import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/map';

import { Api } from './api';

import {Observable} from "rxjs/Observable";
import {Duty} from "../models/duty";

@Injectable()
export class Duties {

  constructor(public http: HttpClient, public api: Api) {
  }

  get(params?: any): Observable<Duty[]> {
    return this.api.get('duties', params)
      .map((duties_json: any) => {
        let duties: Duty[] = [];
        duties_json.forEach(duty => {
          duties.push(new Duty(duty));
        });
        return duties;
      });
  }
}
