import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';
import { EncryptService } from './services/encrypt.service';
import { TelegramService } from './services/telegram.service';
import { UploadService } from './services/upload-file.service';
import { UtilService } from './services/util.service';
import { UuidService } from './services/uuid.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [
    UploadService,
    UuidService,
    EncryptService,
    UtilService,
    TelegramService,
  ],
  exports: [
    UploadService,
    UuidService,
    EncryptService,
    UtilService,
    TelegramService,
  ],
})
export class UtilsModule {}
