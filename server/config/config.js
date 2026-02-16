/**
 * Server Configuration File
 * Centralizes all configuration values for the server application
 */

require('dotenv').config();

const config = {
    // Server settings
    server: {
        port: process.env.PORT || 5002,
        env: process.env.NODE_ENV || 'development',
        apiPrefix: '/api'
    },

    // Database settings
    database: {
        uri: process.env.MONGODB_URI,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }
    },

    // Authentication settings
    auth: {
        jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
        jwtExpiresIn: process.env.JWT_EXPIRES_IN || '90d',
        saltRounds: 12
    },

    // CORS settings
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true
    },

    // Email settings
    email: {
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === 'false',
        user: process.env.EMAIL_USER || 'alice.bogisich@ethereal.email',
        password: process.env.EMAIL_PASSWORD || 'BCrSeusJkmytUnAwzn',
        from: process.env.EMAIL_FROM || 'ParkEase <alice.doe@ethereal.email'
    },

    // Logging settings
    logging: {
        level: process.env.LOG_LEVEL || 'info'
    }
};

module.exports = config;