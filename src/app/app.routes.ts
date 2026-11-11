import { Routes } from '@angular/router';
import { AdminComponent } from './admin';
import { ManutencaoComponent } from './manutencao';

export const routes: Routes = [
  { path: 'admin', component: AdminComponent },
  { path: 'manutencao', component: ManutencaoComponent },
  { path: 'manutencao/:id', component: ManutencaoComponent },
  { path: '', pathMatch: 'full', redirectTo: 'admin' },
  { path: '**', redirectTo: 'admin' }
];
