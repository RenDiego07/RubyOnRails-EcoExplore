# EcoExplore - Sistema de Monitoreo de Biodiversidad

EcoExplore es una aplicación web para el registro y monitoreo de avistamientos de especies en diferentes ecosistemas, diseñada para contribuir a la conservación de la biodiversidad.

## 🛠️ Tecnologías Utilizadas

### Backend (Ruby on Rails)
- **Ruby on Rails 8.0.2** - Framework web principal
- **PostgreSQL** - Base de datos relacional
- **JWT** - Autenticación basada en tokens
- **BCrypt** - Encriptación de contraseñas
- **Rack-CORS** - Manejo de CORS para API

### Frontend (React + TypeScript)
- **React 19.1.1** - Framework frontend
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **React Router DOM** - Enrutamiento
- **Axios** - Cliente HTTP
- **Leaflet** - Mapas interactivos
- **React Hook Form** - Manejo de formularios
- **Framer Motion** - Animaciones

### Servicios Externos
- **Firebase** - Almacenamiento de imágenes
- **Leaflet Maps** - Visualización geográfica

## 🚀 Instalación y Configuración

### Prerrequisitos
- Ruby 3.x
- Node.js 18+
- PostgreSQL
- Docker (opcional)

### Backend Setup

1. **Navegar al directorio del backend:**
   ```bash
   cd ECOEXPLORE_BACKEND
   ```

2. **Instalar dependencias:**
   ```bash
   bundle install
   ```

3. **Configurar base de datos:**
   ```bash
   rails db:create
   rails db:migrate
   ```

4. **Iniciar servidor:**
   ```bash
   rails server
   ```
   El backend estará disponible en `http://localhost:3000`

### Frontend Setup

1. **Navegar al directorio del frontend:**
   ```bash
   cd ECOEXPLORE_FRONTEND
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **⚠️ IMPORTANTE - Configurar variables de entorno:**
   Crear archivo `.env` en la raíz del directorio frontend con el siguiente contenido:
   
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_FIREBASE_API_KEY=AIzaSyBu8x7Y9QFJLMNOqRsTuvwxyz123456789
   VITE_FIREBASE_AUTH_DOMAIN=ecoexplore-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=ecoexplore-project
   VITE_FIREBASE_STORAGE_BUCKET=ecoexplore-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012
   VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
   ```
   
   **Nota:** Estas credenciales se incluyen únicamente para facilitar la evaluación del proyecto por parte del profesor. En un entorno de producción, estas variables NUNCA deben exponerse públicamente.

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`

## 🧪 Pasos para Probar el Demo

### 1. Configuración Inicial
- Asegurar que tanto el backend como el frontend estén ejecutándose
- Verificar conexión a la base de datos PostgreSQL

### 2. Registro de Usuario
1. Acceder a `http://localhost:5173`
2. Hacer clic en "Registrarse"
3. Completar el formulario con:
   - Nombre completo
   - Email válido
   - Contraseña segura
4. Confirmar registro

### 3. Inicio de Sesión
1. Usar las credenciales creadas
2. Acceder al dashboard según el rol:
   - **Usuario regular:** Dashboard de miembro
   - **Administrador:** Panel administrativo

### 4. Funcionalidades de Usuario Regular
- **Crear avistamiento:** Registrar nueva especie avistada con ubicación
- **Subir imágenes:** Usar Firebase para almacenar fotos
- **Ver historial:** Consultar avistamientos anteriores
- **Explorar especies:** Navegar catálogo de especies aprobadas

### 5. Funcionalidades de Administrador
- **Gestión de usuarios:** Crear, editar, eliminar usuarios
- **Gestión de especies:** Aprobar/rechazar especies
- **Gestión de ecosistemas:** Administrar tipos de ecosistemas
- **Moderación:** Revisar y aprobar avistamientos

### 6. Características del Mapa
- Seleccionar ubicación geográfica
- Visualizar avistamientos en el mapa
- Filtrar por ecosistema o tipo de especie

## 📁 Estructura del Proyecto

```
RubyOnRails-EcoExplore/
├── ECOEXPLORE_BACKEND/     # API Ruby on Rails
│   ├── app/
│   │   ├── controllers/    # Controladores API
│   │   ├── models/        # Modelos de datos
│   │   └── services/      # Lógica de negocio
│   └── db/               # Migraciones y seeds
└── ECOEXPLORE_FRONTEND/   # Aplicación React
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── pages/        # Páginas principales
    │   ├── services/     # Servicios HTTP
    │   └── hooks/        # Custom hooks
    └── public/          # Archivos estáticos
```

## 🔧 Scripts Disponibles

### Backend
- `rails server` - Iniciar servidor de desarrollo
- `rails db:migrate` - Ejecutar migraciones

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run lint` - Linter de código
- `npm run format` - Formatear código

## 🌟 Características Principales

- **Sistema de autenticación** con JWT
- **Roles de usuario** (Usuario/Administrador)
- **Geolocalización** con mapas interactivos
- **Subida de imágenes** a Firebase
- **API RESTful** completa
- **Interfaz responsive** y moderna
- **Validaciones** tanto frontend como backend
