import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExercisesController } from './exercises.controller';
import { ExercisesService } from './exercises.service';
import { Exercise } from './models/exercise.model';

@Module({
  imports: [MongooseModule.forFeature([{ name: Exercise.modelName, schema: Exercise.model.schema }])],
  controllers: [ExercisesController],
  providers: [ExercisesService]
})
export class ExercisesModule {}
