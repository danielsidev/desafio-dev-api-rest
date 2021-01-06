import { DateUtc } from "entities/DateUtc";
import { Transacao } from "entities/Transacao";
import { IContaExtratoBusiness } from "../interfaces/business/IContaExtratoBusiness";
import { ITransacoesRepository } from "../interfaces/repositories/ITransacoesRepository";
import { MySQLConn, PoolConnection } from "./database/MySQLClient";

 class TransacaoRepository implements ITransacoesRepository{

    private readonly table: string = "transacoes";
    private readonly tableConta: string = "contas";
    private readonly tablePessoa: string = "pessoas";
    private db: MySQLConn;
    constructor() {
        this.db = new MySQLConn();
    }
    public async registrar(transacao: Transacao): Promise<object | number> {
        return new Promise((resolve, reject) => {
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`INSERT INTO ${this.table}  VALUES(?, ?, ?, ?)`, [
                    transacao.getIdTransacao(),
                    transacao.getIdConta(),
                    transacao.getValor(),
                    transacao.getDataTransacao()                    
                ], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows.insertId);
                    }
                })
            }).catch((err) => {
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });
    }
    public async consultarExtrato(idConta: number): Promise<[IContaExtratoBusiness]> {
        return new Promise((resolve, reject) => {
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`
                 SELECT p.nome as cliente,
                        c.idConta as conta, 
                        c.saldo as saldo, 
                        t.valor as transacao, 
                        t.dataTransacao as 'data',
                        t.idTransacao as idTransacao  
                        FROM ${this.table} as t INNER JOIN ${this.tableConta} as c
                 ON t.idConta=c.idConta INNER JOIN ${this.tablePessoa} as p 
                 ON c.idPessoa=p.idPessoa  WHERE c.flagAtivo=1 AND t.idConta=?`, 
                 [idConta], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
            }).catch((err) => {
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });
    }
    public async consultarExtratoPorPeriodo(idConta: number, dataInicial: string, dataFinal: string): Promise<[IContaExtratoBusiness]> {
        return new Promise((resolve, reject) => {
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`
                SELECT p.nome as cliente,
                c.idConta as conta, 
                c.saldo as saldo, 
                t.valor as transacao, 
                t.dataTransacao as 'data'  
                FROM ${this.table} as t INNER JOIN ${this.tableConta} as c
                ON t.idConta=c.idConta INNER JOIN ${this.tablePessoa} as p 
                ON c.idPessoa=p.idPessoa  WHERE c.flagAtivo=1 AND t.idConta=? AND t.dataTransacao BETWEEN (?) AND (?) `, 
                [idConta, dataInicial, dataFinal], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows);
                    }
                })
            }).catch((err) => {
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });
    }
    public excluir(id:number): Promise<object>{
        return new Promise((resolve, reject)=>{
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`DELETE FROM ${this.table}  WHERE idTransacao=?`, [id], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows.affectedRows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        }); 
    }
    public excluirPorIdConta(idConta:number): Promise<object>{
        return new Promise((resolve, reject)=>{
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`DELETE FROM ${this.table}  WHERE idConta=?`, [idConta], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows.affectedRows);
                    }
                })
            }).catch((err)=>{
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        }); 
    }
}
export { TransacaoRepository };