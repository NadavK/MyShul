import {UserBase} from "./user-base";

export class User extends UserBase {
  private _password: string;
  private _token: string;
  private _auto_save: boolean;

  public spouse: UserBase;
  public _children: UserBase[];


  constructor(json?: object, public auto_save: boolean = false) {
    super();
    //this.fromJSON(json);
    //this.spouse = new UserBase(json); }
    this._children = [];
    console.log('User c\'tor:', json);

    this._auto_save = auto_save;

    //Load JSON
    this.fromJSON(json)

    //this._auto_save = true;
  }



  /*set first_name(value: string) {
    this._first_name = value;
    this._username = User.generate_username(this.first_name, this.last_name);
    if (this._auto_save) this.persist();
  }


  set last_name(value: string) {
    this.last_name = value;
    this._username = User.generate_username(this.first_name, this.last_name);
    if (this._auto_save) this.persist();
  }*/


  get password(): string {
    return this._password;
  }

  set password(value: string) {
    this._password = value;
    if (this._auto_save) this.persist();
  }


  get token(): string {
    return this._token;
  }

  set token(value: string) {
    this._token = value;
    console.log('TOKEN:', value);
    if (this._auto_save) this.persist();
  }

  get children(): UserBase[] {
    return this._children.sort((a, b) => a.id - b.id);      // sort by id, and hopefully the parents added the children in order of age and it will work out OK
  }

  /*
    static load_static() {
      let user = new User();
      let data = JSON.parse(localStorage.getItem('currentUser'));
      console.log('loaded user data:', data);
      if (data)
      {
        user.fromJSON(data);
        console.log('loaded user:', user.username, user.token);
      }

      return user;
    }
  */

  signupInfo(): any {
    return {
      password: this.password,       // This is the only place we send the password
      first_name: this.first_name,
      last_name: this.last_name,
      verification_code: this.verification_code,
      profile_id: this.id
    };
  }

  toJSON(for_local_storage: Boolean=true): any {
    let json = {
      user: this.user_id,
      token: this.token
    };

    if (for_local_storage) {
      json = Object.assign(json, {first_name: this.first_name, last_name: this.last_name, password: this.password});       // Is it secure to save the password to local-storage? but we also don't want to send it each time to the server
      console.log('toJSON shallow:', json);
    }
    else {
      json = Object.assign(json, super.toJSON());
      //json = Object.assign(json, {spouse: this.spouse.toJSON()});   #spouse and children are saved directly from their UserBase instances, not via this user
      console.log('toJSON Deep:', json);
    }
    return json;
  }

  fromJSON(json: object) {
    super.fromJSON(json);

    if (!json) return;
    console.log('fromJSON: ', json);

    if (json.hasOwnProperty('password')) {
      console.log('Account json has password');
      this.password = json['password2'] || json['password'];
    }
    else
      console.log('Account json does not have password');

    if (json.hasOwnProperty('token')) {
      console.log('Account json has token');
      this.token = json['token'];
    }
    else
      console.log('Account json does not have token');

    if (json.hasOwnProperty('user')) {
      this.user_id = json['user'];                   // 'user' is the USER id, and 'id' is the profile-id
    }
    if (json.hasOwnProperty('spouse')) {
      this.spouse = new UserBase(json['spouse']);
    }
    if (json.hasOwnProperty('children')) {
      //this._children.length = 0;
      json['children'].forEach(child => {
          this._children.push(new UserBase(child));
        }
      );
      //this.spouse.fromJSON(json['spouse']);
    }
  }

  load() {
    try {
      let data = localStorage.getItem('currentUser');
      console.log('loaded user data:', data);
      let json = JSON.parse(data);
      if (json) {
        this.fromJSON(json);
        console.log('loaded user:', this.username, this.password, this.token);
      }
    }
    catch (e){
      console.log('Error loading user data:', e);
      return;

    }
  }

  persist() {
    console.log('SAVING: ', JSON.stringify(this));
    localStorage.setItem('currentUser', JSON.stringify(this.toJSON(true)));
  }
}
