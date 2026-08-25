import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-bot-mascot',
  imports: [CommonModule],
  templateUrl: './bot-mascot.html',
  styleUrl: './bot-mascot.css',
})
export class BotMascot {
  private notification = inject(NotificationService);

  readonly message = this.notification.message;

  readonly estilos = computed(() => {
    switch (this.message()?.type) {
      case 'success':
        return {
          borde: 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/20',
          texto: 'text-emerald-400 font-extrabold',
          glow: 'bg-emerald-500 opacity-40 blur-xl'
        };
      case 'error':
        return {
          borde: 'border-2 border-red-500 shadow-lg shadow-red-500/20',
          texto: 'text-red-400 font-extrabold',
          glow: 'bg-red-500 opacity-40 blur-xl'
        };
      case 'warning':
        return {
          borde: 'border-2 border-amber-500 shadow-lg shadow-amber-500/20',
          texto: 'text-amber-400 font-extrabold',
          glow: 'bg-amber-500 opacity-40 blur-xl'
        };
      default:
        return {
          borde: 'border border-slate-700 shadow-md shadow-slate-950/40',
          texto: 'text-slate-300',
          glow: 'bg-slate-500 opacity-15 blur-lg'
        };
    }
  });

}