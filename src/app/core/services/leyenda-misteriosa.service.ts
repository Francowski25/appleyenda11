import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RetoDiarioResponse } from '../models/leyenda-misteriosa.model';
import { NotificationService } from './notification.service';

@Injectable({ providedIn: 'root' })
export class LeyendaMisteriosaService {
    private readonly http = inject(HttpClient);
    private readonly notification = inject(NotificationService);

    readonly loading = signal(false);

    async obtenerRetoDiario(): Promise<RetoDiarioResponse | null> {
        this.loading.set(true);
        try {
            return await firstValueFrom(
                this.http.get<RetoDiarioResponse>(`${environment.urlBase}/wordle/today`)
            );
        } catch (err: unknown) {
            const errorObj = err as HttpErrorResponse;
            const errorBody = errorObj?.error as { listMessage?: string[] };
            const mensaje = errorBody?.listMessage?.[0] || 'No se pudo cargar el reto del día.';

            this.notification.show(mensaje, 'error');
            return null;
        } finally {
            this.loading.set(false);
        }
    }
}