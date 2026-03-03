import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  template: `
    <h1>Home</h1>
    <p>Welcome to my portfolio. Explore <a routerLink="/projects">projects</a> or try the <a routerLink="/labs/search">Search</a> and <a routerLink="/labs/chat">Chat</a> demos in Labs.</p>
  `,
  styles: [],
})
export class HomeComponent {}
