import { computed, Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ObjetoPerdido } from '../../model/objeto-perdido.model';
import { ObjetoPerdidoService } from '../../services/objeto-perdido.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {
  private readonly service = inject(ObjetoPerdidoService);

  readonly objetos = signal<ObjetoPerdido[]>([]);
  readonly loading = signal(true);
  readonly errorMessage = signal('');
  readonly total = computed(() => this.objetos().length);
  readonly pendentes = computed(() => this.objetos().filter(objeto => !objeto.devolvido).length);
  readonly devolvidos = computed(() => this.objetos().filter(objeto => objeto.devolvido).length);
  readonly recentes = computed(() => this.objetos().slice(0, 3));

  constructor() {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.errorMessage.set('');
    this.service.getAll().subscribe({
      next: objetos => {
        this.objetos.set(objetos);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Não foi possível carregar os objetos. Tente novamente.');
      }
    });
  }

  formatarData(data: string): string {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}