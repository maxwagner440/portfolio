import { Controller, Get, Query } from '@nestjs/common';
import { SearchDemoService } from './search-demo.service';
import { SearchItemsQueryDto } from './dto/search-items-query.dto';
import { SearchItemsResponseDto } from './dto/search-items-response.dto';

@Controller('demo/search')
export class SearchDemoController {
  constructor(private readonly searchDemoService: SearchDemoService) {}

  @Get('items')
  getItems(@Query() query: SearchItemsQueryDto): Promise<SearchItemsResponseDto> {
    return this.searchDemoService.getItems(query);
  }
}
