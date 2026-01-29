import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SearchItemEntity } from './entities/search-item.entity';
import { SearchDemoController } from './search-demo.controller';
import { SearchDemoService } from './search-demo.service';

@Module({
  imports: [TypeOrmModule.forFeature([SearchItemEntity])],
  controllers: [SearchDemoController],
  providers: [SearchDemoService],
})
export class SearchDemoModule {}
