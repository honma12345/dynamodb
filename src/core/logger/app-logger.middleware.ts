import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from './app-logger.service';

@Injectable()
export class AppLoggerMiddleware implements NestMiddleware {
  constructor(private logger: AppLogger){}
  use(req: Request, res: Response, next: () => void) {
    this.logger.setRequest(req);
    next();
  }
}
