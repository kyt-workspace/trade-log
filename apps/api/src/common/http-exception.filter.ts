import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger
} from "@nestjs/common";
import { Request, Response } from "express";

interface StandardErrorBody {
  error: string;
  code: string;
  statusCode: number;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body = this.toStandardError(exception);

    if (body.statusCode >= 500) {
      this.logger.error(
        `${request.method} ${request.url} -> ${body.statusCode} ${body.code}`
      );
    }

    response.status(body.statusCode).json(body);
  }

  private toStandardError(exception: unknown): StandardErrorBody {
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const raw = exception.getResponse();
      const { message, code } = this.extractMessageAndCode(raw, status);
      return { error: message, code, statusCode: status };
    }

    return {
      error: "Internal server error",
      code: "INTERNAL_ERROR",
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR
    };
  }

  private extractMessageAndCode(
    raw: string | object,
    status: number
  ): { message: string; code: string } {
    const fallbackCode = this.statusToCode(status);

    if (typeof raw === "string") {
      return { message: raw, code: fallbackCode };
    }

    const record = raw as Record<string, unknown>;
    const rawMessage = record["message"];
    const message = Array.isArray(rawMessage)
      ? rawMessage.join("; ")
      : typeof rawMessage === "string"
        ? rawMessage
        : this.statusToMessage(status);
    const code =
      typeof record["code"] === "string"
        ? (record["code"] as string)
        : fallbackCode;

    return { message, code };
  }

  private statusToCode(status: number): string {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return "BAD_REQUEST";
      case HttpStatus.UNAUTHORIZED:
        return "UNAUTHORIZED";
      case HttpStatus.FORBIDDEN:
        return "FORBIDDEN";
      case HttpStatus.NOT_FOUND:
        return "NOT_FOUND";
      case HttpStatus.CONFLICT:
        return "CONFLICT";
      case HttpStatus.UNPROCESSABLE_ENTITY:
        return "UNPROCESSABLE_ENTITY";
      default:
        return "INTERNAL_ERROR";
    }
  }

  private statusToMessage(status: number): string {
    return status >= 500 ? "Internal server error" : "Request failed";
  }
}
