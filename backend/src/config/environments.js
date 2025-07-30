import dotenv from 'dotenv';

dotenv.config();

export default {
    port: process.env.PORT || 3000,
    database: {
        connectionString: process.env.CONNECTION_STRING
    }
};