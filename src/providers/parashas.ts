import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Api } from './api';

import { Parasha } from '../models/parasha';
import {Observable} from "rxjs/Observable";

@Injectable()
export class Parashas {

  constructor(public api: Api) {
  }

  get(params?: any): Observable<Parasha[]> {
    return this.api.get<Parasha[]>('parashas', params);
      //.map(resp => resp.json());
  }
}
