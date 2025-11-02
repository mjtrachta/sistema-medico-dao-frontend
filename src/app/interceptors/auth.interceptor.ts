import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Obtener el token de acceso
  const token = authService.getToken();

  // Clonar la petición y agregar el header de autorización si hay token
  let authReq = req;
  if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/register')) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Enviar la petición y manejar errores
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Token expirado o inválido
        const refreshToken = authService.getRefreshToken();

        if (refreshToken && !req.url.includes('/auth/refresh')) {
          // Intentar refrescar el token
          return authService.refreshToken().pipe(
            switchMap(() => {
              // Token refrescado exitosamente, reintentar la petición original
              const newToken = authService.getToken();
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                }
              });
              return next(retryReq);
            }),
            catchError((refreshError) => {
              // No se pudo refrescar el token, cerrar sesión
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          // No hay refresh token o la petición de refresh falló, cerrar sesión
          authService.logout();
        }
      }

      return throwError(() => error);
    })
  );
};
