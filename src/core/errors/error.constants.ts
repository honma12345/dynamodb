import { HttpStatus } from '@nestjs/common';
import { getLogger } from 'log4js';
import { AppLogger } from '../logger/app-logger.service';

export const ERROR_PARAMETER_FAILED = 'ParameterFailed';
export const ERROR_ALREADY_EXISTS = 'AlreadyExists';
export const ERROR_NOT_FOUND = 'NotExists';
export const FORBIDDEN = 'Forbidden';
export const ERROR_UNAUTHORIZED = 'Unauthorized';
export const ERROR_INTERNAL_SERVER_ERROR = 'ServerError';
export const ERROR_SERVICE_UNAVAILABLE = 'Unavailable';
export const ERROR_GATEWAY_TIMEOUT = 'Timeout';


export const ERRORS: { [s: string]: { type: string; code: number } } = {
  AlreadyExists: {
    type: ERROR_ALREADY_EXISTS,
    code: HttpStatus.BAD_REQUEST,
  },
  ParameterFailed: {
    type: ERROR_PARAMETER_FAILED,
    code: HttpStatus.BAD_REQUEST,
  },
  NotExists: {
    type: ERROR_NOT_FOUND,
    code: HttpStatus.NOT_FOUND,
  },
  Unauthorized: {
    type: ERROR_UNAUTHORIZED,
    code: HttpStatus.UNAUTHORIZED,
  },
  ServerError: {
    type: ERROR_INTERNAL_SERVER_ERROR,
    code: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  Unavailable: {
    type: ERROR_SERVICE_UNAVAILABLE,
    code: HttpStatus.SERVICE_UNAVAILABLE,
  },
  Timeout: {
    type: ERROR_GATEWAY_TIMEOUT,
    code: HttpStatus.GATEWAY_TIMEOUT,
  },
};
interface LogContextExtraParams {
  path?: any;
  query?: any;
  body?: any;
}

interface LogContextExtra {
  params?: LogContextExtraParams;
  topic?: string;
  message?: any;
  response?: any;
}
interface LogContexts {
  timestamp?: number;
  message?: string;
  method?: string;
  path?: string;
  user?: any;
  extra?: LogContextExtra;
}
export class APIBaseError extends Error {
  code: number;
  type: string;
  message: string;

  constructor(message, code, type) {
    super(message);
    this.code = code;
    this.type = type;
  }
}
export class APIError {
  message: string;
  constructor(message) {
    this.message = message;
  }

  handle(req, e?) {
    const context: LogContexts = {
      user: req && req.user ? req.user : null,
      method: req && req.method ? `"${req.method}"` : null,
      message: this.message,
      path: req && req.url ? `"${req.url}"` : null,
      extra: {
        params: {
          body: req && req.body ? req.body : null,
          path: req && req.params ? req.params : null,
          query: req && req.query ? req.query : null,
        },
        message: e ? e : null,
      },
    };
    const logger = new AppLogger(getLogger(process.env.APP_ENV));
    if (ERRORS[this.message]) {
      context.extra.response = {
        data: {},
        error: {
          code: ERRORS[this.message].type,
          message: this.message,
        },
        status: false,
      };
      logger.warn(this.message, null, null, context);
      return new APIBaseError(this.message, ERRORS[this.message].code, ERRORS[this.message].type);
    } else {
      logger.fatal(this.message, null, null, context);
      const message = ERROR_INTERNAL_SERVER_ERROR;
      return new APIBaseError(message, ERRORS[message].code, ERRORS[message].type);
    }
  }
}
