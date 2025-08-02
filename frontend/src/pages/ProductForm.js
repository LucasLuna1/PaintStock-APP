import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSave, FaTimes } from 'react-icons/fa';
import { productsAPI, categoriesAPI } from '../services/api';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    categoria: '',
    precio: '',
    stock: '',
    stockMinimo: '5',
    descripcion: '',
    proveedor: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadCategories();
    if (isEdit) {
      loadProduct();
    }
  }, [id, isEdit]);

  const loadCategories = async () => {
    try {
      const response = await categoriesAPI.getAll({ active: true });
      setCategories(response.data);
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      const response = await productsAPI.getById(id);
      const product = response.data;
      setFormData({
        nombre: product.nombre,
        codigo: product.codigo,
        categoria: product.categoria._id || product.categoria,
        precio: product.precio.toString(),
        stock: product.stock.toString(),
        stockMinimo: product.stockMinimo.toString(),
        descripcion: product.descripcion || '',
        proveedor: product.proveedor || ''
      });
    } catch (error) {
      console.error('Error loading product:', error);
      alert('Error al cargar el producto');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.codigo.trim()) {
      newErrors.codigo = 'El código es requerido';
    }

    if (!formData.categoria) {
      newErrors.categoria = 'La categoría es requerida';
    }

    if (!formData.precio || parseFloat(formData.precio) < 0) {
      newErrors.precio = 'El precio debe ser mayor o igual a 0';
    }

    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock debe ser mayor o igual a 0';
    }

    if (!formData.stockMinimo || parseInt(formData.stockMinimo) < 0) {
      newErrors.stockMinimo = 'El stock mínimo debe ser mayor o igual a 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const submitData = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock),
        stockMinimo: parseInt(formData.stockMinimo)
      };

      if (isEdit) {
        await productsAPI.update(id, submitData);
        alert('Producto actualizado exitosamente');
      } else {
        await productsAPI.create(submitData);
        alert('Producto creado exitosamente');
      }
      
      navigate('/products');
    } catch (error) {
      console.error('Error saving product:', error);
      const errorMessage = error.response?.data?.message || 'Error al guardar el producto';
      alert(errorMessage);
      
      // Manejar errores específicos del servidor
      if (error.response?.data?.errors) {
        const serverErrors = {};
        error.response.data.errors.forEach(err => {
          serverErrors[err.param] = err.msg;
        });
        setErrors(serverErrors);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/products');
  };

  if (loading && isEdit) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Cargando producto...</p>
      </div>
    );
  }

  return (
    <div className="product-form-page">
      <div className="page-header">
        <h1>{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</h1>
      </div>

      <div className="card">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Nombre *</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`form-control ${errors.nombre ? 'error' : ''}`}
                  placeholder="Nombre del producto"
                />
                {errors.nombre && <span className="error-message">{errors.nombre}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Código *</label>
                <input
                  type="text"
                  name="codigo"
                  value={formData.codigo}
                  onChange={handleChange}
                  className={`form-control ${errors.codigo ? 'error' : ''}`}
                  placeholder="Código único del producto"
                />
                {errors.codigo && <span className="error-message">{errors.codigo}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Categoría *</label>
                <select
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
                  className={`form-control ${errors.categoria ? 'error' : ''}`}
                >
                  <option value="">Seleccionar categoría</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.nombre}
                    </option>
                  ))}
                </select>
                {errors.categoria && <span className="error-message">{errors.categoria}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Proveedor</label>
                <input
                  type="text"
                  name="proveedor"
                  value={formData.proveedor}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="Nombre del proveedor"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Precio *</label>
                <input
                  type="number"
                  name="precio"
                  value={formData.precio}
                  onChange={handleChange}
                  className={`form-control ${errors.precio ? 'error' : ''}`}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                />
                {errors.precio && <span className="error-message">{errors.precio}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Stock Actual *</label>
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`form-control ${errors.stock ? 'error' : ''}`}
                  placeholder="0"
                  min="0"
                />
                {errors.stock && <span className="error-message">{errors.stock}</span>}
              </div>

              <div className="form-group">
                <label className="form-label">Stock Mínimo *</label>
                <input
                  type="number"
                  name="stockMinimo"
                  value={formData.stockMinimo}
                  onChange={handleChange}
                  className={`form-control ${errors.stockMinimo ? 'error' : ''}`}
                  placeholder="5"
                  min="0"
                />
                {errors.stockMinimo && <span className="error-message">{errors.stockMinimo}</span>}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="form-control"
                rows="3"
                placeholder="Descripción del producto (opcional)"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? (
                  <>
                    <div className="spinner-sm"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave /> {isEdit ? 'Actualizar' : 'Crear'} Producto
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={handleCancel}
                className="btn btn-outline"
                disabled={loading}
              >
                <FaTimes /> Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm; 