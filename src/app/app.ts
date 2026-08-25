import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TransitionService } from './core/services/transition.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('appleyenda11');
  transitionService = inject(TransitionService);

}
