import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { JokesModule } from './jokes/jokes.module';
import { DatabaseModule } from './database/database.module';
import { ThrottlerModule, hours } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    JokesModule,
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      {
        ttl: hours(1),
        limit: 10,
      },
    ]),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
