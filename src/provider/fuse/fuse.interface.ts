import Fuse from 'fuse.js';

export interface SearchEngineParameter<T> {
  list: ReadonlyArray<T>;
  keys: Array<Fuse.FuseOptionKey<T>>;
  keyword: string;
}
