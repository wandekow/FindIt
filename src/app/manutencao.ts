import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ObjetoPerdido } from './model/objeto-perdido.model';
import { ObjetoPerdidoService } from './services/objeto-perdido.service';

@Component({
  selector: 'app-manutencao',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './manutencao.html',
  styleUrl: './manutencao.css'
})
export class ManutencaoComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ObjetoPerdidoService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly loadingData = signal(false);
  readonly saving = signal(false);
  readonly successMessage = signal('');
  readonly errorMessage = signal('');
  readonly editandoId = signal<number | null>(null);
  readonly categorias = ['Eletrônicos', 'Documentos', 'Acessórios', 'Chaves', 'Vestuário', 'Material escolar', 'Outros'];

  readonly formulario = this.fb.nonNullable.group({
    descricao: ['', [Validators.required, Validators.minLength(3)]],
    categoria: ['', Validators.required],
    localEncontrado: ['', Validators.required],
    dataEncontrado: ['', Validators.required],
    responsavel: ['', Validators.required],
    contato: ['', Validators.required],
    devolvido: [false]
  });

  ngOnInit(): void { this.load(); }

  load(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.formulario.reset({ descricao: '', categoria: '', localEncontrado: '', dataEncontrado: this.dataHoje(), responsavel: '', contato: '', devolvido: false });
      return;
    }

    this.editandoId.set(id);
    this.loadingData.set(true);
    this.service.getById(id).subscribe({
      next: objeto => {
        this.loadingData.set(false);
        if (!objeto) {
          this.showError('Registro não encontrado.');
          void this.router.navigate(['/admin']);
          return;
        }
        this.formulario.setValue({
          descricao: objeto.descricao,
          categoria: objeto.categoria,
          localEncontrado: objeto.localEncontrado,
          dataEncontrado: objeto.dataEncontrado,
          responsavel: objeto.responsavel,
          contato: objeto.contato,
          devolvido: objeto.devolvido
        });
      },
      error: () => { this.loadingData.set(false); this.showError('Não foi possível carregar o registro.'); }
    });
  }

  submit(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      this.showError('Preencha todos os campos obrigatórios antes de salvar.');
      return;
    }

    this.saving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');
    const dados = this.formulario.getRawValue();
    const id = this.editandoId();
    const requisicao = id === null
      ? this.service.create(dados)
      : this.service.update({ ...dados, id } as ObjetoPerdido);

    requisicao.subscribe({
      next: () => {
        this.saving.set(false);
        this.successMessage.set(id === null ? 'Objeto cadastrado com sucesso.' : 'Registro atualizado com sucesso.');
        window.setTimeout(() => void this.router.navigate(['/admin']), 450);
      },
      error: () => {
        this.saving.set(false);
        this.showError(id === null ? 'Não foi possível cadastrar o objeto.' : 'Não foi possível atualizar o registro.');
      }
    });
  }

  campoInvalido(nome: string): boolean {
    const campo = this.formulario.get(nome);
    return !!campo && campo.invalid && (campo.touched || campo.dirty);
  }

  private dataHoje(): string { return new Date().toISOString().slice(0, 10); }
  private showError(message: string): void {
    this.successMessage.set('');
    this.errorMessage.set(message);
  }
}
