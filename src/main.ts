// preload
import '@/role/permission/permission.constants';
import 'dotenv/config';

// core imports
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();
