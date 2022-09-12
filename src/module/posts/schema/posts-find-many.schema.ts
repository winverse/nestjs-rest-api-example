import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export const postsFindManySchema: SchemaObject = {
  example: {
    list: [
      {
        id: 'cl7yxfqhs0007bicdr1mmoqew',
        title: 'What is the type level system? No.1',
        contents:
          'I want talk to type level system, this is the powerful for mordern application...',
        thumbnail: 'https://aws.s3.northeast',
        user: {
          username: 'winverse',
        },
      },
      {
        id: 'cl7yx77tl0018qccdkmcw78p6',
        title: 'What is the type level system!? No.2',
        contents:
          'I want talk to type level system, this is the powerful for mordern application...',
        thumbnail: 'https://aws.s3.northeast',
        user: {
          username: 'winverse',
        },
      },
    ],
    count: 2,
  },
};
