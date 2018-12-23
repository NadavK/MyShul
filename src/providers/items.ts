import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/map';

import { Api } from './api';

import { Item } from '../models/item';

@Injectable()
export class Items {

  constructor(public http: HttpClient, public api: Api) {
  }

  query(params?: any) {
    return this.api.get('/items', params)
      .map((resp:Response) => resp.json());
  }

  add(item: Item) {
  }

  delete(item: Item) {
  }

}
