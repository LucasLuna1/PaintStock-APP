const express = require('express');
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');

const router = express.Router();

// Validaciones
const categoryValidation = [
  body('nombre').trim().isLength({ min: 1, max: 50 }).withMessage('Nombre es requerido (máx 50 caracteres)'),
  body('descripcion').optional().isLength({ max: 200 }).withMessage('Descripción máximo 200 caracteres')
];

// GET /api/categories - Obtener todas las categorías
router.get('/', async (req, res) => {
  try {
    const { active } = req.query;
    let query = {};
    
    if (active !== undefined) {
      query.activa = active === 'true';
    }
    
    const categories = await Category.find(query)
      .populate('totalProductos')
      .sort({ nombre: 1 });
    
    res.json(categories);
  } catch (error) {
    console.error('Error obteniendo categorías:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/categories/:id - Obtener una categoría específica
router.get('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error obteniendo categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// POST /api/categories - Crear nueva categoría
router.post('/', categoryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: errors.array() 
      });
    }
    
    // Verificar nombre único
    const nameExists = await Category.findOne({ 
      nombre: { $regex: new RegExp(`^${req.body.nombre}$`, 'i') }
    });
    if (nameExists) {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    
    const category = new Category(req.body);
    await category.save();
    
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creando categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// PUT /api/categories/:id - Actualizar categoría
router.put('/:id', categoryValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Datos inválidos', 
        errors: errors.array() 
      });
    }
    
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    // Verificar nombre único (excluyendo la categoría actual)
    const nameExists = await Category.findOne({ 
      nombre: { $regex: new RegExp(`^${req.body.nombre}$`, 'i') },
      _id: { $ne: req.params.id }
    });
    if (nameExists) {
      return res.status(400).json({ message: 'Ya existe una categoría con ese nombre' });
    }
    
    Object.assign(category, req.body);
    await category.save();
    
    res.json(category);
  } catch (error) {
    console.error('Error actualizando categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// DELETE /api/categories/:id - Eliminar categoría
router.delete('/:id', async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: 'Categoría no encontrada' });
    }
    
    // Verificar si tiene productos asociados
    const Product = require('../models/Product');
    const productsCount = await Product.countDocuments({ categoria: req.params.id });
    if (productsCount > 0) {
      return res.status(400).json({ 
        message: `No se puede eliminar la categoría porque tiene ${productsCount} producto(s) asociado(s)` 
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: 'Categoría eliminada exitosamente' });
  } catch (error) {
    console.error('Error eliminando categoría:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 