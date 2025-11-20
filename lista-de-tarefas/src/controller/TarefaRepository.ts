import type { DatabaseInterface } from "@/database/database";
import type { Tarefa } from "@/database/models";

export interface TarefaRepositoryInterface {
    list(): Tarefa[];
    create(titulo: string): Tarefa;
    remove(id: string): boolean;
    toggle(id: string): Tarefa | undefined;
}

export class TarefaRepository implements TarefaRepositoryInterface {
    private db: DatabaseInterface;
    constructor(db: DatabaseInterface) {
        this.db = db;
    }
    
    list(): Tarefa[] {
        return this.db.list() as Tarefa[];
    }

    create(titulo: string): Tarefa {
        // create with a boolean flag 'concluida' by default (common in task apps)
        const created = this.db.create({ titulo, concluida: false });
        return created as Tarefa;
    }

    remove(id: string): boolean {
        return this.db.remove(id);
    }

    toggle(id: string): Tarefa | undefined {
        const items = this.db.list();
        const existing = items.find((it: any) => it && it.id === id);
        if (!existing) return undefined;

        const updated: any = { ...existing };

        // Try to toggle the first boolean property found, otherwise toggle/create 'concluida'
        const boolKey = Object.keys(updated).find(k => typeof updated[k] === "boolean");
        if (boolKey) {
            updated[boolKey] = !updated[boolKey];
        } else {
            updated.concluida = !updated.concluida;
        }

        // Replace stored item by removing old and creating updated (preserves id if provided)
        this.db.remove(id);
        this.db.create(updated);

        return updated as Tarefa;
    }
}