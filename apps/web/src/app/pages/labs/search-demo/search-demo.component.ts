import {
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
  computed,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { SearchDemoApiService, SearchItem } from '../../../services/search-demo-api.service';

const TYPES = ['', 'project', 'article', 'experiment', 'tool', 'tutorial'];
const STATUSES = ['', 'draft', 'published', 'archived', 'review', 'wip'];
const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: 'createdAt-desc', label: 'Newest first' },
  { value: 'createdAt-asc', label: 'Oldest first' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
];
const PAGE_SIZES = [10, 25, 50, 100];

@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [],
  template: `
    <h1>Search Demo</h1>

    <div class="filters">
      <div class="filter-row">
        <input
          type="search"
          [value]="searchTerm()"
          (input)="onSearchInput($event)"
          placeholder="Search..."
          class="search-input"
        />
        <select
          [value]="type()"
          (change)="onTypeChange($event)"
          class="filter-select"
        >
          <option value="">All types</option>
          @for (t of types; track t) {
            @if (t) {
              <option [value]="t">{{ t }}</option>
            }
          }
        </select>
        <select
          [value]="status()"
          (change)="onStatusChange($event)"
          class="filter-select"
        >
          <option value="">All statuses</option>
          @for (s of statuses; track s) {
            @if (s) {
              <option [value]="s">{{ s }}</option>
            }
          }
        </select>
        <select
          [value]="sortValue()"
          (change)="onSortChange($event)"
          class="filter-select"
        >
          @for (opt of sortOptions; track opt.value) {
            <option [value]="opt.value">{{ opt.label }}</option>
          }
        </select>
        <select
          [value]="pageSize()"
          (change)="onPageSizeChange($event)"
          class="filter-select"
        >
          @for (ps of pageSizes; track ps) {
            <option [value]="ps">{{ ps }} per page</option>
          }
        </select>
      </div>
    </div>

    @if (loading()) {
      <p class="loading">Loading…</p>
    } @else if (results().length === 0) {
      <p class="empty">No results found.</p>
    } @else {
      <table class="results-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Type</th>
            <th>Status</th>
            <th>City</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          @for (item of results(); track item.id) {
            <tr>
              <td>{{ item.title }}</td>
              <td>{{ item.type }}</td>
              <td>{{ item.status }}</td>
              <td>{{ item.city ?? '—' }}</td>
              <td>{{ formatDate(item.createdAt) }}</td>
            </tr>
          }
        </tbody>
      </table>

      <div class="pagination">
        <button
          [disabled]="page() <= 1"
          (click)="goToPage(page() - 1)"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ page() }} of {{ totalPages() }}
          ({{ total() }} total)
        </span>
        <button
          [disabled]="page() >= totalPages()"
          (click)="goToPage(page() + 1)"
        >
          Next
        </button>
      </div>
    }
  `,
  styles: [`
    .filters {
      margin-bottom: 1.5rem;
    }
    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
    }
    .search-input {
      min-width: 200px;
      padding: 0.5rem 0.75rem;
      font-size: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .filter-select {
      padding: 0.5rem 0.75rem;
      font-size: 0.95rem;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
    }
    .loading, .empty {
      padding: 2rem;
      text-align: center;
      color: #666;
    }
    .results-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 1rem;
    }
    .results-table th,
    .results-table td {
      padding: 0.5rem 0.75rem;
      text-align: left;
      border-bottom: 1px solid #e0e0e0;
    }
    .results-table th {
      background: #f5f5f5;
      font-weight: 600;
    }
    .pagination {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .pagination button {
      padding: 0.5rem 1rem;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 4px;
      background: white;
    }
    .pagination button:hover:not(:disabled) {
      background: #f0f0f0;
    }
    .pagination button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    .page-info {
      color: #666;
      font-size: 0.9rem;
    }
  `],
})
export class SearchDemoComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(SearchDemoApiService);

  private readonly searchInput$ = new Subject<string>();
  private sub = new Subscription();
  private apiSub = new Subscription();

  readonly types = TYPES;
  readonly statuses = STATUSES;
  readonly sortOptions = SORT_OPTIONS;
  readonly pageSizes = PAGE_SIZES;

  readonly searchTerm = signal('');
  readonly type = signal('');
  readonly status = signal('');
  readonly sortValue = signal('createdAt-desc');
  readonly page = signal(1);
  readonly pageSize = signal(10);

  readonly results = signal<SearchItem[]>([]);
  readonly total = signal(0);
  readonly loading = signal(false);

  readonly totalPages = computed(() => {
    const t = this.total();
    const ps = this.pageSize();
    return ps > 0 ? Math.ceil(t / ps) : 0;
  });

  ngOnInit(): void {
    this.sub.add(
      this.searchInput$
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((q) => this.applyQueryParams({ q, page: 1 }))
    );

    this.sub.add(
      this.route.queryParams.subscribe((params) => {
        const q = (params['q'] ?? '') as string;
        const type = (params['type'] ?? '') as string;
        const status = (params['status'] ?? '') as string;
        const sortValue = (params['sort'] ?? 'createdAt-desc') as string;
        const page = Math.max(1, parseInt(params['page'] ?? '1', 10));
        const pageSize = Math.min(
          100,
          Math.max(1, parseInt(params['pageSize'] ?? '10', 10))
        );

        this.searchTerm.set(q);
        this.type.set(type);
        this.status.set(status);
        this.sortValue.set(sortValue);
        this.page.set(page);
        this.pageSize.set(pageSize);

        this.loading.set(true);
        this.apiSub.unsubscribe();
        this.apiSub = new Subscription();
        const [sort, order] = (sortValue.split('-') as [string, string]);
        const sortField = (sort === 'title' ? 'title' : 'createdAt') as 'createdAt' | 'title';
        const orderDir = (order === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc';

        this.apiSub.add(
          this.api.getItems({
            q: q || undefined,
            type: type || undefined,
            status: status || undefined,
            page,
            pageSize,
            sort: sortField,
            order: orderDir,
          }).subscribe({
            next: (res) => {
              this.results.set(res.data);
              this.total.set(res.total);
              this.loading.set(false);
            },
            error: () => {
              this.results.set([]);
              this.total.set(0);
              this.loading.set(false);
            },
          })
        );
      })
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.apiSub.unsubscribe();
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput$.next(value);
  }

  onTypeChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.applyQueryParams({ type: value, page: 1 });
  }

  onStatusChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.applyQueryParams({ status: value, page: 1 });
  }

  onSortChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    this.applyQueryParams({ sort: value, page: 1 });
  }

  onPageSizeChange(event: Event): void {
    const value = parseInt((event.target as HTMLSelectElement).value, 10);
    this.applyQueryParams({ pageSize: value, page: 1 });
  }

  goToPage(p: number): void {
    this.applyQueryParams({ page: p });
  }

  private applyQueryParams(updates: Record<string, string | number>): void {
    const current = this.route.snapshot.queryParams;
    const merged = { ...current, ...updates };
    Object.keys(merged).forEach((k) => {
      const v = merged[k];
      if (v === '' || v === undefined || v === null) delete merged[k];
    });
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: merged,
      queryParamsHandling: '',
    });
  }

  formatDate(iso: string): string {
    try {
      return new Date(iso).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return iso;
    }
  }
}
