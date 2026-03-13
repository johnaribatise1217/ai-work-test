import { ExceptionFilter, Catch, ArgumentsHost, ConflictException } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Request, Response } from 'express';

@Catch(QueryFailedError)
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError & { code?: string }, host: ArgumentsHost) {

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // PostgreSQL duplicate key error
    if (exception.code === '23505') {
      const conflict = new ConflictException('Resource already exists');

      return response.status(conflict.getStatus()).json({
        statusCode: conflict.getStatus(),
        timestamp: new Date().toISOString(),
        path: request.url,
        message: conflict.message,
      });
    }

    if (exception.code === '23502') {
      const conflict = new ConflictException('Required field missing');
      return response.status(400).json({
        statusCode: 400,
        timestamp: new Date().toISOString(),
        path: request.url,
        message: conflict.message,
      });
    }

    return response.status(500).json({
      statusCode: 500,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'Database error',
    });
  }
}