import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home').then(module => module.HomeComponent),
    title: 'Início | FindIt'
  },
  {
    path: 'objetos',
    loadComponent: () => import('./features/objetos/objetos').then(module => module.ListagemObjetosComponent),
    title: 'Objetos encontrados | FindIt'
  },
  {
    path: 'objetos/:id',
    loadComponent: () => import('./features/detalhe-objeto/detalhe-objeto').then(module => module.DetalheObjetoComponent),
    title: 'Detalhe do objeto | FindIt'
  },
  {
    path: 'sobre',
    loadComponent: () => import('./features/sobre/sobre').then(module => module.SobreComponent),
    title: 'Sobre | FindIt'
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin').then(module => module.AdminComponent),
    title: 'Administração | FindIt'
  },
  {
    path: 'manutencao',
    loadComponent: () => import('./features/manutencao/manutencao').then(module => module.ManutencaoComponent),
    title: 'Novo objeto | FindIt'
  },
  {
    path: 'manutencao/:id',
    loadComponent: () => import('./features/manutencao/manutencao').then(module => module.ManutencaoComponent),
    title: 'Editar objeto | FindIt'
  },
  { path: '**', redirectTo: '' }
];