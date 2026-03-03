import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav>
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
      <a routerLink="/projects" routerLinkActive="active">Projects</a>
      <span class="labs-group">
        <span class="labs-label">Labs:</span>
        <a routerLink="/labs/search" routerLinkActive="active">Search</a>
        <a routerLink="/labs/chat" routerLinkActive="active">Chat</a>
      </span>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    nav {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e0e0e0;
      background: #fafafa;
    }
    nav a {
      color: #333;
      text-decoration: none;
      font-weight: 500;
    }
    nav a:hover {
      color: #0066cc;
    }
    nav a.active {
      color: #0066cc;
      text-decoration: underline;
    }
    .labs-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-left: 0.5rem;
    }
    .labs-label {
      font-size: 0.875rem;
      color: #666;
    }
    main {
      padding: 1.5rem;
    }
  `],
})
export class AppComponent {
  title = 'web';
}
