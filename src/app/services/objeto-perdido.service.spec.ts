import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { ObjetoPerdido } from '../model/objeto-perdido.model';
import { ObjetoPerdidoService } from './objeto-perdido.service';

describe('ObjetoPerdidoService', () => {
  let service: ObjetoPerdidoService;

  const novoObjeto: Omit<ObjetoPerdido, 'id'> = {
    descricao: 'Chave azul',
    categoria: 'Chaves',
    localEncontrado: 'Pátio',
    dataEncontrado: '2026-11-06',
    responsavel: 'Equipe FindIt',
    contato: 'contato@exemplo.test',
    devolvido: false
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ObjetoPerdidoService);
  });

  it('creates records and returns them through getAll and getById', async () => {
    const criado = await firstValueFrom(service.create(novoObjeto));

    expect(criado.id).toBe(1);
    expect(await firstValueFrom(service.getAll())).toEqual([criado]);
    expect(await firstValueFrom(service.getById(criado.id))).toEqual(criado);
    expect(await firstValueFrom(service.getById(999))).toBeUndefined();
  });

  it('updates an existing record', async () => {
    const criado = await firstValueFrom(service.create(novoObjeto));
    const atualizado = { ...criado, descricao: 'Chave azul com chaveiro' };

    await firstValueFrom(service.update(atualizado));

    expect(await firstValueFrom(service.getById(criado.id))).toEqual(atualizado);
    expect((await firstValueFrom(service.getAll()))[0].descricao).toBe('Chave azul com chaveiro');
  });

  it('deletes a record', async () => {
    const criado = await firstValueFrom(service.create(novoObjeto));

    await firstValueFrom(service.delete(criado.id));

    expect(await firstValueFrom(service.getAll())).toEqual([]);
    expect(await firstValueFrom(service.getById(criado.id))).toBeUndefined();
  });

  it('preserves the next ID after deleting the highest record', async () => {
    const criado = await firstValueFrom(service.create(novoObjeto));
    await firstValueFrom(service.delete(criado.id));

    const seguinte = await firstValueFrom(service.create({ ...novoObjeto, descricao: 'Outro objeto' }));

    expect(seguinte.id).toBe(2);
  });
});
