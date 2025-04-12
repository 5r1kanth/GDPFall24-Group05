const request = require('supertest');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../backend/server.js');
const db = require('../backend/databaseConnection.js'); 
const EmailService = require('../backend/Utils/mails.js');
const { register, login, forgotPassword, resetPassword } = require('../backend/Controllers/userControllers.js');

jest.mock('../backend/databaseConnection.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('../backend/Utils/mails.js');

describe('Authentication Controller Tests', () => {
    
    const mockUser = {
        UserID: 1,
        Firstname: 'Virat',
        Lastname: 'Kohli',
        Email: 'user@gmail.com',
        Password: '$2a$10$Fv.KNE963kI1dN3HkIkS4uNnpFtKMm/ms121TTODNFHNtjUnWIDWi',
        Role: 'Student'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    
    test('register should create a new user', async () => {
        db.query.mockResolvedValueOnce([]); 
        bcrypt.genSalt.mockResolvedValue('mockSalt');
        bcrypt.hash.mockResolvedValue('mockHashedPassword');
        db.query.mockResolvedValueOnce({ insertId: 1 });

        const req = {
            body: {
                Firstname: 'Virat',
                Lastname: 'Kohli',
                Email: 'user@gmail.com',
                Password: '$2a$10$Fv.KNE963kI1dN3HkIkS4uNnpFtKMm/ms121TTODNFHNtjUnWIDWi',
                Role: 'Student',
                Bio: 'User bio test'
            },
            file: { path: './__tests__/profile-icon.png' }
        };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: 'User registered successfully', userId: 1 });
    });

    test('register should return 400 if email exists', async () => {
        db.query.mockResolvedValueOnce([mockUser]); 

        const req = { body: { Email: 'user@gmail.com' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await register(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Email already exists' });
    });

    
    test('login should return a token for valid credentials', async () => {
        db.query.mockResolvedValueOnce([mockUser]);
        bcrypt.compare.mockResolvedValue(true);
        jwt.sign.mockReturnValue('mockToken');

        const req = { body: { Email: 'user@gmail.com', Password: 'test123', Role: 'Student' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await login(req, res);

        expect(res.json).toHaveBeenCalledWith({
            message: 'Login successful',
            token: 'mockToken',
            userId: 1,
            role: 'Student',
            username: 'Virat Kohli'
        });
    });

    test('login should return 400 for invalid credentials', async () => {
        db.query.mockResolvedValueOnce([]);
        
        const req = { body: { Email: 'user@gmail.com', Password: 'wrongpass' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid email or password' });
    });

    test('login should return 400 if role does not match', async () => {
        db.query.mockResolvedValueOnce([mockUser]);

        const req = { body: { Email: 'user@gmail.com', Password: 'password123', Role: 'Admin' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await login(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid role selected' });
    });

    
    test('forgotPassword should send a reset link', async () => {
        db.query.mockResolvedValueOnce([mockUser]);
        jwt.sign.mockReturnValue('mockResetToken');

        const req = { body: { email: 'user@gmail.com' }, protocol: 'http', get: () => 'localhost:8080' };
        const res = { json: jest.fn() };

        await forgotPassword(req, res);

        expect(EmailService.sendPasswordResetLink).toHaveBeenCalledWith('user@gmail.com', expect.any(String));
        expect(res.json).toHaveBeenCalledWith({ message: 'Password reset link has been sent to your email', resetLink: expect.any(String) });
    });

    test('forgotPassword should return 404 for non-existing email', async () => {
        db.query.mockResolvedValueOnce([]);

        const req = { body: { email: 'notfound@example.com' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await forgotPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User with this email does not exist' });
    });

    
    test('resetPassword should update password successfully', async () => {
        jwt.verify.mockReturnValue({ userId: 1 });
        db.query.mockResolvedValueOnce([mockUser]);
        bcrypt.genSalt.mockResolvedValue('mockSalt');
        bcrypt.hash.mockResolvedValue('mockHashedPassword');
        db.query.mockResolvedValueOnce({ affectedRows: 1 });

        const req = { body: { newPassword: 'test123', token: 'validToken' } };
        const res = { json: jest.fn() };

        await resetPassword(req, res);

        expect(db.query).toHaveBeenCalledWith('UPDATE Users SET Password = ? WHERE UserID = ?', ['mockHashedPassword', 1]);
        expect(res.json).toHaveBeenCalledWith({ message: 'Password has been updated successfully' });
    });

    test('resetPassword should return 400 for invalid token', async () => {
        jwt.verify.mockImplementation(() => { throw new Error('Invalid token'); });

        const req = { body: { newPassword: 'test123', token: 'invalidToken' } };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

        await resetPassword(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    });
});
