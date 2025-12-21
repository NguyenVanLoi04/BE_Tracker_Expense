import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GlobalConfig } from '../../common/config/global.config';

@Injectable()
export class TelegramService {
  private botToken: string;
  private chatId: string;

  constructor(
    private readonly configService: ConfigService<GlobalConfig>,
    private readonly httpService: HttpService,
  ) {
    this.botToken = configService.get('telegram.botToken');
    this.chatId = configService.get('telegram.chatId');
  }

  async sendMessage(
    message: string,
    type: 'error' | 'success' | 'info' = 'info',
  ) {
    const url = `https://api.telegram.org/bot${this.botToken}/sendMessage`;
    const body = {
      chat_id: this.chatId,
      text: message,
      parse_mode: 'Markdown',
    };

    const template = {
      error: `❌ *Error* \n\n ${message}`,
      success: `✅ *Success* \n\n ${message}`,
      info: `ℹ️ *Info* \n\n ${message}`,
    };

    if (type) {
      body.text = template[type];
    }

    try {
      await this.httpService.axiosRef.post(url, body);
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  }
}
