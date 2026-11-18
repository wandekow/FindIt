import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';

describe('AppComponent', () => {
  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it('renders the application shell and administration route', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/admin');
    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain('Objetos encontrados');
  });

  it('navigates to the maintenance route for new registrations', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/manutencao');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Cadastrar objeto');
    expect(fixture.nativeElement.textContent).toContain('Salvar');
  });
  it('lists public objects without exposing personal contact information', async () => {
    const objeto = {
      id: 1,
      descricao: 'Mochila azul',
      categoria: 'Acessórios',
      localEncontrado: 'Biblioteca Central',
      dataEncontrado: '2026-11-17',
      responsavel: 'Ana Responsável',
      contato: 'ana@example.test',
      devolvido: false
    };
    localStorage.setItem('findit-objetos-v1', JSON.stringify([objeto]));
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/objetos');
    fixture.detectChanges();

    const texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Mochila azul');
    expect(texto).toContain('Biblioteca Central');
    expect(texto).not.toContain('Ana Responsável');
    expect(texto).not.toContain('ana@example.test');
  });

  it('shows object details without contact information and handles an unknown ID', async () => {
    const objeto = {
      id: 1,
      descricao: 'Mochila azul',
      categoria: 'Acessórios',
      localEncontrado: 'Biblioteca Central',
      dataEncontrado: '2026-11-17',
      responsavel: 'Ana Responsável',
      contato: 'ana@example.test',
      devolvido: false
    };
    localStorage.setItem('findit-objetos-v1', JSON.stringify([objeto]));
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/objetos/1');
    fixture.detectChanges();
    let texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Mochila azul');
    expect(texto).toContain('Biblioteca Central');
    expect(texto).not.toContain('Ana Responsável');
    expect(texto).not.toContain('ana@example.test');

    await router.navigateByUrl('/objetos/999');
    fixture.detectChanges();
    texto = fixture.nativeElement.textContent as string;
    expect(texto).toContain('Objeto não encontrado');
    expect(texto).toContain('Ver todos os objetos');
  });
  it('shows the academic About page and keeps the supplied Google Maps destination', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const router = TestBed.inject(Router);

    await router.navigateByUrl('/sobre');
    fixture.detectChanges();

    const texto = fixture.nativeElement.textContent as string;
    const mapsLink = fixture.nativeElement.querySelector('[data-google-maps-link]') as HTMLAnchorElement;
    expect(texto).toContain('Esta história é fictícia');
    expect(texto).toContain('Missão');
    expect(texto).toContain('Visão');
    expect(texto).toContain('Valores');
    expect(mapsLink.getAttribute('href')).toBe('https://maps.app.goo.gl/zDEeJDfTd2Z71Tpn9');
  });
});
