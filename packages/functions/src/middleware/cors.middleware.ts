import { addHTTPMiddleware } from '@pikku/core/http'
import { cors } from '@pikku/core/middleware'

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
      .map((origin) => origin.trim())
      .filter(Boolean)
  : [process.env.FRONTEND_URL, 'http://localhost:7104', 'http://127.0.0.1:7104'].filter(
      (origin): origin is string => Boolean(origin),
    )

addHTTPMiddleware('*', [
  cors({
    origin: corsOrigins,
    credentials: true,
    headers: ['Content-Type', 'Authorization', 'X-Auth-Return-Redirect'],
  }),
])
