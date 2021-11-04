import { Module } from '@nestjs/common';
import { AppLogger } from './app-logger.service';
import { configure, getLogger } from 'log4js';

// process.env.APP_ENV
// 'local', 'test', 'dev', 'prd', 'stg'
const config = {
  appenders: {
    console: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern: '[%d{yyyy/MM/dd hh.mm.ss.SSS}]%[%5p%] %m',
      },
    },
    cloudwatch: {
      type: 'stdout',
      layout: {
        type: 'pattern',
        pattern:
          '{"log_level":"%p", "env":%X{e}, "timestamp":%X{t}, "release_version":%X{v}, "path":%X{p}, "method":%X{m}, "message":"%m", "user":%X{u}, "extra":%X{ex}, "hostname":%X{host}, "service_name":%X{sv}}',
      },
    },
  },
  categories: {
    default: {
      appenders: ['cloudwatch'],
      level: 'INFO',
    },
    local: {
      appenders: ['console', 'cloudwatch'],
      level: 'DEBUG',
    },
    dev: {
      appenders: ['cloudwatch'],
      level: 'DEBUG',
    },
    test: {
      appenders: ['cloudwatch'],
      level: 'DEBUG',
    },
    stg: {
      appenders: ['cloudwatch'],
      level: 'INFO',
    },
    prd: {
      appenders: ['cloudwatch'],
      level: 'INFO',
    },
    codebuild: {
      appenders: ['console'],
      level: 'WARN',
    },
  },
};

const loggerFactory = {
  provide: AppLogger,
  useFactory: () => {
    configure(config);
    return new AppLogger(getLogger(process.env.APP_ENV));
  },
};

@Module({
  providers: [loggerFactory],
  exports: [loggerFactory],
})
export class AppLoggerModule {}
