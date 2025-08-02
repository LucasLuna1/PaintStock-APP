# PaintStock APP

Sistema de gestión de inventario y stock de productos desarrollado con tecnologías modernas.

## 🏗️ Arquitectura

### 3 Capas:
- **Frontend**: React.js con interfaz moderna y responsive
- **Backend**: Node.js con Express.js para APIs REST
- **Base de Datos**: MongoDB para almacenamiento de datos

## 📁 Estructura del Proyecto

```
PaintStock APP/
├── frontend/          # Aplicación React
│   ├── src/
│   │   ├── components/    # Componentes reutilizables
│   │   ├── pages/         # Páginas principales
│   │   ├── services/      # Servicios API
│   │   └── App.js         # Componente principal
│   ├── public/
│   └── package.json
├── backend/           # Servidor Node.js/Express
│   ├── models/            # Modelos Mongoose
│   ├── routes/            # Rutas API
│   ├── seeds/             # Scripts de datos de ejemplo
│   ├── server.js          # Servidor principal
│   └── package.json
└── README.md         # Documentación
```

## 🚀 Funcionalidades

### Dashboard
- ✅ Estadísticas en tiempo real (Total productos, Stock bajo, Valor total, Movimientos)
- ✅ Visualización de datos clave del inventario
- ✅ Tabla de productos recientes

### Gestión de Productos
- ✅ CRUD completo de productos
- ✅ Categorización de productos
- ✅ Control de stock y precios
- ✅ Estados de productos (Normal, Stock Bajo, Sin Stock)
- ✅ Búsqueda y filtrado
- ✅ Validación de formularios

### Navegación
- ✅ Panel lateral con acceso rápido
- ✅ Secciones: Dashboard, Productos, Proveedores, Movimientos, Reportes, Configuración
- ✅ Diseño responsive

### APIs REST
- ✅ Productos: GET, POST, PUT, DELETE
- ✅ Categorías: GET, POST, PUT, DELETE
- ✅ Movimientos: GET con filtros
- ✅ Dashboard: Estadísticas agregadas
- ✅ Validación de datos
- ✅ Manejo de errores

## 🛠️ Tecnologías

- **Frontend**: React.js 18, React Router, Axios, React Icons
- **Backend**: Node.js, Express.js, Mongoose, CORS, Express Validator
- **Base de Datos**: MongoDB
- **Estilos**: CSS3 con variables, Grid, Flexbox
- **Herramientas**: npm, Git

## 📦 Instalación

### Prerequisitos
- Node.js (v16 o superior)
- MongoDB (local o MongoDB Atlas)
- Git

### 1. Clonar el repositorio
```bash
git clone <url-del-repositorio>
cd "PaintStock APP"
```

### 2. Configurar Backend

```bash
# Navegar al directorio backend
cd backend

# Instalar dependencias
npm install

# Crear archivo .env (copiar de .env.example si existe)
# Agregar las siguientes variables:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/paintstock
JWT_SECRET=tu_clave_secreta_aqui
NODE_ENV=development
```

### 3. Configurar Frontend

```bash
# Navegar al directorio frontend
cd ../frontend

# Instalar dependencias
npm install
```

### 4. Configurar Base de Datos

#### Opción A: MongoDB Local
1. Instalar MongoDB en tu sistema
2. Iniciar el servicio MongoDB
3. La base de datos se creará automáticamente

#### Opción B: MongoDB Atlas (Nube)
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crear un cluster gratuito
3. Obtener la URI de conexión
4. Reemplazar `MONGODB_URI` en el archivo .env

## 🚀 Ejecución

### 1. Iniciar Backend

```bash
cd backend

# Poblar base de datos con datos de ejemplo (opcional)
npm run seed

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará disponible en: http://localhost:5000

### 2. Iniciar Frontend

```bash
# En otra terminal
cd frontend

# Iniciar aplicación React
npm start
```

El frontend estará disponible en: http://localhost:3000

## 📊 Datos de Ejemplo

Para facilitar las pruebas, puedes poblar la base de datos con datos de ejemplo:

```bash
cd backend
npm run seed
```

Esto creará:
- 3 categorías (Electrónicos, Periféricos, Accesorios)
- 5 productos de ejemplo
- Movimientos de inventario de muestra

## 🔧 Comandos Disponibles

### Backend
```bash
npm start       # Ejecutar en producción
npm run dev     # Ejecutar con nodemon (desarrollo)
npm run seed    # Poblar base de datos con datos de ejemplo
```

### Frontend
```bash
npm start       # Iniciar servidor de desarrollo
npm run build   # Construir para producción
npm test        # Ejecutar tests
```

## 📱 Características de la Interfaz

### Dashboard
- Tarjetas de estadísticas con animaciones
- Tabla de productos responsive
- Indicadores de estado en tiempo real

### Gestión de Productos
- Formularios con validación
- Filtros y búsqueda
- Paginación
- Estados visuales (Stock bajo, Sin stock)

### Navegación
- Sidebar colapsible
- Búsqueda global
- Menú de usuario
- Responsive design

## 🌐 APIs Disponibles

### Productos
- `GET /api/products` - Listar productos
- `POST /api/products` - Crear producto
- `GET /api/products/:id` - Obtener producto
- `PUT /api/products/:id` - Actualizar producto
- `DELETE /api/products/:id` - Eliminar producto

### Dashboard
- `GET /api/dashboard` - Estadísticas principales

### Categorías
- `GET /api/categories` - Listar categorías
- `POST /api/categories` - Crear categoría

### Movimientos
- `GET /api/movements` - Listar movimientos
- `GET /api/movements/today` - Movimientos de hoy

## 🐛 Solución de Problemas

### Error de conexión a MongoDB
```bash
# Verificar que MongoDB esté ejecutándose
# Windows: net start mongodb
# macOS/Linux: brew services start mongodb/sudo systemctl start mongod
```

### Error de puerto ocupado
```bash
# Cambiar puerto en backend/.env
PORT=5001

# O terminar proceso que usa el puerto
# Windows: netstat -ano | findstr :5000
# Linux/macOS: lsof -ti:5000 | xargs kill
```

### Error de dependencias
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

## 🔄 Estado del Proyecto

### ✅ Completado
- [x] Estructura del proyecto
- [x] Backend con Express y MongoDB
- [x] Modelos de datos (Productos, Categorías, Movimientos)
- [x] APIs REST completas
- [x] Frontend React con navegación
- [x] Dashboard con estadísticas
- [x] Gestión completa de productos
- [x] Diseño responsive
- [x] Datos de ejemplo

### 🚧 En Desarrollo
- [ ] Gestión completa de categorías/proveedores
- [ ] Módulo de movimientos detallado
- [ ] Sistema de reportes
- [ ] Autenticación de usuarios
- [ ] Notificaciones push
- [ ] Exportación de datos

## 📄 Licencia

MIT License - Ver archivo LICENSE para más detalles.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crear una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Crear un Pull Request

## 📞 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Enviar email al equipo de desarrollo

---

**PaintStock APP** - Sistema de Gestión de Inventario Moderno 🎨📦
