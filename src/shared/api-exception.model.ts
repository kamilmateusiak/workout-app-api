import { ApiModelPropertyOptional } from "@nestjs/swagger";

export class ApiException {
  @ApiModelPropertyOptional() statesCode?: number;
  @ApiModelPropertyOptional() message?: string;
  @ApiModelPropertyOptional() status?: string;
  @ApiModelPropertyOptional() error?: string;
  @ApiModelPropertyOptional() errors?: any;
  @ApiModelPropertyOptional() timestamp?: string;
  @ApiModelPropertyOptional() path?: string;
}
