import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Primero verificar si está autenticado
  if (!authService.isAuthenticated()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  // Obtener los roles permitidos desde la configuración de la ruta
  const allowedRoles = route.data['roles'] as string[];

  if (!allowedRoles || allowedRoles.length === 0) {
    // Si no se especificaron roles, permitir acceso
    return true;
  }

  // Verificar si el usuario tiene alguno de los roles permitidos
  if (authService.hasRole(...allowedRoles)) {
    return true;
  }

  // Usuario no tiene el rol necesario, redirigir a página de acceso denegado o home
  router.navigate(['/']);
  return false;
};
