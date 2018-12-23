import {FEMALE, MALE, Profile} from "./profile";

export class UserBase extends Profile {
  private _user_id: number;

  public father: Profile; //= new Profile({gender: MALE});
  public mother: Profile; //= new Profile({gender: FEMALE});

  constructor(json?: object) {
    super();
    this.father = new Profile({gender: MALE});
    this.mother = new Profile({gender: FEMALE});
    this.fromJSON(json);
    //if (this.father == undefined) {
    //  this.father = new Profile({id: 1, gender: MALE});
    //}
    //else {
    //if (this.father)
    //  console.log('fatha_id:', this.father.id);
    //}
    //if (this.mother == undefined) {this.mother = new Profile({id:2, gender: FEMALE});}
    //else {
    //  console.log('matha_id:', this.mother.id);
    //}
  }

  get user_id(): number {
    return this._user_id;
  }

  set user_id(value: number) {
    this._user_id = value;
  }

  static generate_username(first_name: string, last_name: string) {
    return first_name + '_' + last_name;
  }

  get username(): string {
    return UserBase.generate_username(this.first_name, this.last_name);
  }


  toJSON(): any {
    let json = super.toJSON();
    //json.id=this.id;    //set by Profile
    //father: this.father.toJSON(),   server does not support writing nested parents
    //mother: this.mother.toJSON()
    return json
  }

  fromJSON(json: object) {
    super.fromJSON(json);
    if (!json) return;

    this.id = json['id'];

    if (json['parents']) {
      json['parents'].forEach((parent) => {
        if (parent.gender == MALE) {
          this.father = new UserBase(parent);
          console.log('user_id, father_id: ', this.id, this.father.id)
        }
        else {
          this.mother = new UserBase(parent);
          console.log('user_id, mother_id: ', this.id, this.mother.id)
        }
      });
    }
  }
}
