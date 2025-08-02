import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaTachometerAlt, 
  FaBox, 
  FaTags, 
  FaExchangeAlt, 
  FaChartBar, 
  FaCog,
  FaBars,
  FaPalette
} from 'react-icons/fa';

const Sidebar = ({ collapsed, open, isMobile, onClose, onToggle }) => {
  const location = useLocation();

  const menuItems = [
    {
      path: '/dashboard',
      icon: FaTachometerAlt,
      label: 'Dashboard',
      active: location.pathname === '/' || location.pathname === '/dashboard'
    },
    {
      path: '/products',
      icon: FaBox,
      label: 'Productos',
      active: location.pathname.includes('/products')
    },
    {
      path: '/categories',
      icon: FaTags,
      label: 'Proveedores',
      active: location.pathname === '/categories'
    },
    {
      path: '/movements',
      icon: FaExchangeAlt,
      label: 'Movimientos',
      active: location.pathname === '/movements'
    },
    {
      path: '/reports',
      icon: FaChartBar,
      label: 'Reportes',
      active: location.pathname === '/reports'
    },
    {
      path: '/settings',
      icon: FaCog,
      label: 'Configuración',
      active: location.pathname === '/settings'
    }
  ];

  const handleLinkClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const sidebarClasses = [
    'sidebar',
    collapsed && !isMobile ? 'collapsed' : '',
    isMobile && open ? 'open' : '',
    isMobile && !open ? 'mobile-hidden' : ''
  ].filter(Boolean).join(' ');

  return (
    <aside className={sidebarClasses}>
      <div className="sidebar-header">
        <button 
          className="sidebar-toggle" 
          onClick={onToggle}
          aria-label="Toggle sidebar"
        >
          <FaBars />
        </button>
        
        {(!collapsed || isMobile) && (
          <div className="logo">
            <FaPalette className="logo-icon" />
            <span className="logo-text">Stock Panel</span>
          </div>
        )}
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <li key={item.path} className="nav-item">
                <Link 
                  to={item.path} 
                  className={`nav-link ${item.active ? 'active' : ''}`}
                  title={collapsed && !isMobile ? item.label : ''}
                  onClick={handleLinkClick}
                >
                  <IconComponent className="nav-icon" />
                  {(!collapsed || isMobile) && <span className="nav-label">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar; 