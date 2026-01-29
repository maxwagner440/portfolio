import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

const ALLOWED_SORT_FIELDS = ['createdAt', 'title'] as const;
const ALLOWED_ORDERS = ['asc', 'desc'] as const;

export class SearchItemsQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 10;

  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_SORT_FIELDS)
  sort?: (typeof ALLOWED_SORT_FIELDS)[number] = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(ALLOWED_ORDERS)
  order?: (typeof ALLOWED_ORDERS)[number] = 'desc';
}
