export const MALE = 'm';
export const FEMALE = 'f';

export class Profile {
  private _id: number;
  private _first_name: string;
  private _last_name: string;
  public _full_name: string;                // full first name for calling to aliya. For father/mother, this should be פלוני בן פלוני
  public _father_full_name: string;         // used when this profile does not have a separate father-profile
  private _email: string;
  private _phone: string;
  private _gender: string;
  private _bar_mitzvahed: boolean;          // is over 13?
  private _bar_mitzvah_parasha: number;
  private _title: string;                   // cohen, levi, yisrael
  public _duties: number[];
  public _user_notes: string;
  public _read_only: boolean;
  public _dod_day: number;
  public _dod_month: number;
  public _verification_code: string;

  constructor(json?: object) {
    this.fromJSON(json);
  }

  get id(): number {
    return this._id;
  }

  set id(value: number) {
    this._id = value;
  }


  get first_name(): string {
    return this._first_name;
  }
  set first_name(value: string) {
    this._first_name = value;
  }


  get last_name(): string {
    return this._last_name;
  }
  set last_name(value: string) {
    this._last_name = value;
  }


  get full_name(): string {
    return this._full_name;
  }
  set full_name(value: string) {
    this._full_name = value;
  }

  get father_full_name(): string {
    return this._father_full_name;
  }
  set father_full_name(value: string) {
    this._father_full_name = value;
  }

  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

  get phone(): string {
    return this._phone;
  }

  set phone(value: string) {
    this._phone = value;
  }
  get valid_gender(): boolean {
    return this._gender == MALE || this._gender == FEMALE;
  }

  get gender(): string {
    return this._gender;
  }
  set gender(value: string) {
    this._gender = value;
  }

  get spouse_default_gender(): string {
    if (this._gender == MALE)
      return FEMALE;
    else //if (this._gender == FEMALE)
      return MALE;
    //else
    //  return null;
  }

  get male(): boolean {
    return this._gender == MALE;
  }
  set male(value: boolean) {
    this._gender = (value ? MALE : FEMALE);
  }

  get bar_mitzvahed(): boolean {
    return this._bar_mitzvahed;
  }
  set bar_mitzvahed(value: boolean) {
    this._bar_mitzvahed = value;
  }

  get bar_mitzvah_parasha(): number {
    return this._bar_mitzvah_parasha;
  }
  set bar_mitzvah_parasha(value: number) {
    this._bar_mitzvah_parasha = value;
  }

  get title(): string {
    return this._title;
  }
  set title(value: string) {
    this._title = value;
  }

  get duties(): number[] {
    return this._duties;
  }
  set duties(value: number[]) {
    this._duties = value;
  }

  get user_notes(): string {
    return this._user_notes;
  }
  set user_notes(value: string) {
    this._user_notes = value;
  }

  get read_only(): boolean {
    return this._read_only;
  }
  set read_only(value: boolean) {
    this._read_only = value;
  }

  get verification_code(): string {
    return this._verification_code;
  }
  set verification_code(value: string) {
    this._verification_code = value;
  }

  get dod_day(): number {
    return this._dod_day;
  }
  set dod_day(value: number) {
    this._dod_day = +value;   //convert to number
  }

  get dod_month(): number {
    return this._dod_month;
  }
  set dod_month(value: number) {
    this._dod_month = +value;   //convert to number
  }

  toJSON(): any {
    let json: any =  {
      id: this.id,
      first_name: this._first_name,
      last_name: this._last_name,
      full_name: this._full_name,
      father_full_name: this._father_full_name,
      email: this._email,
      phone: this._phone,
      gender: this._gender,
      bar_mitzvahed: this._bar_mitzvahed,
      bar_mitzvah_parasha: this._bar_mitzvah_parasha,
      title: this._title,
      duties: this._duties,
      user_notes: this._user_notes,
      dod_day: this._dod_day,
      dod_month: this._dod_month,
    };

    if (JSON.stringify(json) == '{}')
      return undefined;
    else
      return json;
  }

  empty_string_to_null(json, field_name) {
    return json[field_name]=="" ? undefined : json[field_name];
  }

  fromJSON(json: object) {
    if (!json) return;
    this._id = json['id'];
    this._first_name = json['first_name'];
    this._last_name = json['last_name'];
    this._full_name = json['full_name'];
    if (!this._full_name && this._first_name) {this.full_name = this._first_name}    // Automatically set full_name

    this._father_full_name = json['father_full_name'];
    //this._full_name = this.empty_string_to_null(json, 'full_name');
    this._email = json['email'];
    this._phone = json['phone'];
    this._gender = json['gender'];
    this._bar_mitzvahed = json['bar_mitzvahed'];
    this._bar_mitzvah_parasha = json['bar_mitzvah_parasha'];
    this._title = json['title'] || 'yisrael';
    this._duties = json['duties'] || [];      //If json is empty, set empty array
    this._user_notes = json['user_notes'];
    this._read_only = json['read_only'];
    this._dod_day = json['dod_day'];
    this._dod_month = json['dod_month'];
    this._verification_code = json['verification_code'];
  }
}
