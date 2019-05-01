import { Controller, Get, Post, Body, HttpStatus, Put, Delete, Param, HttpException, Query, UseGuards } from '@nestjs/common';
import { ExercisesService } from './exercises.service';
import { ApiUseTags, ApiResponse, ApiOperation, ApiImplicitQuery, ApiBearerAuth } from '@nestjs/swagger';
import { Exercise } from './models/exercise.model';
import { ExerciseParams } from './models/view-models/exercise-params.model';
import { ExerciseVm } from './models/view-models/exercise-vm.model';
import { ApiException } from 'src/shared/api-exception.model';
import { getOperationId } from 'src/shared/utils/get-operation-id';
import { ExerciseCategory } from './models/exercise-category.enum';
import { isArray } from 'util';
import { Roles } from 'src/shared/decorators/roles.decorators';
import { UserRole } from '../user/models/user-role.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guards';

@Controller('exercises')
@ApiUseTags(Exercise.modelName)
@ApiBearerAuth()
export class ExercisesController {

  constructor(private readonly _exercisesService: ExercisesService) {

  }

  @Post()
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({status: HttpStatus.CREATED, type: ExerciseVm})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(getOperationId(Exercise.modelName, 'Create'))
  async create(@Body() params: ExerciseParams): Promise<ExerciseVm> {
    const { name, description } = params;

    if (!name) {
      throw new HttpException('Name is required', HttpStatus.BAD_REQUEST)
    }

    if (!description) {
      throw new HttpException('Description is required', HttpStatus.BAD_REQUEST)
    }

    try {
      const newExercise = await this._exercisesService.createExercise(params);
      return this._exercisesService.map<ExerciseVm>(newExercise);
    } catch(e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.User)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({status: HttpStatus.OK, type: ExerciseVm, isArray: true})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(getOperationId(Exercise.modelName, 'GetAll'))
  @ApiImplicitQuery({name: 'category', required: false, isArray: true, collectionFormat: 'multi'})
  async get(@Query('category') category?: ExerciseCategory): Promise<ExerciseVm[]> {
    let filter: { category?: any } = {};

    if (category) {
      filter.category = {$in: isArray(category) ? [...category] : [category]}
    }

    try {
      const exercises = await this._exercisesService.findAll(filter);
      return this._exercisesService.map<ExerciseVm[]>(exercises.map(exercise => exercise.toJSON()), true)
    } catch(e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Put()
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({status: HttpStatus.CREATED, type: ExerciseVm})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(getOperationId(Exercise.modelName, 'Update'))
  async update(@Body() vm: ExerciseVm): Promise<ExerciseVm> {
    const { id, name, description, category } = vm;

    if (!vm || !id) {
      throw new HttpException('Missing parameters', HttpStatus.BAD_REQUEST);
    }

    const exist = await this._exercisesService.findById(id);

    if (!exist) {
      throw new HttpException(`${id} not found`, HttpStatus.NOT_FOUND)
    }

    exist.name = name;
    exist.description = description;
    exist.category = category;

    try {
      const updated = await this._exercisesService.update(id, exist)

      return this._exercisesService.map<ExerciseVm>(updated);
    } catch(e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Delete(':id')
  @Roles(UserRole.Admin)
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @ApiResponse({status: HttpStatus.OK, type: ExerciseVm})
  @ApiResponse({status: HttpStatus.BAD_REQUEST, type: ApiException})
  @ApiOperation(getOperationId(Exercise.modelName, 'Delete'))
  async delete(@Param('id') id: string): Promise<ExerciseVm> {
    try {
      const deleted = await this._exercisesService.delete(id);
      return this._exercisesService.map<ExerciseVm>(deleted.toJSON())
    } catch(e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}

