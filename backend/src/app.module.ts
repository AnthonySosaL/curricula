import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { PrismaModule } from './common/prisma/prisma.module';
import { HealthModule } from './modules/health/health.module';
import { ChatModule } from './modules/chat/chat.module';

// AuthModule and UsersModule removed from Vercel deployment:
// @nestjs/passport v11 uses ESM which is incompatible with experimentalServices
// CJS in-place compilation. Chat works without auth.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    HealthModule,
    ChatModule,
  ],
})
export class AppModule {}
