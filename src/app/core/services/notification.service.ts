import { Injectable, signal } from '@angular/core';

export type NotificationType = 'success' | 'warning' | 'error' | 'exception' | 'info';

export interface BotMessage {
    text: string;
    type: NotificationType;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
    readonly message = signal<BotMessage | null>(null);
    private timeoutId: any = null;

    show(text: string, type: NotificationType = 'info', durationMs = 4000): void {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.message.set({ text, type });
        this.timeoutId = setTimeout(() => this.message.set(null), durationMs);
    }

    clear(): void {
        if (this.timeoutId) clearTimeout(this.timeoutId);
        this.message.set(null);
    }
}