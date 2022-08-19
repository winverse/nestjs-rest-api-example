import { Prisma } from '@prisma/client';

export type LoggedUserData = Prisma.UserGetPayload<{
  select: {
    id: true;
    email: true;
    username: true;
    createdAt: true;
  };
}>;
