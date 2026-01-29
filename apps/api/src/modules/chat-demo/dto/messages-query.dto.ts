import { IsOptional, IsInt, Min, Max, IsISO8601 } from 'class-validator';
import { Type } from 'class-transformer';

export class MessagesQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 30;

  @IsOptional()
  @IsISO8601()
  before?: string;
}
