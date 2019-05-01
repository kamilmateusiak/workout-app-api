import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ExercisesService } from './entities/exercises/exercises.service';
import { ExercisesController } from './entities/exercises/exercises.controller';
import { ExercisesModule } from './entities/exercises/exercises.module';
import { SharedModule } from './shared/shared.module';
import { ConfigurationService } from './shared/configuration/configuration.service';
import { Configuration } from './shared/configuration/configuration.enum';
import { UserModule } from './entities/user/user.module';

@Module({
  imports: [MongooseModule.forRoot(ConfigurationService.connectionString), ExercisesModule, SharedModule, UserModule],
  controllers: [AppController, ExercisesController],
  providers: [AppService, ExercisesService],
})
export class AppModule {
  static host: string;
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly _configurationService: ConfigurationService) {
    AppModule.port = AppModule.normalizePort(_configurationService.get(Configuration.PORT))
    AppModule.host = _configurationService.get(Configuration.HOST)
    AppModule.isDev = _configurationService.isDevelopment
  }

  private static normalizePort(param: number | string): number | string {
    const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param;

    if (isNaN(portNumber)) {
      return param;
    } else if (portNumber >= 0) {
      return portNumber;
    }
  } 
}
