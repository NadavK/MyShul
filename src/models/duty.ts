export class Duty
{
  id: number;

  category: string;
  name: string;
  order_id: number;

  applicable_for_profile: boolean;
  not_applicable_for_roster: boolean;
  applicable_for_adults: boolean;
  applicable_for_children: boolean;

  applicable_for_shabbat: boolean;
  applicable_for_hag: boolean;
  applicable_for_mevarchim: boolean;

  constructor(json?: object) {
    console.log('constructorconstructorconstructorconstructorconstructorconstructorconstructorconstructorconstructorconstructorconstructorconstructor')
    if (json) {
      for (let prop in json) {
        this[prop] = json[prop];
      }
    }
  }

  fromJSON(json: any): Duty {
    console.log('fromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJsonfromJson')

    let duty = Object.create(Duty.prototype);
    Object.assign(duty, json);
    //duty.profile = UserProfile.fromJSON(json.profile);
    return duty;

      //this.id = json['id'];
      //this.category = json['category'];
      //this.name = json['name'];
      //this.order_id = json['order_id'];
  }
}
