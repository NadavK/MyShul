import {Component} from '@angular/core';
import {LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import {ProfilePageBase} from "../profile-page-base";
import {Data} from "../../../providers/data";
import {Parasha} from "../../../models/parasha";
import {Parashas} from "../../../providers/parashas";
import {Profiles} from "../../../providers/profiles";

@Component({
  selector: 'page-personal',
  templateUrl: 'personal.html'
})
export class PersonalPage extends ProfilePageBase {
  parashas: Parasha[];
  selectedParasha: Parasha;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public data: Data,
              public profiles: Profiles,
              public parashasService: Parashas,
              public navParams: NavParams) {
    super(navCtrl, toastCtrl, loadingCtrl, translateService, data, navParams);
    //parashasService.get().subscribe(data => this.parashas = data, error => this.errorMessage = <any>error);
    parashasService.get().subscribe(data => this.parashas = data);
  }

  changeParasha(value: Parasha)
  {
    this.selectedParasha = value;
  }

  done() {
    console.log('Profile-page:', this.user);

    if (!this.user.valid_gender) {
      this.toastMsg(this.translateService.instant('SET_GENDER'));
      return;
    }
    if (!this.user.full_name) {
      this.toastMsg(this.translateService.instant('SET_FULLNAME'));
      return;
    }
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
