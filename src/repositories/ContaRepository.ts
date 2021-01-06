
import { Conta } from "entities/Conta";
import { IContaSaldoRepository } from "../interfaces/repositories/IContaSaldoRepository";
import { IContasRepository } from "../interfaces/repositories/IContasRepository";
import { MySQLConn, PoolConnection } from "./database/MySQLClient";

class ContaRepository implements IContasRepository  {
    private readonly table: string = "contas";
    private readonly tablePessoa: string = "pessoas";
    private db: MySQLConn;
    constructor() {
        this.db = new MySQLConn();
    }
    public criar(conta: Conta): Promise<object> {
        return new Promise((resolve, reject) => {
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`INSERT INTO ${this.table}  VALUES(?, ?, ?, ?, ?, ?, ?)`, [
                    conta.getIdConta(),
                    conta.getIdPessoa(),
                    conta.getSaldo(),
                    conta.getLimiteSaqueDiario(),
                    conta.getFlagAtivo(),
                    conta.getTipoConta(),
                    conta.getDataCriacao()
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
    public atualizarSaldo(saldo: number, idConta: number): Promise<object> {
        return new Promise((resolve, reject) => {
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`UPDATE ${this.table} SET  saldo=? WHERE idConta=? AND flagAtivo=1`, [
                    saldo,
                    idConta
                ], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows.affectedRows);
                    }
                })
            }).catch((err) => {
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });
    }
    public atualizarFlagAtivo(flagAtivo: boolean, idConta: number): Promise<object> {
        return new Promise((resolve, reject) => {
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`UPDATE ${this.table} SET  flagAtivo=? WHERE idConta=?`, [
                    flagAtivo,
                    idConta
                ], (err, rows) => {
                    if (err) {
                        console.log(`ERROR QUERY: ${JSON.stringify(err)}`);
                        reject(err);
                    } else {
                        resolve(rows.affectedRows);
                    }
                })
            }).catch((err) => {
                console.log(`CATCH: ERROR EXECUTION => ${JSON.stringify(err)}`);
                reject(err);
            });
        });
    }
    public consultarPorId(idConta: number): Promise<[Conta]> {
        return new Promise((resolve, reject) => {
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`
                SELECT 
                idConta,
                idPessoa, 
                saldo, 
                limiteSaqueDiario, 
                flagAtivo, 
                tipoConta, 
                DATE_FORMAT(dataCriacao,'%Y-%m-%d %H:%i:%s') as dataCriacao FROM ${this.table}  WHERE flagAtivo=1 AND idConta=?`, [idConta], (err, rows) => {
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
    public consultarSaldoContaPessoaPorId(idConta: number): Promise<[IContaSaldoRepository]> {
        return new Promise((resolve, reject) => {
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`SELECT c.idConta as id, c.saldo as saldo, p.nome as nome  FROM ${this.table} as c INNER JOIN ${this.tablePessoa} as p
                 ON c.idPessoa=p.idPessoa WHERE c.flagAtivo=1 AND c.idConta=?`, [idConta], (err, rows) => {
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
    public consultarPorPessoa(idPessoa: number): Promise<[any]> {
        return new Promise((resolve, reject) => {
            this.db.getConnection().then((connection: PoolConnection) => {
                connection.query(`
                SELECT 
                c.idConta as idConta, 
                p.idPessoa as idPessoa  FROM ${this.table} as c
                INNER JOIN ${this.tablePessoa} as p
                ON c.idPessoa=p.idPessoa WHERE c.flagAtivo=1 AND c.idPessoa=?`, [idPessoa], (err, rows) => {
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
    public excluir(idConta: number):Promise<object>{
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
export { ContaRepository };
