const mongoose = require('mongoose');

const movementSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'El producto es requerido']
  },
  tipo: {
    type: String,
    enum: ['Entrada', 'Salida', 'Ajuste'],
    required: [true, 'El tipo de movimiento es requerido']
  },
  cantidad: {
    type: Number,
    required: [true, 'La cantidad es requerida'],
    min: [1, 'La cantidad debe ser mayor a 0']
  },
  motivo: {
    type: String,
    required: [true, 'El motivo es requerido'],
    enum: [
      'Compra', 
      'Venta', 
      'Devolución', 
      'Ajuste de inventario', 
      'Producto dañado', 
      'Transferencia',
      'Inventario inicial'
    ]
  },
  observaciones: {
    type: String,
    maxlength: [300, 'Las observaciones no pueden exceder 300 caracteres']
  },
  stockAnterior: {
    type: Number,
    required: true
  },
  stockNuevo: {
    type: Number,
    required: true
  },
  usuario: {
    type: String,
    default: 'Sistema',
    trim: true
  },
  fecha: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para consultas frecuentes
movementSchema.index({ producto: 1, fecha: -1 });
movementSchema.index({ tipo: 1, fecha: -1 });
movementSchema.index({ fecha: -1 });

module.exports = mongoose.model('Movement', movementSchema); 