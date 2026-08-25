import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, UpdateLevelPoints, LevelInfo } from '../models/login-response.model';
import { NotificationService } from './notification.service';

const REFRESH_MARGIN_MS = 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly notification = inject(NotificationService);

    readonly currentUser = signal<LoginResponse | null>(this.getUserFromStorage());
    readonly isLoggedIn = computed(() => this.currentUser() !== null);
    readonly userLevel = computed<LevelInfo & { level: number; totalPoints: number } | null>(() => {
        const user = this.currentUser();
        if (!user) return null;
        const { level, totalPoints, idLevel, levelName, levelIcon, levelPosition, levelMin, levelMax } = user;
        return { level, totalPoints, idLevel, levelName, levelIcon, levelPosition, levelMin, levelMax };
    });

    private refreshTimeoutId: any = null;

    private getUserFromStorage(): LoginResponse | null {
        const raw = localStorage.getItem('current_user');
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    }

    async login(nickName: string, password: string): Promise<{ ok: boolean; message: string }> {
        try {
            const data = await firstValueFrom(
                this.http.post<LoginResponse>(`${environment.urlBase}/auth/login`, { nickName, password })
            );

            if (!data || !data.token) {
                const mensajeError = data?.listMessage?.[0] || 'Ocurrió un error al iniciar sesión.';
                this.notification.show(mensajeError, 'error');
                return { ok: false, message: mensajeError };
            }

            this.saveSession(data);
            const mensajeExito = data.listMessage?.[0] || `Bienvenido, ${data.nickName}`;
            this.notification.show(`¡Bienvenido, ${data.nickName}!`, 'success');
            return { ok: true, message: mensajeExito };
        } catch (err: any) {
            const errorBody = err?.error;
            const mensajeError = errorBody?.listMessage?.[0] || errorBody?.message || err?.message || 'Error de conexión con el servidor.';
            this.notification.show(mensajeError, 'error');
            return { ok: false, message: mensajeError };
        }
    }

    private saveSession(data: LoginResponse): void {
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('refresh_token', data.refreshToken);
        localStorage.setItem('current_user', JSON.stringify(data));
        this.currentUser.set(data);
        this.scheduleRefresh();
    }

    getToken(): string | null {
        return localStorage.getItem('auth_token');
    }

    updateLevelAndPoints(data: UpdateLevelPoints): void {
        const current = this.currentUser();
        if (!current) return;
        const updated = { ...current, ...data };
        localStorage.setItem('current_user', JSON.stringify(updated));
        this.currentUser.set(updated);
    }

    updateNivelYPuntos(level: number, totalPoints: number): void {
        const current = this.currentUser();
        if (!current) return;
        const updated = { ...current, level, totalPoints };
        localStorage.setItem('current_user', JSON.stringify(updated));
        this.currentUser.set(updated);
    }

    getUserLevel(): number | null {
        return this.currentUser()?.level ?? null;
    }

    getUserPoints(): number | null {
        return this.currentUser()?.totalPoints ?? null;
    }

    getLevelInfoComplete(): LevelInfo | null {
        const user = this.currentUser();
        if (!user) return null;
        const { idLevel, levelName, levelIcon, levelPosition, levelMin, levelMax } = user;
        return { idLevel, levelName, levelIcon, levelPosition, levelMin, levelMax };
    }

    logout(reason?: string, redirigirALogin: boolean = false): void {
        this.clearRefreshTimer();
        localStorage.removeItem('current_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        this.currentUser.set(null);

        if (redirigirALogin) {
            this.router.navigate(['/login'], { queryParams: reason ? { reason } : undefined });
        }
    }

    private scheduleRefresh(): void {
        this.clearRefreshTimer();
        this.refreshTimeoutId = setTimeout(() => this.refreshSession(), 3600000 - REFRESH_MARGIN_MS);
    }

    private clearRefreshTimer(): void {
        if (this.refreshTimeoutId) clearTimeout(this.refreshTimeoutId);
    }

    private refreshSession(): void {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            this.logout('session_expired', true);
            return;
        }

        this.http.post<LoginResponse>(`${environment.urlBase}/auth/refresh`, { refreshToken })
            .subscribe({
                next: (data) => this.saveSession(data),
                error: () => this.logout('session_expired', true)
            });
    }
}