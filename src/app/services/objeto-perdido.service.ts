
import { Injectable } from '@angular/core';
import { ObjetoPerdido } from '../model/objeto-perdido.model';

@Injectable({ providedIn: 'root' })
export class ObjetoPerdidoService {
  private readonly storageKey = 'findit-objetos-v1';
  private readonly idKey = 'findit-proximo-id-v1';

  // Retorna todos os objetos cadastrados
  getAll(): ObjetoPerdido[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      return raw ? JSON.parse(raw) as ObjetoPerdido[] : [];
    } catch {
      return [];
    }
  }

  // Retorna um objeto pelo ID
  getById(id: number): ObjetoPerdido | undefined {
    return this.getAll().find(item => item.id === id);
  }

  // Remove um objeto pelo ID
  delete(id: number): void {
    this.salvarTodos(this.getAll().filter(item => item.id !== id));
  }

  listar(): ObjetoPerdido[] {
    return this.getAll();
  }

  criar(dados: Omit<ObjetoPerdido, 'id'>): ObjetoPerdido {
    const objeto: ObjetoPerdido = { ...dados, id: this.proximoId() };
    this.salvarTodos([objeto, ...this.getAll()]);
    return objeto;
  }

  atualizar(objeto: ObjetoPerdido): void {
    this.salvarTodos(
      this.getAll().map(item =>
        item.id === objeto.id ? { ...objeto } : item
      )
    );
  }

  remover(id: number): void {
    this.delete(id);
  }

  alternarDevolucao(id: number): void {
    this.salvarTodos(
      this.getAll().map(item =>
        item.id === id ? { ...item, devolvido: !item.devolvido } : item
      )
    );
  }

  private proximoId(): number {
    const maiorAtual = this.getAll().reduce(
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
