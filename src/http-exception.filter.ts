import { Response } from 'express';
import { getLogger } from 'log4js';

import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';

import {
  ERROR_PARAMETER_FAILED,
  ERROR_UNAUTHORIZED,
  ERROR_INTERNAL_SERVER_ERROR,
  ERROR_NOT_FOUND,
  ERROR_SERVICE_UNAVAILABLE,
  ERROR_GATEWAY_TIMEOUT,
} from './core/errors/error.constants';
import { AppLogger } from './core/logger/app-logger.service';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const logger = new AppLogger(getLogger(process.env.APP_ENV));
    const errorResponse = {
      data: {},
      error: {
        code: ERROR_PARAMETER_FAILED,
        message: ['Unknown error.'],
      },
      status: false,
    };

    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status;
    try {
      status = exception.getStatus();
    } catch (e) {
      status = HttpStatus.INTERNAL_SERVER_ERROR;
      errorResponse.error.code = ERROR_INTERNAL_SERVER_ERROR;
      const arg = host.getArgByIndex(0);
      logger.fatal('API ERROR', null, null, {
        path: `"${arg.url}"` || null,
        method: `"${arg.method}"` || null,
        user: arg.user || null,
        extra: {
          message: exception.message,
          params: {
            path: arg.params || null,
            query: arg.query || null,
            body: arg.body || null,
          },
          // message: exception.stack,
          response: errorResponse,
        },
      });
      response.status(status).json(errorResponse);
      return;
    }

    let args: any;
    switch (exception.getStatus()) {
      case HttpStatus.UNAUTHORIZED:
        errorResponse.error.code = ERROR_UNAUTHORIZED;
        errorResponse.error.message = ['Unauthorized'];
        args = host.getArgByIndex(0);
        logger.warn('API ERROR', null, null, {
          path: `"${args.url}"` || null,
          method: `"${args.method}"` || null,
          user: args.user || null,
          extra: {
            params: {
              path: args.params || null,
              query: args.query || null,
              body: args.body || null,
            },
            message: exception.message,
            response: errorResponse,
          },
        });
        response.status(status).json({
          data: {},
          error: {
            code: ERROR_UNAUTHORIZED,
            message: ['Unauthorized'],
          },
          status: false,
        });
        return;
      case HttpStatus.BAD_REQUEST:
        errorResponse.error.code = ERROR_PARAMETER_FAILED;
        errorResponse.error.message = ['ParameterFailed'];
        args = host.getArgByIndex(0);
        logger.warn('API ERROR', null, null, {
          path: `"${args.url}"` || null,
          method: `"${args.method}"` || null,
          user: args.user || null,
          extra: {
            params: {
              path: args.params || null,
              query: args.query || null,
              body: args.body || null,
            },
            message: exception.message,
            response: errorResponse,
          },
        });
        response.status(status).json({
          data: {},
          error: {
            code: ERROR_PARAMETER_FAILED,
            message: ['ParameterFailed'],
          },
          status: false,
        });
        return;
      case HttpStatus.NOT_FOUND:
        errorResponse.error.code = ERROR_NOT_FOUND;
        errorResponse.error.message = ['NotExists'];
        args = host.getArgByIndex(0);
        logger.warn('API ERROR', null, null, {
          path: `"${args.url}"` || null,
          method: `"${args.method}"` || null,
          user: args.user || null,
          extra: {
            params: {
              path: args.params || null,
              query: args.query || null,
              body: args.body || null,
            },
            message: exception.message,
            response: errorResponse,
          },
        });
        response.status(status).json({
          data: {},
          error: {
            code: ERROR_NOT_FOUND,
            message: ['NotExists'],
          },
          status: false,
        });
        return;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        errorResponse.error.code = ERROR_INTERNAL_SERVER_ERROR;
        errorResponse.error.message = ['ServerError'];
        args = host.getArgByIndex(0);
        logger.warn('API ERROR', null, null, {
          path: `"${args.url}"` || null,
          method: `"${args.method}"` || null,
          user: args.user || null,
          extra: {
            params: {
              path: args.params || null,
              query: args.query || null,
              body: args.body || null,
            },
            message: exception.message,
            response: errorResponse,
          },
        });
        response.status(status).json({
          data: {},
          error: {
            code: ERROR_INTERNAL_SERVER_ERROR,
            message: ['ServerError'],
          },
          status: false,
        });
        return;
      case HttpStatus.SERVICE_UNAVAILABLE:
        errorResponse.error.code = ERROR_SERVICE_UNAVAILABLE;
        errorResponse.error.message = ['Unavailable'];
        args = host.getArgByIndex(0);
        logger.warn('API ERROR', null, null, {
          path: `"${args.url}"` || null,
          method: `"${args.method}"` || null,
          user: args.user || null,
          extra: {
            params: {
              path: args.params || null,
              query: args.query || null,
              body: args.body || null,
            },
            message: exception.message,
            response: errorResponse,
          },
        });
        response.status(status).json({
          data: {},
          error: {
            code: ERROR_SERVICE_UNAVAILABLE,
            message: ['Unavailable'],
          },
          status: false,
        });
        return;
      case HttpStatus.GATEWAY_TIMEOUT:
        errorResponse.error.code = ERROR_GATEWAY_TIMEOUT;
        errorResponse.error.message = ['Timeout'];
        args = host.getArgByIndex(0);
        logger.warn('API ERROR', null, null, {
          path: `"${args.url}"` || null,
          method: `"${args.method}"` || null,
          user: args.user || null,
          extra: {
            params: {
              path: args.params || null,
              query: args.query || null,
              body: args.body || null,
            },
            message: exception.message,
            response: errorResponse,
          },
        });
        response.status(status).json({
          data: {},
          error: {
            code: ERROR_GATEWAY_TIMEOUT,
            message: ['Timeout'],
          },
          status: false,
        });
        return;
    }
    const res = exception.getResponse();
    if (typeof res === 'object') {
      if ('message' in res) {
        errorResponse.error.message = res['message'];
      }
    }

    const arg = host.getArgByIndex(0);
    logger.warn('API ERROR', null, null, {
      path: `"${arg.url}"` || null,
      method: `"${arg.method}"` || null,
      user: arg.user || null,
      extra: {
        params: {
          path: arg.params || null,
          query: arg.query || null,
          body: arg.body || null,
        },
        // message: exception.stack,
        response: errorResponse,
      },
    });
    response.status(status).json(errorResponse);
  }
}
