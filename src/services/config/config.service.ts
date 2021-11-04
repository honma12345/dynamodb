import * as dotenv from 'dotenv';
import * as Joi from 'joi';
import * as fs from 'fs';


export interface EnvConfig {
  [key: string]: string;
}
export class ConfigService {
  private envConfig: EnvConfig;

  async init(filePath: string) {
    let config = {};
    if (fs.existsSync(filePath)) {
      config = dotenv.parse(fs.readFileSync(filePath));
    }
    const merged = Object.assign({}, config, process.env);

    this.envConfig = ConfigService.validateInput(merged);
  }

  get(key: string): string {
    return this.envConfig[key];
  }

  private static validateInput(envConfig: EnvConfig): EnvConfig {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      ENV_NAME: Joi.string()
        .valid(['local', 'test', 'dev', 'prd', 'stg'])
        .default('local')
    });

    const { error, value: validatedEnvConfig } = Joi.validate(envConfig, envVarsSchema, {
      stripUnknown: true,
    });
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}
