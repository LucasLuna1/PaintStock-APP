const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Movement = require('../models/Movement');
require('dotenv').config();

// Conectar a MongoDB Atlas simplificada
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/paintstock');

const seedData = async () => {
  try {
    console.log('🌱 Iniciando seeding de datos PaintStock...');

    // Limpiar datos existentes
    await Product.deleteMany({});
    await Category.deleteMany({});
    await Movement.deleteMany({});
    console.log('🗑️ Datos existentes eliminados');

    // Crear categorías específicas de pinturas
    const categories = await Category.create([
      {
        nombre: 'Pinturas Acrílicas',
        descripcion: 'Pinturas acrílicas de alta calidad para interiores y exteriores',
        activa: true
      },
      {
        nombre: 'Pinturas al Óleo',
        descripcion: 'Pinturas al óleo profesionales para arte y decoración',
        activa: true
      },
      {
        nombre: 'Pinturas en Spray',
        descripcion: 'Pinturas en aerosol para aplicaciones rápidas y uniformes',
        activa: true
      },
      {
        nombre: 'Imprimaciones',
        descripcion: 'Bases y imprimaciones para preparación de superficies',
        activa: true
      },
      {
        nombre: 'Barnices y Selladores',
        descripcion: 'Productos de acabado y protección para superficies pintadas',
        activa: true
      },
      {
        nombre: 'Pinceles y Brochas',
        descripcion: 'Herramientas de aplicación profesional',
        activa: true
      },
      {
        nombre: 'Herramientas de Pintura',
        descripcion: 'Rodillos, bandejas, espátulas y accesorios',
        activa: true
      },
      {
        nombre: 'Diluyentes y Solventes',
        descripcion: 'Productos para dilución y limpieza',
        activa: true
      }
    ]);
    console.log('🎨 Categorías de pinturas creadas:', categories.length);

    // Crear productos específicos de pinturas
    const products = await Product.create([
      // Pinturas Acrílicas
      {
        nombre: 'Pintura Acrílica Blanco Mate',
        codigo: 'PA001',
        categoria: categories[0]._id,
        precio: 45.99,
        stock: 120,
        stockMinimo: 20,
        descripcion: 'Pintura acrílica blanco mate para interiores, 4 litros',
        proveedor: 'Sherwin Williams'
      },
      {
        nombre: 'Pintura Acrílica Azul Cielo',
        codigo: 'PA002',
        categoria: categories[0]._id,
        precio: 42.50,
        stock: 8,
        stockMinimo: 15,
        descripcion: 'Pintura acrílica azul cielo satinada, 4 litros',
        proveedor: 'Comex'
      },
      {
        nombre: 'Pintura Acrílica Rojo Carmesí',
        codigo: 'PA003',
        categoria: categories[0]._id,
        precio: 48.75,
        stock: 0,
        stockMinimo: 10,
        descripcion: 'Pintura acrílica rojo carmesí brillante, 4 litros',
        proveedor: 'Berel'
      },

      // Pinturas al Óleo
      {
        nombre: 'Esmalte Sintético Negro',
        codigo: 'PO001',
        categoria: categories[1]._id,
        precio: 38.90,
        stock: 65,
        stockMinimo: 12,
        descripcion: 'Esmalte sintético negro brillante para metal y madera',
        proveedor: 'Comex'
      },
      {
        nombre: 'Esmalte Antioxidante Café',
        codigo: 'PO002',
        categoria: categories[1]._id,
        precio: 52.00,
        stock: 28,
        stockMinimo: 8,
        descripcion: 'Esmalte antioxidante café para superficies metálicas',
        proveedor: 'Rust-Mort'
      },

      // Pinturas en Spray
      {
        nombre: 'Spray Acrílico Plateado',
        codigo: 'PS001',
        categoria: categories[2]._id,
        precio: 15.99,
        stock: 45,
        stockMinimo: 25,
        descripcion: 'Pintura en spray acrílica plateada, 400ml',
        proveedor: 'Krylon'
      },
      {
        nombre: 'Spray Primer Blanco',
        codigo: 'PS002',
        categoria: categories[2]._id,
        precio: 18.50,
        stock: 22,
        stockMinimo: 15,
        descripcion: 'Primer en spray blanco universal, 400ml',
        proveedor: 'Rust-Oleum'
      },

      // Imprimaciones
      {
        nombre: 'Primer Sellador Blanco',
        codigo: 'PR001',
        categoria: categories[3]._id,
        precio: 35.75,
        stock: 32,
        stockMinimo: 8,
        descripcion: 'Primer sellador blanco para paredes nuevas, 4 litros',
        proveedor: 'Sherwin Williams'
      },

      // Barnices
      {
        nombre: 'Barniz Poliuretano Brillante',
        codigo: 'BA001',
        categoria: categories[4]._id,
        precio: 68.00,
        stock: 18,
        stockMinimo: 6,
        descripcion: 'Barniz poliuretano transparente brillante, 4 litros',
        proveedor: 'Comex'
      },

      // Pinceles
      {
        nombre: 'Pincel Cerda Natural #6',
        codigo: 'PN001',
        categoria: categories[5]._id,
        precio: 12.50,
        stock: 75,
        stockMinimo: 30,
        descripcion: 'Pincel de cerda natural para pinturas al óleo, #6',
        proveedor: 'Winsor & Newton'
      },
      {
        nombre: 'Brocha Profesional 4"',
        codigo: 'BR001',
        categoria: categories[5]._id,
        precio: 24.99,
        stock: 38,
        stockMinimo: 15,
        descripcion: 'Brocha profesional de 4 pulgadas para grandes superficies',
        proveedor: 'Purdy'
      },

      // Herramientas
      {
        nombre: 'Rodillo Microfibra 9"',
        codigo: 'RO001',
        categoria: categories[6]._id,
        precio: 8.75,
        stock: 55,
        stockMinimo: 20,
        descripcion: 'Rodillo de microfibra 9" para acabados lisos',
        proveedor: 'Wooster'
      },
      {
        nombre: 'Bandeja Plástica 9"',
        codigo: 'BD001',
        categoria: categories[6]._id,
        precio: 5.50,
        stock: 42,
        stockMinimo: 25,
        descripcion: 'Bandeja plástica para rodillo de 9 pulgadas',
        proveedor: 'Generic'
      },

      // Diluyentes
      {
        nombre: 'Thinner Estándar',
        codigo: 'TH001',
        categoria: categories[7]._id,
        precio: 22.00,
        stock: 28,
        stockMinimo: 10,
        descripcion: 'Thinner estándar para dilución de pinturas, 4 litros',
        proveedor: 'Solventes Industriales'
      },
      {
        nombre: 'Aguarrás Mineral',
        codigo: 'AG001',
        categoria: categories[7]._id,
        precio: 18.75,
        stock: 35,
        stockMinimo: 12,
        descripcion: 'Aguarrás mineral para limpieza y dilución, 4 litros',
        proveedor: 'Solventes SA'
      }
    ]);
    console.log('🎨 Productos de pintura creados:', products.length);

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
        observaciones: 'Stock inicial del producto',
        fecha: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) // 15 días atrás
      });

      // Algunos movimientos adicionales realistas
      if (product.stock > 0) {
        const ventasSimuladas = Math.floor(Math.random() * 3) + 1;
        for (let i = 0; i < ventasSimuladas; i++) {
          const cantidadVenta = Math.floor(Math.random() * Math.min(5, product.stock / 2)) + 1;
          const fechaVenta = new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000);
          
          movements.push({
            producto: product._id,
            tipo: 'Salida',
            cantidad: cantidadVenta,
            motivo: 'Venta',
            stockAnterior: product.stock + cantidadVenta,
            stockNuevo: product.stock,
            observaciones: `Venta a cliente ${i + 1}`,
            fecha: fechaVenta
          });
        }
      }

      // Algunas reposiciones
      if (Math.random() > 0.7) {
        const cantidadReposicion = Math.floor(Math.random() * 20) + 10;
        movements.push({
          producto: product._id,
          tipo: 'Entrada',
          cantidad: cantidadReposicion,
          motivo: 'Reposición',
          stockAnterior: Math.max(0, product.stock - cantidadReposicion),
          stockNuevo: product.stock,
          observaciones: 'Reposición de inventario',
          fecha: new Date(Date.now() - Math.random() * 5 * 24 * 60 * 60 * 1000)
        });
      }
    }

    await Movement.create(movements);
    console.log('📊 Movimientos de inventario creados:', movements.length);

    console.log('✅ Seeding de PaintStock completado exitosamente');
    
    // Mostrar resumen detallado
    const totalProducts = await Product.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalMovements = await Movement.countDocuments();
    const productsWithLowStock = await Product.countDocuments({
      $expr: { $lt: ["$stock", "$stockMinimo"] }
    });
    const productsOutOfStock = await Product.countDocuments({ stock: 0 });
    
    console.log('\n🎨 RESUMEN PAINTSTOCK:');
    console.log(`- Categorías de pinturas: ${totalCategories}`);
    console.log(`- Productos en inventario: ${totalProducts}`);
    console.log(`- Movimientos registrados: ${totalMovements}`);
    console.log(`- Productos con stock bajo: ${productsWithLowStock}`);
    console.log(`- Productos sin stock: ${productsOutOfStock}`);
    console.log('\n🎉 Tu tienda de pinturas está lista para funcionar!');

  } catch (error) {
    console.error('❌ Error durante el seeding:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Ejecutar seeding
seedData(); 