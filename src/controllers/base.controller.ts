import { Response } from 'express';

import { Controller } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { AppLogger } from '../core/logger/app-logger.service';
import { getLogger } from 'log4js';
import { APIBaseError } from '../core/errors/error.constants';
import * as moment from 'moment';
export class RestApiError {
  @ApiProperty()
  code: string;
  @ApiProperty()
  message: string[];
}
export class RestApiErrorResponse {
  @ApiProperty()
  data: any;
  @ApiProperty()
  error: RestApiError;
  @ApiProperty({
    example: false,
  })
  status: boolean;
}
@Controller('base')
export class BaseController {
  logger = new AppLogger(getLogger(process.env.APP_ENV));

  response(results, res: Response) {
    if (results instanceof APIBaseError) {
      return res.status(results.code).json(this.generateError(results));
    }
    return res.status(200).json(results);
  }

  genarateMoment(): string {
    return moment().add(9, 'hour').format('YYYY-MM-DD HH:mm:ss');
  }

  private generateError(results): RestApiErrorResponse {
    return {
      data: {},
      error: {
        code: results.type,
        message: [results.message],
      },
      status: false,
    };
  }


}

export class APIInterface {
  fetchItem?(req: any, res: Response, params: any): any;
  deleteItem?(req: any, res: Response, params: any): any;
}

