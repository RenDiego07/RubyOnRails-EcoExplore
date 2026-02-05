# EcoExplore - Sistema de Monitoreo de Biodiversidad

EcoExplore es una aplicación web para el registro y monitoreo de avistamientos de especies en diferentes ecosistemas, diseñada para contribuir a la conservación de la biodiversidad.

## Tecnologías Utilizadas

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

## Instalación y Configuración

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

3. **IMPORTANTE - Configurar variables de entorno:**
   Crear archivo `.env` en la raíz del directorio frontend con el siguiente contenido:
   
   ```env
   VITE_API_BASE_URL=http://localhost:3000/api
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   ```
   
   **Nota:** Estas credenciales se incluyen únicamente para facilitar la evaluación del proyecto por parte del profesor. En un entorno de producción, estas variables NUNCA deben exponerse públicamente.

4. **Iniciar servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   El frontend estará disponible en `http://localhost:5173`

## Pasos para Probar el Demo

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

##  Estructura del Proyecto

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

## Scripts Disponibles

### Backend
- `rails server` - Iniciar servidor de desarrollo
- `rails db:migrate` - Ejecutar migraciones

### Frontend
- `npm run dev` - Servidor de desarrollo
- `npm run lint` - Linter de código
- `npm run format` - Formatear código

## Documentación de la API

### Base URL
```
http://localhost:3000
```

### Autenticación
La API utiliza JWT tokens. Incluir el token en el header de autorización:
```
Authorization: Bearer {token}
```

### Endpoints Disponibles

#### **Autenticación**
- `POST /auth/register` - Registro de usuario
  - **Body:** `{ name, email, password, role? }`
  - **Response:** `{ success, message, user, token? }`

- `POST /auth/login` - Inicio de sesión
  - **Body:** `{ email, password }`
  - **Response:** `{ success, message, token, user }`

- `DELETE /auth/logout` - Cerrar sesión
  - **Response:** `{ message }`

#### **Usuarios**
- `GET /user/getUsers` - Obtener todos los usuarios (Admin)
- `DELETE /user/deleteUser/:id` - Eliminar usuario (Admin)
- `PUT /user/updateUser` - Actualizar usuario (Admin)
- `GET /user/profile` - Obtener perfil del usuario actual
- `PATCH /user/profile` - Actualizar perfil del usuario
- `PATCH /user/profile_photo` - Actualizar foto de perfil

#### **Especies**
- `GET /species/getSpecies` - Obtener todas las especies
- `POST /species/create` - Crear nueva especie
- `POST /species` - Crear nueva especie (alternativo)
- `DELETE /species/deleteSpecies/:id` - Eliminar especie
- `POST /species/updateSpecies` - Actualizar especie

#### **Avistamientos**
- `GET /sightings` - Obtener todos los avistamientos
- `GET /sightings/my_sightings` - Obtener avistamientos del usuario
- `POST /sightings` - Crear nuevo avistamiento
- `PUT /sightings/:id` - Actualizar avistamiento
- `POST /sightings/updateState` - Actualizar estado de avistamiento (Admin)

#### **Ecosistemas**
- `GET /ecosystems` - Obtener todos los ecosistemas
- `GET /ecosystems/:id` - Obtener ecosistema específico
- `POST /ecosystems` - Crear nuevo ecosistema
- `PUT /ecosystems/:id` - Actualizar ecosistema
- `DELETE /ecosystems/:id` - Eliminar ecosistema

#### **Tipos de Especies**
- `GET /type_specie/index` - Obtener todos los tipos de especies

#### **Especies de Usuario**
- `GET /user_species/my_contributed_species` - Especies contribuidas por el usuario
- `GET /user_species/all_contributed_species` - Todas las especies contribuidas (Admin)
- `GET /user_species/explore_species` - Explorar todas las especies disponibles

#### **Sistema**
- `GET /up` - Health check del servidor

### Códigos de Respuesta HTTP
- `200` - Operación exitosa
- `201` - Recurso creado exitosamente
- `204` - Operación exitosa sin contenido
- `400` - Solicitud incorrecta
- `401` - No autorizado
- `404` - Recurso no encontrado
- `422` - Entidad no procesable (errores de validación)
- `500` - Error interno del servidor

## Características Principales

- **Sistema de autenticación** con JWT
- **Roles de usuario** (Usuario/Administrador)
- **Geolocalización** con mapas interactivos
- **Subida de imágenes** a Firebase
- **API RESTful** completa
- **Interfaz responsive** y moderna
- **Validaciones** tanto frontend como backend
