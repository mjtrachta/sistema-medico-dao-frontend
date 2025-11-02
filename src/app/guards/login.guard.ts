import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const loginGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si el usuario ya está autenticado, redirigir a la página principal
  if (authService.isAuthenticated()) {
    router.navigate(['/turnos']);
    return false;
  }

  // Si no está autenticado, permitir acceso a login/register
  return true;
};
