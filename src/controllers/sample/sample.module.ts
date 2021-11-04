import { Module } from '@nestjs/common';
import { SampleController } from '../sample/sample.controller';
import { CacheService } from '../../services/cache/cache.service';
@Module({
  imports: [],
  controllers: [SampleController],
  providers: [CacheService],
})
export class SampleModule { }
