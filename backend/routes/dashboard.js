const express = require('express');
const Product = require('../models/Product');
const Movement = require('../models/Movement');

const router = express.Router();

// GET /api/dashboard - Estadísticas principales del dashboard
router.get('/', async (req, res) => {
  try {
    // Total de productos
    const totalProductos = await Product.countDocuments();
    
    // Productos con stock bajo
    const stockBajo = await Product.countDocuments({
      $expr: { $lte: ['$stock', '$stockMinimo'] },
      stock: { $gt: 0 }
    });
    
    // Productos sin stock
    const sinStock = await Product.countDocuments({ stock: 0 });
    
    // Valor total del inventario
    const valorTotal = await Product.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$precio', '$stock'] } }
        }
      }
    ]);
    
    // Movimientos de hoy
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const movimientosHoy = await Movement.countDocuments({
      fecha: { $gte: today, $lt: tomorrow }
    });
    
    // Productos más vendidos (basado en salidas)
    const productosMasVendidos = await Movement.aggregate([
      {
        $match: {
          tipo: 'Salida',
          motivo: 'Venta',
          fecha: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } // Últimos 30 días
        }
      },
      {
        $group: {
          _id: '$producto',
          totalVendido: { $sum: '$cantidad' }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'producto'
        }
      },
      {
        $unwind: '$producto'
      },
      {
        $project: {
          nombre: '$producto.nombre',
          codigo: '$producto.codigo',
          totalVendido: 1
        }
      },
      {
        $sort: { totalVendido: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Productos con stock crítico
    const stockCritico = await Product.find({
      $expr: { $lte: ['$stock', '$stockMinimo'] }
    })
    .populate('categoria', 'nombre')
    .sort({ stock: 1 })
    .limit(10);
    
    // Movimientos recientes
    const movimientosRecientes = await Movement.find()
      .populate('producto', 'nombre codigo')
      .sort({ fecha: -1 })
      .limit(10);
    
    // Distribución por categorías
    const distribucionCategorias = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoria',
          foreignField: '_id',
          as: 'categoria'
        }
      },
      {
        $unwind: '$categoria'
      },
      {
        $group: {
          _id: '$categoria._id',
          nombre: { $first: '$categoria.nombre' },
          totalProductos: { $sum: 1 },
          valorTotal: { $sum: { $multiply: ['$precio', '$stock'] } }
        }
      },
      {
        $sort: { totalProductos: -1 }
      }
    ]);
    
    res.json({
      estadisticasPrincipales: {
        totalProductos,
        stockBajo,
        sinStock,
        valorTotal: valorTotal.length > 0 ? valorTotal[0].total : 0,
        movimientosHoy
      },
      productosMasVendidos,
      stockCritico,
      movimientosRecientes,
      distribucionCategorias
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas del dashboard:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// GET /api/dashboard/stats/weekly - Estadísticas de la semana
router.get('/stats/weekly', async (req, res) => {
  try {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const movimientosPorDia = await Movement.aggregate([
      {
        $match: {
          fecha: { $gte: weekAgo }
        }
      },
      {
        $group: {
          _id: {
            fecha: { $dateToString: { format: '%Y-%m-%d', date: '$fecha' } },
            tipo: '$tipo'
          },
          cantidad: { $sum: '$cantidad' }
        }
      },
      {
        $group: {
          _id: '$_id.fecha',
          entradas: {
            $sum: {
              $cond: [{ $eq: ['$_id.tipo', 'Entrada'] }, '$cantidad', 0]
            }
          },
          salidas: {
            $sum: {
              $cond: [{ $eq: ['$_id.tipo', 'Salida'] }, '$cantidad', 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.json(movimientosPorDia);
  } catch (error) {
    console.error('Error obteniendo estadísticas semanales:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router; 