import { server } from '../index.js';
import { clearDatabase, closeDatabase, defaultUser, registerUser, loginUser } from './testUtils.js';

beforeAll(async () => {
    await clearDatabase();
});

afterAll(async () => {
    await closeDatabase();
    if ( server ) {
        server.close();
    };
});


describe('Auth Routes', () => {

    describe('POST /api/auth/register', () => {
        it('should register a new user', async () => {
            const res = await registerUser();
            expect(res.statusCode).toBe(201);
            expect(res.body.message).toBe('User registered successfully');
        });

        it('should not register a user with an existing email', async () => {
            const res = await registerUser();
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('User with this email already exists');
        });
    });

    describe('POST /api/auth/login', () => {
        it('should login an existing user', async () => {
            const res = await loginUser();
            expect(res.statusCode).toBe(200);
            expect(res.body.message).toBe('Login successful');
            expect(res.body.token).toBeDefined();
        });

        it('should not login with invalid credentials', async () => {
            const res = await loginUser(defaultUser.email, 'wrongpassword123');
            expect(res.statusCode).toBe(400);
            expect(res.body.message).toBe('Invalid email or password');
        });
    });
});


