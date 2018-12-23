import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import 'rxjs/add/operator/map';

/**
 * Api is a generic REST Api handler. Set your API url first.
 */
@Injectable()
export class Api {
  base: string = 'api/v1/';
  url: string = 'http://localhost:8000/';
  token: string;

  constructor(public http: HttpClient) {
  }

  public construct_url(endpoint: string) {
    if (endpoint.slice(-1) != '/') {
      endpoint += '/'
    }

    return this.url + this.base + endpoint;
  }

  private headers() {
    if (!this.token)
      return undefined;

    return new HttpHeaders({ 'Authorization': 'JWT ' + this.token });
  }

  get<T>(endpoint: string, params?: any, options?: any) {
    if (!options) {
      options = {
        params: new HttpParams()
      };
    }

    // Support easy query params for GET requests
    if (params) {
      options.params = new HttpParams();
      for (let k in params) {
        options.params = options.params.set(k, params[k]);
      }
    }

    let options2 = {
      headers: this.headers(),
      responseType: 'text' as 'json'
    };
    options2 = Object.assign(options2, options);

    //return this.http.get<T>(this.construct_url(endpoint), {params: options, headers: this.headers()}).map(resp=>resp as T);
    return this.http.get<T>(this.construct_url(endpoint), {headers: this.headers()}).map(resp=>resp as T);
    //return this.http.get<T>(this.construct_url(endpoint), options=options).map(resp=>resp as T);
    //return this.http.get<T>(this.construct_url(endpoint), options=options2).map(resp => resp as T);
  }

  post(endpoint: string, body: any, options?: any) {
    return this.http.post(this.construct_url(endpoint), body,{params: options, headers: this.headers()});
  }

  put(endpoint: string, body: any, options?: any) {
    console.log('put:', this.token);
    return this.http.put(this.construct_url(endpoint), body, {params: options, headers: this.headers()});
  }

  delete(endpoint: string, options?: any) {
    return this.http.delete(this.construct_url(endpoint), {params: options, headers: this.headers()});
  }

  patch(endpoint: string, body: any, options?: any) {
    return this.http.patch(this.construct_url(endpoint), body, {params: options, headers: this.headers()});
  }
}
