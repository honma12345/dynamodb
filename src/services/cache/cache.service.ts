import { DataMapper } from '@aws/dynamodb-data-mapper';
import { Injectable } from '@nestjs/common';
import { SampleCache } from './schema/sample';
import DynamoDB = require('aws-sdk/clients/dynamodb');
@Injectable()
export class CacheService {
  static SAMPLE_CACHE = 'sample';

  protected ROWS = 100;

  async get(tableName: string, key: number | string | object) {
    const model = this.getSchema(tableName);
    if (typeof key === 'object') {
      return await this.mapper.get(Object.assign(model, key)).catch(e => {
        if (e.name === 'ItemNotFoundException') {
          return null;
        } else {
          throw Error(e.message);
        }
      });
    } else {
      return await this.mapper.get(Object.assign(model, { id: key })).catch(e => {
        if (e.name === 'ItemNotFoundException') {
          return null;
        } else {
          throw Error(e.message);
        }
      });
    }
  }

  async put(tableName: string, attributes: any) {
    const model = this.getSchema(tableName);
    return await this.mapper.put(Object.assign(model, attributes));
  }

  async batchGet(tableName: string, attributes: any[]) {
    const toGet = [];
    const items = [];
    attributes.map(row => toGet.push(Object.assign(this.getSchema(tableName), row)));
    for await (const item of this.mapper.batchGet(toGet)) {
      items.push(item);
    }
    return items;
  }

  async batchPut(tableName: string, attributes: any[]) {
    const toSave = [];
    const items = [];
    attributes.map(row => toSave.push(Object.assign(this.getSchema(tableName), row)));
    for await (const item of this.mapper.batchPut(toSave)) {
      items.push(item);
    }
    return items;
  }

  async batchDelete(tableName: string, attributes: any[]) {
    const toSave = [];
    const items = [];
    attributes.map(row => toSave.push(Object.assign(this.getSchema(tableName), row)));
    for await (const item of this.mapper.batchDelete(toSave)) {
      items.push(item);
    }
    return items;
  }

  async query(tableName: string, attributes: any, queryOptions: any) {
    const model: any = this.getModel(tableName);
    const items = [];
    for await (const item of this.mapper.query(model, attributes, queryOptions)) {
      items.push(item);
    }
    return items;
  }

  async queryPaginate(tableName: string, attributes: any, queryOptions?: any) {
    const model: any = this.getModel(tableName);
    const result = {};
    const items = [];
    Object.assign(queryOptions, { limit: this.ROWS, scanIndexForward: false });
    const recursive = async () => {
      const paginator = this.mapper.query(model, attributes, queryOptions).pages();
      for await (const page of paginator) {
        for await (const item of page) {
          items.push(item)
        }
      }
      if (!paginator.lastEvaluatedKey) {
        return;
      } else {
        Object.assign(queryOptions, { startKey: paginator.lastEvaluatedKey });
        return await recursive();
      }
    }
    await recursive();
    Object.assign(result, { items });
    return result;
  }


  async update(tableName: string, key: number | string, attributes: any) {
    const result = await this.get(tableName, key);
    if (!!result.id) {
      await this.mapper.update(Object.assign(result, attributes));
      return true;
    }
    return false;
  }

  async scanPaginate(tableName: string) {
    const model: any = this.getModel(tableName);
    const result = {};
    const items = [];
    const queryOptions = {};
    Object.assign(queryOptions, { limit: this.ROWS, scanIndexForward: false });
    const recursive = async () => {
      const paginator = this.mapper.scan(model, queryOptions).pages();
      for await (const page of paginator) {
        for await (const item of page) {
          items.push(item)
        }
      }
      if (!paginator.lastEvaluatedKey) {
        return;
      } else {
        Object.assign(queryOptions, { startKey: paginator.lastEvaluatedKey });
        return await recursive();
      }
    }
    await recursive();
    Object.assign(result, { items });
    return result;
  }

  async scan(tableName: string) {
    const items = [];
    const model: any = this.getModel(tableName);
    for await (const item of this.mapper.scan(model)) {
      items.push(item);
    }
    return items;
  }

  async delete(tableName: string, key: number | string | object) {
    const model = this.getSchema(tableName);
    if (typeof key === 'object') {
      return await this.mapper.delete(Object.assign(model, key)).catch(e => {
        if (e.name === 'ItemNotFoundException') {
          return null;
        } else {
          throw Error(e.message);
        }
      });
    } else {
      return await this.mapper.delete(Object.assign(model, { id: key })).catch(e => {
        if (e.name === 'ItemNotFoundException') {
          return null;
        } else {
          throw Error(e.message);
        }
      });
    }
  }


  private get configure(): DynamoDB.ClientConfiguration {
    if (process.env.OFFLINE === '1') {
      return {
        endpoint: 'http://dynamodblocal:8000',
        region: 'ap-northeast-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_ACCESS_KEY_ID,
      };
    } else {
      return { region: 'ap-northeast-1' };
    }
  }

  private get mapper(): DataMapper {
    return new DataMapper({
      client: new DynamoDB(this.configure),
    });
  }

  private getSchema(schemaName: string) {
    switch (schemaName) {
      case CacheService.SAMPLE_CACHE:
        return new SampleCache();
    }
  }

  private getModel(schemaName: string) {
    switch (schemaName) {
      case CacheService.SAMPLE_CACHE:
        return SampleCache;
    }
  }
}
