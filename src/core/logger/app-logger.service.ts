import { LoggerService, Injectable, Scope } from '@nestjs/common';
import { Logger } from 'log4js';
import { Request } from 'express';
interface LogContextExtraParams {
  path?: string;
  query?: string;
  body?: string;
}

interface LogContextExtra {
  params?: LogContextExtraParams;
  topic?: string;
  message?: any;
  response?: any;
}
interface LogContexts {
  benchmark?: boolean;
  timestamp?: number;
  method?: string;
  path?: string;
  user?: any;
  extra?: LogContextExtra;
}
@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  constructor(private readonly logger: Logger) { }

  setRequest(req: Request) {
    const date = new Date();
    this.logger.addContext('t', date.getTime());
    this.logger.addContext('m', `"${req.method}"`);
    this.logger.addContext('p', `"${req.url}"`);
    this.logger.addContext('v', process.env.RELEASE_VERSION ? `"${process.env.RELEASE_VERSION}"` : '"1.0"');
  }
  log(message: any) {
    console.log('log: ', message);
  }
  info(message: any, req?, extra?) {
    this.setOptions(req, extra);
    this.logger.info(message);
  }
  bencmark(message: any, req?, extra?, context?: LogContexts) {
    this.setOptions(req, extra);
    if (context) {
      this.setContexts(Object.assign(context, { bencmark: true }));
    }
    this.logger.info(message);
  }
  fatal(message: any, req?, extra?, context?: LogContexts) {
    this.setOptions(req, extra);
    if (context) {
      this.setContexts(context);
    }
    this.logger.fatal(message);
  }
  error(message: any, req?, extra?, context?: LogContexts) {
    this.setOptions(req, extra);
    if (context) {
      this.setContexts(context);
    }
    this.logger.error(message);
  }
  warn(message: any, req?, extra?, context?: LogContexts) {
    this.setOptions(req, extra);
    if (context) {
      this.setContexts(context);
    }
    this.logger.warn(message);
  }
  debug?(message: any, req?, extra?) {
    this.setOptions(req, extra);
    this.logger.debug(message);
  }

  private setOptions(req, extra) {
    this.logger.addContext('u', req && req.user ? JSON.stringify(req.user) : null);
    this.logger.addContext('ex', extra ? JSON.stringify(extra) : null);
    this.logger.addContext('host', `"${[process.env.APP_ENV, 'dynamodb'].join('.')}"`);
    this.logger.addContext('sv', '"dynamodb"');
    this.logger.addContext('v', process.env.RELEASE_VERSION ? `"${process.env.RELEASE_VERSION}"` : '"1.0"');
    this.logger.addContext('e', `"${process.env.APP_ENV}"`);
  }

  private setContexts(context: LogContexts) {
    const date = new Date();
    this.logger.addContext('t', date.getTime());
    this.logger.addContext('u', context.user ? JSON.stringify(context.user) : null);
    this.logger.addContext('m', context.method || '"ANY"');
    this.logger.addContext('p', context.path || null);
    this.logger.addContext('ex', context.extra ? JSON.stringify(context.extra) : null);
  }
}
