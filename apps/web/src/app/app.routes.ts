import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { SearchDemoComponent } from './pages/labs/search-demo/search-demo.component';
import { ChatDemoComponent } from './pages/labs/chat-demo/chat-demo.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'projects', component: ProjectsComponent },
  { path: 'labs/search', component: SearchDemoComponent },
  { path: 'labs/chat', component: ChatDemoComponent },
];
