module.exports =`

CREATE TABLE IF NOT EXISTS dock_bank_test.pessoas(
    idPessoa INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    cpf VARCHAR(25)NOT NULL,
    dataNascimento DATE NOT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


CREATE TABLE IF NOT EXISTS dock_bank_test.tipoConta(
    idTipoConta INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS  dock_bank_test.contas(
    idConta INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    idPessoa INT(45) NOT NULL,
    saldo DECIMAL(10,2) NOT NULL DEFAULT 0.0,
    limiteSaqueDiario DECIMAL(10,2) NOT NULL DEFAULT 2000.0,
    flagAtivo BOOLEAN DEFAULT true,
    tipoConta INT(11) NOT NULL,
    dataCriacao DATETIME NOT NULL,
    CONSTRAINT fk_conta_pessoa
    FOREIGN KEY (idPessoa)
    REFERENCES pessoas (idPessoa)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
    CONSTRAINT fk_tipo_conta
    FOREIGN KEY (tipoConta)
    REFERENCES tipoConta (idTipoConta)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION
    )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

CREATE TABLE IF NOT EXISTS dock_bank_test.transacoes(
    idTransacao INT(11) PRIMARY KEY NOT NULL AUTO_INCREMENT,
    idConta INT(11) NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    dataTransacao DATETIME NOT NULL
    )
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


INSERT INTO dock_bank_test.tipoConta (idTipoConta , nome ) VALUES (1, 'PF - Conta Corrente');

INSERT INTO dock_bank_test.tipoConta (idTipoConta , nome ) VALUES (2, 'PF - Conta Poupança');

INSERT INTO dock_bank_test.tipoConta (idTipoConta , nome ) VALUES (3, 'PJ - Conta Corrente');





`;
//Se sua versão do MySQL for mais recente e houver porblemas de conexão, 
//crie ou atualize o usuário de conexão conforme abaixo:
//CREATE USER 'daniel'@'localhost' IDENTIFIED WITH mysql_native_password BY 'apolo1';
//ALTER USER 'daniel'@'localhost' IDENTIFIED WITH mysql_native_password BY 'apolo1'
//GRANT ALL PRIVILEGES ON * . * TO 'daniel'@'localhost';
//FLUSH PRIVILEGES; 