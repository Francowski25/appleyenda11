import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../core/services/game.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { Game } from '../../core/models/game.model';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private readonly router = inject(Router);
  private readonly gameService = inject(GameService);
  private readonly notification = inject(NotificationService);
  readonly usuarioState = inject(AuthService);

  readonly games = this.gameService.games;
  readonly loading = this.gameService.loading;
  readonly loadingCompletados = this.gameService.loadingCompletados;

  readonly imageErrors = signal<Record<string, boolean>>({});

  private readonly nivelUsuario = computed(() => this.usuarioState.userLevel()?.level ?? 0);

  ngOnInit(): void {
    this.gameService.loadGames();
  }

  jugar(slug: string): void {
    if (!this.usuarioState.isLoggedIn()) {
      this.notification.show('Necesitas iniciar sesión para jugar', 'error');
      return;
    }

    const juego = this.games().find(g => g.slug === slug);
    if (!juego) return;

    if (this.isLocked(juego)) {
      this.notification.show(`Necesitas nivel ${juego.minimumLevel} para jugar`, 'warning');
      return;
    }

    if (this.estaCompletado(slug)) {
      this.notification.show('Ya completaste este juego hoy, vuelve mañana', 'warning');
      return;
    }

    this.router.navigate(['/leyenda11', slug]);
  }

  onImageError(gameId: string): void {
    this.imageErrors.update(errors => ({
      ...errors,
      [gameId]: true
    }));
  }

  isImageLoaded(gameId: string): boolean {
    return !this.imageErrors()[gameId];
  }

  isLocked(game: Game): boolean {
    if (!this.usuarioState.isLoggedIn()) {
      return false;
    }
    return this.nivelUsuario() < game.minimumLevel;
  }

  estaCompletado(slug: string): boolean {
    return this.gameService.estaCompletado(slug);
  }

  estaBloqueadoOCompletado(game: Game): boolean {
    if (this.usuarioState.isLoggedIn() && this.loadingCompletados()) {
      return true;
    }
    return this.isLocked(game) || this.estaCompletado(game.slug);
  }
}