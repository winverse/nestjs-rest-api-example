// https://github.com/yagop/node-telegram-bot-api/issues/540
process.env.NTBA_FIX_319 = '1'; // don'remove

import { Injectable } from '@nestjs/common';
import { TelegramRoomName } from '@provider/bot';
import { ConfigService } from '@provider/config';
import TelegramBot from 'node-telegram-bot-api';

@Injectable()
export class BotService {
  constructor(private readonly config: ConfigService) {}
  telegramSendMessage(roomName: TelegramRoomName, message: string) {
    const { token, ...rest } = this.config.get('telegram');

    const bot = new TelegramBot(token);

    const rooms = new Map();

    Object.entries(rest).map(([key, value]) => {
      rooms.set(key, value);
    });

    const roomId = rooms.get(roomName);

    if (!roomId) {
      throw new Error('Not found chat id for send telegram message');
    }

    setTimeout(() => {
      bot.sendMessage(roomId, message);
    }, 0);
  }
}
