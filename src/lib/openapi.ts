export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'HBMS Hotel Booking API',
    version: '1.0.0',
    description:
      'Swagger UI for the hotel-booking backend. The application uses Next.js Server Actions with Supabase as the backend, so the documented business operations map to server actions unless a real HTTP route is explicitly noted.',
  },
  servers: [
    {
      url: '/',
      description: 'Current Next.js application',
    },
  ],
  tags: [
    { name: 'Documentation', description: 'OpenAPI and Swagger UI endpoints' },
    { name: 'Auth', description: 'Supabase authentication flows' },
    { name: 'Bookings', description: 'Customer booking and admin lifecycle actions' },
    { name: 'Rooms', description: 'Room catalog and admin room management' },
    { name: 'Room Types', description: 'Admin room type management' },
    { name: 'Services', description: 'Admin add-on service management' },
    { name: 'Reviews', description: 'Customer reviews and moderation' },
    { name: 'Profiles', description: 'Customer profile and avatar actions' },
  ],
  paths: {
    '/api/openapi': {
      get: {
        tags: ['Documentation'],
        summary: 'Get OpenAPI document',
        description: 'Returns the OpenAPI JSON document used by Swagger UI.',
        responses: {
          '200': {
            description: 'OpenAPI document',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                },
              },
            },
          },
        },
      },
    },
    '/api-docs': {
      get: {
        tags: ['Documentation'],
        summary: 'Swagger UI',
        description: 'Interactive Swagger UI page for the backend documentation.',
        responses: {
          '200': {
            description: 'Swagger UI HTML page',
            content: {
              'text/html': {
                schema: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
    '/auth/callback': {
      get: {
        tags: ['Auth'],
        summary: 'Supabase auth callback',
        description: 'Real Next.js route handler used by email OTP and OAuth login callbacks.',
        parameters: [
          {
            name: 'code',
            in: 'query',
            required: false,
            schema: { type: 'string' },
            description: 'Supabase authorization code.',
          },
          {
            name: 'next',
            in: 'query',
            required: false,
            schema: { type: 'string', default: '/' },
            description: 'Relative URL to redirect to after exchanging the code.',
          },
        ],
        responses: {
          '307': {
            description: 'Redirects to the target page after processing the callback.',
          },
        },
      },
    },
    '/server-actions/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login with email and password',
        description: 'Implemented by src/server/actions/auth.ts: login.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Authenticated session is created by Supabase.' },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register customer account',
        description: 'Implemented by src/server/actions/auth.ts: register.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RegisterInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Account is registered and profile trigger creates profile data.' },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/bookings': {
      post: {
        tags: ['Bookings'],
        summary: 'Create booking',
        description:
          'Implemented by src/server/actions/bookings.ts: createBooking. Uses the Supabase RPC create_booking_transaction.',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/CreateBookingInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Booking is created and user is redirected to the success page.' },
          '401': { $ref: '#/components/responses/Unauthorized' },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/bookings/check-availability': {
      post: {
        tags: ['Bookings'],
        summary: 'Check room availability',
        description:
          'Implemented by src/server/actions/bookings.ts: checkRoomAvailability. Uses the Supabase RPC check_room_availability.',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AvailabilityInput' },
            },
          },
        },
        responses: {
          '200': {
            description: 'Availability result',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AvailabilityResult' },
              },
            },
          },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/bookings/{bookingId}/cancel': {
      post: {
        tags: ['Bookings'],
        summary: 'Cancel customer booking',
        description: 'Implemented by src/server/actions/bookings.ts: cancelBooking.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/BookingId' }],
        responses: {
          '200': { $ref: '#/components/responses/ActionResult' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/admin/bookings/{bookingId}/confirm': {
      post: {
        tags: ['Bookings'],
        summary: 'Confirm booking',
        description: 'Implemented by src/server/actions/bookings.ts: confirmBooking.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/BookingId' }],
        responses: {
          '200': { $ref: '#/components/responses/ActionResult' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/admin/bookings/{bookingId}/check-in': {
      post: {
        tags: ['Bookings'],
        summary: 'Check in booking',
        description: 'Implemented by src/server/actions/bookings.ts: checkInBooking.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/BookingId' }],
        responses: {
          '200': { $ref: '#/components/responses/ActionResult' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/admin/bookings/{bookingId}/check-out': {
      post: {
        tags: ['Bookings'],
        summary: 'Check out booking',
        description: 'Implemented by src/server/actions/bookings.ts: checkOutBooking.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/BookingId' }],
        responses: {
          '200': { $ref: '#/components/responses/ActionResult' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/admin/rooms': {
      post: {
        tags: ['Rooms'],
        summary: 'Create room',
        description: 'Implemented by src/server/actions/rooms.ts: createRoom.',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RoomInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Room is created.' },
          '403': { $ref: '#/components/responses/Forbidden' },
          '400': { $ref: '#/components/responses/ValidationError' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/admin/rooms/{roomId}': {
      put: {
        tags: ['Rooms'],
        summary: 'Update room',
        description: 'Implemented by src/server/actions/rooms.ts: updateRoom.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/RoomId' }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RoomInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Room is updated.' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
        'x-next-implementation': 'server-action',
      },
      delete: {
        tags: ['Rooms'],
        summary: 'Delete room',
        description: 'Implemented by src/server/actions/rooms.ts: deleteRoom.',
        security: [{ cookieAuth: [] }],
        parameters: [{ $ref: '#/components/parameters/RoomId' }],
        responses: {
          '200': { description: 'Room is deleted.' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/admin/room-types': {
      post: {
        tags: ['Room Types'],
        summary: 'Create room type',
        description: 'Implemented by src/server/actions/room-types.ts: createRoomType.',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/RoomTypeInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Room type is created.' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/admin/services': {
      post: {
        tags: ['Services'],
        summary: 'Create add-on service',
        description: 'Implemented by src/server/actions/services.ts: createService.',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ServiceInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Service is created.' },
          '403': { $ref: '#/components/responses/Forbidden' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/reviews': {
      post: {
        tags: ['Reviews'],
        summary: 'Create review',
        description: 'Implemented by src/server/actions/reviews.ts: createReview.',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ReviewInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Review is created.' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
        'x-next-implementation': 'server-action',
      },
    },
    '/server-actions/profile': {
      put: {
        tags: ['Profiles'],
        summary: 'Update profile',
        description: 'Implemented by src/server/actions/profile.ts: updateProfile.',
        security: [{ cookieAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ProfileInput' },
            },
          },
        },
        responses: {
          '200': { description: 'Profile is updated.' },
          '401': { $ref: '#/components/responses/Unauthorized' },
        },
        'x-next-implementation': 'server-action',
      },
    },
  },
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'sb-auth-token',
        description: 'Supabase auth cookies managed by @supabase/ssr.',
      },
    },
    parameters: {
      BookingId: {
        name: 'bookingId',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
      },
      RoomId: {
        name: 'roomId',
        in: 'path',
        required: true,
        schema: { type: 'string', format: 'uuid' },
      },
    },
    responses: {
      ActionResult: {
        description: 'Server action result',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ActionResult' },
          },
        },
      },
      ValidationError: {
        description: 'Validation error',
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/ValidationError' },
          },
        },
      },
      Unauthorized: {
        description: 'User must be authenticated.',
      },
      Forbidden: {
        description: 'Admin role is required.',
      },
    },
    schemas: {
      ActionResult: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          error: { type: 'string', example: 'Action failed' },
        },
      },
      ValidationError: {
        type: 'object',
        properties: {
          errors: {
            type: 'object',
            additionalProperties: {
              type: 'array',
              items: { type: 'string' },
            },
          },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email', example: 'customer@example.com' },
          password: { type: 'string', format: 'password', example: 'password123' },
          redirect: { type: 'string', example: '/' },
        },
      },
      RegisterInput: {
        type: 'object',
        required: ['full_name', 'email', 'password', 'confirm_password'],
        properties: {
          full_name: { type: 'string', example: 'Nguyen Van A' },
          email: { type: 'string', format: 'email', example: 'customer@example.com' },
          password: { type: 'string', format: 'password', example: 'password123' },
          confirm_password: { type: 'string', format: 'password', example: 'password123' },
        },
      },
      CreateBookingInput: {
        type: 'object',
        required: ['room_id', 'check_in', 'check_out', 'guests'],
        properties: {
          room_id: { type: 'string', format: 'uuid' },
          check_in: { type: 'string', format: 'date', example: '2026-06-01' },
          check_out: { type: 'string', format: 'date', example: '2026-06-03' },
          guests: { type: 'integer', minimum: 1, example: 2 },
          special_requests: { type: 'string', example: 'Late check-in' },
          services: {
            type: 'array',
            items: { type: 'string', format: 'uuid' },
          },
        },
      },
      AvailabilityInput: {
        type: 'object',
        required: ['roomId', 'checkIn', 'checkOut'],
        properties: {
          roomId: { type: 'string', format: 'uuid' },
          checkIn: { type: 'string', format: 'date' },
          checkOut: { type: 'string', format: 'date' },
        },
      },
      AvailabilityResult: {
        type: 'object',
        properties: {
          available: { type: 'boolean', example: true },
          error: { type: 'string' },
        },
      },
      RoomInput: {
        type: 'object',
        required: ['room_number', 'room_type_id', 'status'],
        properties: {
          room_number: { type: 'string', example: 'A101' },
          room_type_id: { type: 'string', format: 'uuid' },
          floor: { type: 'integer', example: 1 },
          description: { type: 'string' },
          status: {
            type: 'string',
            enum: ['available', 'occupied', 'maintenance', 'cleaning'],
          },
          images: {
            type: 'array',
            items: { type: 'string', format: 'uri' },
          },
        },
      },
      RoomTypeInput: {
        type: 'object',
        required: ['name', 'base_price', 'capacity'],
        properties: {
          name: { type: 'string', example: 'Deluxe' },
          description: { type: 'string' },
          base_price: { type: 'number', example: 1500000 },
          capacity: { type: 'integer', example: 2 },
          amenities: {
            type: 'array',
            items: { type: 'string' },
          },
        },
      },
      ServiceInput: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
          name: { type: 'string', example: 'Airport pickup' },
          description: { type: 'string' },
          price: { type: 'number', example: 300000 },
          is_active: { type: 'boolean', example: true },
        },
      },
      ReviewInput: {
        type: 'object',
        required: ['booking_id', 'rating'],
        properties: {
          booking_id: { type: 'string', format: 'uuid' },
          rating: { type: 'integer', minimum: 1, maximum: 5 },
          comment: { type: 'string' },
        },
      },
      ProfileInput: {
        type: 'object',
        properties: {
          full_name: { type: 'string', example: 'Nguyen Van A' },
          phone: { type: 'string', example: '0900000000' },
          address: { type: 'string' },
          avatar_url: { type: 'string', format: 'uri' },
        },
      },
    },
  },
} as const
