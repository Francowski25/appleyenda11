import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { BotMascot } from '../../shared/bot-mascot/bot-mascot';

@Component({
  selector: 'app-fan-wall',
  imports: [CommonModule, BotMascot],
  templateUrl: './fan-wall.html',
  styleUrl: './fan-wall.css',
})
export class FanWall {
  private router = inject(Router);
  usuarioState = inject(AuthService);

  coloresNivel = [
    'text-slate-400', 'text-blue-400', 'text-cyan-400', 'text-teal-400',
    'text-emerald-400', 'text-green-400', 'text-yellow-400',
    'text-orange-400', 'text-red-400', 'text-purple-400'
  ];

  readonly progresoNivel = computed(() => this.usuarioState.userLevel()?.progresoPorcentaje ?? 0);
  readonly puntosFaltantes = computed(() => this.usuarioState.userLevel()?.puntosFaltantes ?? 0);

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  irARegistro(): void {
    this.router.navigate(['/registro']);
  }

  irAPerfil(): void {
    this.router.navigate([this.usuarioState.isLoggedIn() ? '/perfil' : '/login']);
  }

  cerrarSesion(): void {
    this.usuarioState.logout('sesion_cerrada');

    const rutaActual = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([rutaActual]);
    });
  }


  getIconoNivel(): string {
    return this.usuarioState.userLevel()?.levelIcon || '🏆';
  }

  getColorNivel(): string {
    const pos = this.usuarioState.userLevel()?.levelPosition || 0;
    return this.coloresNivel[(pos - 1) % this.coloresNivel.length] || 'text-emerald-400';
  }

  getBadgeLevel(): string {
    const pos = this.usuarioState.userLevel()?.levelPosition || 0;
    if (pos >= 8) return '🔥';
    if (pos >= 5) return '⭐';
    if (pos >= 3) return '🌟';
    return '⚡';
  }
}