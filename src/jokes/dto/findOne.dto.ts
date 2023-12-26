import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class FindOneDto {
  @Type(() => Number)
  @IsInt()
  id: number;
}
