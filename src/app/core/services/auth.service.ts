import { inject, Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginResponse, UpdateLevelPoints } from '../models/login-response.model';
import { NotificationService } from './notification.service';

const SESSION_DURATION_MS = 60 * 60 * 1000;

@Injectable({ providedIn: 'root' })
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly notification = inject(NotificationService);

    readonly currentUser = signal<LoginResponse | null>(this.getUserFromStorage());
    readonly isLoggedIn = computed(() => this.currentUser() !== null);

    readonly userLevel = computed<UpdateLevelPoints | null>(() => {
        const user = this.currentUser();
        if (!user) return null;
        const {
            level, totalPoints, idLevel, levelName, levelIcon,
            levelPosition, levelMin, levelMax, puntosFaltantes, progresoPorcentaje
        } = user;
        return {
            level, totalPoints, idLevel, levelName, levelIcon,
            levelPosition, levelMin, levelMax, puntosFaltantes, progresoPorcentaje
        };
    });

    private logoutTimeoutId: any = null;

    private getUserFromStorage(): LoginResponse | null {
        const raw = localStorage.getItem('current_user');
        const expiry = Number(localStorage.getItem('session_expiry'));

        if (!raw || !expiry) return null;

        const remaining = expiry - Date.now();
        if (remaining <= 0) {
            this.clearStorage();
            return null;
        }

        this.scheduleAutoLogout(remaining);
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
        const expiry = Date.now() + SESSION_DURATION_MS;
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('current_user', JSON.stringify(data));
        localStorage.setItem('session_expiry', String(expiry));
        this.currentUser.set(data);
        this.scheduleAutoLogout(SESSION_DURATION_MS);
    }

    getToken(): string | null {
        const expiry = Number(localStorage.getItem('session_expiry'));
        if (expiry && Date.now() > expiry) {
            this.logout('session_expired', true);
            return null;
        }
        return localStorage.getItem('auth_token');
    }

    updateLevelAndPoints(data: UpdateLevelPoints): void {
        const current = this.currentUser();
        if (!current) return;
        const updated: LoginResponse = { ...current, ...data };
        localStorage.setItem('current_user', JSON.stringify(updated));
        this.currentUser.set(updated);
    }

    sumarPuntos(puntos: number): void {
        const current = this.currentUser();
        if (!current) return;
        const totalPoints = current.totalPoints + puntos;
        const updated = { ...current, totalPoints };
        localStorage.setItem('current_user', JSON.stringify(updated));
        this.currentUser.set(updated);
    }

    getUserPoints(): number | null {
        return this.currentUser()?.totalPoints ?? null;
    }

    getLevelInfoComplete(): UpdateLevelPoints | null {
        return this.userLevel();
    }

    logout(reason?: string, redirigir: boolean = false): void {
        this.clearLogoutTimer();
        this.clearStorage();
        this.currentUser.set(null);

        if (redirigir) {
            this.router.navigate(['/leyenda11'], { queryParams: reason ? { reason } : undefined });
        }
    }

    private clearStorage(): void {
        localStorage.removeItem('current_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('session_expiry');
    }

    private scheduleAutoLogout(ms: number): void {
        this.clearLogoutTimer();
        this.logoutTimeoutId = setTimeout(() => this.logout('session_expired', true), ms);
    }

    private clearLogoutTimer(): void {
        if (this.logoutTimeoutId) clearTimeout(this.logoutTimeoutId);
    }
}