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

  readonly rangoActual = computed(() => {
    const info = this.usuarioState.userLevel();
    if (!info) return { min: 0, max: 100 };
    return { min: info.levelMin ?? 0, max: info.levelMax ?? 100 };
  });

  readonly progresoNivel = computed(() => {
    const info = this.usuarioState.userLevel();
    if (!info) return 0;

    const { min, max } = this.rangoActual();
    const rangoTotal = max - min;
    if (rangoTotal <= 0) return 0;

    const progreso = ((info.totalPoints - min) / rangoTotal) * 100;
    return Math.min(Math.max(progreso, 0), 100);
  });

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

  formatearPuntos(puntos: number | undefined): string {
    if (!puntos) return '0 pts';
    return puntos >= 1000 ? `${(puntos / 1000).toFixed(1)}K pts` : `${puntos} pts`;
  }

  getPuntosSiguienteNivel(): number {
    const info = this.usuarioState.userLevel();
    if (!info) return 100;
    return this.rangoActual().max || (info.level + 1) * 100;
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