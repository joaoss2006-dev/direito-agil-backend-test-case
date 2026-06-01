import { Injectable, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestMetricsMiddleware implements NestMiddleware {
  use(request: Request, response: Response, next: NextFunction): void {
    const startedAt = Date.now();

    let requestId = request.headers['x-request-id'] as string;
    if(!requestId) requestId = randomUUID();

    response.setHeader('x-request-id', requestId);

    response.on('finish', () => {
      const elapsedMs = Date.now() - startedAt;
      console.log(
        `[${requestId}] ${request.method} ${request.originalUrl} ${response.statusCode} - ${elapsedMs}ms`,
      );
    }
    );

    next();
  }
}
