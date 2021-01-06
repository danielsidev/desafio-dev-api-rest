import { MySQLConn, PoolConnection } from "../../src/repositories/database/MySQLClient";

describe('Repositories - Database ', () => {

    it('Deve conseguir estabalecer conexão com MySQL', async () => {
        let db = new MySQLConn();        
        let result= await db.getConnection();
        expect(result['_connectCalled']).toBe(true);
        expect(result['threadId']).toBeGreaterThan(0);
    });

    it('Deve conseguir estabalecer conexão com MySQL de Teste', async () => {
        let db = new MySQLConn();
            db.setDatabase('dock_bank_test')
            db.setCreatePool();     
        let result= await db.getConnection();
        expect(result['_connectCalled']).toBe(true);
        expect(result['threadId']).toBeGreaterThan(0);
    });

});