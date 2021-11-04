import { Module, MiddlewareConsumer } from '@nestjs/common';
import { RouterModule, Routes } from 'nest-router';
import { AppLoggerModule } from './core/logger/app-logger.module';
import { AppLoggerMiddleware } from './core/logger/app-logger.middleware';
import { SampleModule } from './controllers/sample/sample.module';
import { CacheService } from './services/cache/cache.service';
import { ConfigService } from './services/config/config.service';
import { ConfigModule } from './config/config.module';
const routes: Routes = [
  // Apps
  {
    path: '/',
    children: [
      {
        path: 'dynamodb',
        module: SampleModule,
      },
    ],
  },
];

@Module({
  imports: [
    ConfigModule,
    AppLoggerModule,
    RouterModule.forRoutes(routes),
    SampleModule,
  ],
  providers: [ConfigService, CacheService],
  controllers: [],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AppLoggerMiddleware).forRoutes('');
  }
}
