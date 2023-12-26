import { Type } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class FindRandomDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number = 1;
}
