// features/auth/registro/registro.ts
import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  name = '';
  nickName = '';
  email = '';
  password = '';

  isCovering = signal(false);

  onPasswordFocus(): void {
    this.isCovering.set(true);
  }

  onPasswordBlur(): void {
    this.isCovering.set(false);
  }

  onSubmit(): void {
    // Diseño estático por ahora
    console.log('Datos de registro:', {
      name: this.name,
      nickName: this.nickName,
      email: this.email,
      password: this.password,
    });
  }
}