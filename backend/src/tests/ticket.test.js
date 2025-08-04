import request from 'supertest';
import app, { server } from '../index.js';
import { clearDatabase, closeDatabase, registerAndLoginUser } from './testUtils.js';


beforeAll(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
    if (server) {
        server.close();
    };
});


describe('Ticket Routes', () => {
    describe('GET /api/tickets', () => {
        it('should get all tickets', async () => {
            const token = await registerAndLoginUser();

            const res = await request(app)
                .get('/api/tickets')
                .set('Authorization', `Bearer ${token}`);

            expect(res.statusCode).toBe(200);
            expect(Array.isArray(res.body.tickets)).toBe(true);
        });
    });

})
