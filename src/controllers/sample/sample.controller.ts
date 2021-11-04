import { Controller, Get, Req, Res, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { APIInterface, BaseController } from '../base.controller';
import { APIError } from '../../core/errors/error.constants';
import { CreateDto, FetchIdsDto, } from '../../interfaces/sample/sample.interface';
import { CacheService } from '../../services/cache/cache.service';
import { SampleCache } from '../../services/cache/schema/sample';

@Controller('sample')
export class SampleController extends BaseController implements APIInterface {
    constructor(private cache: CacheService) {
        super();
    }

    @Post('batchput')
    @ApiOperation({ summary: 'batchPut' })
    async addItem(@Req() req, @Res() res, @Body() body: CreateDto) {
        try {
            const result = await this.cache.batchPut('sample', body.list as SampleCache[]);
            return this.response(result, res);
        } catch (e) {
            return this.response(new APIError(e.message).handle(req), res);
        }
    }


    @Get('bacthget/:ids')
    @ApiOperation({ summary: 'bacthGet' })
    async fetchItem(@Req() req, @Res() res, @Param() params: FetchIdsDto) {
        try {
            const result: SampleCache[] = await this.cache.batchGet('sample',
                params.ids.split(',').map((i) => { return { id: String(i) } })).then();
            return this.response({ total: result.length, result }, res);
        } catch (e) {
            return this.response(new APIError(e.message).handle(req), res);
        }
    }

    @Get('scan')
    @ApiOperation({ summary: 'sacn' })
    async scanItem(@Req() req, @Res() res) {
        try {
            const result: { items: SampleCache[] } = await this.cache.scanPaginate('sample').then();
            return this.response({ total: result.items.length, result }, res);
        } catch (e) {
            return this.response(new APIError(e.message).handle(req), res);
        }
    }

    @Delete('batchdelete/:ids')
    @ApiOperation({ summary: 'batchDelete' })
    async deleteItem(@Req() req, @Res() res, @Param() params: FetchIdsDto) {
        try {
            const result = await this.cache.batchDelete('sample', params.ids.split(',').map((i) => { return { id: String(i) } }));
            return this.response(result, res);
        } catch (e) {
            return this.response(new APIError(e.message).handle(req), res);
        }
    }
}

