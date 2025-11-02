import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { RegisterPacienteRequest } from '../../../models';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';

  tiposDocumento = ['DNI', 'Pasaporte', 'CI', 'Otro'];
  generos = [
    { label: 'Masculino', value: 'masculino' },
    { label: 'Femenino', value: 'femenino' },
    { label: 'Otro', value: 'otro' },
    { label: 'No especifica', value: 'no_especifica' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      nombre_usuario: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      tipo_documento: ['DNI', Validators.required],
      nro_documento: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      genero: ['', Validators.required],
      telefono: ['']
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): { [key: string]: boolean } | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls).forEach(key => {
        this.registerForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.loading = true;
    this.error = '';

    const formValue = this.registerForm.value;
    const data: RegisterPacienteRequest = {
      nombre_usuario: formValue.nombre_usuario,
      email: formValue.email,
      password: formValue.password,
      nombre: formValue.nombre,
      apellido: formValue.apellido,
      tipo_documento: formValue.tipo_documento,
      nro_documento: formValue.nro_documento,
      fecha_nacimiento: formValue.fecha_nacimiento,
      genero: formValue.genero,
      telefono: formValue.telefono || undefined
    };

    this.authService.registerPaciente(data).subscribe({
      next: (response) => {
        this.loading = false;
        // Auto-login exitoso, redirigir al dashboard del paciente
        this.router.navigate(['/paciente/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.error || 'Error al registrarse';
      }
    });
  }

  get passwordMismatch(): boolean {
    return this.registerForm.hasError('passwordMismatch') &&
           this.registerForm.get('confirmPassword')?.touched || false;
  }
}
