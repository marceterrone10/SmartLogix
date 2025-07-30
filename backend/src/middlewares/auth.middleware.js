import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access token is missing'
        });
    };

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch ( error ) {
        console.error('Error during authentication:', error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
};

export const checkRole = (roles) => {
    return (req, res, next) => {
        const { role } = req.user;

        if (!roles.includes(role)) {
            return res.status(403).json({
                message: 'Forbidden: You do not have permission to access this resource'
            });
        }
        next();
    };
};