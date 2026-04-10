import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';
import { ChatModule } from './modules/chat/chat.module';

// PrismaModule, HealthModule, AuthModule, UsersModule removed from Vercel deployment:
// Prisma 7 requires @prisma/client-runtime-utils which is unresolvable via pnpm symlinks
// in experimentalServices Lambda runtime. Chat works without them.

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ChatModule,
  ],
})
export class AppModule {}
