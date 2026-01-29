import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchItemEntity } from './entities/search-item.entity';
import { SearchItemsQueryDto } from './dto/search-items-query.dto';
import { SearchItemsResponseDto } from './dto/search-items-response.dto';

const TYPES = ['project', 'article', 'experiment', 'tool', 'tutorial'];
const STATUSES = ['draft', 'published', 'archived', 'review', 'wip'];
const CITIES = ['Berlin', 'Munich', 'Hamburg', 'Cologne', 'Frankfurt', null];
const TITLE_WORDS = [
  'Angular', 'NestJS', 'TypeScript', 'Postgres', 'Docker', 'Kubernetes',
  'React', 'Vue', 'Node', 'API', 'GraphQL', 'REST', 'Auth', 'Testing',
  'CI/CD', 'Monorepo', 'Microservices', 'Database', 'ORM', 'Frontend',
];

@Injectable()
export class SearchDemoService implements OnModuleInit {
  constructor(
    @InjectRepository(SearchItemEntity)
    private readonly repo: Repository<SearchItemEntity>,
  ) {}

  async onModuleInit() {
    const count = await this.repo.count();
    if (count === 0) {
      await this.seed();
    }
  }

  async getItems(query: SearchItemsQueryDto): Promise<SearchItemsResponseDto> {
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const sort = query.sort ?? 'createdAt';
    const order = query.order ?? 'desc';
    const allowedOrder = order.toUpperCase() as 'ASC' | 'DESC';

    const qb = this.repo.createQueryBuilder('item');

    if (query.q?.trim()) {
      qb.andWhere('item.title ILIKE :q', { q: `%${query.q.trim()}%` });
    }
    if (query.type?.trim()) {
      qb.andWhere('item.type = :type', { type: query.type.trim() });
    }
    if (query.status?.trim()) {
      qb.andWhere('item.status = :status', { status: query.status.trim() });
    }

    qb.orderBy(`item.${sort}`, allowedOrder);
    qb.skip((page - 1) * pageSize);
    qb.take(pageSize);

    const [data, total] = await qb.getManyAndCount();

    return { data, page, pageSize, total };
  }

  private async seed() {
    const batchSize = 100;
    for (let b = 0; b < 5; b++) {
      const items: Partial<SearchItemEntity>[] = [];
      for (let i = 0; i < batchSize; i++) {
        const type = TYPES[Math.floor(Math.random() * TYPES.length)];
        const status = STATUSES[Math.floor(Math.random() * STATUSES.length)];
        const city = CITIES[Math.floor(Math.random() * CITIES.length)];
        const word1 = TITLE_WORDS[Math.floor(Math.random() * TITLE_WORDS.length)];
        const word2 = TITLE_WORDS[Math.floor(Math.random() * TITLE_WORDS.length)];
        const title = `${word1} ${word2} ${type} #${b * batchSize + i + 1}`;
        items.push({ title, type, status, city });
      }
      await this.repo.insert(items);
    }
  }
}
