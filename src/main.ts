import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerMiddleware } from './Middlewares';
// import { AuthGuard } from './Guards';
// import { TokenService } from './Common/Services';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  app.use(LoggerMiddleware)
  // app.useGlobalGuards(new AuthGuard(app.get(TokenService)))
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }))
  const port = configService.get('app.port');
  await app.listen(port, () =>
    console.log(`Server running on port ${port}`),
  );
}
bootstrap();
