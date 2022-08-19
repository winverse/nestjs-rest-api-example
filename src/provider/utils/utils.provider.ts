import { Provider } from '@nestjs/common';

import { HASH_SALT, HASH_SALT_OR_ROUND } from './utils.constants';

export const bcryptProvider: Provider[] = [
  {
    useFactory: () => {
      return HASH_SALT;
    },
    provide: HASH_SALT_OR_ROUND,
  },
];
