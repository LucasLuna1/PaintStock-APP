import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { productsAPI, categoriesAPI } from '../services/api.jsx';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
  }, [searchTerm, selectedCategory, selectedStatus, pagination.currentPage]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(selectedCategory && { categoria: selectedCategory }),
        ...(selectedStatus && { estado: selectedStatus })
      };

      const response = await productsAPI.getAll(params);
      setProducts(response.data.products);
      setPagination({
        currentPage: Number(response.data.currentPage),
        totalPages: Number(response.data.totalPages),
        total: Number(response.data.total)
      });
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await productsAPI.delete(id);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto');
      }
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

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedStatus('');
    setPagination(prev => ({ ...prev, currentPage: 1 }));
  };

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Productos</h1>
        <Link to="/products/new" className="btn btn-primary">
          <FaPlus /> Nuevo Producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="filters-section">
        <div className="filters-row">
          <div className="search-filter">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-control"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-control"
          >
            <option value="">Todas las categorías</option>
            {categories.map(category => (
              <option key={category._id} value={category._id}>
                {category.nombre}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-control"
          >
            <option value="">Todos los estados</option>
            <option value="Normal">Normal</option>
            <option value="Stock Bajo">Stock Bajo</option>
            <option value="Sin Stock">Sin Stock</option>
          </select>

          <button onClick={resetFilters} className="btn btn-outline">
            <FaFilter /> Limpiar
          </button>
        </div>
      </div>

      {/* Tabla de Productos */}
      <div className="card">
        <div className="card-body">
          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>Cargando productos...</p>
            </div>
          ) : (
            <>
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
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                      products.map((product) => (
                        <tr key={product._id}>
                          <td>
                            <div className="product-info">
                              <span className="product-name">{product.nombre}</span>
                              {product.descripcion && (
                                <span className="product-description">{product.descripcion}</span>
                              )}
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
                          <td>
                            <div className="actions">
                              <Link
                                to={`/products/edit/${product._id}`}
                                className="btn btn-sm btn-outline"
                                title="Editar"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                onClick={() => handleDelete(product._id)}
                                className="btn btn-sm btn-danger"
                                title="Eliminar"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          <div className="empty-message">
                            <p>No se encontraron productos</p>
                            <Link to="/products/new" className="btn btn-primary">
                              <FaPlus /> Agregar producto
                            </Link>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Number(prev.currentPage) - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="btn btn-outline"
                  >
                    Anterior
                  </button>
                  <span className="pagination-info">
                    Página {pagination.currentPage} de {pagination.totalPages} ({pagination.total} productos)
                  </span>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: Number(prev.currentPage) + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="btn btn-outline"
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products; 