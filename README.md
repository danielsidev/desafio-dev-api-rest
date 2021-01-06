# API
[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://travis-ci.org/joemccann/dillinger)

Uma API de sistema para gestão de conta
# <a name="indice"><a/> Índice
- [Requerimentos](#requerimentos)
- [Configuração](#configuracao)
- [Dependências](#dependencias)
- [Banco de Dados](#banco)
- [Testes Automatizados](#testes-auto)
- [Execução da Aplicação](#execucao-app)
- [Banco de Dados](#banco)
- [Testes Manuais](#testes-manuais)
- [Rotas da Aplicação](#rotas-app)
- [Criação da Conta Usuário Existente](#cria-conta)
- [Criação da Conta e Usuário Novo](#cria-conta-nova)
- [Transação de Depósito em Conta](#deposito)
- [Consultar Saldo](#saldo)
- [Transação de Saque da Conta](#saque)
- [Bloquear Conta](#bloquear)
- [Desbloquear Conta](#desbloquear)
- [Consultar Extrato](#extrato)
- [Consultar Extrato por Período](#extrato-periodo)


[índice&#8613;](#indice)
### <a name="requerimentos"><a/>Requerimentos  

Requer [Node.js](https://nodejs.org/) v13+ , [Typescript](https://www.typescriptlang.org/) v3+, MySQL 8 para rodar.

[índice&#8613;](#indice)
### <a name="configuracao"><a/> Configuração
Edite as variáveis de ambiente no arquivo **.env** na raiz do projeto para configurar o acesso ao banco de dados.
Coloque os valores de acesso para um mysql local com o usuário, senha, nome do banco e host.
Quando a migration for executada será criado um banco de teste, **dock_bank_test**,  pelo usuario da conexão. Logo esse usuário deve possuir permissão para criar banco de dados.
##### Observação: Criação de usuário no MySQL 8
Se sua versão do MySQL for mais recente e houver porblemas de conexão, crie ou atualize o usuário de conexão conforme abaixo:
```
CREATE USER 'my_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'my_password';
--Ou
ALTER USER 'my_user'@'localhost' IDENTIFIED WITH mysql_native_password BY 'my_password';

GRANT ALL PRIVILEGES ON  database_name. * TO 'my_user'@'localhost';
FLUSH PRIVILEGES;
```
---
#### Variáveis de Ambiente
Após editar o arquivo **.env**, abra um terminal, na raiz do projeto e aloque as variáveis de ambiente, através no comando:
```sh
$ set -a; source .env; set +a
```
[índice&#8613;](#indice)
###  <a name="configuracao"><a/>Instalação de Dependêcias
Abra um terminal, na raiz do projeto, e instale as dependências. 
```sh
$ npm install 
```
[índice&#8613;](#indice)
###  <a name="banco"><a/>Banco de Dados
Execute a criação das tabelas através do comando:
```sh
$ npm run migration 
```
[índice&#8613;](#indice)
###  <a name="testes-auto"><a/>Testes Automatizados
##### Jest 
Para rodar os testes execute o comando:
```sh
$ npm test
```
[índice&#8613;](#indice)
###  <a name="execucao-app"><a/>Execução da Aplicação
---
##### Para ambiente Dev
Abra uma segunda guia do terminal, na raiz do projeto, e execute:
```sh
$ npm run gulp
```
Na primeira guia do terminal, na raiz do projeto, execute:
```sh
$ npm run dev 
```

##### Para ambiente Prod
Em uma guia do terminal, na raiz do projeto, execute:
```sh
$ npm run prod 
```
----
 >O Gulp, através do typescript, realizará a transpilação do código .ts em .js, e alocará no diretório dist na raiz do projeto. Esse é o diretório para publicação.
 
 ----
 >No ambiente de DEV, o gulp ficará assistindo os arquivos .ts, logo a cada alteração em um arquivo .ts, dentro de 5 segundos, um novo arquivo .js será gerado ou atualizado.
 ----
 >No ambiente de PROD, o gulp gerará um única vez o diretório dist com a transpilação dos arquivos Typescript e acionará o node para levantar a aplicação apontando para o server na raiz do dist.
 ---
 [índice&#8613;](#indice)
 ###  <a name="testes-manuais"><a/>Testes Manuais
 ##### Postman
 
 Importar no Postman a collection dock.postman_collection.json que encontra-se dentro do diretório postman.
 >/postman/dock.postman_collection.json
 ---
 [índice&#8613;](#indice)
 ### <a name="rotas-app"><a/> Rotas da Aplicação
 ##### Host: localhost:5000
 
 [índice&#8613;](#indice)
###  <a name="cria-conta"><a/>Criação de Conta 

##### Criar Conta com pessoa existente na base dados

Esta operação , com base em um id de pessoa existente, mas que ainda não possua conta, cria uma nova conta para esta pessoa.

---

|Request| POST|
|---|---| 
|Content-Type|application/json| 
|Rota|/conta/pf/existente|
Exemplo de body:
```
body
{
    "id_pessoa":1,
    "saldo":"5500.50"
}
```
|Response JSON| Status 200| 
|---|---|  
```
{
    "result": true,
    "response": "4",
    "data": "4"
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Precisamos de todos os campos preenchidos!"
}

```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Conta já existe!",
    "data": null
}

```
|Response JSON| Status 404| 
|---|---|  

```
{
    "result": false,
    "response": "Pessoa não existe.",
    "data": null
}
```

|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Não foi possível criar a conta",
    "data": {}
}
```
[índice&#8613;](#indice)
#####  <a name="cria-conta-nova"><a/> Criar Conta com pessoa completamente nova
Esta operação realiza cria uma nova pessoa e a partir do id dessa pessoa cria uma nova conta para a mesma.

---

|Request| POST|
|---|---| 
|Content-Type|application/json| 
|Rota|/conta/pf/nova|
Exemplo de body:
```
body
{
    "nome":"Marcos da Silva",
    "cpf":"582.741.963-89",
    "data_nascimento":"1975-01-15",
    "saldo":"3450.78"
}
```
|Response JSON| Status 200| 
|---|---|  
```
{
    "result": true,
    "response": "4",
    "data": "4"
}
```

|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Precisamos de todos os campos preenchidos!"
}

```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Pessoa já existe!",
    "data": null
}

```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Conta já existe!",
    "data": null
}

```

|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Não foi possível criar a conta",
    "data": {}
}
```
---
[índice&#8613;](#indice)
###  <a name="deposito"><a/>Depósito em Conta
Essa operação realiza o registro de transação de depósito e o depósito em conta.
|Request| POST|
|---|---| 
|Content-Type|application/json| 
|Rota|/transacao|
Exemplo de body:
```
body
{
    "id_conta":1,
    "valor":200,
    "tipo":"deposito"
}
```
|Response JSON| Status 200| 
|---|---|  
```
{
    "result": true,
    "response": "Depósito realizado com sucesso.",
    "data": "1"
}
```

|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Precisamos de todos os campos preenchidos!"
}

```
|Response JSON| Status 404| 
|---|---|  

```
{
    "result": false,
    "response": "Conta inexistente ou bloqueada!"
}

```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Não foi possíel depositar",
    "data": null
}

```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "O depósito deve ser maior que zero(0).",
    "data": null
}

```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Operação indefinida.",
    "data": null
}

```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Erro ao realizar depósito",
    "data": {}
}
```
---
[índice&#8613;](#indice)
###  <a name="saldo"><a/>Consultar Saldo em uma determinada Conta
Essa operação realiza a consulta do saldo de uma determinada conta, informando o id da conta.
|Request || 
|---| ---| 
|Content-Type|application/json| 
|GET: | /conta/saldo/{id}|
|PARAM| id: number|

|Response JSON| Status 200| 
|---|---|  
```
{
    "result": false,
    "response": "Saldo recuperado com sucesso.",
    "data": [
        {
            "id": 1,
            "saldo": 900,
            "nome": "Vinicius Benício Carvalho"
        }
    ]
}
```

|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Conta não encontrada.",
    "data": null
}
```

|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Dados inválidos",
    "data": null
}
```

---
[índice&#8613;](#indice)
###  <a name="saque"><a/>Saque da Conta
Essa operação realiza o registro de transação de saque e o saque da conta.
|Request| POST|
|---|---| 
|Content-Type|application/json| 
|Rota|/transacao|
Exemplo de body:
```
body
{
    "id_conta":1,
    "valor":100,
    "tipo":"saque"
}
```
|Response JSON| Status 200| 
|---|---|  
```
{
    "result": true,
    "response": "Saque realizado com sucesso.",
    "data": "1"
}
```

|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Precisamos de todos os campos preenchidos!"
}

```
|Response JSON| Status 404| 
|---|---|  

```
{
    "result": false,
    "response": "Conta inexistente ou bloqueada!"
}

```
|Response JSON| Status 400| 
|---|---|  
```
{
    "result": false,
    "response": "Operação não permitida. Saldo insuficiente.",
    "data": {
        "saldo": 900,
        "saque": -1000
    }
}

```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Operação não permitida. Essa operação só realiza saque.",
    "data": {}
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Erro ao realizar saque",
    "data": {}
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Operação indefinida.",
    "data": null
}

```
---
[índice&#8613;](#indice)

###  <a name="bloquear"><a/>Bloquear Conta
Essa operação realiza o bloqueio da conta informando o id da conta.
|Request ||
|---| ---| 
|Content-Type|application/json| 
|GET: | /conta/bloquear/{id}|
|PARAM| id: number|

|Response JSON| Status 200| 
|---|---|  
```
{
    "result": false,
    "response": "Conta bloqueada com sucesso!",
    "data": null
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Dados inválidos.",
    "data": null
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Não conseguimos bloquear a conta",
    "data": null
}
```
[índice&#8613;](#indice)
###  <a name="desbloquear"><a/>Desbloquear Conta
Essa operação realiza o desbloqueio da conta informando o id da conta.
|Request ||
|---| ---| 
|Content-Type|application/json| 
|GET: | /conta/desbloquear/{id}|
|PARAM| id: number|

|Response JSON| Status 200| 
|---|---|  
```
{
    "result": false,
    "response": "Conta desbloqueada com sucesso!",
    "data": null
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Dados inválidos.",
    "data": null
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Não conseguimos desbloquear a conta",
    "data": null
}
```
[índice&#8613;](#indice)
###  <a name="extrato"><a/>Consulta Extrato da Conta
Essa operação realiza a consulta do extrato da conta, informando o id da conta.
|Request ||
|---| ---| 
|Content-Type|application/json| 
|GET: | /transacao/extrato/conta/{id}|
|PARAM| id: number|

Examplo: GET http://localhost:5000/transacao/extrato/conta/1
|Response JSON| Status 200| 
|---|---|  
```
{
    "result": true,
    "response": "Extrato consultado com sucesso.",
    "data": {
        "cliente": "Vinicius Benício Carvalho",
        "conta": 1,
        "saldo": 700,
        "transacoes": [
            {
                "tranasacao": 200,
                "data": "2021-01-02T19:13:05.000Z"
            },
            {
                "tranasacao": -200,
                "data": "2021-01-02T19:13:58.000Z"
            },
            {
                "tranasacao": 500,
                "data": "2021-01-04T19:14:40.000Z"
            },
            {
                "tranasacao": -200,
                "data": "2021-01-10T19:14:47.000Z"
            },
            {
                "tranasacao": 300,
                "data": "2021-01-02T21:43:02.000Z"
            },
            {
                "tranasacao": -100,
                "data": "2021-01-02T21:43:37.000Z"
            },
            {
                "tranasacao": 300,
                "data": "2021-01-02T21:55:07.000Z"
            },
            {
                "tranasacao": -100,
                "data": "2021-01-02T21:55:11.000Z"
            }
        ]
    }
}
```
|Response JSON| Status 404| 
|---|---|  

```
{
    "result": false,
    "response": "Não existem transações para essa conta",
    "data": null
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Dados inválidos",
    "data": null
}
```
---
[índice&#8613;](#indice)
###  <a name="extrato-periodo"><a/>Consulta Extrato da Conta por Período
Essa operação realiza a consulta do extrato da conta , informando o id da conta, o período de data inicial e data final.
|Request ||
|---| ---| 
|Content-Type|application/json| 
|GET: | /transacao/extrato/conta/{id}/periodo/{data_ini}/{data_fim}|
|PARAM| id: number|
|PARAM| data_ini: string|
|PARAM| data_fim: string|

Exemplo:
GET http://localhost:5000/transacao/extrato/conta/1/periodo/2021-01-04/2021-01-10
|Response JSON| Status 200| 
|---|---|  
```
{
    "result": true,
    "response": "Extrato consultado com sucesso.",
    "data": {
        "cliente": "Vinicius Benício Carvalho",
        "conta": 1,
        "saldo": 300,
        "transacoes": [
            {
                "tranasacao": 500,
                "data": "2021-01-04T19:14:40.000Z"
            },
            {
                "tranasacao": -200,
                "data": "2021-01-10T19:14:47.000Z"
            }
        ]
    }
}
```
|Response JSON| Status 404| 
|---|---|  

```
{
    "result": false,
    "response": "Não existem transações para essa conta no período solicitado.",
    "data": null
}
```
|Response JSON| Status 400| 
|---|---|  

```
{
    "result": false,
    "response": "Dados inválidos",
    "data": null
}
```

---




