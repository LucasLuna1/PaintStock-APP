import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../services/api';
import './Categories.css';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activa: true
  });

  // Cargar categorías
  useEffect(() => {
    loadCategories();
  }, []);

  // Filtrar categorías
  useEffect(() => {
    filterCategories();
  }, [categories, searchTerm, statusFilter]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get('/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error cargando categorías:', error);
      setError('Error cargando categorías');
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    let filtered = categories;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(category => 
        category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (category.descripcion && category.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(category => 
        statusFilter === 'active' ? category.activa : !category.activa
      );
    }

    setFilteredCategories(filtered);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      if (editingCategory) {
        // Actualizar categoría
        await api.put(`/categories/${editingCategory._id}`, formData);
      } else {
        // Crear nueva categoría
        await api.post('/categories', formData);
      }
      
      await loadCategories();
      handleCloseModal();
    } catch (error) {
      console.error('Error guardando categoría:', error);
      setError(error.response?.data?.message || 'Error guardando categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion || '',
      activa: category.activa
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId, categoryName) => {
    if (window.confirm(`¿Estás seguro de eliminar la categoría "${categoryName}"?`)) {
      try {
        await api.delete(`/categories/${categoryId}`);
        await loadCategories();
      } catch (error) {
        console.error('Error eliminando categoría:', error);
        alert(error.response?.data?.message || 'Error eliminando categoría');
      }
    }
  };

  const handleToggleStatus = async (category) => {
    try {
      await api.put(`/categories/${category._id}`, {
        ...category,
        activa: !category.activa
      });
      await loadCategories();
    } catch (error) {
      console.error('Error cambiando estado:', error);
      setError('Error cambiando estado de la categoría');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({
      nombre: '',
      descripcion: '',
      activa: true
    });
    setError('');
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    setFormData({
      nombre: '',
      descripcion: '',
      activa: true
    });
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="page">
        <div className="loading">
          <div className="spinner"></div>
          <span>Cargando categorías...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Gestión de Categorías</h1>
        <button className="btn btn-primary" onClick={handleNewCategory}>
          <FaPlus /> Nueva Categoría
        </button>
      </div>

      {/* Filtros */}
      <div className="card">
        <div className="card-body">
          <div className="filters-section">
            <div className="search-box">
              <FaSearch />
              <input
                type="text"
                placeholder="Buscar categorías..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">Todas las categorías</option>
              <option value="active">Solo activas</option>
              <option value="inactive">Solo inactivas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla de categorías */}
      <div className="card">
        <div className="card-body">
          {filteredCategories.length === 0 ? (
            <div className="empty-state">
              <p>No se encontraron categorías</p>
              <button className="btn btn-primary" onClick={handleNewCategory}>
                <FaPlus /> Crear primera categoría
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Productos</th>
                    <th>Estado</th>
                    <th>Fecha Creación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map(category => (
                    <tr key={category._id}>
                      <td>
                        <strong>{category.nombre}</strong>
                      </td>
                      <td>
                        <span className="description">
                          {category.descripcion || 'Sin descripción'}
                        </span>
                      </td>
                      <td>
                        <span className="product-count">
                          {category.totalProductos || 0} productos
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${category.activa ? 'status-active' : 'status-inactive'}`}>
                          {category.activa ? 'Activa' : 'Inactiva'}
                        </span>
                      </td>
                      <td>
                        {new Date(category.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td>
                        <div className="actions">
                          <button
                            className="btn-icon btn-edit"
                            onClick={() => handleEdit(category)}
                            title="Editar"
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={`btn-icon ${category.activa ? 'btn-deactivate' : 'btn-activate'}`}
                            onClick={() => handleToggleStatus(category)}
                            title={category.activa ? 'Desactivar' : 'Activar'}
                          >
                            {category.activa ? <FaEyeSlash /> : <FaEye />}
                          </button>
                          <button
                            className="btn-icon btn-delete"
                            onClick={() => handleDelete(category._id, category.nombre)}
                            title="Eliminar"
                            disabled={category.totalProductos > 0}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de formulario */}
      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>×</button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div className="error-message">{error}</div>
                )}
                
                <div className="form-row">
                  <label htmlFor="nombre">Nombre *</label>
                  <input
                    type="text"
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    placeholder="Ej: Pinturas Acrílicas"
                    required
                    maxLength={50}
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData({...formData, descripcion: e.target.value})}
                    placeholder="Descripción de la categoría..."
                    rows={3}
                    maxLength={200}
                  />
                </div>

                <div className="form-row">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.activa}
                      onChange={(e) => setFormData({...formData, activa: e.target.checked})}
                    />
                    Categoría activa
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Actualizar' : 'Crear'} Categoría
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories; 