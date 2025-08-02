const express = require('express');
const { body, validationResult } = require('express-validator');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Movement = require('../models/Movement');

const router = express.Router();

// Validaciones
const productValidation = [
  body('nombre').trim().isLength({ min: 1, max: 100 }).withMessage('Nombre es requerido (máx 100 caracteres)'),
  body('codigo').trim().isLength({ min: 1, max: 20 }).withMessage('Código es requerido (máx 20 caracteres)'),
  body('categoria').isMongoId().withMessage('Categoría válida es requerida'),
  body('precio').isFloat({ min: 0 }).withMessage('Precio debe ser mayor o igual a 0'),
  body('stock').isInt({ min: 0 }).withMessage('Stock debe ser mayor o igual a 0'),
  body('stockMinimo').optional().isInt({ min: 0 }).withMessage('Stock mínimo debe ser mayor o igual a 0')
];

// GET /api/products - Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 10, search, categoria, estado } = req.query;
    
    let query = {};
    
    // Filtro de búsqueda
    if (search) {
      query.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { codigo: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filtro por categoría
    if (categoria) {
      query.categoria = categoria;
    }
    
    // Filtro por estado
    if (estado) {
      query.estado = estado;
    }
    
    const products = await Product.find(query)
      .populate('categoria', 'nombre')
      .sort({ fechaCreacion: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/products/:id - Obtener un producto específico
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('categoria', 'nombre');
    
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    res.json(product);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/products - Crear nuevo producto
router.post('/', productValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: errors.array() 
      });
    }
    
    // Verificar que la categoría existe
    const categoryExists = await Category.findById(req.body.categoria);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Categoría no encontrada' });
    }
    
    // Verificar código único
    const codeExists = await Product.findOne({ codigo: req.body.codigo.toUpperCase() });
    if (codeExists) {
      return res.status(400).json({ message: 'El código ya existe' });
    }
    
    const product = new Product(req.body);
    await product.save();
    
    // Registrar movimiento inicial si hay stock
    if (product.stock > 0) {
      const movement = new Movement({
        producto: product._id,
        tipo: 'Entrada',
        cantidad: product.stock,
        motivo: 'Inventario inicial',
        stockAnterior: 0,
        stockNuevo: product.stock,
        observaciones: 'Stock inicial del producto'
      });
      await movement.save();
    }
    
    await product.populate('categoria', 'nombre');
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /api/products/:id - Actualizar producto
router.put('/:id', productValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: errors.array() 
      });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    // Verificar código único (excluyendo el producto actual)
    if (req.body.codigo !== product.codigo) {
      const codeExists = await Product.findOne({ 
        codigo: req.body.codigo.toUpperCase(),
        _id: { $ne: req.params.id }
      });
      if (codeExists) {
        return res.status(400).json({ message: 'El código ya existe' });
      }
    }
    
    // Verificar categoría
    const categoryExists = await Category.findById(req.body.categoria);
    if (!categoryExists) {
      return res.status(400).json({ message: 'Categoría no encontrada' });
    }
    
    const stockAnterior = product.stock;
    const stockNuevo = req.body.stock;
    
    Object.assign(product, req.body);
    await product.save();
    
    // Registrar movimiento si cambió el stock
    if (stockAnterior !== stockNuevo) {
      const movement = new Movement({
        producto: product._id,
        tipo: stockNuevo > stockAnterior ? 'Entrada' : 'Salida',
        cantidad: Math.abs(stockNuevo - stockAnterior),
        motivo: 'Ajuste de inventario',
        stockAnterior,
        stockNuevo,
        observaciones: 'Ajuste manual de stock'
      });
      await movement.save();
    }
    
    await product.populate('categoria', 'nombre');
    res.json(product);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /api/products/:id - Eliminar producto
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/products/:id/movement - Registrar movimiento de stock
router.post('/:id/movement', [
  body('tipo').isIn(['Entrada', 'Salida', 'Ajuste']).withMessage('Tipo inválido'),
  body('cantidad').isInt({ min: 1 }).withMessage('Cantidad debe ser mayor a 0'),
  body('motivo').notEmpty().withMessage('Motivo es requerido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: errors.array() 
      });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }
    
    const { tipo, cantidad, motivo, observaciones } = req.body;
    const stockAnterior = product.stock;
    let stockNuevo = stockAnterior;
    
    if (tipo === 'Entrada') {
      stockNuevo = stockAnterior + cantidad;
    } else if (tipo === 'Salida') {
      if (stockAnterior < cantidad) {
        return res.status(400).json({ message: 'Stock insuficiente' });
      }
      stockNuevo = stockAnterior - cantidad;
    }
    
    // Actualizar stock del producto
    product.stock = stockNuevo;
    await product.save();
    
    // Registrar movimiento
    const movement = new Movement({
      producto: product._id,
      tipo,
      cantidad,
      motivo,
      observaciones,
      stockAnterior,
      stockNuevo
    });
    await movement.save();
    
    res.json({ 
      message: 'Movimiento registrado exitosamente',
      product,
      movement 
    });
  } catch (error) {
    console.error('Error registrando movimiento:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 