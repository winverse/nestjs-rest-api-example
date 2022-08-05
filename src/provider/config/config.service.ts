import fs from 'fs';
import path from 'path';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService as NestConfig, Path, PathValue } from '@nestjs/config';
import { CONFIG_OPTIONS } from '@provider/config/config.constants';
import { ConfigOptions } from '@provider/config/interfaces';
import { Config } from './interfaces/config.interface';

@Injectable()
export class ConfigService<K = Config> extends NestConfig<K> {
  public override get<P extends Path<K>>(path: P): PathValue<K, P> {
    const value = super.get(path, { infer: true });
    return value;
  }
}
