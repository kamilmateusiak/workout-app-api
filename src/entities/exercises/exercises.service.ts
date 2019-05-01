import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Exercise } from './models/exercise.model';
import { BaseService } from 'src/shared/base.service';
import { ModelType } from 'typegoose';
import { MapperService } from 'src/shared/mapper/mapper.service';
import { ExerciseParams } from './models/view-models/exercise-params.model';
import { ExerciseCategory } from './models/exercise-category.enum';

@Injectable()
export class ExercisesService extends BaseService<Exercise> {
  constructor(@InjectModel(Exercise.modelName) private readonly _exerciseModel: ModelType<Exercise>, private readonly _mapperService: MapperService) {
    super();
    this._model = _exerciseModel;
    this._mapper = _mapperService.mapper;
  }

  async createExercise(params: ExerciseParams): Promise<Exercise> {
    const { name, description,  category } = params;
    
    const newExercise = new this._model();
    newExercise.name = name;
    newExercise.description = description;

    if (category) {
      newExercise.category = category;
    }

    try {
      const result = await this.create(newExercise)
      return result.toJSON();
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // async findAll(): Promise<Exercise[]> {
  //   return await this.exerciseModel.find();
  // }

  // async create(exercise: Exercise): Promise<Exercise> {
  //   const newExercise = new this.exerciseModel(exercise);

  //   return await newExercise.save();
  // }
}
