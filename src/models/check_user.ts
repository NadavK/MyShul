/**
 * Returns user's details.
 * Used when singing up to know if a user is validated or not, and if it is already associated with a family.
 * Note sure why there are so many field, though
 */
export class CheckUser {
  public exists: boolean;
  public verified: boolean;
  public family: string;
  public relation: string;
  public valid_verification_code: boolean;
  public profiles: {};
  public error: string;

  constructor(res?: any) {
    console.log('check:', res);
    this.error = null;

    if (res.status == 404) {
      this.exists = false;
      this.verified = false;
    }
    else if (res.status == 409) {
      this.exists = true;
      this.verified = true;
    }
    else if (res.status == 400) {
      this.error = 'Family has error';
    }
    else if (res.ok == false){
      this.error = res.statusText;
    }
    else  {
      this.exists = true;
      this.verified = false;
      this.family = res.family;
      this.relation = res.relation;
      this.valid_verification_code = res.valid_verification_code;
      this.profiles = res.profiles;
    }

    console.log('checked:', this);

  }

}
