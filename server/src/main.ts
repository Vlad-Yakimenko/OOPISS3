require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const PORT = Number(process.env.PORT) || 5000;
  await app.listen(PORT, () => console.log(`Server is listening on port: ${PORT} ...`));
}
bootstrap();
