import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ObjetoPerdido } from './model/objeto-perdido.model';
import { ObjetoPerdidoService } from './services/objeto-perdido.service';

type Filtro = 'todos' | 'pendentes' | 'devolvidos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  objetos: ObjetoPerdido[] = [];
  selecionado: ObjetoPerdido | null = null;
  editandoId: number | null = null;
  busca = '';
  filtro: Filtro = 'todos';
  mensagem = '';
  tipoMensagem: 'sucesso' | 'erro' = 'sucesso';
  mostrarFormulario = false;
  mostrarDetalhes = false;
  categorias = ['Eletrônicos', 'Documentos', 'Acessórios', 'Chaves', 'Vestuário', 'Material escolar', 'Outros'];

  formulario = this.fb.nonNullable.group({
    descricao: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['', Validators.required],
    localEncontrado: ['', Validators.required],
    dataEncontrado: ['', Validators.required],
    responsavel: ['', Validators.required],
    contato: ['', Validators.required],
    devolvido: [false]
  });

  constructor(private readonly fb: FormBuilder, private readonly service: ObjetoPerdidoService) {}

  ngOnInit(): void { this.carregar(); }

  get filtrados(): ObjetoPerdido[] {
    const termo = this.busca.trim().toLocaleLowerCase('pt-BR');
    return this.objetos.filter(objeto => {
      const correspondeBusca = !termo || [objeto.descricao, objeto.categoria, objeto.localEncontrado, objeto.responsavel, objeto.contato].some(valor => valor.toLocaleLowerCase('pt-BR').includes(termo));
      const correspondeFiltro = this.filtro === 'todos' || (this.filtro === 'devolvidos' ? objeto.devolvido : !objeto.devolvido);
      return correspondeBusca && correspondeFiltro;
    });
  }

  get total(): number { return this.objetos.length; }
  get pendentes(): number { return this.objetos.filter(item => !item.devolvido).length; }
  get devolvidos(): number { return this.objetos.filter(item => item.devolvido).length; }

  abrirCadastro(): void {
    this.editandoId = null;
    this.formulario.reset({ descricao: '', categoria: '', localEncontrado: '', dataEncontrado: this.dataHoje(), responsavel: '', contato: '', devolvido: false });
    this.mostrarFormulario = true;
    window.setTimeout(() => document.getElementById('descricao')?.focus());
  }

  editar(objeto: ObjetoPerdido): void {
    this.editandoId = objeto.id;
    this.formulario.setValue({ descricao: objeto.descricao, categoria: objeto.categoria, localEncontrado: objeto.localEncontrado, dataEncontrado: objeto.dataEncontrado, responsavel: objeto.responsavel, contato: objeto.contato, devolvido: objeto.devolvido });
    this.mostrarFormulario = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  salvar(): void {
    if (this.formulario.invalid) { this.formulario.markAllAsTouched(); this.exibir('Preencha todos os campos obrigatórios antes de salvar.', 'erro'); return; }
    const dados = this.formulario.getRawValue();
    if (this.editandoId === null) {
      this.service.create(dados).subscribe({
        next: () => {
          this.carregar();
          this.exibir('Objeto cadastrado com sucesso.');
          this.cancelarFormulario();
        },
        error: () => this.exibir('Não foi possível cadastrar o objeto.', 'erro')
      });
    } else {
      this.service.update({ ...dados, id: this.editandoId }).subscribe({
        next: () => {
          this.carregar();
          this.exibir('Registro atualizado com sucesso.');
          this.cancelarFormulario();
        },
        error: () => this.exibir('Não foi possível atualizar o registro.', 'erro')
      });
    }
  }

  confirmarExclusao(objeto: ObjetoPerdido): void {
    if (window.confirm(`Excluir o registro “${objeto.descricao}”? Esta ação não pode ser desfeita.`)) {
      this.service.delete(objeto.id).subscribe({
        next: () => {
          this.carregar();
          this.exibir('Registro excluído com sucesso.');
          if (this.selecionado?.id === objeto.id) this.fecharDetalhes();
        },
        error: () => this.exibir('Não foi possível excluir o registro.', 'erro')
      });
    }
  }

  alternarDevolucao(objeto: ObjetoPerdido): void {
    this.service.alternarDevolucao(objeto.id).subscribe({
      next: () => {
        this.carregar();
        if (this.selecionado?.id === objeto.id) {
          this.service.getById(objeto.id).subscribe(atualizado => {
            this.selecionado = atualizado ?? null;
          });
        }
        this.exibir(objeto.devolvido ? 'Objeto marcado como aguardando retirada.' : 'Objeto marcado como devolvido.');
      },
      error: () => this.exibir('Não foi possível alterar o status de devolução.', 'erro')
    });
  }

  verDetalhes(objeto: ObjetoPerdido): void {
    this.service.getById(objeto.id).subscribe(detalhe => {
      this.selecionado = detalhe ?? null;
      this.mostrarDetalhes = this.selecionado !== null;
    });
  }
  fecharDetalhes(): void { this.mostrarDetalhes = false; this.selecionado = null; }
  cancelarFormulario(): void { this.mostrarFormulario = false; this.editandoId = null; this.formulario.reset(); }
  selecionarFiltro(filtro: Filtro): void { this.filtro = filtro; }
  campoInvalido(nome: string): boolean { const campo = this.formulario.get(nome); return !!campo && campo.invalid && (campo.touched || campo.dirty); }
  formatarData(data: string): string { if (!data) return '—'; const [ano, mes, dia] = data.split('-'); return `${dia}/${mes}/${ano}`; }

  private carregar(): void {
    this.service.getAll().subscribe(objetos => this.objetos = objetos);
  }
  private dataHoje(): string { return new Date().toISOString().slice(0, 10); }
  private exibir(mensagem: string, tipo: 'sucesso' | 'erro' = 'sucesso'): void { this.mensagem = mensagem; this.tipoMensagem = tipo; window.setTimeout(() => this.mensagem = '', 3500); }
}
