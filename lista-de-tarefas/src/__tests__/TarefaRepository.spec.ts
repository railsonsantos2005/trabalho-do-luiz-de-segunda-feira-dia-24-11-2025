import { describe, it, expect, beforeEach } from "vitest";
import { type DatabaseInterface} from "@/database/database";
import { TarefaRepository } from "@/controller/TarefaRepository";

class DatabaseMock implements DatabaseInterface {
  private items: any[] = [];   
    generateId(): string {
        return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    }
    list(): any[] {
        return this.items;
    }
    create(item: any): any {
        const newItem = { ...item };
        if (!newItem.id) {
            newItem.id = this.generateId();
        }
        this.items.push(newItem);
        return newItem;
    }
    remove(id: string): boolean {
        const idx = this.items.findIndex((it: any) => it && it.id === id);
        if (idx === -1) return false;
        this.items.splice(idx, 1);
        return true;
    }
}

describe("TarefaRepository", () => {
  let repo: TarefaRepository;
  const storageKey = "test-tarefas";

  beforeEach(() => {
    const db = new DatabaseMock();
    repo = new TarefaRepository(db);
  });

  it("Listagem inicial vazia", () => {
    const list = repo.list();
    expect(Array.isArray(list)).toBe(true);
    expect(list.length).toBe(0);
  });

  it('Criar uma nova tarefa', () => {
    const created = repo.create("Comprar leite");
    expect(created).toHaveProperty("titulo", "Comprar leite");
    expect(created).toHaveProperty("id");
    const all = repo.list();
    expect(all.find((t: any) => t.id === (created as any).id)).toBeTruthy();
  });

  it('Remover uma tarefa existente', () => {
    const created = repo.create("Pagar contas");
    const removed = repo.remove((created as any).id);
    expect(removed).toBe(true);
    const all = repo.list();
    expect(all.find((t: any) => t.titulo === "Pagar contas")).toBeUndefined();
  });

  it('Tentar remover uma tarefa inexistente', () => {
    const removed = repo.remove("id-inexistente");
    expect(removed).toBe(false);
    expect(repo.list().length).toBe(0);
  });

  it('Alternar (toggle) o estado de conclusão de uma tarefa', () => {
    const created = repo.create("Lavar roupa");
    const id = (created as any).id as string;

    let item = repo.list().find((t: any) => t.id === id) as any;
    expect(item).toBeTruthy();
    expect(item.concluida).toBe(false);

    const toggled1 = repo.toggle(id) as any;
    expect(toggled1).toBeTruthy();
    expect(toggled1.concluida).toBe(true);

    const toggled2 = repo.toggle(id) as any;
    expect(toggled2).toBeTruthy();
    expect(toggled2.concluida).toBe(false);
  });
});