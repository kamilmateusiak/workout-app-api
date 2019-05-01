import { ExerciseCategory } from "../exercise-category.enum";
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { enumToArray } from "src/shared/utils/enum-to-array";

export class ExerciseParams {
  @ApiModelProperty() name: string;
  @ApiModelProperty() description: string;
  @ApiModelPropertyOptional({enum: enumToArray(ExerciseCategory), example: ExerciseCategory.Chest})
  category?: ExerciseCategory 
}