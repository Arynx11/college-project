const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'ParkEase API',
      version: '1.0.0',
      description: `
## ParkEase Smart Parking Management System — API Documentation

This API powers the ParkEase platform, enabling:
- **Users** to register, login, find nearby parking, and manage bookings
- **Operators** to manage their parking lots and view analytics

### Authentication
Most endpoints require a **Bearer JWT token** in the Authorization header:
\`\`\`
Authorization: Bearer <your_token>
\`\`\`
You can get a token by calling **POST /api/users/login** or **POST /api/users/register**.
      `,
      contact: {
        name: 'ParkEase Team',
      },
    },
    servers: [
      {
        url: 'http://localhost:5002',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from /api/users/login',
        },
      },
      schemas: {
        // ── User ──────────────────────────────────────────────────
        UserRegister: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name:     { type: 'string', example: 'Arsh Sharma' },
            email:    { type: 'string', format: 'email', example: 'arsh@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
            role:     { type: 'string', enum: ['user', 'operator'], example: 'user' },
          },
        },
        UserLogin: {
          type: 'object',
          required: ['email', 'password', 'role'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'arsh@example.com' },
            password: { type: 'string', format: 'password', example: 'password123' },
            role:     { type: 'string', enum: ['user', 'operator'], example: 'user' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'success' },
            token:  { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                _id:   { type: 'string', example: '64abc123def456' },
                name:  { type: 'string', example: 'Arsh Sharma' },
                email: { type: 'string', example: 'arsh@example.com' },
                role:  { type: 'string', example: 'user' },
              },
            },
          },
        },
        UserProfile: {
          type: 'object',
          properties: {
            name:          { type: 'string', example: 'Arsh Sharma' },
            vehicleNumber: { type: 'string', example: 'DL01AB1234' },
            vehicleType:   { type: 'string', enum: ['car', 'bike', 'truck', 'ev'], example: 'car' },
          },
        },
        // ── Parking ───────────────────────────────────────────────
        ParkingLot: {
          type: 'object',
          required: ['name', 'type', 'totalSpots', 'pricePerHour', 'location'],
          properties: {
            name:            { type: 'string', example: 'Connaught Place Parking' },
            type:            { type: 'string', enum: ['government', 'private', 'public'], example: 'private' },
            totalSpots:      { type: 'integer', example: 50 },
            availableSpots:  { type: 'integer', example: 30 },
            pricePerHour:    { type: 'number', example: 40 },
            features:        { type: 'array', items: { type: 'string', enum: ['ev', 'covered', 'security', 'disabled', '24/7'] }, example: ['covered', 'security'] },
            location: {
              type: 'object',
              properties: {
                address:     { type: 'string', example: 'Rajiv Chowk, New Delhi 110001' },
                coordinates: { type: 'array', items: { type: 'number' }, example: [77.2195, 28.6327], description: '[longitude, latitude] — MongoDB GeoJSON format' },
              },
            },
          },
        },
        // ── Booking ───────────────────────────────────────────────
        BookingCreate: {
          type: 'object',
          required: ['parking', 'startTime', 'endTime', 'vehicleDetails'],
          properties: {
            parking:   { type: 'string', example: '64abc123def456', description: 'Parking lot _id' },
            startTime: { type: 'string', format: 'date-time', example: '2026-03-19T10:00:00.000Z' },
            endTime:   { type: 'string', format: 'date-time', example: '2026-03-19T12:00:00.000Z' },
            vehicleDetails: {
              type: 'object',
              properties: {
                number:      { type: 'string', example: 'DL01AB1234' },
                type:        { type: 'string', enum: ['car', 'bike', 'truck', 'ev'], example: 'car' },
              },
            },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            _id:        { type: 'string', example: '64abc789def012' },
            parking:    { type: 'object', description: 'Populated parking lot info' },
            startTime:  { type: 'string', format: 'date-time' },
            endTime:    { type: 'string', format: 'date-time' },
            duration:   { type: 'integer', example: 2, description: 'Duration in hours' },
            totalPrice: { type: 'number', example: 80 },
            status:     { type: 'string', enum: ['pending', 'approved', 'active', 'completed', 'cancelled', 'rejected'], example: 'pending' },
            vehicleDetails: {
              type: 'object',
              properties: {
                plateNumber:  { type: 'string', example: 'DL01AB1234' },
                vehicleType:  { type: 'string', example: 'car' },
              },
            },
          },
        },
        // ── Error ─────────────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            status:  { type: 'string', example: 'fail' },
            message: { type: 'string', example: 'Something went wrong' },
          },
        },
      },
    },
    // Apply JWT auth globally (endpoints can override)
    security: [{ bearerAuth: [] }],
    tags: [
      { name: 'Health',       description: 'Server health check' },
      { name: 'Auth',         description: 'Register, Login, Password reset' },
      { name: 'Users',        description: 'User profile management' },
      { name: 'Parking',      description: 'Browse and manage parking lots' },
      { name: 'Bookings',     description: 'Create and manage bookings' },
      { name: 'Operators',    description: 'Operator-specific endpoints' },
      { name: 'Operators',    description: 'Operator-specific endpoints' },
    ],
    paths: {
      // ═══════════════════════════════════════════════════
      // HEALTH
      // ═══════════════════════════════════════════════════
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Server health check',
          security: [],
          responses: {
            200: {
              description: 'Server is running',
              content: { 'application/json': { example: { status: 'ok', timestamp: '2026-03-19T10:00:00.000Z', environment: 'development' } } },
            },
          },
        },
      },

      // ═══════════════════════════════════════════════════
      // AUTH — /api/users
      // ═══════════════════════════════════════════════════
      '/api/users/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRegister' } } },
          },
          responses: {
            201: { description: 'User registered successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Email already registered / validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/users/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login — returns JWT token',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserLogin' } } },
          },
          responses: {
            200: { description: 'Login successful', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Incorrect credentials', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/api/users/forgot-password': {
        post: {
          tags: ['Auth'],
          summary: 'Request password reset email',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { example: { email: 'arsh@example.com' } } },
          },
          responses: {
            200: { description: 'Reset email sent (or token logged in dev mode)' },
            404: { description: 'No user with that email' },
          },
        },
      },
      '/api/users/reset-password': {
        post: {
          tags: ['Auth'],
          summary: 'Reset password using token from email',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { example: { token: '<reset_token_from_email>', password: 'newpassword123' } } },
          },
          responses: {
            200: { description: 'Password reset successful' },
            400: { description: 'Token invalid or expired' },
          },
        },
      },
      '/api/users/profile': {
        get: {
          tags: ['Users'],
          summary: 'Get current user profile',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User profile with booking history', content: { 'application/json': { example: { status: 'success', data: { user: { name: 'Arsh Sharma', email: 'arsh@example.com', role: 'user' } } } } } },
            401: { description: 'Not authenticated' },
          },
        },
        patch: {
          tags: ['Users'],
          summary: 'Update user profile (name, vehicleNumber, vehicleType)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UserProfile' } } },
          },
          responses: {
            200: { description: 'Profile updated successfully' },
            400: { description: 'Validation error' },
          },
        },
      },

      // ═══════════════════════════════════════════════════
      // PARKING — /api/parking
      // ═══════════════════════════════════════════════════
      '/api/parking': {
        get: {
          tags: ['Parking'],
          summary: 'Get all parking lots (with optional geo search)',
          security: [],
          parameters: [
            { name: 'lat', in: 'query', schema: { type: 'number' }, description: 'Latitude for geo search', example: 28.6139 },
            { name: 'lng', in: 'query', schema: { type: 'number' }, description: 'Longitude for geo search', example: 77.2090 },
            { name: 'distance', in: 'query', schema: { type: 'number' }, description: 'Radius in km (default: 5)', example: 5 },
            { name: 'sort', in: 'query', schema: { type: 'string' }, description: 'Sort field e.g. pricePerHour', example: 'pricePerHour' },
          ],
          responses: {
            200: { description: 'List of parking lots', content: { 'application/json': { example: { status: 'success', results: 3, data: { parkings: [] } } } } },
          },
        },
        post: {
          tags: ['Parking'],
          summary: 'Create a new parking lot (operator only)',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/ParkingLot' } } },
          },
          responses: {
            201: { description: 'Parking lot created' },
            403: { description: 'Only operators can create parking spaces' },
          },
        },
      },
      '/api/parking/{id}': {
        get: {
          tags: ['Parking'],
          summary: 'Get a single parking lot by ID',
          security: [],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, example: '64abc123def456' }],
          responses: {
            200: { description: 'Parking lot details' },
            404: { description: 'Not found' },
          },
        },
        put: {
          tags: ['Parking'],
          summary: 'Update a parking lot (owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/ParkingLot' } } } },
          responses: { 200: { description: 'Updated' }, 403: { description: 'Unauthorized' } },
        },
        delete: {
          tags: ['Parking'],
          summary: 'Delete a parking lot (owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'Deleted' }, 403: { description: 'Unauthorized' } },
        },
      },
      '/api/parking/{id}/availability': {
        patch: {
          tags: ['Parking'],
          summary: 'Update available spots count (owner only)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: { content: { 'application/json': { example: { availableSpots: 25 } } } },
          responses: { 200: { description: 'Availability updated' } },
        },
      },

      // ═══════════════════════════════════════════════════
      // BOOKINGS — /api/bookings
      // ═══════════════════════════════════════════════════
      '/api/bookings': {
        post: {
          tags: ['Bookings'],
          summary: 'Create a new booking',
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/BookingCreate' } } },
          },
          responses: {
            201: { description: 'Booking created with status: pending', content: { 'application/json': { schema: { $ref: '#/components/schemas/Booking' } } } },
            400: { description: 'No available spots / validation error' },
            404: { description: 'Parking not found' },
          },
        },
      },
      '/api/bookings/user': {
        get: {
          tags: ['Bookings'],
          summary: 'Get all bookings for the logged-in user',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'User bookings list', content: { 'application/json': { example: { status: 'success', results: 2, data: { bookings: [] } } } } },
          },
        },
      },
      '/api/bookings/operator': {
        get: {
          tags: ['Bookings'],
          summary: 'Get all bookings for the logged-in operator\'s parking lots',
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: 'Operator bookings list' },
          },
        },
      },
      '/api/bookings/{id}/cancel': {
        patch: {
          tags: ['Bookings'],
          summary: 'Cancel a booking (user cancels their own booking)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'Booking ID' }],
          responses: {
            200: { description: 'Booking cancelled' },
            403: { description: 'Not your booking' },
            404: { description: 'Booking not found' },
          },
        },
      },
      '/api/bookings/{id}': {
        patch: {
          tags: ['Bookings'],
          summary: 'Update booking status (operator approves/rejects/completes)',
          security: [{ bearerAuth: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                example: { status: 'approved', comment: 'Welcome to our parking!' },
                schema: {
                  type: 'object',
                  properties: {
                    status:  { type: 'string', enum: ['approved', 'rejected', 'active', 'completed', 'cancelled'] },
                    comment: { type: 'string', example: 'Booking approved' },
                  },
                },
              },
            },
          },
          responses: {
            200: { description: 'Status updated. Sends email on approval.' },
            403: { description: 'You do not own this parking lot' },
          },
        },
      },

      // ═══════════════════════════════════════════════════
      // OPERATORS — /api/operators
      // ═══════════════════════════════════════════════════
      '/api/operators/register': {
        post: {
          tags: ['Operators'],
          summary: 'Register as an operator',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UserRegister' } } } },
          responses: { 201: { description: 'Operator registered' } },
        },
      },
      '/api/operators/login': {
        post: {
          tags: ['Operators'],
          summary: 'Operator login',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/UserLogin' } } } },
          responses: { 200: { description: 'Operator login successful' } },
        },
      },
      '/api/operators/profile': {
        get: {
          tags: ['Operators'],
          summary: 'Get operator profile',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Operator profile' } },
        },
        patch: {
          tags: ['Operators'],
          summary: 'Update operator profile',
          security: [{ bearerAuth: [] }],
          requestBody: { content: { 'application/json': { example: { name: 'New Name', phone: '9999999999' } } } },
          responses: { 200: { description: 'Profile updated' } },
        },
      },
      '/api/operators/lots': {
        get: {
          tags: ['Operators'],
          summary: 'Get all parking lots owned by this operator',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'List of operator lots' } },
        },
      },
      '/api/operators/bookings': {
        get: {
          tags: ['Operators'],
          summary: 'Get bookings for this operator\'s lots',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Operator bookings' } },
        },
      },
      '/api/operators/analytics': {
        get: {
          tags: ['Operators'],
          summary: 'Get analytics for this operator (revenue, occupancy, etc.)',
          security: [{ bearerAuth: [] }],
          responses: { 200: { description: 'Analytics data' } },
        },
      },

    },
  },
  apis: [], // using inline definition above — no JSDoc scanning needed
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
