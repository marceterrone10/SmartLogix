import request from 'supertest';
import mongoose from 'mongoose';
import User from '../models/user.model.js';
import app from '../index.js';

export const defaultUser = {
    email: 'test@example.com',
    password: 'Password123456',
    role: 'cliente'
};

const generateRandomEmail = () => `test${Math.floor(Math.random() * 10000)}@example.com`;

export const registerUser = async () => {
    const res = await request(app).post('/api/auth/register').send({
        email: defaultUser.email,
        password: defaultUser.password,
        role: defaultUser.role
    });
    return res;
};

export const loginUser = async (email = defaultUser.email, password = defaultUser.password) => {
    const res = await request(app).post('/api/auth/login').send({
        email,
        password
    });
    return res;
};

export const registerAndLoginUser = async () => {
    const email = generateRandomEmail();
    const password = 'Password123456';
    const role = 'admin';

    await request(app)
        .post('/api/auth/register')
        .send({email, password, role});

    const loginRes = await request(app)
        .post('/api/auth/login')
        .send({email, password});

    return loginRes.body.token;

};

export const clearDatabase = async () => {
    await User.deleteMany({});
};

export const closeDatabase = async () => {
    await mongoose.connection.close();
};