const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre del producto es requerido'],
    trim: true,
    maxlength: [100, 'El nombre no puede exceder 100 caracteres']
  },
  codigo: {
    type: String,
    required: [true, 'El código del producto es requerido'],
    unique: true,
    uppercase: true,
    trim: true,
    maxlength: [20, 'El código no puede exceder 20 caracteres']
  },
  categoria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'La categoría es requerida']
  },
  precio: {
    type: Number,
    required: [true, 'El precio es requerido'],
    min: [0, 'El precio no puede ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'El stock es requerido'],
    min: [0, 'El stock no puede ser negativo'],
    default: 0
  },
  stockMinimo: {
    type: Number,
    default: 5,
    min: [0, 'El stock mínimo no puede ser negativo']
  },
  descripcion: {
    type: String,
    maxlength: [500, 'La descripción no puede exceder 500 caracteres']
  },
  estado: {
    type: String,
    enum: ['Normal', 'Stock Bajo', 'Sin Stock'],
    default: 'Normal'
  },
  proveedor: {
    type: String,
    trim: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  },
  fechaActualizacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Middleware para actualizar estado basado en stock
productSchema.pre('save', function(next) {
  if (this.stock === 0) {
    this.estado = 'Sin Stock';
  } else if (this.stock <= this.stockMinimo) {
    this.estado = 'Stock Bajo';
  } else {
    this.estado = 'Normal';
  }
  
  if (this.isModified() && !this.isNew) {
    this.fechaActualizacion = Date.now();
  }
  
  next();
});

// Índices para mejorar rendimiento
productSchema.index({ codigo: 1 });
productSchema.index({ categoria: 1 });
productSchema.index({ estado: 1 });
productSchema.index({ nombre: 'text', descripcion: 'text' });

module.exports = mongoose.model('Product', productSchema); 