import { Module } from '@nestjs/common';
import { ConfigService } from '../services/config/config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useFactory: async () => {
        const config = new ConfigService();
        await config.init(`.env`);
        return config;
      },
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
