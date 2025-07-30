import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/user.model.js';
import dotenv from 'dotenv';
dotenv.config();


export const register = async (req, res) => {
    const { email, password, role } = req.body 

    try {
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        };

        const hash = await bcrypt.hash(password, 10);
        const newUser = new User({
            email,
            password: hash,
            role: role || 'clienteS'
        });

        await newUser.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                email: newUser.email,
                role: newUser.role
            }
        });

    } catch (error) {
        console.error('Error during registration:', error);
        return res.status(500).json(
            { message: 'Internal server error' }
        );
    }
};


export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        };

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid email or password'
            });
        };

        const token = jwt.sign(
            {  
                id: user._id, 
                email: user.email,
                role: user.role 
            },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token: token
        });
        
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json(
            { message: 'Internal server error' }
        );
    }
};
