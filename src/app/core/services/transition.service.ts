import { Injectable, signal } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class TransitionService {
    isOpen = signal(false);

    abrir() { this.isOpen.set(true); }
    cerrar() { this.isOpen.set(false); }
}