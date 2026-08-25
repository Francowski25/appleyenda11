// features/auth/login/login.ts
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  nickName = signal('');
  password = signal('');
  rememberMe = signal(false);

  isCovering = signal(false);

  nickNameTocado = signal(false);
  passwordTocado = signal(false);

  isLoading = signal(false);

  serverLoginError = signal<string | null>(null);

  nickNameError = computed(() => {
    return this.nickNameTocado() && !this.nickName().trim() ? 'Ingresa tu usuario.' : '';
  });

  passwordError = computed(() => {
    if (this.serverLoginError()) {
      return this.serverLoginError();
    }
    return this.passwordTocado() && !this.password() ? 'Ingresa tu contraseña.' : '';
  });

  formValido = computed(() =>
    this.nickName().trim().length > 0 && this.password().length > 0
  );

  onPasswordFocus(): void {
    this.isCovering.set(true);
  }

  onPasswordBlur(): void {
    this.isCovering.set(false);
    this.passwordTocado.set(true);
  }

  marcarNickNameTocado(): void {
    this.nickNameTocado.set(true);
  }

  onNickNameChange(value: string): void {
    this.nickName.set(value);
    this.serverLoginError.set(null);
  }

  onPasswordChange(value: string): void {
    this.password.set(value);
    this.serverLoginError.set(null);
  }

  async onSubmit(): Promise<void> {
    this.nickNameTocado.set(true);
    this.passwordTocado.set(true);
    this.serverLoginError.set(null);

    if (!this.formValido()) {
      return;
    }

    this.isLoading.set(true);

    try {
      const result = await this.authService.login(this.nickName(), this.password());

      this.isLoading.set(false);

      if (result.ok) {
        await this.router.navigate(['/leyenda11']);
      } else {
        this.serverLoginError.set(result.message || 'Credenciales incorrectas.');
        this.passwordTocado.set(true);
      }
    } catch (error) {
      this.isLoading.set(false);
      this.serverLoginError.set('Ocurrió un error inesperado.');
      console.error('Error en login:', error);
    }
  }
}