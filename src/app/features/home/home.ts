import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { GameService } from '../../core/services/game.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private router = inject(Router);
  private gameService = inject(GameService);
  private notification = inject(NotificationService);
  usuarioState = inject(AuthService);

  readonly games = this.gameService.games;
  readonly loading = this.gameService.loading;

  ngOnInit(): void {
    this.gameService.loadGames();
  }

  jugar(slug: string): void {
    if (!this.usuarioState.isLoggedIn()) {
      this.notification.show('Necesitas iniciar sesión para jugar ⚽', 'error');
      return;
    }

    this.router.navigate(['/juego', slug]);
  }
}