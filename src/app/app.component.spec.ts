import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => { localStorage.clear(); await TestBed.configureTestingModule({ imports: [AppComponent] }).compileComponents(); });
  it('cria o componente e exibe a marca FindIt', () => { const fixture = TestBed.createComponent(AppComponent); fixture.detectChanges(); expect(fixture.componentInstance).toBeTruthy(); expect(fixture.nativeElement.textContent).toContain('FindIt'); });
  it('inicia sem registros e abre o cadastro', () => { const fixture = TestBed.createComponent(AppComponent); fixture.detectChanges(); fixture.componentInstance.abrirCadastro(); expect(fixture.componentInstance.mostrarFormulario).toBeTrue(); });
});
