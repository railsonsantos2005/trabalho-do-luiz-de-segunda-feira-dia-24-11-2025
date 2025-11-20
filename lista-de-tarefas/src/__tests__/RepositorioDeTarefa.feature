Feature: Repositório de Tarefas
  Como desenvolvedor
  Quero que o repositório de tarefas permita listar, criar, remover e alternar o estado de uma tarefa
  Para manter o comportamento consistente do app

  Background:
    Dado um repositório de tarefas vazio

  Scenario: Listagem inicial vazia
    When eu listar as tarefas
    Then devo receber uma lista vazia

  Scenario: Criar uma nova tarefa
    When eu criar uma tarefa com o título "Comprar leite"
    Then a tarefa "Comprar leite" deve existir na lista
    And a tarefa deve possuir um id gerado

  Scenario: Remover uma tarefa existente
    Given existe uma tarefa com o título "Pagar contas"
    When eu remover a tarefa pelo seu id
    Then a tarefa "Pagar contas" não deve mais existir na lista
    And a operação de remoção deve retornar verdadeiro

  Scenario: Tentar remover uma tarefa inexistente
    Given o repositório está vazio
    When eu remover a tarefa com id "id-inexistente"
    Then a operação de remoção deve retornar falso
    And a lista de tarefas continua vazia

  Scenario: Alternar (toggle) o estado de conclusão de uma tarefa
    Given existe uma tarefa com o título "Lavar roupa" e concluida falsa
    When eu alternar o estado da tarefa pelo seu id
    Then a tarefa "Lavar roupa" deve ficar concluida verdadeira
    When eu alternar novamente o estado da tarefa pelo seu id
    Then a tarefa "Lavar roupa" deve ficar concluida falsa