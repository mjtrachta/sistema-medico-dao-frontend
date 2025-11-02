import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { PacienteListComponent } from './components/pacientes/paciente-list/paciente-list.component';
import { MisPacientesComponent } from './components/pacientes/mis-pacientes/mis-pacientes.component';
import { PacienteDetalleComponent } from './components/pacientes/paciente-detalle/paciente-detalle.component';
import { MedicoListComponent } from './components/medicos/medico-list/medico-list.component';
import { EspecialidadListComponent } from './components/especialidades/especialidad-list/especialidad-list.component';
import { UbicacionListComponent } from './components/ubicaciones/ubicacion-list/ubicacion-list.component';
import { HorarioListComponent } from './components/horarios/horario-list/horario-list.component';
import { TurnoListComponent } from './components/turnos/turno-list/turno-list.component';
import { TurnoFormComponent } from './components/turnos/turno-form/turno-form.component';
import { TurnoAtencionComponent } from './components/turnos/turno-atencion/turno-atencion.component';
import { HistoriaListComponent } from './components/historias-clinicas/historia-list/historia-list.component';
import { HistoriaFormComponent } from './components/historias-clinicas/historia-form/historia-form.component';
import { RecetaListComponent } from './components/recetas/receta-list/receta-list.component';
import { RecetaFormComponent } from './components/recetas/receta-form/receta-form.component';
import { ReporteDashboardComponent } from './components/reportes/reporte-dashboard/reporte-dashboard.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { loginGuard } from './guards/login.guard';
export const routes: Routes = [
  // Rutas públicas (redirigen a /turnos si ya estás autenticado)
  { path: 'login', component: LoginComponent, canActivate: [loginGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [loginGuard] },

  // Rutas protegidas - requieren autenticación
  {
    path: '',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: '/turnos', pathMatch: 'full' },

      // Dashboards por rol
      {
        path: 'admin',
        redirectTo: '/turnos',
        pathMatch: 'full'
      },
      {
        path: 'paciente/dashboard',
        redirectTo: '/turnos',
        pathMatch: 'full'
      },
      {
        path: 'medico/dashboard',
        redirectTo: '/turnos',
        pathMatch: 'full'
      },
      {
        path: 'recepcionista/dashboard',
        redirectTo: '/turnos',
        pathMatch: 'full'
      },

      // Rutas accesibles por todos los usuarios autenticados
      { path: 'turnos', component: TurnoListComponent },
      { path: 'turnos/nuevo', component: TurnoFormComponent },
      {
        path: 'turnos/:id/atender',
        component: TurnoAtencionComponent,
        canActivate: [roleGuard],
        data: { roles: ['medico', 'admin'] }
      },

      // Rutas para admin y recepcionista
      {
        path: 'pacientes',
        component: PacienteListComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'recepcionista'] }
      },
      // Rutas para médicos - vista de pacientes atendidos
      {
        path: 'pacientes/mis-pacientes',
        component: MisPacientesComponent,
        canActivate: [roleGuard],
        data: { roles: ['medico', 'admin'] }
      },
      {
        path: 'pacientes/:id/detalle',
        component: PacienteDetalleComponent,
        canActivate: [roleGuard],
        data: { roles: ['medico', 'admin'] }
      },

      // Rutas para admin
      {
        path: 'medicos',
        component: MedicoListComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'especialidades',
        component: EspecialidadListComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
      },
      {
        path: 'ubicaciones',
        component: UbicacionListComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
      },

      // Rutas para médicos y admin - Gestión de horarios
      {
        path: 'horarios',
        component: HorarioListComponent,
        canActivate: [roleGuard],
        data: { roles: ['medico', 'admin'] }
      },

      // Rutas para médicos, pacientes y admin
      {
        path: 'historias-clinicas',
        component: HistoriaListComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'medico', 'paciente'] }
      },
      {
        path: 'historias-clinicas/nueva',
        component: HistoriaFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['medico'] } // Solo médicos - acto médico que requiere matrícula
      },
      {
        path: 'recetas',
        component: RecetaListComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin', 'medico', 'paciente'] }
      },
      {
        path: 'recetas/nueva',
        component: RecetaFormComponent,
        canActivate: [roleGuard],
        data: { roles: ['medico'] } // Solo médicos - recetar requiere matrícula profesional
      },

      // Rutas para reportes (admin)
      {
        path: 'reportes',
        component: ReporteDashboardComponent,
        canActivate: [roleGuard],
        data: { roles: ['admin'] }
      }
    ]
  },

  // Ruta 404
  { path: '**', redirectTo: '/login' }
];
