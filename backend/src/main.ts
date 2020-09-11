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
 **** Test unitaires --> NOK
 * RAYONS :
 **** findAll --> OK
 **** findOne --> OK
 **** create --> OK
 **** createAll --> OK
 **** delete --> OK
 **** deleteAll --> OK
 **** update --> OK
 **** Test unitaires --> NOK
 * GROUPS :
 **** findAll --> OK
 **** findOne --> OK
 **** create --> OK
 **** createAll --> OK
 **** delete --> OK
 **** deleteAll --> OK
 **** update --> OK
 **** Test unitaires --> NOK
 */
/**
 * DELETE public dans les fichier model
 * DELETE les interfaces
 */
