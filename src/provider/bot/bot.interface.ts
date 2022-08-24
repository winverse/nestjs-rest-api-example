import type { TelegramConfig } from '@provider/config';

export type TelegramRoomName = keyof Omit<TelegramConfig, 'token'>;
