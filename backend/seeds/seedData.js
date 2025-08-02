const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Movement = require('../models/Movement');
require('dotenv').config();

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paintstock', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seeding de datos...');

    // Limpiar datos existentes
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Movement.deleteMany({});
    console.log('🗑️ Datos existentes eliminados');

    // Crear categorías
    const categories = await Category.create([
      {
        nombre: 'Electrónicos',
        descripcion: 'Productos electrónicos y tecnología'
      },
      {
        nombre: 'Periféricos',
        descripcion: 'Accesorios y periféricos de computadora'
      },
      {
        nombre: 'Accesorios',
        descripcion: 'Accesorios diversos'
      }
    ]);
    console.log('📁 Categorías creadas:', categories.length);

    // Crear productos
    const products = await Product.create([
      {
        nombre: 'Laptop HP Pavilion',
        codigo: 'LP001',
        categoria: categories[0]._id,
        precio: 899.00,
        stock: 25,
        stockMinimo: 5,
        descripcion: 'Laptop HP Pavilion 15" con procesador Intel i5',
        proveedor: 'HP Store'
      },
      {
        nombre: 'Mouse Gaming Logitech',
        codigo: 'MS002',
        categoria: categories[1]._id,
        precio: 79.99,
        stock: 5,
        stockMinimo: 10,
        descripcion: 'Mouse gaming con RGB y alta precisión',
        proveedor: 'Logitech'
      },
      {
        nombre: 'Tablet Samsung Galaxy',
        codigo: 'TB003',
        categoria: categories[0]._id,
        precio: 299.00,
        stock: 0,
        stockMinimo: 3,
        descripcion: 'Tablet Samsung Galaxy Tab A7',
        proveedor: 'Samsung'
      },
      {
        nombre: 'Audífonos Sony WH-1000XM4',
        codigo: 'HD004',
        categoria: categories[2]._id,
        precio: 349.99,
        stock: 18,
        stockMinimo: 5,
        descripcion: 'Audífonos inalámbricos con cancelación de ruido',
        proveedor: 'Sony'
      },
      {
        nombre: 'Teclado Mecánico Corsair',
        codigo: 'KB005',
        categoria: categories[1]._id,
        precio: 159.99,
        stock: 12,
        stockMinimo: 8,
        descripcion: 'Teclado mecánico gaming con switches Cherry MX',
        proveedor: 'Corsair'
      }
    ]);
    console.log('📦 Productos creados:', products.length);

    // Crear movimientos de ejemplo
    const movements = [];
    for (const product of products) {
      // Movimiento inicial de inventario
      movements.push({
        producto: product._id,
        tipo: 'Entrada',
        cantidad: product.stock,
        motivo: 'Inventario inicial',
        stockAnterior: 0,
        stockNuevo: product.stock,
        observaciones: 'Stock inicial del producto'
      });

      // Algunos movimientos adicionales
      if (product.stock > 0) {
        movements.push({
          producto: product._id,
          tipo: 'Salida',
          cantidad: Math.floor(Math.random() * 3) + 1,
          motivo: 'Venta',
          stockAnterior: product.stock + 3,
          stockNuevo: product.stock,
          observaciones: 'Venta a cliente',
          fecha: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) // Última semana
        });
      }
    }

    await Movement.create(movements);
    console.log('📊 Movimientos creados:', movements.length);

    console.log('✅ Seeding completado exitosamente');
    
    // Mostrar resumen
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalMovements = await Movement.countDocuments();
    
    console.log('\n📈 RESUMEN:');
    console.log(`- Categorías: ${totalCategories}`);
    console.log(`- Productos: ${totalProducts}`);
    console.log(`- Movimientos: ${totalMovements}`);
    console.log('\n🎉 Base de datos lista para usar!');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar seeding
seedData(); 