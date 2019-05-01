import { BaseModel, schemaOptions } from "src/shared/base.model";
import { ExerciseCategory } from "./exercise-category.enum";
import { prop, ModelType } from "typegoose";

export class Exercise extends BaseModel<Exercise> {
  @prop({enum: ExerciseCategory, default: ExerciseCategory.General})
  category: ExerciseCategory;

  @prop({required: [true, 'Description is required']})
  description: string;

  @prop({required: [true, 'Name is required']})
  name: string;

  static get model(): ModelType<Exercise> {
    return new Exercise().getModelForClass(Exercise, { schemaOptions })
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}
