<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Database } from "@/database/database";
import { TarefaRepository } from "@/controller/TarefaRepository";
import type { Tarefa } from "@/database/models";

const db = new Database();
const repo = new TarefaRepository(db);

const titulo = ref("");
const tarefas = ref<Tarefa[]>([]);

function load() {
  tarefas.value = repo.list();
}

onMounted(load);

function add() {
  const value = titulo.value.trim();
  if (!value) return;
  repo.create(value);
  titulo.value = "";
  load();
}

function removeItem(id: string) {
  repo.remove(id);
  load();
}
</script>

<template>
  <div class="app">
    <h1>Lista de Tarefas</h1>

    <form @submit.prevent="add" class="form">
      <input v-model="titulo" placeholder="Nova tarefa..." />
      <button type="submit">Adicionar</button>
    </form>

    <ul class="lista">
      <li v-for="t in tarefas" :key="t.id" class="item">
        <span class="titulo">{{ t.titulo }}</span>
        <button class="excluir" @click="removeItem(t.id)">Excluir</button>
      </li>
    </ul>

    <p v-if="tarefas.length === 0">Nenhuma tarefa ainda.</p>
  </div>
</template>

<style scoped>
.app {
  max-width: 640px;
  margin: 32px auto;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial;
}

.form {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.form input {
  flex: 1;
  padding: 8px;
  font-size: 14px;
}

.form button {
  padding: 8px 12px;
  cursor: pointer;
}

.lista {
  list-style: none;
  padding: 0;
  margin: 0;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 6px;
  border-bottom: 1px solid #eee;
}

.excluir {
  background: #e53e3e;
  color: white;
  border: none;
  padding: 6px 10px;
  cursor: pointer;
  border-radius: 4px;
}
</style>