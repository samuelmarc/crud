# Sistema CRUD de Clientes — Documentação de Requisitos

---

## Histórias de Usuário

### HU-01 — Cadastrar cliente

> **Como** usuário do sistema,  
> **quero** cadastrar um novo cliente informando nome, e-mail, telefone e cidade,  
> **para que** eu possa manter um registro atualizado dos meus clientes.

---

### HU-02 — Consultar lista de clientes

> **Como** usuário do sistema,  
> **quero** visualizar todos os clientes cadastrados em uma tabela,  
> **para que** eu possa ter uma visão geral do meu cadastro.

---

### HU-03 — Editar dados de um cliente

> **Como** usuário do sistema,  
> **quero** alterar as informações de um cliente já cadastrado,  
> **para que** eu possa manter os dados sempre corretos e atualizados.

---

### HU-04 — Excluir um cliente

> **Como** usuário do sistema,  
> **quero** remover um cliente do cadastro,  
> **para que** registros desatualizados ou incorretos não permaneçam no sistema.

---

### HU-05 — Receber feedback das ações

> **Como** usuário do sistema,  
> **quero** ser notificado sobre o resultado de cada operação realizada,  
> **para que** eu saiba se a ação foi concluída com sucesso ou se ocorreu algum erro.

---

### HU-06 — Confirmar exclusão antes de remover

> **Como** usuário do sistema,  
> **quero** ser solicitado a confirmar antes de excluir um cliente,  
> **para que** eu não exclua registros acidentalmente.

---

## Requisitos

### Requisitos Funcionais

| ID    | Descrição |
|-------|-----------|
| RF-01 | O sistema deve permitir o cadastro de clientes com os campos: nome, e-mail, telefone e cidade. |
| RF-02 | Os campos nome e e-mail devem ser obrigatórios no cadastro e na edição. |
| RF-03 | O sistema deve garantir que o e-mail de cada cliente seja único no banco de dados. |
| RF-04 | O sistema deve exibir todos os clientes cadastrados em uma tabela com colunas: ID, Nome, E-mail, Telefone e Cidade. |
| RF-05 | O sistema deve permitir a edição dos dados de qualquer cliente listado. |
| RF-06 | O sistema deve permitir a exclusão de um cliente, precedida de confirmação explícita do usuário. |
| RF-07 | O sistema deve exibir mensagens de feedback (sucesso, erro ou aviso) após cada operação de criação, edição ou exclusão. |
| RF-08 | O formulário de cadastro/edição deve ser exibido e ocultado na mesma página, sem redirecionamentos. |
| RF-09 | A tabela de clientes deve ser atualizada automaticamente após qualquer operação de criação, edição ou exclusão. |

---

### Requisitos Não Funcionais

| ID     | Descrição |
|--------|-----------|
| RNF-01 | A interface deve ser responsiva, adaptando-se a diferentes tamanhos de tela. |
| RNF-02 | O front-end deve utilizar Bootstrap 5 e jQuery. |
| RNF-03 | O back-end deve ser desenvolvido em Node.js com Express. |
| RNF-04 | Os dados devem ser persistidos em banco de dados PostgreSQL. |
| RNF-05 | A comunicação entre front-end e back-end deve ocorrer via API REST com JSON. |
| RNF-06 | As credenciais do banco de dados não devem estar expostas no código-fonte, sendo gerenciadas por variáveis de ambiente (`.env`). |
| RNF-07 | A API deve retornar códigos HTTP semânticos: `200 OK`, `201 Created`, `204 No Content`, `400 Bad Request`, `404 Not Found`, `409 Conflict`, `500 Internal Server Error`. |
| RNF-08 | O tempo de resposta da API para operações simples deve ser inferior a 500ms em condições normais de rede local. |

---

## Critérios de Aceitação

### CA-01 — Cadastrar cliente (HU-01)

- [ ] Dado que o usuário preenche nome e e-mail e clica em **Salvar**, o cliente é inserido no banco e aparece na tabela sem recarregar a página.
- [ ] Dado que o usuário não preenche o campo nome ou e-mail, os campos inválidos são destacados em vermelho e a submissão é bloqueada.
- [ ] Dado que o usuário informa um e-mail já existente no banco, o sistema exibe a mensagem *"E-mail já cadastrado"* sem inserir o registro.
- [ ] Dado que o cadastro é realizado com sucesso, o formulário é limpo e ocultado, e uma mensagem de sucesso é exibida.

---

### CA-02 — Consultar lista de clientes (HU-02)

- [ ] Dado que existem clientes cadastrados, ao carregar a página a tabela exibe todos os registros com as colunas: ID, Nome, E-mail, Telefone e Cidade.
- [ ] Dado que não há clientes cadastrados, a tabela exibe a mensagem *"Nenhum cliente cadastrado."*
- [ ] Dado que ocorre um erro na requisição à API, a tabela exibe uma mensagem de erro ao usuário.

---

### CA-03 — Editar dados de um cliente (HU-03)

- [ ] Dado que o usuário clica em **Editar** em uma linha da tabela, o formulário é exibido preenchido com os dados atuais daquele cliente.
- [ ] Dado que o usuário altera os dados e clica em **Salvar**, as informações são atualizadas no banco e refletidas na tabela imediatamente.
- [ ] Dado que o usuário remove o conteúdo de um campo obrigatório e tenta salvar, o campo é destacado em vermelho e a operação é bloqueada.
- [ ] Dado que o usuário altera o e-mail para um já existente em outro registro, o sistema exibe a mensagem *"E-mail já cadastrado"* sem salvar a alteração.

---

### CA-04 — Excluir um cliente (HU-04)

- [ ] Dado que o usuário clica em **Excluir** em uma linha da tabela, um modal de confirmação é exibido antes de qualquer ação no banco.
- [ ] Dado que o usuário confirma a exclusão no modal, o cliente é removido do banco e desaparece da tabela.
- [ ] Dado que o usuário cancela a exclusão no modal, nenhuma alteração é realizada.

---

### CA-05 — Receber feedback das ações (HU-05)

- [ ] Após um cadastro bem-sucedido, uma mensagem de sucesso (verde) é exibida no topo da tela.
- [ ] Após uma edição bem-sucedida, uma mensagem de sucesso (verde) é exibida no topo da tela.
- [ ] Após uma exclusão bem-sucedida, uma mensagem de aviso (amarelo) é exibida no topo da tela.
- [ ] Em caso de erro na API (ex.: falha de conexão), uma mensagem de erro (vermelho) é exibida ao usuário.
- [ ] Todas as mensagens de feedback podem ser fechadas manualmente pelo usuário.

---

### CA-06 — Confirmar exclusão antes de remover (HU-06)

- [ ] O modal de confirmação de exclusão exibe as opções **Excluir** e **Cancelar**.
- [ ] O botão **Excluir** do modal realiza a chamada à API e fecha o modal após a resposta.
- [ ] O botão **Cancelar** fecha o modal sem nenhuma chamada à API.
- [ ] Clicar fora do modal ou pressionar ESC cancela a operação sem excluir o registro.

---

## Rastreabilidade

| História | Requisitos Funcionais | Critérios de Aceitação |
|----------|-----------------------|------------------------|
| HU-01    | RF-01, RF-02, RF-03, RF-08, RF-09 | CA-01 |
| HU-02    | RF-04                             | CA-02 |
| HU-03    | RF-02, RF-03, RF-05, RF-08, RF-09 | CA-03 |
| HU-04    | RF-06, RF-09                      | CA-04, CA-06 |
| HU-05    | RF-07                             | CA-05 |
| HU-06    | RF-06                             | CA-06 |
