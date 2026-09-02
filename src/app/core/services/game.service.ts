import { inject, Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Game, GameListResponse, GameCompletedResponse } from '../models/game.model';
import { NotificationService } from './notification.service';
import { AuthService } from './auth.service';
import { gameResult } from '../../api/functions';

@Injectable({ providedIn: 'root' })
export class GameService {
    private readonly http = inject(HttpClient);
    private readonly notification = inject(NotificationService);
    private readonly authService = inject(AuthService);

    readonly games = signal<Game[]>([]);
    readonly loading = signal<boolean>(false);
    readonly loadingCompletados = signal<boolean>(false);
    private readonly juegosCompletados = signal<Set<string>>(new Set());

    readonly hasCompletedGames = computed(() => this.juegosCompletados().size > 0);

    constructor() {
        effect(() => {
            const user = this.authService.currentUser();
            if (user) {
                this.loadJuegosCompletados();
            } else {
                this.juegosCompletados.set(new Set());
            }
        });
    }

    async loadGames(): Promise<void> {
        this.loading.set(true);
        try {
            const resGames = await firstValueFrom(
                this.http.get<GameListResponse>(`${environment.urlBase}/game/getall`)
            );
            this.games.set(resGames?.listGame ?? []);
        } catch {
            this.notification.show('Error al cargar la lista de juegos.', 'error');
            this.games.set([]);
        } finally {
            this.loading.set(false);
        }
    }

    async loadJuegosCompletados(): Promise<void> {
        this.loadingCompletados.set(true);
        try {
            const data = await firstValueFrom(
                this.http.get<GameCompletedResponse>(`${environment.urlBase}/game/completed/today`)
            );

            const slugs = (data?.listGame ?? [])
                .filter(game => Boolean(game?.slug))
                .map(game => game.slug);

            this.juegosCompletados.set(new Set(slugs));
        } catch (err) {
            console.error('Error cargando juegos completados:', err);
            this.juegosCompletados.set(new Set());
        } finally {
            this.loadingCompletados.set(false);
        }
    }

    async ensureCompletadosCargados(): Promise<void> {
        if (!this.loadingCompletados()) return;
        while (this.loadingCompletados()) {
            await new Promise(resolve => setTimeout(resolve, 50));
        }
    }

    async enviarResultado(slug: string, exito: boolean): Promise<boolean> {
        if (this.estaCompletado(slug)) {
            this.notification.show('Ya completaste este juego hoy, vuelve mañana.', 'info');
            return false;
        }

        const juego = this.games().find(g => g.slug === slug);
        if (!juego) {
            this.notification.show('No se pudo identificar el juego.', 'error');
            return false;
        }

        try {
            await firstValueFrom(
                gameResult(this.http, environment.urlBase, {
                    body: { idGame: juego.idGame, exito }
                })
            );

            this.marcarCompletado(slug);

            if (exito && juego.pointsReward) {
                this.authService.sumarPuntos(juego.pointsReward);
            }

            return true;
        } catch (err: unknown) {
            const errorObj = err as HttpErrorResponse;
            const errorBody = errorObj?.error as { listMessage?: string[] };
            const mensaje = errorBody?.listMessage?.[0] || 'No se pudo guardar tu resultado.';

            if (errorObj?.status === 409 || mensaje.toLowerCase().includes('ya completaste')) {
                this.marcarCompletado(slug);
            }

            this.notification.show(mensaje, 'error');
            return false;
        }
    }

    estaCompletado(slug: string): boolean {
        if (!this.authService.isLoggedIn()) return false;
        return this.juegosCompletados().has(slug);
    }

    private marcarCompletado(slug: string): void {
        this.juegosCompletados.update(prevSet => new Set(prevSet).add(slug));
    }
}