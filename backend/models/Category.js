const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre de la categoría es requerido'],
    unique: true,
    trim: true,
    maxlength: [50, 'El nombre no puede exceder 50 caracteres']
  },
  descripcion: {
    type: String,
    maxlength: [200, 'La descripción no puede exceder 200 caracteres']
  },
  activa: {
    type: Boolean,
    default: true
  },
  fechaCreacion: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Virtual para contar productos en esta categoría
categorySchema.virtual('totalProductos', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'categoria',
  count: true
});

module.exports = mongoose.model('Category', categorySchema); 