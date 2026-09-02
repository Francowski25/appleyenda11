import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { GameService } from '../services/game.service';
import { NotificationService } from '../services/notification.service';

export const gameNotCompletedGuard: CanActivateFn = (route) => {
    const gameService = inject(GameService);
    const notification = inject(NotificationService);
    const router = inject(Router);

    const slug = route.data['slug'] as string;

    if (gameService.estaCompletado(slug)) {
        notification.show('Ya completaste este juego hoy, vuelve mañana ⏰', 'warning');
        return router.parseUrl('/leyenda11');
    }

    return true;
};