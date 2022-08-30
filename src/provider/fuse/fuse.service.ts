import { Injectable } from '@nestjs/common';
import { SearchEngineParameter } from '@provider/fuse/fuse.interface';
import Fuse from 'fuse.js';

@Injectable()
export class FuseService {
  searchEngine<T>({
    list,
    keys,
    keyword,
  }: SearchEngineParameter<T>): Fuse.FuseResult<T>[] {
    const options: Fuse.IFuseOptions<any> = {
      shouldSort: true,
      threshold: 0.6,
      distance: 100,
      minMatchCharLength: 1,
      // findAllMatches: true,
      includeScore: true,
      includeMatches: true,
      keys,
    };

    const fuse = new Fuse(list, options);
    const engine = fuse.search<T>(keyword);

    return engine;
  }
}
