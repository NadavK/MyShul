import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import 'rxjs/add/operator/map';

import { Api } from './api';

import {Observable} from "rxjs/Observable";
import {User} from "../models/user";
import {Profile} from "../models/profile";

@Injectable()
export class Profiles {

  constructor(public http: HttpClient, public api: Api) {
  }

  query(params?: any) {
    return this.api.get('profiles', params);
      //.map(resp => resp.json());
  }

  get() {
    return this.api.get('profile')
      //.map(resp => resp.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server Error'));
  }

  addSpouse(user: User, spouse: User): Observable<User> {
    console.log('Adding Spouse', user.id, spouse);
    return this.api.post('profiles/' + user.id + '/spouse', spouse)
      //.map(resp => resp.json())
      .catch((error:any) => Observable.throw(console.log('ERROR', error.json().error) || 'Server error'));
  }

  addParent(user: Profile, parent: Profile): Observable<User> {
    console.log('Adding Parent', user.id, parent);
    return this.api.post('profiles/' + user.id + '/parent', parent)
      //.map(resp => resp.json())
      .catch((error:any) => Observable.throw(console.log('ERROR', error.json().error) || 'Server error'));
  }

  addChild(user: User, child: User): Observable<User> {
    console.log('Adding Child', user.id, child);
    return this.api.post('profiles/' + user.id + '/children', child)
      //.map(resp => resp.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  /*saveSpouse(spouse: User): Observable<User> {
    console.log('Saving Spouse', spouse.id, spouse);
    return this.api.patch('users/' + spouse.id, spouse)
      .map(resp => resp.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }*/

  save(profile: Profile): Observable<User> {
    //if (profile.read_only)
    //  return Observable.empty<User>();

    //return this.api.put('users/' + user.profile.id + '/', user)
    return this.api.patch('profiles/' + profile.id, profile)
      //.map(resp => resp.json())
      .catch((error:any) => Observable.throw(error.json().error || 'Server error'));
  }

  add_or_save_parent(profile: Profile, parent: Profile): Observable<User> {
    //return this.api.put('users/' + user.profile.id + '/', user)
    if (parent.read_only)
      return new Observable(obs=>{obs.next(null); obs.complete()});
    else if (parent.id)
      return this.save(parent);
    else
      return this.addParent(profile, parent);
  }

  delete(user: User) {
  }

}
