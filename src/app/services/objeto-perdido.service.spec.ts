import { TestBed } from '@angular/core/testing';
import { ObjetoPerdidoService } from './objeto-perdido.service';

describe('ObjetoPerdidoService', () => {
  let service: ObjetoPerdidoService;
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({}); service = TestBed.inject(ObjetoPerdidoService); });
  it('gera IDs automaticamente e persiste um objeto', () => {
    const criado = service.criar({ descricao: 'Chave azul', categoria: 'Chaves', localEncontrado: 'Pátio', dataEncontrado: '2026-11-06', responsavel: 'Equipe FindIt', contato: 'contato@exemplo.test', devolvido: false });
    expect(criado.id).toBe(1); expect(service.listar().length).toBe(1); expect(service.listar()[0].descricao).toBe('Chave azul');
  });
  it('alterna a situação de devolução', () => {
    const criado = service.criar({ descricao: 'Livro', categoria: 'Material escolar', localEncontrado: 'Sala 1', dataEncontrado: '2026-11-06', responsavel: 'Equipe FindIt', contato: '0000-0000', devolvido: false });
    service.alternarDevolucao(criado.id); expect(service.listar()[0].devolvido).toBeTrue();
  });
  it('atualiza e remove registros', () => {
    const criado = service.criar({ descricao: 'Mochila', categoria: 'Acessórios', localEncontrado: 'Entrada', dataEncontrado: '2026-11-06', responsavel: 'Equipe FindIt', contato: '0000-0000', devolvido: false });
    service.atualizar({ ...criado, descricao: 'Mochila preta' }); expect(service.listar()[0].descricao).toBe('Mochila preta');
    service.remover(criado.id); expect(service.listar()).toEqual([]);
  });
});
