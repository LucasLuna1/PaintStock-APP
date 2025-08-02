const express = require('express');
const Movement = require('../models/Movement');

const router = express.Router();

// GET /api/movements - Obtener movimientos con filtros
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      producto, 
      tipo, 
      fechaInicio, 
      fechaFin 
    } = req.query;
    
    let query = {};
    
    // Filtro por producto
    if (producto) {
      query.producto = producto;
    }
    
    // Filtro por tipo
    if (tipo) {
      query.tipo = tipo;
    }
    
    // Filtro por rango de fechas
    if (fechaInicio || fechaFin) {
      query.fecha = {};
      if (fechaInicio) {
        query.fecha.$gte = new Date(fechaInicio);
      }
      if (fechaFin) {
        query.fecha.$lte = new Date(fechaFin);
      }
    }
    
    const movements = await Movement.find(query)
      .populate('producto', 'nombre codigo')
      .sort({ fecha: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Movement.countDocuments(query);
    
    res.json({
      movements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo movimientos:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/movements/product/:productId - Historial de movimientos de un producto
router.get('/product/:productId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    
    const movements = await Movement.find({ producto: req.params.productId })
      .populate('producto', 'nombre codigo')
      .sort({ fecha: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Movement.countDocuments({ producto: req.params.productId });
    
    res.json({
      movements,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Error obteniendo historial de producto:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/movements/today - Movimientos de hoy
router.get('/today', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const movements = await Movement.find({
      fecha: {
        $gte: today,
        $lt: tomorrow
      }
    })
    .populate('producto', 'nombre codigo')
    .sort({ fecha: -1 });
    
    res.json(movements);
  } catch (error) {
    console.error('Error obteniendo movimientos de hoy:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/movements/stats - Estadísticas de movimientos
router.get('/stats', async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Movimientos de hoy
    const movimientosHoy = await Movement.countDocuments({
      fecha: { $gte: today, $lt: tomorrow }
    });
    
    // Estadísticas por tipo
    const estadisticasPorTipo = await Movement.aggregate([
      {
        $group: {
          _id: '$tipo',
          total: { $sum: 1 },
          cantidad: { $sum: '$cantidad' }
        }
      }
    ]);
    
    // Movimientos de la semana
    const inicioSemana = new Date(today);
    inicioSemana.setDate(today.getDate() - today.getDay());
    
    const movimientosSemana = await Movement.countDocuments({
      fecha: { $gte: inicioSemana }
    });
    
    res.json({
      movimientosHoy,
      movimientosSemana,
      estadisticasPorTipo
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 