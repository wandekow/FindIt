import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ObjetoPerdido } from '../../model/objeto-perdido.model';
import { ObjetoPerdidoService } from '../../services/objeto-perdido.service';

@Component({
  selector: 'app-detalhe-objeto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './detalhe-objeto.html',
  styleUrl: './detalhe-objeto.css'
})
export class DetalheObjetoComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly service = inject(ObjetoPerdidoService);

  readonly objeto = signal<ObjetoPerdido | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly errorMessage = signal('');

  constructor() {
    this.route.paramMap.subscribe(parametros => this.load(parametros.get('id')));
  }

  load(rawId: string | null): void {
    this.objeto.set(null);
    this.notFound.set(false);
    this.errorMessage.set('');

    const id = Number(rawId);
    if (!rawId || !Number.isSafeInteger(id) || id < 1) {
      this.loading.set(false);
      this.notFound.set(true);
      return;
    }

    this.loading.set(true);
    this.service.getById(id).subscribe({
      next: objeto => {
        this.loading.set(false);
        if (!objeto) {
          this.notFound.set(true);
          return;
        }
        this.objeto.set(objeto);
      },
      error: () => {
        this.loading.set(false);
        this.errorMessage.set('Não foi possível carregar este objeto. Tente novamente.');
      }
    });
  }

  tentarNovamente(): void {
    this.load(this.route.snapshot.paramMap.get('id'));
  }

  formatarData(data: string): string {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }
}