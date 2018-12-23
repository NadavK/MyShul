import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import {ProfilePageBase} from "../profile-page-base";
import {Data} from "../../../providers/data";
import {Duty} from "../../../models/duty";
import {Parasha} from "../../../models/parasha";
import {Profiles} from "../../../providers/profiles";

@Component({
  selector: 'page-duties',
  templateUrl: 'duties.html'
})
export class DutiesPage extends ProfilePageBase {
  selectedParasha: Parasha;
  duties: Duty[];

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public data: Data,
              public profiles: Profiles,
              public navParams: NavParams) {
    super(navCtrl, toastCtrl, loadingCtrl, translateService, data, navParams);

    data.duties
      .subscribe((duties: Duty[]) => this.duties = duties);
  }

  //changeParasha(value: Parasha)
  //{
  //  this.selectedParasha = value;
  //}

  get relevantDuties () {
    var filtered = this.duties.filter((duty) => {
      if (!duty.applicable_for_profile) return false;
      if (this.user.bar_mitzvahed)
        return duty.applicable_for_adults;
      else
        return duty.applicable_for_children;
    });

    return filtered.sort((a, b) => {
      return (a.order_id < b.order_id) ? -1 : (a.order_id > b.order_id) ? 1 : 0;
    });
  }

  checkIfChecked(id): boolean {

    try {
      return this.user.duties.indexOf(id) != -1;
    } catch (e) {
      return false;
    }
  }

  updateCheckedOptions(id, event) {
      console.log('Duties profile:', this.user);
      console.log('Duties duties:', this.user.duties);

    try {
      let index = this.user.duties.indexOf(id);
      if (index > -1) {
        this.user.duties.splice(index, 1);
      } else {
        this.user.duties.push(id);
      }
      console.log('Duties:', this.user.duties);
    } catch (e) {
      console.log('Duties:', e);
      return false;
    }
  }

  // TODO: Remove this when we're done
  //get diagnostic() { return JSON.stringify(this.user); }

  done() {
    console.log('Duties-page:', this.duties);
    //console.log('Duties-page p:', this.user.profile);
    //console.log('Dutiespage e:', this.user.profile.dob);
    //console.log('Duties-page b:', this.user.profile.bar_mitzvah_parasha);

    this.save();
  }

  save() {
    this.showLoading();

    this.profiles.save(this.user).subscribe(
      allowed => {
          this.loading.dismiss().catch(() => {});
          if (allowed) {
            this.NextPage();
          }
          else{
            this.toastMsg("Error");
          }
      },
      error => {
        this.loading.dismiss().catch(() => {});
        this.toastMsg(error);
      });
  }

}
