import { SearchItemEntity } from '../entities/search-item.entity';

export class SearchItemsResponseDto {
  data: SearchItemEntity[];
  page: number;
  pageSize: number;
  total: number;
}
