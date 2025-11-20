export interface DatabaseInterface {
  generateId(): string;
  list(): any[];
  create(item: any): any;
  remove(id: string): boolean;
}

export class Database implements DatabaseInterface {
  private storageKey: string;

  constructor(storageKey = 'tarefas') {
    this.storageKey = storageKey;
  }
  generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
   list(): any[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  create(item: any): any {
    const items = this.list();
    const newItem = { ...item };
    if (!newItem.id) {
      newItem.id = this.generateId();
    }
    items.push(newItem);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return newItem;
  }

  remove(id: string): boolean {
    const items = this.list();
    const idx = items.findIndex((it: any) => it && it.id === id);
    if (idx === -1) return false;
    items.splice(idx, 1);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
    return true;
  }
}