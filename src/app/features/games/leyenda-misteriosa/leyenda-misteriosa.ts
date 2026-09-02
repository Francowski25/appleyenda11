import { Component, OnInit, inject, signal, computed, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LeyendaMisteriosaService } from '../../../core/services/leyenda-misteriosa.service';
import { NotificationService } from '../../../core/services/notification.service';
import { GameService } from '../../../core/services/game.service';
import { resolverNombreObjetivo } from '../../../core/utils/desafio-nombre.util';

type LetterStatus = 'correct' | 'present' | 'absent';

const MAX_INTENTOS = 6;
const FILA_1 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
const FILA_2 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'];
const FILA_3 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M'];

@Component({
  selector: 'app-leyenda-misteriosa',
  imports: [CommonModule],
  templateUrl: './leyenda-misteriosa.html',
  styleUrl: './leyenda-misteriosa.css',
})
export class LeyendaMisteriosa implements OnInit {
  private readonly service = inject(LeyendaMisteriosaService);
  private readonly notification = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);
  private readonly gameService = inject(GameService);
  private readonly router = inject(Router);

  private readonly slug = this.route.snapshot.routeConfig?.path ?? '';

  readonly loading = this.service.loading;
  readonly wordLength = signal(0);

  private respuestaCompleta = '';
  private letras: string[] = [];

  readonly intentos = signal<string[]>([]);
  readonly intentoActual = signal('');
  readonly juegoTerminado = signal(false);
  readonly gano = signal(false);
  readonly mostrarModalExito = signal(false);

  readonly rangoLetras = computed(() => Array.from({ length: this.wordLength() }));
  readonly filasVaciasArray = computed(() =>
    Array.from({ length: Math.max(0, MAX_INTENTOS - this.intentos().length - (this.juegoTerminado() ? 0 : 1)) })
  );

  readonly estadoTeclado = computed<Record<string, LetterStatus>>(() => {
    const estado: Record<string, LetterStatus> = {};
    for (const intento of this.intentos()) {
      const resultado = this.evaluar(intento);
      intento.split('').forEach((letra, i) => {
        if (estado[letra] === 'correct') return;
        estado[letra] = resultado[i];
      });
    }
    return estado;
  });

  readonly teclasFila1 = FILA_1;
  readonly teclasFila2 = FILA_2;
  readonly teclasFila3 = FILA_3;

  ngOnInit(): void {
    void this.cargarReto();
  }

  private async cargarReto(): Promise<void> {
    const reto = await this.service.obtenerRetoDiario();
    if (!reto) return;

    const { nombre, longitud } = resolverNombreObjetivo(reto);

    this.respuestaCompleta = this.normalizar(nombre);
    this.letras = this.respuestaCompleta.replace(/ /g, '').split('');
    this.wordLength.set(longitud);
  }

  private normalizar(texto: string): string {
    return texto
      .toUpperCase()
      .replace(/Ñ/g, '{N}')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\{N\}/g, 'Ñ');
  }

  @HostListener('window:keydown', ['$event'])
  manejarTeclado(event: KeyboardEvent): void {
    if (this.juegoTerminado()) return;
    const tecla = event.key.toUpperCase();

    if (tecla === 'ENTER') { this.confirmarIntento(); return; }
    if (tecla === 'BACKSPACE') { this.borrarLetra(); return; }
    if (/^[A-ZÑ]$/.test(tecla)) this.escribirLetra(tecla);
  }

  clickTecla(letra: string): void {
    this.escribirLetra(letra);
  }

  escribirLetra(letra: string): void {
    if (this.intentoActual().length >= this.letras.length) return;
    this.intentoActual.set(this.intentoActual() + letra);
  }

  borrarLetra(): void {
    this.intentoActual.set(this.intentoActual().slice(0, -1));
  }

  confirmarIntento(): void {
    const intento = this.intentoActual();
    if (intento.length !== this.letras.length) {
      this.notification.show('Completa el nombre antes de continuar', 'warning');
      return;
    }

    this.intentos.update(lista => [...lista, intento]);
    this.intentoActual.set('');

    if (intento === this.letras.join('')) {
      this.juegoTerminado.set(true);
      this.gano.set(true);
      void this.finalizarPartida(true);
      return;
    }

    if (this.intentos().length >= MAX_INTENTOS) {
      this.juegoTerminado.set(true);
      this.gano.set(false);
      void this.finalizarPartida(false);
    }
  }

  private async finalizarPartida(exito: boolean): Promise<void> {
    const guardado = await this.gameService.enviarResultado(this.slug, exito);

    if (exito) {
      this.notification.show('¡Correcto! Adivinaste al futbolista ⚽🎉', 'success');
      this.mostrarModalExito.set(true);
    } else {
      this.notification.show(`Se acabaron los intentos. Era: ${this.respuestaCompleta}`, 'error');
    }

    if (!guardado) {
      this.notification.show('No se pudo guardar tu resultado en el servidor.', 'warning');
    }
  }

  redirigirALeyenda11(): void {
    this.mostrarModalExito.set(false);
    void this.router.navigate(['/leyenda11']);
  }

  private evaluar(intento: string): LetterStatus[] {
    const resultado: LetterStatus[] = new Array(this.letras.length).fill('absent');
    const usados = new Array(this.letras.length).fill(false);

    for (let i = 0; i < intento.length; i++) {
      if (intento[i] === this.letras[i]) {
        resultado[i] = 'correct';
        usados[i] = true;
      }
    }

    for (let i = 0; i < intento.length; i++) {
      if (resultado[i] === 'correct') continue;
      const idx = this.letras.findIndex((l, j) => l === intento[i] && !usados[j]);
      if (idx !== -1) {
        resultado[i] = 'present';
        usados[idx] = true;
      }
    }

    return resultado;
  }

  obtenerEstadoCelda(intento: string, index: number): LetterStatus | null {
    if (index >= intento.length) return null;
    return this.evaluar(intento)[index];
  }

  claseTecla(tecla: string): string {
    const estado = this.estadoTeclado()[tecla];
    if (estado === 'correct') return 'bg-emerald-600 text-white';
    if (estado === 'present') return 'bg-amber-500 text-white';
    if (estado === 'absent') return 'bg-slate-800 text-slate-500';
    return 'bg-slate-700 hover:bg-slate-600 text-white';
  }
}