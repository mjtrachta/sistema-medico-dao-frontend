# Sistema Médico DAO - Frontend

Aplicación web desarrollada con Angular 17 para gestión de turnos médicos, historias clínicas y recetas.

## Tecnologías

- **Angular 17** - Framework web con standalone components
- **TypeScript** - Lenguaje tipado
- **RxJS** - Programación reactiva
- **Angular Router** - Navegación y guards
- **HttpClient** - Comunicación con API REST
- **JWT** - Autenticación basada en tokens

## Características Principales

### Sistema de Autenticación
- Login y registro de usuarios
- JWT con refresh automático
- Guards de autenticación y roles
- Redirección inteligente según rol

### Gestión de Usuarios
- **Admin**: Acceso completo al sistema
- **Médico**: Gestión de turnos, horarios, historias clínicas y recetas
- **Paciente**: Consulta de turnos, historias clínicas y recetas propias
- **Recepcionista**: Gestión de pacientes y turnos

### Módulos Implementados

#### Turnos
- Listado con filtros (médico, paciente, fecha, estado)
- Creación de nuevos turnos
- Atención de turnos (solo médicos)
- Estados: pendiente, confirmado, completado, cancelado

#### Pacientes
- Listado general (admin y recepcionista)
- Mis Pacientes (médicos - pacientes atendidos)
- Detalle de paciente con historial completo
- Registro de nuevos pacientes

#### Médicos (Admin)
- Gestión de médicos
- Asignación de especialidades
- Soft delete preservando datos de pacientes

#### Especialidades (Admin)
- CRUD completo de especialidades médicas

#### Ubicaciones/Sedes (Admin)
- Gestión de sedes donde se atiende
- Integración con sistema de horarios

#### Horarios
- Médicos: Gestión de horarios propios
- Admin: Gestión de horarios de todos los médicos
- Validación automática de superposición
- Filtros por médico y ubicación

#### Historias Clínicas
- Creación desde turnos completados (solo médicos)
- Visualización según permisos:
  - Admin: Todas
  - Médicos: Historias propias
  - Pacientes: Historias propias
- Datos permanentes e inalterables

#### Recetas Médicas
- Emisión por médicos (requiere matrícula)
- Gestión de medicamentos y posología
- Visualización según permisos
- Validación de fechas de vencimiento

#### Reportes (Admin)
- Dashboard con estadísticas generales
- Reportes por médico
- Reportes por paciente
- Filtros por período

## Requisitos Previos

- **Node.js 18+**
- **npm 9+**
- **Angular CLI 17**

## Instalación

1. **Clonar el repositorio:**
```bash
git clone <repository-url>
cd frontend
```

2. **Instalar dependencias:**
```bash
npm install
```

3. **Configurar variables de entorno:**

Crear archivo `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000/api'
};
```

Crear archivo `src/environments/environment.prod.ts`:
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://tu-api-produccion.com/api'
};
```

## Ejecutar en Desarrollo

```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

## Compilar para Producción

```bash
ng build --configuration production
```

Los archivos compilados estarán en `dist/frontend/`

## Estructura del Proyecto

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/          # Componentes de la aplicación
│   │   │   ├── auth/            # Login y registro
│   │   │   ├── shared/          # Navbar y componentes compartidos
│   │   │   ├── turnos/          # Gestión de turnos
│   │   │   ├── pacientes/       # Gestión de pacientes
│   │   │   ├── medicos/         # Gestión de médicos
│   │   │   ├── especialidades/  # Gestión de especialidades
│   │   │   ├── ubicaciones/     # Gestión de ubicaciones/sedes
│   │   │   ├── horarios/        # Gestión de horarios médicos
│   │   │   ├── historias-clinicas/  # Historias clínicas
│   │   │   ├── recetas/         # Recetas médicas
│   │   │   └── reportes/        # Dashboard y reportes
│   │   ├── guards/              # Guards de autenticación y roles
│   │   ├── interceptors/        # Interceptores HTTP (JWT)
│   │   ├── models/              # Interfaces TypeScript
│   │   ├── services/            # Servicios para comunicación con API
│   │   ├── app.component.ts     # Componente raíz
│   │   └── app.routes.ts        # Configuración de rutas
│   ├── environments/            # Configuración de entornos
│   └── styles.css               # Estilos globales
├── angular.json                 # Configuración de Angular
├── tsconfig.json                # Configuración de TypeScript
└── package.json                 # Dependencias del proyecto
```

## Arquitectura

### Guards

#### AuthGuard
Protege rutas que requieren autenticación. Si el usuario no está autenticado, redirige a `/login`.

```typescript
canActivate: [authGuard]
```

#### RoleGuard
Protege rutas según roles específicos. Verifica que el usuario tenga uno de los roles permitidos.

```typescript
canActivate: [roleGuard],
data: { roles: ['admin', 'medico'] }
```

#### LoginGuard
Redirige a `/turnos` si el usuario ya está autenticado (para páginas de login/registro).

### Interceptores

#### AuthInterceptor
- Agrega automáticamente el token JWT a todas las peticiones HTTP
- Maneja errores 401 (no autorizado)
- Redirige a login si el token expiró

### Servicios

Cada entidad tiene su servicio con operaciones CRUD:
- `AuthService` - Autenticación y gestión de sesión
- `TurnoService` - Operaciones con turnos
- `PacienteService` - Gestión de pacientes
- `MedicoService` - Gestión de médicos
- `EspecialidadService` - Gestión de especialidades
- `UbicacionService` - Gestión de ubicaciones
- `HorarioService` - Gestión de horarios
- `HistoriaClinicaService` - Historias clínicas
- `RecetaService` - Recetas médicas
- `ReporteService` - Reportes y estadísticas

### Modelos

Interfaces TypeScript que definen la estructura de datos:
```typescript
export interface Usuario {
  id?: number;
  nombre_usuario: string;
  email: string;
  rol: 'admin' | 'medico' | 'paciente' | 'recepcionista';
  activo?: boolean;
}
```

## Rutas de la Aplicación

### Públicas
- `/login` - Inicio de sesión
- `/register` - Registro de nuevos usuarios

### Protegidas (Requieren autenticación)
- `/turnos` - Listado de turnos (todos los roles)
- `/turnos/nuevo` - Crear turno (todos los roles)
- `/turnos/:id/atender` - Atender turno (médicos y admin)

### Por Rol

**Admin:**
- `/medicos` - Gestión de médicos
- `/especialidades` - Gestión de especialidades
- `/ubicaciones` - Gestión de ubicaciones/sedes
- `/reportes` - Dashboard y reportes

**Admin + Recepcionista:**
- `/pacientes` - Listado de pacientes

**Médicos + Admin:**
- `/pacientes/mis-pacientes` - Pacientes atendidos
- `/pacientes/:id/detalle` - Detalle de paciente
- `/horarios` - Gestión de horarios

**Médicos + Pacientes + Admin:**
- `/historias-clinicas` - Historias clínicas
- `/recetas` - Recetas médicas

**Solo Médicos:**
- `/historias-clinicas/nueva` - Crear historia clínica (acto médico)
- `/recetas/nueva` - Crear receta (requiere matrícula)

## Validaciones de Negocio

### Frontend
- ✅ Validación de campos requeridos en formularios
- ✅ Validación de formatos (email, teléfono, fechas)
- ✅ Control de acceso por roles (guards)
- ✅ Prevención de acceso a rutas no autorizadas
- ✅ Manejo de errores con mensajes amigables

### Sincronización con Backend
El frontend confía en las validaciones del backend para:
- Validación de superposición de horarios
- Validación de matrícula profesional
- Validación de datos duplicados
- Reglas de negocio complejas

## Estilos y UI/UX

- Diseño responsive (mobile-first)
- Paleta de colores consistente
- Navegación intuitiva con navbar contextual
- Modals para formularios
- Tablas con filtros y búsqueda
- Estados de carga y mensajes de error
- Badges para estados visuales
- Botones con estados disabled

## Testing

```bash
# Tests unitarios
ng test

# Tests E2E
ng e2e
```

## Usuarios de Prueba

Después de inicializar el backend con `crear_usuarios_medicos.py`:

```
Admin:
- Usuario: admin
- Password: admin123

Médico:
- Usuario: dr.garcia
- Password: medico123

Paciente:
- Usuario: paciente1
- Password: paciente123

Recepcionista:
- Usuario: recep1
- Password: recep123
```

## Flujo de Trabajo Típico

### Médico
1. Login → Dashboard (redirige a /turnos)
2. Ver turnos del día
3. Atender turno → Crear historia clínica
4. Emitir receta si es necesario
5. Gestionar horarios propios
6. Ver mis pacientes atendidos

### Paciente
1. Login → Dashboard (redirige a /turnos)
2. Solicitar nuevo turno
3. Ver mis turnos
4. Consultar mis historias clínicas
5. Ver mis recetas

### Admin
1. Login → Dashboard (redirige a /turnos)
2. Gestionar médicos, especialidades, ubicaciones
3. Ver todos los turnos
4. Gestionar horarios de médicos
5. Acceso a reportes y estadísticas

## Seguridad

- **JWT Token**: Almacenado en localStorage
- **Auto-refresh**: El interceptor renueva tokens automáticamente
- **Guards**: Protección de rutas por autenticación y rol
- **Sanitización**: Angular sanitiza automáticamente el HTML
- **CORS**: Configurado en el backend para permitir origen del frontend

## Dependencias Principales

```json
{
  "@angular/core": "^17.0.0",
  "@angular/common": "^17.0.0",
  "@angular/router": "^17.0.0",
  "@angular/forms": "^17.0.0",
  "rxjs": "^7.8.0",
  "tslib": "^2.6.0"
}
```

## Configuración de Producción

1. Actualizar `environment.prod.ts` con URL de API de producción
2. Compilar: `ng build --configuration production`
3. Desplegar carpeta `dist/frontend/` en servidor web (nginx, Apache, etc.)
4. Configurar rewrite rules para Angular routing:

**Nginx:**
```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

**Apache (.htaccess):**
```apache
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

## Licencia

Proyecto académico - DAO

## Autor

Sistema desarrollado para gestión médica integral

## Soporte

Para reportar problemas o sugerencias, crear un issue en el repositorio.
