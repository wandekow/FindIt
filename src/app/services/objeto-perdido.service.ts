
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ObjetoPerdido } from '../model/objeto-perdido.model';

@Injectable({ providedIn: 'root' })
export class ObjetoPerdidoService {
  private readonly storageKey = 'findit-objetos-v1';
  private readonly idKey = 'findit-proximo-id-v1';

  // Retorna todos os objetos cadastrados
  getAll(): Observable<ObjetoPerdido[]> {
    return of(this.listarLocal());
  }

  // Retorna um objeto pelo ID
  getById(id: number): Observable<ObjetoPerdido | undefined> {
    const objeto = this.listarLocal().find(item => item.id === id);
    return of(objeto);
  }

  // Cadastra um objeto
  create(dados: Omit<ObjetoPerdido, 'id'>): Observable<ObjetoPerdido> {
    const objeto: ObjetoPerdido = {
      ...dados,
      id: this.proximoId()
    };

    this.salvarTodos([objeto, ...this.listarLocal()]);

    return of(objeto);
  }

  // Atualiza um objeto
  update(objeto: ObjetoPerdido): Observable<ObjetoPerdido> {
    const objetos = this.listarLocal().map(item =>
      item.id === objeto.id ? { ...objeto } : item
    );

    this.salvarTodos(objetos);

    return of(objeto);
  }

  // Remove um objeto
  delete(id: number): Observable<void> {
    const objetos = this.listarLocal().filter(item => item.id !== id);

    this.salvarTodos(objetos);

    return of(void 0);
  }

  // Alterna a situação de devolução
  alternarDevolucao(id: number): Observable<void> {
    const objetos = this.listarLocal().map(item =>
      item.id === id
        ? { ...item, devolvido: !item.devolvido }
        : item
    );

    this.salvarTodos(objetos);

    return of(void 0);
  }

  // Mantém a leitura dos dados no armazenamento local
  private listarLocal(): ObjetoPerdido[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) as ObjetoPerdido[] : [];
    } catch {
      return [];
    }
  }

  private proximoId(): number {
    const maiorAtual = this.listarLocal().reduce(
      (maior, item) => Math.max(maior, item.id), 0
    );

    const salvo = Number(localStorage.getItem(this.idKey) || 0);
    const proximo = Math.max(maiorAtual, salvo) + 1;

    localStorage.setItem(this.idKey, String(proximo));

    return proximo;
  }

  private salvarTodos(objetos: ObjetoPerdido[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(objetos));
  }
}
