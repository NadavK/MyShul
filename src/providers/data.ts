import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {User} from "../models/user";
import {Profiles} from "./profiles";
import {Duty} from "../models/duty";
import {Duties} from "./duties";
import {UserBase} from "../models/user-base";

class dataStore {
    user: User;
    duties: Duty[];
    //users: Map<string, User>;   This can be used to easily look-up any user, without regard to user/spouse/child
  //} = {user: new User(null, true), spouse: null, duties: [], children: [], parents: []};

  constructor() {
    this.duties = [];
    this.resetUser();
    this.user.load();
  }

  public resetUser() {
    this.user = new User(null, true);
  }

  public UserFromJSON(json) {
    this.user = new User(json, true);
    //this.user.fromJSON(json);
  }
}
const datastore_const: dataStore = new dataStore();

@Injectable()
export class Data {
  //datastore = datastore_const;
  datastore = datastore_const;
  user: BehaviorSubject<UserBase> = <BehaviorSubject<UserBase>>new BehaviorSubject(new UserBase());
  related_user: BehaviorSubject<UserBase> = <BehaviorSubject<UserBase>>new BehaviorSubject(new UserBase());
  duties: BehaviorSubject<Duty[]> = <BehaviorSubject<Duty[]>>new BehaviorSubject([]);

  constructor(public userService: Profiles, public dutyService: Duties){
  }


  loadAll() : Promise<boolean> {
    return new Promise<boolean>(resolve => {
      // In place of the code given below, one can call REST APIs
      // For errors, one can choose to reject the promise;
      // For successful processing, promise can be resolved
      //
        this.userService
          .get()
          .subscribe((user: JSON) => {
            this.datastore.UserFromJSON(user);
            this.user.next(this.datastore.user);    //Notify consumers
            resolve(true);
          }, error => console.log('***Could not load profile.', error));

        this.loadDuties();
      });
  }

  private loadDuties() {
    this.dutyService
      .get()
      .subscribe((duties: Duty[]) => {
        this.datastore.duties = duties;
        this.duties.next(this.datastore.duties);   //Notify consumers
      }, error => console.log('***Could not load duties.', error));
  }

  // Returns a new empty user promise
  public newUser(): BehaviorSubject<UserBase> {
    console.log('newUser');
    this.datastore.user = new User();
    this.user.next(this.datastore.user);    //Notify consumers
    return this.user;
  }

  // Returns a user promise, per type and index
  public getUser(username?: string): BehaviorSubject<UserBase> {
    //let user: UserBase;
    console.log('getUser:', username);

    if (!username || this.datastore.user.username == username) {
      this.user.next(this.datastore.user);    //Notify consumers
      //this.user.subscribe(val => user=val);
      //user = this.datastore.user;
        return this.user;
    } else if (this.datastore.user.spouse && this.datastore.user.spouse.username == username) {
      //user = this.datastore.user.spouse;
      this.related_user.next(this.datastore.user.spouse);    //Notify consumers
      return this.related_user;
    } else for (let child of this.datastore.user.children) {
      if (child.username == username) {
        //user = child;
        console.log('NEXT CHILD', child);
        this.related_user.next(child);    //Notify consumers
        return this.related_user;
      }
    }
    //return Promise.resolve(user);
  }

  public isSpouse(user: UserBase) {
    return (this.datastore.user.spouse == user);
  }

  public setUser(json) {
    this.datastore.user.fromJSON(json);         // Serialize the credentials
    this.datastore.user.persist();              // Save the credentials to auto-login
    this.loadAll();                             // Will load the profile, and the duties

    //now we can read duties
    //this.loadDuties();

    this.user.next(this.datastore.user);        // Notify consumers
  }

  public addSpouse(json): UserBase {
    this.datastore.user.spouse = new UserBase(json);

    /*this.datastore.spouse = new User();
    this.datastore.spouse.fromJSON(json);

    this.spouse.next(this.datastore.spouse);        //Notify consumers
    return this.datastore.spouse;*/
    return this.datastore.user.spouse;
  }

  /*public addSpouseParent(spouse, json): User {
    let parent = new User();
    spouse.parent.fromJSON(json);

    this.spouse.next(this.datastore.spouse);        //Notify consumers
    return this.datastore.spouse;
  }*/

  public addChild(json, notify?: boolean): UserBase {
    let child = new UserBase(json);
    this.datastore.user.children.push(child);

    //if (notify) {
      //this.children.next(this.datastore.children);     //Notify consumers
    //}
    return child;
  }
}
