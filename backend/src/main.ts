import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppLogger } from "./app.logger"

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
  	logger: new AppLogger(2)
	});
  await app.listen(process.env.PORT);
}
bootstrap();

/**
 * PROVIDER :
 **** findAll --> OK
 **** findOne --> OK
 **** create --> OK
 **** createAll --> OK
 **** delete --> OK
 **** deleteAll --> OK
 **** update --> OK
 **** Test unitaires --> OK
 * RAYONS :
 **** findAll --> NOK
 **** findOne --> NOK
 **** create --> NOK
 **** createAll --> NOK
 **** delete --> NOK
 **** deleteAll --> NOK
 **** update --> NOK
 **** Test unitaires --> NOK
 * GROUPE RAYONS :
 **** findAll --> NOK
 **** findOne --> NOK
 **** create --> NOK
 **** createAll --> NOK
 **** delete --> NOK
 **** deleteAll --> NOK
 **** update --> NOK
 **** Test unitaires --> NOK
 */
