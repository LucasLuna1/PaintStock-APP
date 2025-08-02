import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaBox, FaExclamationTriangle, FaTimes, FaArrowUp } from 'react-icons/fa';
import { dashboardAPI, productsAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    stockBajo: 0,
    sinStock: 0,
    valorTotal: 0,
    movimientosHoy: 0
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      // Cargar estadísticas del dashboard
      const dashboardResponse = await dashboardAPI.getStats();
      setStats(dashboardResponse.data.estadisticasPrincipales);

      // Cargar productos recientes
      const productsResponse = await productsAPI.getAll({ limit: 5 });
      setProducts(productsResponse.data.products);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado) => {
    const statusClass = estado.toLowerCase().replace(' ', '-');
    return <span className={`status-badge status-${statusClass}`}>{estado}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">
          <div className="spinner"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">
          <p>{error}</p>
          <button onClick={loadDashboardData} className="btn btn-primary">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/products/new" className="btn btn-primary">
          <FaPlus /> Nuevo Producto
        </Link>
      </div>

      {/* Tarjetas de Estadísticas */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3>Total Productos</h3>
              <div className="stat-value">{stats.totalProductos.toLocaleString()}</div>
            </div>
            <div className="stat-icon total">
              <FaBox />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3>Stock Bajo</h3>
              <div className="stat-value">{stats.stockBajo}</div>
            </div>
            <div className="stat-icon warning">
              <FaExclamationTriangle />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3>Valor Total</h3>
              <div className="stat-value">{formatCurrency(stats.valorTotal)}</div>
            </div>
            <div className="stat-icon success">
              <FaArrowUp />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <div className="stat-info">
              <h3>Movimientos Hoy</h3>
              <div className="stat-value">{stats.movimientosHoy}</div>
            </div>
            <div className="stat-icon info">
              <FaArrowUp />
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Productos */}
      <div className="dashboard-section">
        <div className="section-header">
          <h2>Productos</h2>
          <Link to="/products" className="btn btn-outline">
            Ver todos
          </Link>
        </div>

        <div className="card">
          <div className="card-body">
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Código</th>
                    <th>Categoría</th>
                    <th>Stock</th>
                    <th>Precio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((product) => (
                      <tr key={product._id}>
                        <td>
                          <div className="product-info">
                            <span className="product-name">{product.nombre}</span>
                          </div>
                        </td>
                        <td>
                          <code className="product-code">{product.codigo}</code>
                        </td>
                        <td>{product.categoria?.nombre || 'Sin categoría'}</td>
                        <td>
                          <span className={`stock-value ${product.stock <= product.stockMinimo ? 'low' : ''}`}>
                            {product.stock}
                          </span>
                        </td>
                        <td>{formatCurrency(product.precio)}</td>
                        <td>{getStatusBadge(product.estado)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="empty-state">
                        <div className="empty-message">
                          <FaBox className="empty-icon" />
                          <p>No hay productos registrados</p>
                          <Link to="/products/new" className="btn btn-primary">
                            <FaPlus /> Agregar primer producto
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 