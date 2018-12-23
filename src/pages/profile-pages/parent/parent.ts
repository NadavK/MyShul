import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {ProfilePageBase} from "../profile-page-base";
import {Data} from "../../../providers/data";
import {Profiles} from "../../../providers/profiles";

@Component({
  selector: 'page-parent',
  templateUrl: 'parent.html'
})
export class ParentPage extends ProfilePageBase {
  //@Input() parent_type: string;
  //readonly father_type = "father";
  //readonly mother_type = "mother";

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public data: Data,
              public profiles: Profiles,
              public navParams: NavParams) {
    super(navCtrl, toastCtrl, loadingCtrl, translateService, data, navParams);
  }

  done() {
    if (!this.user.father.full_name) {
      this.toastMsg(this.translateService.instant('SET_FULLNAME_FATHER'));
      return;
    }
    if (!this.user.father.father_full_name) {
      this.toastMsg(this.translateService.instant('SET_FULLNAME_FATHERFATHER'));
      return;
    }
    if (!this.user.mother.full_name) {
      this.toastMsg(this.translateService.instant('SET_FULLNAME_MOTHER'));
      return;
    }

    if (this.user.male) {
      this.user.father.title = this.user.title; }

    console.log(this.user);
    this.save();
  }

  /*get parent(): Profile {
    return (this.parent_type == this.father_type) ? this.user.father : this.user.mother;
  }

  get is_father(): boolean {
    return (this.parent_type == this.father_type);
  }
  */

  save() {
    this.showLoading();

    // Save Father
    this.profiles.add_or_save_parent(this.user, this.user.father).subscribe(json => {
        this.user.father.fromJSON(json);

        // Save Mother
        this.profiles.add_or_save_parent(this.user, this.user.mother).subscribe(json => {
            this.loading.dismiss().catch(() => {});
            this.user.mother.fromJSON(json);
            this.NextPage();
          },
          error => {
            this.loading.dismiss().catch(() => {});
            this.toastMsg(error);
          });

      },
      error => {
        this.loading.dismiss().catch(() => {});
        this.toastMsg(error);
      });

  }

}
