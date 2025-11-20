/// <reference types="cypress" />
import App from './App.vue'
import { mount } from 'cypress/vue'

describe('<App /> (component)', () => {
  beforeEach(() => {
    // garante localStorage limpo antes de montar
    cy.window().then((win) => win.localStorage.clear());
  });

  it('mostra estado vazio, cria e remove uma tarefa', () => {
    mount(App);

    cy.contains('Nenhuma tarefa ainda.').should('be.visible');
    cy.get('ul.lista').find('li').should('have.length', 0);

    const titulo = 'Comprar leite';
    cy.get('input[placeholder="Nova tarefa..."]').type(titulo);
    // usa botão de submit explicitamente
    cy.get('button[type="submit"]').click();

    // espera e verifica que o item foi criado
    cy.get('ul.lista li', { timeout: 5000 }).should('have.length', 1)
      .contains(titulo).should('be.visible');
    cy.contains('Nenhuma tarefa ainda.').should('not.exist');

    // verifica localStorage e id gerado
    cy.window().its('localStorage').invoke('getItem', 'tarefas').then((raw) => {
      const items = JSON.parse(raw as string);
      const found = items.find((i: any) => i.titulo === titulo);
      expect(found).to.exist;
      expect(found.id).to.be.a('string').and.to.have.length.greaterThan(0);
    });

    // remove via botão dentro do li correspondente
    cy.get('ul.lista').contains('li', titulo).within(() => {
      cy.get('button.excluir').click();
    });

    // verifica remoção
    cy.get('ul.lista').find('li').should('have.length', 0);
    cy.contains('Nenhuma tarefa ainda.').should('be.visible');
  });
});