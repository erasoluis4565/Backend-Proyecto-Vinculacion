# Documentación Frontend — Agro Vivero Backend

> Documento dirigido al equipo de desarrollo Frontend.
> Contiene todo lo necesario para consumir e integrar la API sin necesidad de consultar al equipo Backend.

---

## Tabla de contenidos

1. [Descripción general](#1-descripción-general)
2. [Tecnologías del Backend](#2-tecnologías-del-backend)
3. [Estructura del proyecto](#3-estructura-del-proyecto)
4. [URL base de la API](#4-url-base-de-la-api)
5. [Variables de entorno del Frontend](#5-variables-de-entorno-del-frontend)
6. [Autenticación](#6-autenticación)
7. [Roles y permisos](#7-roles-y-permisos)
8. [Endpoints disponibles](#8-endpoints-disponibles)
9. [Manejo de errores](#9-manejo-de-errores)
10. [Recomendaciones para formularios](#10-recomendaciones-para-formularios)
11. [Manejo del estado de sesión](#11-manejo-del-estado-de-sesión)
12. [Flujo de consumo recomendado](#12-flujo-de-consumo-recomendado)

---

## 1. Descripción general

**Agro Vivero Backend** es una API REST desarrollada en Node.js que sirve como núcleo de datos para el sistema **Agro Vivero Medicinal**. Su propósito es gestionar:

- El catálogo de plantas medicinales con información taxonómica y etnobotánica.
- Noticias y contenido editorial del sitio.
- Recursos multimedia (imágenes, videos, documentos) almacenados en Cloudinary.
- Suscriptores y notificaciones del sistema.
- Fuentes bibliográficas de referencia.
- Usuarios administradores con roles diferenciados.
- Registro de auditoría de todas las acciones del sistema.

El Frontend interactúa exclusivamente a través de esta API mediante HTTP/JSON.

---

## 2. Tecnologías del Backend

| Tecnología | Versión | Rol |
|---|---|---|
| Node.js | — | Runtime |
| Express.js | ^5.2.1 | Framework HTTP |
| MongoDB | — | Base de datos |
| Mongoose | ^9.7.0 | ODM para MongoDB |
| JSON Web Token (JWT) | ^9.0.3 | Autenticación |
| bcrypt | ^6.0.0 | Hash de contraseñas |
| Cloudinary | ^2.10.0 | Almacenamiento multimedia |
| express-validator | ^7.3.2 | Validación de campos |
| Helmet | ^8.2.0 | Headers de seguridad HTTP |
| CORS | ^2.8.6 | Control de acceso entre orígenes |
| Morgan | ^1.11.0 | Logging de peticiones |
| express-rate-limit | — | Límite de peticiones |

---

## 3. Estructura del proyecto

```
src/
├── app.js                        # Configuración Express (CORS, Helmet, rutas)
├── server.js                     # Arranque del servidor y conexión a MongoDB
├── routes/
│   └── index.js                  # Registro central de todas las rutas (/api/...)
├── config/
│   ├── database.js               # Conexión a MongoDB
│   └── cloudinary.js             # Configuración Cloudinary (pendiente)
├── middlewares/
│   ├── auth.middleware.js        # Verificación de JWT
│   ├── role.middleware.js        # Control de roles
│   ├── validation.middleware.js  # Manejo de errores de validación
│   ├── error.middleware.js       # Handler global de errores
│   └── rate-limit.middleware.js  # Límite de peticiones (100/15min)
├── services/
│   └── auditoria.service.js      # Servicio compartido de auditoría
└── modules/
    ├── auth/                     # Login y generación de JWT ✅
    ├── plantas/                  # Catálogo de plantas ✅
    ├── noticias/                 # Noticias y contenido ✅
    ├── multimedia/               # Recursos multimedia ✅
    ├── suscriptores/             # Suscriptores ✅
    ├── notificaciones/           # Notificaciones ✅
    ├── fuentes/                  # Fuentes bibliográficas ✅
    ├── configuracion/            # Configuración del sistema ✅
    ├── auditoria/                # Registro de auditoría ✅
    └── usuarios-admin/           # Gestión de admins ✅
```

---

## 4. URL base de la API

```
http://localhost:3000/api
```

> El puerto se configura mediante la variable de entorno `PORT`. Por defecto es `3000`.

En producción, reemplazar por la URL del servidor desplegado. Configurar siempre mediante variables de entorno en el Frontend, nunca hardcodear.

---

## 5. Variables de entorno del Frontend

Crear un archivo `.env` (o equivalente según el framework) con:

```env
VITE_API_URL=http://localhost:3000/api
```

> Ajustar el prefijo según el framework: `VITE_` para Vite/Vue, `REACT_APP_` para Create React App, `NEXT_PUBLIC_` para Next.js, etc.

Uso en código:

```js
const BASE_URL = import.meta.env.VITE_API_URL;
```

---

## 6. Autenticación

El sistema usa **JSON Web Tokens (JWT)** para autenticar al administrador.

### 6.1 Cómo hacer login

**Endpoint:**

```
POST /api/auth/login
```

**Body:**

```json
{
  "correo": "admin@agrovivero.com",
  "password": "micontraseña"
}
```

**Respuesta exitosa (200):**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "correo": "admin@agrovivero.com",
    "nombreCompleto": "Administrador Principal",
    "rol": "SUPER_ADMIN"
  }
}
```

**Errores posibles:**

| Código | Mensaje | Causa |
|---|---|---|
| `400` | `{ "success": false, "errores": [...] }` | Correo inválido o password vacío |
| `500` | `{ "success": false, "message": "Credenciales inválidas" }` | Correo no existe o contraseña incorrecta |

### 6.2 Cómo enviar el token en las peticiones

Una vez obtenido el token, debe enviarse en el header `Authorization` usando el esquema **Bearer**:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> **Nota actual:** Los middlewares de auth están implementados pero **aún no están aplicados** sobre los endpoints de los módulos (plantas, noticias, etc.). Actualmente todos los endpoints son públicos. Esto cambiará cuando el equipo Backend los proteja. Se avisará al Frontend cuando ocurra.

### 6.3 Ejemplo con Axios

```js
// Guardar token tras login
const { data } = await axios.post('/api/auth/login', {
  correo: 'admin@agrovivero.com',
  password: 'micontraseña'
});
localStorage.setItem('token', data.token);
localStorage.setItem('usuario', JSON.stringify(data.usuario));

// Usar token en peticiones protegidas
const token = localStorage.getItem('token');
const response = await axios.get('/api/plantas', {
  headers: {
    Authorization: `Bearer ${token}`
  }
});
```

### 6.4 Cliente HTTP centralizado recomendado

```js
// src/api/client.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' }
});

// Adjuntar token automáticamente en cada petición
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Manejo global de errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      // Token expirado o inválido — redirigir a login
      localStorage.removeItem('token');
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    if (status === 403) {
      console.warn('Sin permisos para esta acción');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 7. Roles y permisos

El sistema tiene tres roles de administrador. Los middlewares están implementados pero aún no aplicados a rutas específicas.

| Rol | Descripción | Nivel de acceso esperado |
|---|---|---|
| `SUPER_ADMIN` | Acceso total al sistema | Todos los módulos + configuración + usuarios |
| `EDITOR` | Gestión de contenido | Plantas, noticias, multimedia, fuentes |
| `CONSULTOR` | Solo lectura | Visualización de datos sin modificar |

El rol del usuario autenticado viene en el payload del JWT y también en la respuesta del login. Usarlo en el Frontend para mostrar u ocultar secciones del panel:

```js
const usuario = JSON.parse(localStorage.getItem('usuario'));
const esSuperAdmin = usuario?.rol === 'SUPER_ADMIN';
const esEditor = ['SUPER_ADMIN', 'EDITOR'].includes(usuario?.rol);
```

---

## 8. Endpoints disponibles

### Convenciones generales

- Todos los endpoints responden en **JSON**.
- Los `_id` son **ObjectIds** de MongoDB (string de 24 caracteres hex).
- Las fechas siguen formato **ISO 8601**: `"2024-06-20T10:00:00.000Z"`.
- Los campos marcados con ✅ son **requeridos**. Los marcados con ❌ son opcionales.

---

### 8.0 Health Check

#### `GET /api/health`

Verifica que el servidor esté activo. Útil para mostrar estado de conexión.

```http
GET /api/health
```

**Respuesta (200):**
```json
{
  "status": "OK",
  "message": "Backend funcionando"
}
```

---

### 8.1 Autenticación — `/api/auth`

#### `POST /api/auth/login` — Iniciar sesión

| Header | Valor |
|---|---|
| `Content-Type` | `application/json` |

**Body:**

| Campo | Tipo | Req. | Validación |
|---|---|---|---|
| `correo` | `string` | ✅ | Debe ser email válido |
| `password` | `string` | ✅ | No puede estar vacío |

**Petición:**
```json
{
  "correo": "admin@agrovivero.com",
  "password": "micontraseña123"
}
```

**Respuesta (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "correo": "admin@agrovivero.com",
    "nombreCompleto": "Administrador Principal",
    "rol": "SUPER_ADMIN"
  }
}
```

**Errores:**

| Código | Descripción |
|---|---|
| `400` | Validación fallida (correo inválido, password vacío) |
| `500` | Credenciales incorrectas o usuario inactivo |


---

### 8.2 Plantas — `/api/plantas`

Solo devuelve plantas con `estado: "ACTIVO"`. El listado retorna campos reducidos; el detalle retorna el objeto completo.

---

#### `GET /api/plantas` — Listar plantas

**Parámetros de consulta:**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `familia` | `string` | Filtra por `taxonomia.familia` (ej: `?familia=Asteraceae`) |

**Respuesta (200):** Array con campos resumidos.
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
    "slug": "manzanilla",
    "nombreComun": "Manzanilla",
    "nombreCientifico": "Matricaria chamomilla",
    "taxonomia": { "familia": "Asteraceae" },
    "multimediaPrincipal": {
      "imagenUrl": "https://res.cloudinary.com/demo/image/upload/manzanilla.jpg"
    }
  }
]
```

> El listado retorna solo: `slug`, `nombreComun`, `nombreCientifico`, `taxonomia.familia`, `multimediaPrincipal.imagenUrl`. Para obtener todos los datos de una planta usar el endpoint de detalle.

---

#### `GET /api/plantas/:slug` — Detalle de planta

**Parámetro de ruta:** `slug` (string, ej: `manzanilla`)

**Respuesta (200):** Objeto completo de la planta.
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "slug": "manzanilla",
  "nombreComun": "Manzanilla",
  "nombreCientifico": "Matricaria chamomilla",
  "nombresAlternativos": ["Camomila"],
  "taxonomia": {
    "reino": "Plantae",
    "division": "Magnoliophyta",
    "clase": "Magnoliopsida",
    "familia": "Asteraceae",
    "genero": "Matricaria"
  },
  "etnobotanica": {
    "clasificacion": "Medicinal",
    "parteUtilizada": "Flores",
    "usoTradicional": "Digestivo y antiespasmódico",
    "compuestosQuimicos": ["Azuleno", "Bisabolol"]
  },
  "analisisAcademico": {
    "taxonomia": "Texto descriptivo...",
    "etnobotanica": "Texto descriptivo...",
    "fitoquimica": "Texto descriptivo...",
    "sostenibilidad": "Texto descriptivo..."
  },
  "multimediaPrincipal": {
    "imagenUrl": "https://res.cloudinary.com/demo/image/upload/manzanilla.jpg",
    "imagenPublicId": "agro-vivero/plantas/manzanilla",
    "videoUrl": "",
    "videoPublicId": "",
    "proveedor": "CLOUDINARY"
  },
  "estado": "ACTIVO",
  "fechaRegistro": "2024-01-15T10:00:00.000Z",
  "fechaActualizacion": "2024-01-15T10:00:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|---|---|
| `404` | `{ "mensaje": "Planta no encontrada" }` |

---

#### `POST /api/plantas` — Crear planta

**Body:**

| Campo | Tipo | Req. | Descripción |
|---|---|---|---|
| `slug` | `string` | ✅ | Único, lowercase, sin espacios (ej: `"manzanilla"`) |
| `nombreComun` | `string` | ✅ | Nombre común |
| `nombreCientifico` | `string` | ✅ | Único en BD |
| `nombresAlternativos` | `string[]` | ❌ | Otros nombres |
| `taxonomia.reino` | `string` | ✅ | |
| `taxonomia.division` | `string` | ✅ | |
| `taxonomia.clase` | `string` | ✅ | |
| `taxonomia.familia` | `string` | ✅ | |
| `taxonomia.genero` | `string` | ✅ | |
| `etnobotanica.clasificacion` | `string` | ❌ | Ej: `"Medicinal"` |
| `etnobotanica.parteUtilizada` | `string` | ❌ | |
| `etnobotanica.usoTradicional` | `string` | ❌ | |
| `etnobotanica.compuestosQuimicos` | `string[]` | ❌ | |
| `analisisAcademico.taxonomia` | `string` | ❌ | |
| `analisisAcademico.etnobotanica` | `string` | ❌ | |
| `analisisAcademico.fitoquimica` | `string` | ❌ | |
| `analisisAcademico.sostenibilidad` | `string` | ❌ | |
| `multimediaPrincipal.imagenUrl` | `string` | ❌ | URL Cloudinary |
| `multimediaPrincipal.imagenPublicId` | `string` | ❌ | |
| `multimediaPrincipal.videoUrl` | `string` | ❌ | |
| `multimediaPrincipal.videoPublicId` | `string` | ❌ | |
| `multimediaPrincipal.proveedor` | `enum` | ❌ | `"CLOUDINARY"` \| `"NINGUNO"` |
| `estado` | `enum` | ❌ | `"ACTIVO"` \| `"INACTIVO"` (default: `"ACTIVO"`) |

**Respuesta (201):** Objeto completo de la planta creada.

**Errores:**

| Código | Descripción |
|---|---|
| `400` | `slug` o `nombreCientifico` duplicado, o campo requerido faltante |
| `500` | Error interno |

---

#### `PUT /api/plantas/:id` — Actualizar planta

**Parámetro de ruta:** `id` (MongoDB ObjectId)

**Body:** Mismos campos que POST, todos opcionales. Solo enviar los campos a modificar.

**Respuesta (200):** Objeto actualizado.

> Al actualizar, `fechaActualizacion` se actualiza automáticamente en el servidor.

---

#### `DELETE /api/plantas/:id` — Desactivar planta

**Parámetro de ruta:** `id` (MongoDB ObjectId)

> **Soft delete:** No elimina el registro. Cambia `estado` a `"INACTIVO"`. La planta deja de aparecer en el listado y detalle público.

**Respuesta (200):** Objeto con `estado: "INACTIVO"`.

---

### 8.3 Noticias — `/api/noticias`

---

#### `GET /api/noticias` — Listar noticias

Devuelve todas las noticias sin filtrar por estado. Filtrar en el Frontend por `estado === "PUBLICADO"` para la vista pública.

**Respuesta (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d2",
    "slug": "descubrimiento-planta-2024",
    "titulo": "Descubrimiento de nueva planta medicinal",
    "resumen": "Investigadores identificaron una nueva especie...",
    "contenido": "<p>El equipo de investigación...</p>",
    "categoria": "Investigación",
    "autorCorreo": "editor@agrovivero.com",
    "portada": {
      "secureUrl": "https://res.cloudinary.com/demo/image/upload/portada.jpg",
      "publicId": "agro-vivero/noticias/portada-1"
    },
    "multimediaIds": ["64f1a2b3c4d5e6f7a8b9c0d3"],
    "estado": "PUBLICADO",
    "fechaPublicacion": "2024-06-20T00:00:00.000Z",
    "fechaActualizacion": "2024-06-20T10:00:00.000Z"
  }
]
```

---

#### `GET /api/noticias/:id` — Detalle de noticia

**Parámetro de ruta:** `id` (MongoDB ObjectId)

**Respuesta (200):** Objeto individual de la noticia.

**Errores:**

| Código | Descripción |
|---|---|
| `404` | `{ "mensaje": "Noticia no encontrada" }` |

---

#### `POST /api/noticias` — Crear noticia

**Body:**

| Campo | Tipo | Req. | Descripción |
|---|---|---|---|
| `slug` | `string` | ✅ | Único, URL-friendly (ej: `"descubrimiento-2024"`) |
| `titulo` | `string` | ✅ | |
| `resumen` | `string` | ✅ | Texto corto para vistas de lista |
| `contenido` | `string` | ✅ | Puede contener HTML |
| `fechaPublicacion` | `Date` | ✅ | ISO 8601 |
| `categoria` | `string` | ❌ | |
| `autorCorreo` | `string` | ❌ | |
| `portada.secureUrl` | `string` | ❌ | URL imagen portada |
| `portada.publicId` | `string` | ❌ | Public ID Cloudinary |
| `multimediaIds` | `ObjectId[]` | ❌ | IDs de `/api/multimedia` |
| `estado` | `enum` | ❌ | `"BORRADOR"` \| `"PUBLICADO"` \| `"INACTIVO"` (default: `"BORRADOR"`) |

**Respuesta (201):** Objeto completo creado.

---

#### `PUT /api/noticias/:id` — Actualizar noticia

**Parámetro de ruta:** `id` (MongoDB ObjectId)

**Body:** Mismos campos que POST, todos opcionales.

> Usar este endpoint para publicar una noticia: enviar `{ "estado": "PUBLICADO" }`.

> `fechaActualizacion` se actualiza automáticamente en el servidor.

---

#### `DELETE /api/noticias/:id` — Desactivar noticia

> **Soft delete:** Cambia `estado` a `"INACTIVO"`.

**Respuesta (200):** Objeto con `estado: "INACTIVO"`.

---

### 8.4 Multimedia — `/api/multimedia`

Gestión de recursos multimedia registrados. Los archivos físicos se almacenan en Cloudinary; estos endpoints registran los metadatos y URLs resultantes.

---

#### `GET /api/multimedia` — Listar recursos

**Respuesta (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d3",
    "titulo": "Fotografía Manzanilla",
    "descripcion": "Imagen en campo",
    "tipo": "IMAGEN",
    "url": "https://res.cloudinary.com/demo/image/upload/manzanilla.jpg",
    "publicId": "agro-vivero/plantas/manzanilla",
    "proveedor": "Cloudinary",
    "estado": "ACTIVO",
    "fechaRegistro": "2024-06-20T10:00:00.000Z"
  }
]
```

---

#### `GET /api/multimedia/:id` — Obtener recurso

**Errores:**

| Código | Descripción |
|---|---|
| `404` | `{ "mensaje": "Registro no encontrado" }` |

---

#### `POST /api/multimedia` — Registrar recurso

**Body:**

| Campo | Tipo | Req. | Descripción |
|---|---|---|---|
| `titulo` | `string` | ✅ | Nombre descriptivo |
| `tipo` | `enum` | ✅ | `"IMAGEN"` \| `"VIDEO"` \| `"DOCUMENTO"` |
| `url` | `string` | ✅ | URL pública del recurso |
| `publicId` | `string` | ✅ | ID de Cloudinary |
| `descripcion` | `string` | ❌ | |
| `proveedor` | `string` | ❌ | Default: `"Cloudinary"` |
| `estado` | `enum` | ❌ | `"ACTIVO"` \| `"INACTIVO"` (default: `"ACTIVO"`) |

**Petición:**
```json
{
  "titulo": "Fotografía Manzanilla",
  "tipo": "IMAGEN",
  "url": "https://res.cloudinary.com/demo/image/upload/v123/manzanilla.jpg",
  "publicId": "agro-vivero/plantas/manzanilla",
  "descripcion": "Tomada en campo de cultivo"
}
```

**Respuesta (201):** Objeto creado.

---

#### `PUT /api/multimedia/:id` — Actualizar recurso

**Body:** Mismos campos que POST, todos opcionales.

---

#### `DELETE /api/multimedia/:id` — Desactivar recurso

> **Soft delete:** Cambia `estado` a `"INACTIVO"`.

---

### 8.5 Suscriptores — `/api/suscriptores`

---

#### `GET /api/suscriptores` — Listar suscriptores

Devuelve todos los suscriptores sin filtro de estado.

**Respuesta (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
    "nombre": "Juan Pérez",
    "correo": "juan@example.com",
    "intereses": ["plantas medicinales"],
    "aceptaNotificaciones": true,
    "estado": "ACTIVO",
    "fechaRegistro": "2024-06-01T00:00:00.000Z",
    "ultimaNotificacion": null
  }
]
```

---

#### `POST /api/suscriptores` — Registrar suscriptor

Usar en el formulario de suscripción del sitio público.

**Body:**

| Campo | Tipo | Req. | Descripción |
|---|---|---|---|
| `correo` | `string` | ✅ | Único en BD |
| `nombre` | `string` | ❌ | |
| `intereses` | `string[]` | ❌ | Temas de interés |
| `aceptaNotificaciones` | `boolean` | ❌ | Default: `true` |
| `estado` | `enum` | ❌ | `"ACTIVO"` \| `"INACTIVO"` \| `"PENDIENTE"` (default: `"PENDIENTE"`) |

**Petición:**
```json
{
  "correo": "juan@example.com",
  "nombre": "Juan Pérez",
  "intereses": ["plantas medicinales", "noticias"],
  "aceptaNotificaciones": true
}
```

**Respuesta (201):**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d4",
  "correo": "juan@example.com",
  "nombre": "Juan Pérez",
  "estado": "PENDIENTE",
  "fechaRegistro": "2024-06-20T10:00:00.000Z"
}
```

**Errores:**

| Código | Descripción |
|---|---|
| `400` | `correo` faltante o ya registrado |
| `500` | Error interno |

---

### 8.6 Notificaciones — `/api/notificaciones`

---

#### `GET /api/notificaciones` — Listar notificaciones

**Respuesta (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d5",
    "tipo": "NUEVA_NOTICIA",
    "titulo": "Nueva noticia publicada",
    "mensaje": "Se publicó: Descubrimiento de nueva planta",
    "noticiaSlug": "descubrimiento-2024",
    "plantaSlug": null,
    "canales": ["WEB", "EMAIL"],
    "totalDestinatarios": 150,
    "estado": "ENVIADA",
    "fechaCreacion": "2024-06-20T10:00:00.000Z",
    "fechaEnvio": "2024-06-20T10:01:00.000Z"
  }
]
```

---

#### `POST /api/notificaciones` — Crear notificación

**Body:**

| Campo | Tipo | Req. | Descripción |
|---|---|---|---|
| `tipo` | `enum` | ✅ | `"NUEVA_NOTICIA"` \| `"NUEVA_PLANTA"` \| `"NUEVO_MULTIMEDIA"` \| `"GENERAL"` |
| `titulo` | `string` | ✅ | |
| `mensaje` | `string` | ✅ | |
| `noticiaSlug` | `string` | ❌ | Slug de noticia relacionada |
| `plantaSlug` | `string` | ❌ | Slug de planta relacionada |
| `canales` | `enum[]` | ❌ | `"WEB"` \| `"EMAIL"` |
| `totalDestinatarios` | `number` | ❌ | |
| `estado` | `enum` | ❌ | `"PENDIENTE"` \| `"ENVIADA"` \| `"FALLIDA"` (default: `"PENDIENTE"`) |

**Respuesta (201):** Objeto creado.

---

### 8.7 Fuentes — `/api/fuentes`

---

#### `GET /api/fuentes` — Listar fuentes

**Respuesta (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d6",
    "titulo": "Manual de plantas medicinales",
    "tipo": "Libro",
    "autor": "Dr. Carlos Flores",
    "anio": 2020,
    "descripcion": "Guía completa de plantas",
    "urlDocumento": "https://example.com/manual.pdf",
    "estado": "ACTIVO",
    "fechaRegistro": "2024-01-01T00:00:00.000Z"
  }
]
```

---

#### `POST /api/fuentes` — Crear fuente

**Body:**

| Campo | Tipo | Req. | Descripción |
|---|---|---|---|
| `titulo` | `string` | ✅ | |
| `tipo` | `enum` | ✅ | `"Word"` \| `"PDF"` \| `"Libro"` \| `"Artículo"` \| `"Sitio web"` \| `"Entrevista"` \| `"Otro"` |
| `autor` | `string` | ❌ | |
| `anio` | `number` | ❌ | Año de publicación |
| `descripcion` | `string` | ❌ | |
| `urlDocumento` | `string` | ❌ | URL al documento original |
| `estado` | `enum` | ❌ | `"ACTIVO"` \| `"INACTIVO"` (default: `"ACTIVO"`) |

**Respuesta (201):** Objeto creado.

---

### 8.8 Configuración — `/api/configuracion`

Recurso singleton: solo existe un documento de configuración. `GET` lo obtiene, `PUT` lo actualiza (crea si no existe).

---

#### `GET /api/configuracion` — Obtener configuración

**Respuesta (200):**
```json
{
  "_id": "64f1a2b3c4d5e6f7a8b9c0d7",
  "proyecto": "Agro Vivero Medicinal",
  "descripcion": "Sistema de gestión de plantas medicinales",
  "baseDatos": "agro-vivero-db",
  "almacenamientoMultimedia": "Cloudinary",
  "cloudinaryFolderBase": "agro-vivero",
  "versionDatos": "1.0.0",
  "responsableBaseDatos": "admin@agrovivero.com",
  "estado": "ACTIVO"
}
```

---

#### `PUT /api/configuracion` — Actualizar configuración

**Body:** Cualquier campo del modelo (todos opcionales). Usa `upsert` internamente.

**Respuesta (200):** Objeto actualizado.

---

### 8.9 Auditoría — `/api/auditoria`

Registro de trazabilidad. El servidor registra automáticamente las acciones en plantas, noticias, usuarios y configuración. El Frontend puede crear entradas manuales si es necesario.

---

#### `GET /api/auditoria` — Listar registros

**Respuesta (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d8",
    "accion": "INSERT",
    "coleccion": "plantas",
    "documentoSlug": "manzanilla",
    "usuarioCorreo": "editor@agrovivero.com",
    "detalle": "Planta creada correctamente",
    "fechaAccion": "2024-06-20T10:00:00.000Z"
  }
]
```

---

#### `POST /api/auditoria` — Registrar acción

**Body:**

| Campo | Tipo | Req. | Descripción |
|---|---|---|---|
| `accion` | `enum` | ✅ | `"INSERT"` \| `"UPDATE"` \| `"DELETE"` \| `"LOGIN"` \| `"UPLOAD"` \| `"PUBLICAR_NOTICIA"` \| `"OTRO"` |
| `coleccion` | `string` | ✅ | Nombre de la colección afectada |
| `usuarioCorreo` | `string` | ✅ | Correo del usuario que realizó la acción |
| `documentoSlug` | `string` | ❌ | Slug del documento |
| `detalle` | `string` | ❌ | Descripción de la acción |

**Respuesta (201):** Objeto creado.

---

### 8.10 Usuarios Admin — `/api/usuarios-admin`

> ⚠️ Endpoints sin protección de auth actualmente. No exponer al público en producción.

---

#### `GET /api/usuarios-admin` — Listar admins

**Respuesta (200):**
```json
[
  {
    "_id": "64f1a2b3c4d5e6f7a8b9c0d9",
    "correo": "admin@agrovivero.com",
    "nombreCompleto": "Administrador Principal",
    "rol": "SUPER_ADMIN",
    "estado": "ACTIVO",
    "ultimoAcceso": "2024-06-19T08:00:00.000Z",
    "fechaRegistro": "2024-01-01T00:00:00.000Z"
  }
]
```

> El campo `passwordHash` está en la BD pero no debe mostrarse en el Frontend.

---

#### `GET /api/usuarios-admin/:id` — Obtener admin por ID

**Errores:**

| Código | Descripción |
|---|---|
| `404` | `{ "mensaje": "Usuario no encontrado" }` |

---

#### `POST /api/usuarios-admin` — Crear administrador

**Body:**

| Campo | Tipo | Req. | Descripción |
|---|---|---|---|
| `correo` | `string` | ✅ | Único en BD |
| `passwordHash` | `string` | ✅ | Contraseña en texto plano — el servidor la hashea con bcrypt |
| `nombreCompleto` | `string` | ✅ | |
| `rol` | `enum` | ❌ | `"SUPER_ADMIN"` \| `"EDITOR"` \| `"CONSULTOR"` (default: `"CONSULTOR"`) |
| `estado` | `enum` | ❌ | `"ACTIVO"` \| `"INACTIVO"` (default: `"ACTIVO"`) |

> Aunque el campo se llama `passwordHash`, se envía la contraseña en texto plano. El servidor se encarga de hashearla con bcrypt.

**Respuesta (201):** Objeto del usuario creado (incluye `passwordHash` hasheado).

---

#### `PUT /api/usuarios-admin/:id` — Actualizar admin

**Body:** Mismos campos que POST, todos opcionales.

---

#### `DELETE /api/usuarios-admin/:id` — Desactivar admin

> **Soft delete:** Cambia `estado` a `"INACTIVO"`.

---

## 9. Manejo de errores

### 9.1 Estructura de errores del servidor

El middleware global de errores devuelve siempre esta forma:

```json
{
  "success": false,
  "message": "Descripción del error"
}
```

Los errores de validación (400) devuelven:

```json
{
  "success": false,
  "errores": [
    {
      "type": "field",
      "msg": "El correo es obligatorio",
      "path": "correo",
      "location": "body"
    }
  ]
}
```

### 9.2 Tabla de códigos HTTP usados

| Código | Significado | Cuándo ocurre |
|---|---|---|
| `200` | OK | Petición exitosa (GET, PUT, DELETE) |
| `201` | Created | Recurso creado exitosamente (POST) |
| `400` | Bad Request | Validación fallida, campo requerido faltante, valor duplicado |
| `401` | Unauthorized | Token ausente o inválido/expirado |
| `403` | Forbidden | Token válido pero rol sin permisos |
| `404` | Not Found | Recurso no existe en la BD |
| `429` | Too Many Requests | Más de 100 peticiones en 15 minutos |
| `500` | Internal Server Error | Error del servidor (BD caída, lógica fallida) |

### 9.3 Manejo recomendado en el Frontend

```js
try {
  const { data } = await apiClient.post('/api/plantas', payload);
  // éxito
} catch (error) {
  const status = error.response?.status;
  const msg = error.response?.data?.message;
  const errores = error.response?.data?.errores;

  if (status === 400 && errores) {
    // Mostrar errores de validación campo a campo
    errores.forEach(e => mostrarErrorCampo(e.path, e.msg));
  } else if (status === 404) {
    mostrarAlerta('El recurso no fue encontrado');
  } else if (status === 429) {
    mostrarAlerta('Demasiadas solicitudes. Espere un momento.');
  } else {
    mostrarAlerta(msg || 'Error del servidor. Intente más tarde.');
  }
}
```

---

## 10. Recomendaciones para formularios

**Validar en el Frontend antes de enviar.** Los campos requeridos en el Backend deben validarse también en el cliente para evitar round-trips innecesarios.

**Slugs.** Generar el slug automáticamente a partir del nombre usando una función:
```js
const generarSlug = (texto) =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

// Ejemplo: "Manzanilla Alemana" → "manzanilla-alemana"
```

**Fechas.** Enviar siempre en ISO 8601 con `.toISOString()`:
```js
fechaPublicacion: new Date(inputFecha).toISOString()
```

**Enums.** Los valores de los campos `enum` son exactos y case-sensitive. Usar los valores tal cual aparecen en la documentación (mayúsculas).

**Estados iniciales.** Al crear, no enviar el campo `estado` a menos que se quiera un valor específico — el servidor asigna el default correcto.

**Arrays vacíos.** Campos como `nombresAlternativos`, `intereses` o `multimediaIds` pueden enviarse como `[]` o simplemente omitirse.

**Multimedia antes del recurso principal.** Si se va a asociar una imagen a una planta o noticia, primero registrar el recurso en `/api/multimedia` (obteniendo la URL de Cloudinary), y luego usar esa URL al crear/actualizar la planta o noticia.

---

## 11. Manejo del estado de sesión

### Al hacer login

```js
// Guardar en localStorage
localStorage.setItem('token', data.token);
localStorage.setItem('usuario', JSON.stringify(data.usuario));
```

### Al verificar si hay sesión activa

```js
const estaAutenticado = () => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  try {
    // Decodificar sin verificar firma (solo para leer exp)
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
};
```

### Al cerrar sesión

```js
const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/login';
};
```

### Proteger rutas del panel admin (React ejemplo)

```jsx
const RutaProtegida = ({ children }) => {
  if (!estaAutenticado()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};
```

> **Nota:** La duración del token (`JWT_EXPIRES_IN`) la configura el equipo Backend en sus variables de entorno. Cuando expire, el interceptor del cliente HTTP redirige automáticamente al login.

---

## 12. Flujo de consumo recomendado

### 12.1 Inicialización de la aplicación

```
1. GET /api/health              → Verificar que el servidor responde
2. GET /api/configuracion       → Cargar nombre del proyecto y config general
```

### 12.2 Sección pública — vitrina del sitio

```
1. GET /api/plantas             → Catálogo (solo devuelve ACTIVO, campo familia opcional)
2. GET /api/plantas/:slug       → Detalle al hacer clic en una planta
3. GET /api/noticias            → Listado (filtrar en FE por estado === "PUBLICADO")
4. GET /api/noticias/:id        → Detalle de noticia
5. POST /api/suscriptores       → Formulario de suscripción
```

### 12.3 Panel admin — flujo de login

```
1. POST /api/auth/login         → Obtener token + datos del usuario
2. Guardar token en localStorage
3. Redirigir al dashboard
```

### 12.4 Panel admin — publicar una noticia

```
1. POST /api/multimedia         → Registrar imagen de portada (URL desde Cloudinary)
2. POST /api/noticias           → Crear con estado "BORRADOR" y portada.secureUrl
3. PUT  /api/noticias/:id       → Cambiar estado a "PUBLICADO" cuando esté lista
4. POST /api/notificaciones     → Crear notificación tipo "NUEVA_NOTICIA" con noticiaSlug
```

### 12.5 Panel admin — agregar una planta

```
1. POST /api/multimedia         → Subir imagen/video principal
2. POST /api/plantas            → Crear planta con multimediaPrincipal completo
3. POST /api/fuentes            → Registrar fuentes bibliográficas consultadas
4. POST /api/notificaciones     → Notificación tipo "NUEVA_PLANTA" con plantaSlug
```

### 12.6 Tabla de estados por entidad

| Entidad | Estados | Default | Visible en público |
|---|---|---|---|
| Planta | `ACTIVO`, `INACTIVO` | `ACTIVO` | Solo `ACTIVO` |
| Noticia | `BORRADOR`, `PUBLICADO`, `INACTIVO` | `BORRADOR` | Solo `PUBLICADO` |
| Multimedia | `ACTIVO`, `INACTIVO` | `ACTIVO` | Solo `ACTIVO` |
| Suscriptor | `ACTIVO`, `INACTIVO`, `PENDIENTE` | `PENDIENTE` | — |
| Notificación | `PENDIENTE`, `ENVIADA`, `FALLIDA` | `PENDIENTE` | — |
| Fuente | `ACTIVO`, `INACTIVO` | `ACTIVO` | Solo `ACTIVO` |
| Usuario Admin | `ACTIVO`, `INACTIVO` | `ACTIVO` | — |

### 12.7 Puntos de atención para el equipo Frontend

1. **Slugs vs IDs:** Las plantas usan `slug` en el GET de detalle (`/plantas/:slug`) pero `_id` en PUT y DELETE. Las noticias usan `_id` para todo.
2. **Soft delete universal:** Ningún endpoint elimina físicamente un registro. Siempre cambia el campo `estado` a `INACTIVO`.
3. **Auditoría automática:** El servidor registra en `/api/auditoria` las operaciones de plantas, noticias, configuración y usuarios. El Frontend no necesita hacerlo para esas entidades.
4. **CORS abierto:** El Backend acepta peticiones de cualquier origen. No se necesita configuración especial en desarrollo.
5. **Rate limit:** 100 peticiones cada 15 minutos por IP. En desarrollo no es problema; tenerlo en cuenta para funcionalidades con polling.
6. **Cloudinary:** La integración de subida de archivos (multipart) aún no está wired en los endpoints. Por ahora, el Frontend debe obtener las URLs de Cloudinary de forma directa o mediante el SDK de Cloudinary y luego registrarlas en `/api/multimedia`.

---

*Documentación generada: junio 2026 — Backend versión 1.0.0*
