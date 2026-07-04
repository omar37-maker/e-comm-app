import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [`.${process.env.NODE_ENV}.env`, '.env'],
    }),
    MongooseModule.forRoot(process.env.MONGO_URL!, {
      onConnectionCreate: (connection: Connection) => {
        connection.on('connected', () => console.log('connected on database:::', process.env.MONGO_URL));
        return connection;
      },
    }),
    
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
