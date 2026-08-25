import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { FanWall } from '../fan-wall/fan-wall';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet, Navbar, FanWall, Footer],
  templateUrl: './shell.html',
  styleUrl: './shell.css',
})
export class Shell { }