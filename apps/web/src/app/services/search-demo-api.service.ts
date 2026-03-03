import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface SearchItem {
  id: string;
  title: string;
  type: string;
  status: string;
  city: string | null;
  createdAt: string;
}

export interface SearchItemsResponse {
  data: SearchItem[];
  page: number;
  pageSize: number;
  total: number;
}

export interface SearchItemsParams {
  q?: string;
  type?: string;
  status?: string;
  page?: number;
  pageSize?: number;
  sort?: 'createdAt' | 'title';
  order?: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' })
export class SearchDemoApiService {
  private readonly baseUrl = `${environment.apiBaseUrl}/demo/search`;

  constructor(private readonly http: HttpClient) {}

  getItems(params: SearchItemsParams): Observable<SearchItemsResponse> {
    let httpParams = new HttpParams();
    if (params.q?.trim()) httpParams = httpParams.set('q', params.q.trim());
    if (params.type?.trim()) httpParams = httpParams.set('type', params.type.trim());
    if (params.status?.trim()) httpParams = httpParams.set('status', params.status.trim());
    if (params.page != null) httpParams = httpParams.set('page', params.page.toString());
    if (params.pageSize != null) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    if (params.sort) httpParams = httpParams.set('sort', params.sort);
    if (params.order) httpParams = httpParams.set('order', params.order);

    return this.http.get<SearchItemsResponse>(`${this.baseUrl}/items`, {
      params: httpParams,
    }) as unknown as Observable<SearchItemsResponse>;
  }
}
