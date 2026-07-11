# Documentación General del Proyecto — Agro Vivero Medicinal

> Documento oficial del estado actual del proyecto.
> Destinado a nuevos integrantes, equipo completo y partes interesadas.

---

## Tabla de contenidos

1. [Información general](#1-información-general)
2. [Arquitectura del sistema](#2-arquitectura-del-sistema)
3. [Tecnologías utilizadas](#3-tecnologías-utilizadas)
4. [Backend — estructura y organización](#4-backend--estructura-y-organización)
5. [Base de datos](#5-base-de-datos)
6. [Seguridad implementada](#6-seguridad-implementada)
7. [API — resumen de endpoints](#7-api--resumen-de-endpoints)
8. [Estado actual del proyecto](#8-estado-actual-del-proyecto)
9. [Instalación y ejecución](#9-instalación-y-ejecución)
10. [Convenciones del proyecto](#10-convenciones-del-proyecto)

---

## 1. Información general

| Atributo | Detalle |
|---|---|
| **Nombre del proyecto** | Agro Vivero Medicinal |
| **Repositorio Backend** | `agro-vivero-backend` |
| **Versión actual** | 1.0.0 |
| **Tipo de sistema** | API REST + (Frontend por desarrollar) |
| **Estado** | En desarrollo activo |

### Descripción del sistema

Agro Vivero Medicinal es un sistema de información web orientado a documentar, preservar y difundir el conocimiento sobre plantas medicinales. El sistema centraliza datos taxonómicos, etnobotánicos y académicos sobre cada planta, y permite gestionar noticias, multimedia, fuentes bibliográficas y suscriptores interesados en el tema.

### Objetivo principal

Proveer una plataforma digital que facilite el acceso público al catálogo de plantas medicinales y permita a un equipo de administradores gestionar el contenido de forma ordenada, con trazabilidad de cambios y control de acceso por roles.

### Alcance actual

El alcance actual cubre únicamente el **Backend** (API REST). El Frontend no ha sido desarrollado todavía. El Backend expone todos los endpoints necesarios para:

- Gestión completa del catálogo de plantas medicinales.
- Gestión de noticias y contenido editorial.
- Administración de recursos multimedia vinculados a Cloudinary.
- Registro y gestión de suscriptores.
- Sistema de notificaciones.
- Fuentes bibliográficas.
- Configuración global del sistema.
- Auditoría de acciones.
- Autenticación de administradores con JWT y roles.

---

## 2. Arquitectura del sistema

### Arquitectura utilizada

El Backend sigue una arquitectura **modular por capas** (Layered + Modular Architecture), donde cada módulo de negocio es autónomo y contiene sus propias capas: rutas → controlador → servicio → modelo.

```
Cliente (Frontend / Postman)
        │
        │  HTTP / JSON
        ▼
┌───────────────────────────────┐
│         Express.js API        │
│                               │
│  Middlewares globales:        │
│  - CORS, Helmet, Morgan       │
│  - Rate Limiter               │
│  - Error Handler              │
│                               │
│  Middlewares por ruta:        │
│  - auth.middleware (JWT)      │
│  - role.middleware (Roles)    │
│  - validation.middleware      │
│                               │
│  Módulos:                     │
│  Route → Controller →         │
│  Service → Model              │
└───────────┬───────────────────┘
            │
            │  Mongoose ODM
            ▼
┌───────────────────────┐
│       MongoDB         │
│  (Base de datos)      │
└───────────────────────┘
            
┌───────────────────────┐
│      Cloudinary       │
│  (Almacenamiento de   │
│   archivos multimedia)│
└───────────────────────┘
```

### División de componentes

| Componente | Estado | Tecnología |
|---|---|---|
| **Backend / API** | ✅ En desarrollo | Node.js + Express |
| **Base de datos** | ✅ Activo | MongoDB + Mongoose |
| **Almacenamiento multimedia** | ⚠️ Parcial | Cloudinary (config pendiente) |
| **Frontend** | ❌ No iniciado | Por definir |

### Comunicación entre componentes

- El **Frontend** se comunica con la API exclusivamente mediante peticiones HTTP/JSON a `http://[host]/api/...`.
- La **API** se comunica con MongoDB mediante Mongoose de forma asíncrona (`async/await`).
- La **API** se comunicará con Cloudinary para almacenamiento de archivos (pendiente de configuración completa).
- No existe comunicación directa entre Frontend y MongoDB ni Frontend y Cloudinary (toda la lógica pasa por la API).

---

## 3. Tecnologías utilizadas

### Lenguajes

| Lenguaje | Uso |
|---|---|
| JavaScript (Node.js) | Backend completo |

### Frameworks y librerías principales

| Librería | Versión | Función |
|---|---|---|
| `express` | ^5.2.1 | Framework HTTP principal |
| `mongoose` | ^9.7.0 | ODM para MongoDB |
| `jsonwebtoken` | ^9.0.3 | Generación y verificación de JWT |
| `bcrypt` | ^6.0.0 | Hash seguro de contraseñas |
| `cloudinary` | ^2.10.0 | SDK de almacenamiento multimedia |
| `multer` | ^2.1.1 | Procesamiento de archivos multipart (pendiente de integrar) |
| `express-validator` | ^7.3.2 | Validación declarativa de campos |
| `helmet` | ^8.2.0 | Headers HTTP de seguridad |
| `cors` | ^2.8.6 | Control de acceso entre orígenes |
| `morgan` | ^1.11.0 | Logger de peticiones HTTP |
| `express-rate-limit` | — | Limitación de peticiones por IP |
| `dotenv` | ^17.4.2 | Carga de variables de entorno |

### Herramientas de desarrollo

| Herramienta | Función |
|---|---|
| `nodemon` | Reinicio automático en desarrollo |
| Git | Control de versiones |
| Postman / Insomnia | Prueba manual de endpoints |

---

## 4. Backend — estructura y organización

### Estructura de carpetas

```
agro-vivero-backend/
├── .env                          # Variables de entorno (no subir a Git)
├── .env.example                  # Plantilla de variables de entorno
├── package.json
├── docs/                         # Documentación del proyecto
└── src/
    ├── server.js                 # Punto de entrada: carga .env, conecta BD, inicia servidor
    ├── app.js                    # Configuración Express: middlewares globales y rutas
    ├── routes/
    │   └── index.js              # Registro central de rutas bajo /api
    ├── config/
    │   ├── database.js           # Función connectDB() con mongoose.connect()
    │   └── cloudinary.js         # Config Cloudinary (pendiente de implementar)
    ├── middlewares/
    │   ├── auth.middleware.js    # Verifica JWT en header Authorization
    │   ├── role.middleware.js    # Verifica rol del usuario autenticado
    │   ├── validation.middleware.js  # Procesa errores de express-validator
    │   ├── error.middleware.js   # Handler global de errores no capturados
    │   └── rate-limit.middleware.js  # 100 req / 15 min por IP
    ├── services/
    │   └── auditoria.service.js  # Servicio compartido: registrar() usado por todos los módulos
    └── modules/
        ├── auth/
        ├── plantas/
        ├── noticias/
        ├── multimedia/
        ├── suscriptores/
        ├── notificaciones/
        ├── fuentes/
        ├── configuracion/
        ├── auditoria/
        └── usuarios-admin/
```

### Organización por módulos

Cada módulo sigue exactamente la misma estructura interna:

```
modulo/
├── modulo.routes.js       # Define rutas Express y las conecta al controlador
├── modulo.controller.js   # Recibe req/res, llama al servicio, retorna respuesta HTTP
├── modulo.service.js      # Lógica de negocio, consultas a la BD, llamadas a auditoría
├── modulo.model.js        # Esquema Mongoose y exportación del modelo
└── modulo.validation.js   # Reglas de validación con express-validator (en desarrollo)
```

### Capa de rutas

Las rutas se definen con `express.Router()` en cada módulo y se montan en `src/routes/index.js` bajo el prefijo `/api`:

```
/api/health
/api/auth
/api/plantas
/api/noticias
/api/multimedia
/api/suscriptores
/api/notificaciones
/api/fuentes
/api/configuracion
/api/auditoria
/api/usuarios-admin
```

### Capa de controladores

Los controladores son funciones `async (req, res)` que:
1. Extraen datos de `req.body`, `req.params` o `req.query`.
2. Llaman al servicio correspondiente.
3. Retornan la respuesta HTTP con el código de estado adecuado.
4. El módulo `auth` usa `next(error)` para delegar al error handler global.

### Capa de servicios

Los servicios contienen toda la lógica de negocio:
- Consultas a MongoDB mediante Mongoose (`find`, `findById`, `findByIdAndUpdate`, `create`).
- Lógica de soft delete (actualizar `estado` a `"INACTIVO"`).
- Llamadas automáticas a `auditoriaService.registrar()` al crear, actualizar o eliminar.
- En `auth.service.js`: verificación de contraseña con `bcrypt.compare()` y firma de JWT.

### Capa de modelos

Esquemas Mongoose que definen:
- Tipos de datos y restricciones.
- Valores por defecto.
- Enums permitidos.
- Índices para optimización de consultas.
- Relaciones entre colecciones mediante `ObjectId` con `ref`.

### Middlewares implementados

| Middleware | Archivo | Aplicado actualmente |
|---|---|---|
| CORS abierto | `app.js` (via `cors()`) | ✅ Global |
| Helmet (headers seguridad) | `app.js` (via `helmet()`) | ✅ Global |
| Morgan (logging) | `app.js` (via `morgan("dev")`) | ✅ Global |
| JSON body parser | `app.js` (via `express.json()`) | ✅ Global |
| Validación de campos | `validation.middleware.js` | ✅ Solo en `/api/auth/login` |
| Auth JWT | `auth.middleware.js` | ⚠️ Implementado, no aplicado a rutas aún |
| Control de roles | `role.middleware.js` | ⚠️ Implementado, no aplicado a rutas aún |
| Rate limiter | `rate-limit.middleware.js` | ⚠️ Implementado, no aplicado aún |
| Error handler global | `error.middleware.js` | ⚠️ Implementado, no registrado en app.js aún |

### Validaciones

Actualmente solo el endpoint `POST /api/auth/login` tiene validación activa mediante `express-validator`. Todos los demás archivos `*.validation.js` exportan un objeto vacío — la validación de los demás módulos está pendiente de implementar.

### Manejo de errores

- En `auth.controller.js` los errores se pasan a `next(error)` para el handler global.
- En el resto de controladores no hay try/catch — los errores no capturados generan respuestas genéricas de Express 5.
- El `error.middleware.js` está listo pero no registrado en `app.js` (pendiente).

### Servicio de auditoría compartido

`src/services/auditoria.service.js` expone la función `registrar(accion, coleccion, usuarioCorreo, detalle, documentoSlug)`. Es usada internamente por los servicios de plantas, noticias, configuración, usuarios-admin y auth. Los errores de auditoría son silenciados para no afectar la operación principal.

---

## 5. Base de datos

### Motor

**MongoDB** (NoSQL, orientado a documentos) — accedido mediante **Mongoose** como ODM.

### Nombre de la base de datos

Configurada mediante la variable de entorno `MONGO_URI`. El nombre de la base está incluido en la URI de conexión.

### Colecciones existentes

| Colección | Módulo | Descripción |
|---|---|---|
| `plantas` | plantas | Catálogo de plantas medicinales |
| `noticias` | noticias | Artículos y noticias del sitio |
| `multimedias` | multimedia | Metadatos de recursos Cloudinary |
| `suscriptors` | suscriptores | Usuarios suscritos a notificaciones |
| `notificacions` | notificaciones | Historial de notificaciones |
| `fuentes` | fuentes | Fuentes bibliográficas |
| `configuracions` | configuracion | Configuración global (singleton) |
| `auditorias` | auditoria | Registro de acciones del sistema |
| `usuarioadmins` | usuarios-admin | Cuentas de administrador |

> Mongoose pluraliza automáticamente los nombres de los modelos al crear las colecciones.

### Estructura de cada colección

#### `plantas`

| Campo | Tipo | Restricción |
|---|---|---|
| `slug` | String | Requerido, único, lowercase |
| `nombreComun` | String | Requerido |
| `nombreCientifico` | String | Requerido, único |
| `nombresAlternativos` | [String] | — |
| `taxonomia` | Object | Requerido (reino, division, clase, familia, genero) |
| `etnobotanica` | Object | Opcional (clasificacion, parteUtilizada, usoTradicional, compuestosQuimicos) |
| `analisisAcademico` | Object | Opcional (taxonomia, etnobotanica, fitoquimica, sostenibilidad) |
| `multimediaPrincipal` | Object | Opcional (imagenUrl, imagenPublicId, videoUrl, videoPublicId, proveedor) |
| `estado` | Enum | `ACTIVO` \| `INACTIVO` — default `ACTIVO` |
| `fechaRegistro` | Date | default: now |
| `fechaActualizacion` | Date | default: now |

**Índices:** `slug` (único), `nombreCientifico` (único), `nombreComun`, `taxonomia.familia`, `etnobotanica.clasificacion`, `estado`, índice de texto completo sobre nombre y uso.

---

#### `noticias`

| Campo | Tipo | Restricción |
|---|---|---|
| `slug` | String | Requerido, único |
| `titulo` | String | Requerido |
| `resumen` | String | Requerido |
| `contenido` | String | Requerido |
| `categoria` | String | Opcional |
| `autorCorreo` | String | Opcional |
| `portada` | Object | Opcional (secureUrl, publicId) |
| `multimediaIds` | [ObjectId → Multimedia] | Opcional |
| `estado` | Enum | `BORRADOR` \| `PUBLICADO` \| `INACTIVO` — default `BORRADOR` |
| `fechaPublicacion` | Date | Requerido |
| `fechaActualizacion` | Date | default: now |

---

#### `multimedias`

| Campo | Tipo | Restricción |
|---|---|---|
| `titulo` | String | Requerido |
| `descripcion` | String | Opcional |
| `tipo` | Enum | `IMAGEN` \| `VIDEO` \| `DOCUMENTO` — requerido |
| `url` | String | Requerido |
| `publicId` | String | Requerido (ID en Cloudinary) |
| `proveedor` | String | default: `"Cloudinary"` |
| `estado` | Enum | `ACTIVO` \| `INACTIVO` — default `ACTIVO` |
| `fechaRegistro` | Date | default: now |

---

#### `suscriptors`

| Campo | Tipo | Restricción |
|---|---|---|
| `nombre` | String | Opcional |
| `correo` | String | Requerido, único |
| `intereses` | [String] | Opcional |
| `aceptaNotificaciones` | Boolean | default: `true` |
| `estado` | Enum | `ACTIVO` \| `INACTIVO` \| `PENDIENTE` — default `PENDIENTE` |
| `fechaRegistro` | Date | default: now |
| `ultimaNotificacion` | Date | default: null |

---

#### `notificacions`

| Campo | Tipo | Restricción |
|---|---|---|
| `tipo` | Enum | `NUEVA_NOTICIA` \| `NUEVA_PLANTA` \| `NUEVO_MULTIMEDIA` \| `GENERAL` — requerido |
| `titulo` | String | Requerido |
| `mensaje` | String | Requerido |
| `noticiaSlug` | String | default: null |
| `plantaSlug` | String | default: null |
| `canales` | [Enum] | `WEB` \| `EMAIL` |
| `totalDestinatarios` | Number | default: null |
| `estado` | Enum | `PENDIENTE` \| `ENVIADA` \| `FALLIDA` — default `PENDIENTE` |
| `fechaCreacion` | Date | default: now |
| `fechaEnvio` | Date | default: null |

---

#### `fuentes`

| Campo | Tipo | Restricción |
|---|---|---|
| `titulo` | String | Requerido |
| `tipo` | Enum | `Word` \| `PDF` \| `Libro` \| `Artículo` \| `Sitio web` \| `Entrevista` \| `Otro` — requerido |
| `autor` | String | Opcional |
| `anio` | Number | Opcional |
| `descripcion` | String | Opcional |
| `urlDocumento` | String | Opcional |
| `estado` | Enum | `ACTIVO` \| `INACTIVO` — default `ACTIVO` |
| `fechaRegistro` | Date | default: now |

---

#### `configuracions`

| Campo | Tipo | Restricción |
|---|---|---|
| `proyecto` | String | Requerido |
| `descripcion` | String | Opcional |
| `baseDatos` | String | Requerido |
| `almacenamientoMultimedia` | Enum | `Cloudinary` — default `Cloudinary` |
| `cloudinaryFolderBase` | String | Opcional |
| `versionDatos` | String | Opcional |
| `responsableBaseDatos` | String | Opcional |
| `estado` | Enum | `ACTIVO` \| `INACTIVO` — default `ACTIVO` |
| `fechaRegistro` | Date | default: now |

---

#### `auditorias`

| Campo | Tipo | Restricción |
|---|---|---|
| `accion` | Enum | `INSERT` \| `UPDATE` \| `DELETE` \| `LOGIN` \| `UPLOAD` \| `PUBLICAR_NOTICIA` \| `OTRO` — requerido |
| `coleccion` | String | Requerido |
| `documentoSlug` | String | default: null |
| `usuarioCorreo` | String | Requerido |
| `detalle` | String | Opcional |
| `fechaAccion` | Date | default: now |

---

#### `usuarioadmins`

| Campo | Tipo | Restricción |
|---|---|---|
| `correo` | String | Requerido, único |
| `passwordHash` | String | Requerido (almacenado hasheado con bcrypt) |
| `nombreCompleto` | String | Requerido |
| `rol` | Enum | `SUPER_ADMIN` \| `EDITOR` \| `CONSULTOR` — default `CONSULTOR` |
| `estado` | Enum | `ACTIVO` \| `INACTIVO` — default `ACTIVO` |
| `ultimoAcceso` | Date | default: null — se actualiza en cada login |
| `fechaRegistro` | Date | default: now |

### Relaciones entre entidades

```
Noticia ──────────────────► Multimedia   (multimediaIds: [ObjectId])
                             (referencia débil, no hay populate activo)

Auditoria ────────────────► (coleccion + documentoSlug)
                             (referencia por slug/nombre, no por ObjectId)

Planta ───────────────────► (multimediaPrincipal embebido, sin referencia a Multimedia)

Notificacion ─────────────► Noticia / Planta   (por slug, no ObjectId)
```

No existen `populate()` activos en ningún servicio actualmente. Las relaciones son por referencia de slug o ID pero sin resolución automática en las respuestas.

---

## 6. Seguridad implementada

### Resumen de estado

| Medida de seguridad | Estado | Detalles |
|---|---|---|
| Hash de contraseñas | ✅ Activo | bcrypt con salt rounds = 10 |
| JWT | ✅ Activo | Firmado con `JWT_SECRET`, expira según `JWT_EXPIRES_IN` |
| Middleware de autenticación | ✅ Implementado | No aplicado a rutas aún |
| Middleware de roles | ✅ Implementado | No aplicado a rutas aún |
| CORS | ✅ Activo global | Acepta cualquier origen (`cors()` sin restricción) |
| Helmet | ✅ Activo global | Headers de seguridad HTTP por defecto |
| Rate limiting | ✅ Implementado | 100 req / 15 min — no aplicado a rutas aún |
| Validación de entradas | ⚠️ Parcial | Solo activo en `POST /api/auth/login` |
| Error handler global | ⚠️ Implementado | No registrado en `app.js` aún |
| HTTPS | ❌ No configurado | Pendiente para producción |

### Hash de contraseñas

Al crear un usuario administrador, `usuario-admin.service.js` aplica:

```js
const passwordHash = await bcrypt.hash(data.passwordHash, 10);
```

La contraseña nunca se almacena en texto plano. Se usa `bcrypt.compare()` durante el login para verificar.

### Autenticación JWT

El token JWT contiene el siguiente payload:

```json
{
  "id": "64f1a2b3c4d5e6f7a8b9c0d1",
  "correo": "admin@agrovivero.com",
  "rol": "SUPER_ADMIN",
  "iat": 1718870000,
  "exp": 1718956400
}
```

Configuración del token:
- **Secreto:** `process.env.JWT_SECRET`
- **Expiración:** `process.env.JWT_EXPIRES_IN`
- **Algoritmo:** HS256 (default de jsonwebtoken)

### Verificación de token (auth.middleware.js)

```
1. Leer header: Authorization: Bearer <token>
2. Extraer token (split(" ")[1])
3. jwt.verify(token, JWT_SECRET)
4. Si válido: adjuntar payload a req.usuario y llamar next()
5. Si inválido o ausente: responder 401
```

### Control de roles (role.middleware.js)

```
roleMiddleware("SUPER_ADMIN", "EDITOR")
→ Verifica que req.usuario.rol esté en la lista
→ Si no: responder 403
→ Si sí: next()
```

### Helmet

Activa automáticamente los siguientes headers HTTP:
- `X-DNS-Prefetch-Control`
- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `Strict-Transport-Security`
- `X-XSS-Protection`
- Entre otros.

### Rate Limiting

Configuración actual del middleware (pendiente de aplicar):
- **Ventana:** 15 minutos
- **Máximo:** 100 peticiones por IP
- **Respuesta al exceder:** `{ "message": "Demasiadas solicitudes. Intente más tarde." }`

### Pendientes de seguridad para producción

- Aplicar `authMiddleware` en rutas del panel admin.
- Aplicar `roleMiddleware` diferenciado por módulo.
- Aplicar `apiLimiter` como middleware global o en rutas críticas.
- Registrar `errorHandler` en `app.js`.
- Restringir CORS a los dominios permitidos.
- Configurar HTTPS en el servidor de producción.
- Completar validaciones con `express-validator` en todos los módulos.

---

## 7. API — resumen de endpoints

Base URL: `http://[host]/api`

| Método | Ruta | Descripción | Auth requerida |
|---|---|---|---|
| `GET` | `/health` | Estado del servidor | No |
| `POST` | `/auth/login` | Login de administrador | No |
| `GET` | `/plantas` | Listar plantas activas (filtro: `?familia=`) | No |
| `GET` | `/plantas/:slug` | Detalle de planta por slug | No |
| `POST` | `/plantas` | Crear planta | No* |
| `PUT` | `/plantas/:id` | Actualizar planta | No* |
| `DELETE` | `/plantas/:id` | Desactivar planta (soft delete) | No* |
| `GET` | `/noticias` | Listar noticias | No |
| `GET` | `/noticias/:id` | Detalle de noticia | No |
| `POST` | `/noticias` | Crear noticia | No* |
| `PUT` | `/noticias/:id` | Actualizar noticia | No* |
| `DELETE` | `/noticias/:id` | Desactivar noticia (soft delete) | No* |
| `GET` | `/multimedia` | Listar recursos multimedia | No |
| `GET` | `/multimedia/:id` | Detalle de recurso | No |
| `POST` | `/multimedia` | Registrar recurso multimedia | No* |
| `PUT` | `/multimedia/:id` | Actualizar recurso | No* |
| `DELETE` | `/multimedia/:id` | Desactivar recurso (soft delete) | No* |
| `GET` | `/suscriptores` | Listar suscriptores | No* |
| `POST` | `/suscriptores` | Registrar suscriptor | No |
| `GET` | `/notificaciones` | Listar notificaciones | No* |
| `POST` | `/notificaciones` | Crear notificación | No* |
| `GET` | `/fuentes` | Listar fuentes bibliográficas | No |
| `POST` | `/fuentes` | Crear fuente | No* |
| `GET` | `/configuracion` | Obtener configuración global | No |
| `PUT` | `/configuracion` | Actualizar configuración global | No* |
| `GET` | `/auditoria` | Listar registros de auditoría | No* |
| `POST` | `/auditoria` | Crear registro de auditoría | No* |
| `GET` | `/usuarios-admin` | Listar admins | No* |
| `GET` | `/usuarios-admin/:id` | Detalle de admin | No* |
| `POST` | `/usuarios-admin` | Crear admin | No* |
| `PUT` | `/usuarios-admin/:id` | Actualizar admin | No* |
| `DELETE` | `/usuarios-admin/:id` | Desactivar admin (soft delete) | No* |

> **No\*** = Sin autenticación actualmente, pero debe protegerse antes de producción.

---

## 8. Estado actual del proyecto

### Funcionalidades terminadas ✅

- Estructura completa del proyecto con organización modular.
- Conexión a MongoDB con reconexión automática y manejo de errores.
- Módulo de autenticación: login con JWT y bcrypt.
- CRUD completo para: Plantas, Noticias, Multimedia, Usuarios Admin.
- Endpoints de creación para: Suscriptores, Notificaciones, Fuentes.
- Configuración global del sistema (singleton con upsert).
- Auditoría automática en: plantas, noticias, configuración, usuarios, login.
- Servicio de auditoría compartido (`src/services/auditoria.service.js`).
- Middleware de autenticación JWT (`auth.middleware.js`).
- Middleware de control de roles (`role.middleware.js`).
- Middleware de validación con express-validator (`validation.middleware.js`).
- Handler global de errores (`error.middleware.js`).
- Rate limiter configurado (`rate-limit.middleware.js`).
- Seguridad global con Helmet y CORS.
- Filtrado por `estado: "ACTIVO"` en el listado de plantas.
- Filtrado por `taxonomia.familia` en el listado de plantas.
- Soft delete en todas las entidades (nunca se eliminan registros).
- Hash automático de contraseñas al crear administradores.
- Health check endpoint.
- Variables de entorno documentadas en `.env.example`.

### Funcionalidades en desarrollo / parcialmente implementadas ⚠️

- **Validaciones de entrada:** Solo activas en `POST /api/auth/login`. Los demás módulos tienen el archivo `*.validation.js` vacío.
- **Aplicación de middlewares de auth y roles:** Los middlewares existen pero no están aplicados a ninguna ruta además de login.
- **Rate limiter:** Implementado pero no aplicado como middleware en ninguna ruta.
- **Error handler global:** Implementado pero no registrado en `app.js`.
- **Cloudinary:** SDK instalado, archivo de config vacío. No hay integración activa para subida de archivos.
- **Multer:** Instalado en `package.json` pero no integrado en ninguna ruta.

### Pendientes próximos 📋

- Registrar `errorHandler` en `app.js` como último middleware.
- Aplicar `authMiddleware` en rutas del panel administrativo.
- Aplicar `roleMiddleware` por ruta según permisos de cada rol.
- Aplicar `apiLimiter` en rutas públicas o de forma global.
- Implementar validaciones completas en todos los módulos.
- Completar `src/config/cloudinary.js` con la configuración del SDK.
- Integrar Multer + Cloudinary para subida de archivos en `/api/multimedia`.
- Filtros y paginación en los listados (actualmente sin límite de resultados).
- Endpoint de búsqueda por texto en plantas (los índices de texto ya están creados).
- Endpoints adicionales para suscriptores: actualizar estado, cancelar por correo.
- Desarrollo del Frontend.

### Posibles mejoras futuras 🔭

- Paginación y ordenamiento en todos los endpoints de listado.
- Endpoint de búsqueda global (`GET /api/plantas?q=texto`).
- Refresh tokens para extender sesión sin re-login.
- Envío real de emails a suscriptores al crear notificaciones.
- Panel de métricas y estadísticas.
- Soft delete con posibilidad de restaurar registros.
- Tests automatizados (unitarios e integración).
- Dockerización del proyecto.
- CI/CD para despliegue automático.

---

## 9. Instalación y ejecución

### Requisitos previos

- **Node.js** v18 o superior
- **npm** v8 o superior
- Cuenta en **MongoDB Atlas** o instancia local de MongoDB
- Cuenta en **Cloudinary** (para multimedia)

### Instalación de dependencias

```bash
cd agro-vivero-backend
npm install
```

### Configuración del archivo .env

Crear el archivo `.env` en la raíz del proyecto basándose en `.env.example`:

```env
# Puerto del servidor
PORT=3000

# URI de conexión a MongoDB
# Formato Atlas: mongodb+srv://usuario:password@cluster.mongodb.net/nombre-bd
# Formato local: mongodb://localhost:27017/nombre-bd
MONGO_URI=mongodb+srv://usuario:password@cluster.mongodb.net/agro-vivero-db

# Cloudinary (obtener desde el dashboard de Cloudinary)
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret

# JWT
JWT_SECRET=una_clave_secreta_larga_y_aleatoria
JWT_EXPIRES_IN=24h
```

> **Importante:** El archivo `.env` no debe subirse al repositorio. Está incluido en `.gitignore`.

> **JWT_SECRET:** Usar una cadena aleatoria larga (mínimo 32 caracteres). Puede generarse con: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Ejecución del servidor

**Modo desarrollo** (con nodemon, reinicio automático):
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

### Verificar que el servidor está activo

```bash
curl http://localhost:3000/api/health
# Respuesta esperada: {"status":"OK","message":"Backend funcionando"}
```

### Conexión con MongoDB

La conexión se establece automáticamente en `server.js` al arrancar:

```js
connectDB(); // mongoose.connect(process.env.MONGO_URI)
```

Si la conexión falla, el proceso termina con `process.exit(1)`. Verificar que:
- La variable `MONGO_URI` esté correctamente configurada en `.env`.
- El IP del servidor esté en la whitelist de MongoDB Atlas.
- Las credenciales de la URI sean correctas.

---

## 10. Convenciones del proyecto

### Nombres de archivos

| Tipo | Convención | Ejemplo |
|---|---|---|
| Módulos | `nombre-modulo/nombre.tipo.js` | `plantas/planta.service.js` |
| Rutas con guión | kebab-case | `usuarios-admin/` |
| Config | camelCase | `database.js`, `cloudinary.js` |
| Middlewares | camelCase con sufijo | `auth.middleware.js` |

### Organización del código

- Una **responsabilidad por archivo**: rutas solo definen rutas, controladores solo manejan HTTP, servicios solo tienen lógica de negocio.
- Imports al inicio del archivo, con `require()` (CommonJS — el proyecto usa `"type": "commonjs"`).
- Exports al final del archivo con `module.exports = { ... }`.
- Las funciones de controlador y servicio son siempre `async`.

### Buenas prácticas aplicadas

- **Soft delete universal:** Ningún registro se elimina físicamente. Todos tienen campo `estado`.
- **Auditoría automática:** Toda operación de escritura relevante genera un registro de auditoría.
- **Variables de entorno:** Toda configuración sensible va en `.env`, nunca hardcodeada.
- **Separación de concerns:** La lógica de negocio no vive en los controladores.
- **Contraseñas seguras:** bcrypt con 10 salt rounds, nunca en texto plano.
- **Respuestas consistentes:** Los errores siempre incluyen `success: false` y `message`.
- **Fechas:** Se usan fechas ISO en todos los modelos (`Date`, default `Date.now`).
- **Mongoose `runValidators: true`:** Aplicado en `findByIdAndUpdate` de plantas para respetar restricciones del esquema.

### Convención de respuestas HTTP

| Situación | Código |
|---|---|
| Lectura exitosa | `200 OK` |
| Creación exitosa | `201 Created` |
| No encontrado | `404 Not Found` |
| Error de validación | `400 Bad Request` |
| Sin autenticación | `401 Unauthorized` |
| Sin permisos | `403 Forbidden` |
| Demasiadas peticiones | `429 Too Many Requests` |
| Error interno | `500 Internal Server Error` |

---

*Documentación generada: junio 2026 — Estado del proyecto: versión 1.0.0*
