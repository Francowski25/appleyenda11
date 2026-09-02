import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

export const authGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const notification = inject(NotificationService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
        notification.show('Necesitas iniciar sesión para jugar ⚽', 'error');
        return router.parseUrl('/leyenda11');
    }

    return true;
};