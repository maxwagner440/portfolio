import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatDemoModule } from './modules/chat-demo/chat-demo.module';
import { SearchDemoModule } from './modules/search-demo/search-demo.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST', 'localhost'),
        port: config.get('DB_PORT', 5432),
        username: config.get('DB_USER', 'postgres'),
        password: config.get('DB_PASS', 'postgres'),
        database: config.get('DB_NAME', 'portfolio'),
        autoLoadEntities: true,
        synchronize: process.env.NODE_ENV !== 'production',
      }),
      inject: [ConfigService],
    }),
    SearchDemoModule,
    ChatDemoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
