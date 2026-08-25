import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Game, GameListResponse } from '../models/game.model';

@Injectable({ providedIn: 'root' })
export class GameService {
    private readonly http = inject(HttpClient);

    readonly games = signal<Game[]>([]);
    readonly loading = signal(false);

    async loadGames(): Promise<void> {
        this.loading.set(true);
        try {
            const res = await firstValueFrom(
                this.http.get<GameListResponse>(`${environment.urlBase}/game/getall`));
            this.games.set(res.listGame ?? []);
        } finally {
            this.loading.set(false);
        }
    }
}