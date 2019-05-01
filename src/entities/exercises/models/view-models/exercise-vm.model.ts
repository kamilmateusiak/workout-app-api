import { BaseModelVm } from "src/shared/base.model";
import { ExerciseCategory } from "../exercise-category.enum";
import { ApiModelProperty } from "@nestjs/swagger";
import { enumToArray } from "src/shared/utils/enum-to-array";

export class ExerciseVm extends BaseModelVm {
  @ApiModelProperty() name: string;
  @ApiModelProperty() description: string;
  @ApiModelProperty({enum: enumToArray(ExerciseCategory)}) category: ExerciseCategory;
}