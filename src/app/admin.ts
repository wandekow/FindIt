import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ObjetoPerdido } from './model/objeto-perdido.model';
import { ObjetoPerdidoService } from './services/objeto-perdido.service';

type Filtro = 'todos' | 'pendentes' | 'devolvidos';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {
  private readonly service = inject(ObjetoPerdidoService);
  private readonly router = inject(Router);

  readonly objetos = signal<ObjetoPerdido[]>([]);
  readonly loadingData = signal(true);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  readonly busca = signal('');
  readonly filtro = signal<Filtro>('todos');
  readonly selecionado = signal<ObjetoPerdido | null>(null);

  readonly filtrados = computed(() => {
    const termo = this.busca().trim().toLocaleLowerCase('pt-BR');
    const filtroAtual = this.filtro();
    return this.objetos().filter(objeto => {
      const correspondeBusca = !termo || [objeto.descricao, objeto.categoria, objeto.localEncontrado, objeto.responsavel, objeto.contato]
        .some(valor => valor.toLocaleLowerCase('pt-BR').includes(termo));
      const correspondeFiltro = filtroAtual === 'todos' || (filtroAtual === 'devolvidos' ? objeto.devolvido : !objeto.devolvido);
      return correspondeBusca && correspondeFiltro;
    });
  });

  constructor() { this.load(); }

  load(): void {
    this.loadingData.set(true);
    this.service.getAll().subscribe({
      next: objetos => { this.objetos.set(objetos); this.loadingData.set(false); },
      error: () => { this.loadingData.set(false); this.showError('Não foi possível carregar os registros.'); }
    });
  }

  get total(): number { return this.objetos().length; }
  get pendentes(): number { return this.objetos().filter(item => !item.devolvido).length; }
  get devolvidos(): number { return this.objetos().filter(item => item.devolvido).length; }

  novo(): void { void this.router.navigate(['/manutencao']); }
  editar(objeto: ObjetoPerdido): void { void this.router.navigate(['/manutencao', objeto.id]); }

  verDetalhes(objeto: ObjetoPerdido): void {
    this.service.getById(objeto.id).subscribe({
      next: detalhe => this.selecionado.set(detalhe ?? null),
      error: () => this.showError('Não foi possível carregar os detalhes.')
    });
  }

  fecharDetalhes(): void { this.selecionado.set(null); }

  excluir(objeto: ObjetoPerdido): void {
    if (!window.confirm(`Excluir o registro “${objeto.descricao}”? Esta ação não pode ser desfeita.`)) return;
    this.service.delete(objeto.id).subscribe({
      next: () => {
        this.load();
        if (this.selecionado()?.id === objeto.id) this.fecharDetalhes();
        this.showSuccess('Registro excluído com sucesso.');
      },
      error: () => this.showError('Não foi possível excluir o registro.')
    });
  }

  alternarDevolucao(objeto: ObjetoPerdido): void {
    this.service.alternarDevolucao(objeto.id).subscribe({
      next: () => {
        this.load();
        if (this.selecionado()?.id === objeto.id) this.verDetalhes(objeto);
        this.showSuccess(objeto.devolvido ? 'Objeto marcado como aguardando retirada.' : 'Objeto marcado como devolvido.');
      },
      error: () => this.showError('Não foi possível alterar o status de devolução.')
    });
  }

  formatarData(data: string): string {
    if (!data) return '—';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  }

  private showSuccess(message: string): void {
    this.errorMessage.set('');
    this.successMessage.set(message);
    window.setTimeout(() => this.successMessage.set(''), 3500);
  }

  private showError(message: string): void {
    this.successMessage.set('');
    this.errorMessage.set(message);
    window.setTimeout(() => this.errorMessage.set(''), 3500);
  }
}
