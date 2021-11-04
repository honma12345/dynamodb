import { attribute, hashKey, table } from '@aws/dynamodb-data-mapper-annotations';
@table(`sample`)
export class SampleCache {
  @hashKey()
  id: string;
  @attribute()
  attribute: any;
}
