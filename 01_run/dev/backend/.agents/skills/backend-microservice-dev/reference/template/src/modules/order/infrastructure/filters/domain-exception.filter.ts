import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { DomainException } from '../../domain/exceptions/domain.exception';

interface StandardErrorBody {
  statusCode: number;
  errorCode: string;
  message: string;
  timestamp: string;
  path: string;
}

/**
 * Filtro global que intercepta CUALQUIER excepción de dominio (que
 * extienda `DomainException`, lanzada por la entidad, la máquina de
 * estados o los handlers de aplicación) y la traduce a una respuesta
 * HTTP semántica y estandarizada.
 *
 * Se registra a nivel de aplicación (ver order.module.ts / main.ts) para
 * que ningún controlador necesite try/catch.
 */
@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(DomainExceptionFilter.name);

  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const statusCode = exception.httpStatusHint;

    const body: StandardErrorBody = {
      statusCode,
      errorCode: exception.errorCode,
      message: exception.message,
      timestamp: new Date().toISOString(),
      path: request.url,
    };

    this.logger.warn(
      `[${exception.errorCode}] ${exception.message} (${request.method} ${request.url})`,
    );

    response.status(statusCode).json(body);
  }
}
