import mongoose from 'mongoose';

export const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'tecnico', 'cliente'],
        default: 'cliente'
    }
}, {
    timestamps: true,
});

export default mongoose.model('User', userSchema);
