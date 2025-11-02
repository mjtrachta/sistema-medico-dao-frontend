import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    const { username, password } = this.loginForm.value;

    this.authService.login(username, password).subscribe({
      next: (response) => {
        this.loading = false;
        // Redirigir según el rol del usuario
        const user = response.usuario;
        if (user.rol === 'admin') {
          this.router.navigate(['/admin']);
        } else if (user.rol === 'medico') {
          this.router.navigate(['/medico/dashboard']);
        } else if (user.rol === 'paciente') {
          this.router.navigate(['/paciente/dashboard']);
        } else if (user.rol === 'recepcionista') {
          this.router.navigate(['/recepcionista/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.error || 'Error al iniciar sesión';
      }
    });
  }
}
