import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import { Profiles } from "../../../providers/profiles";
import { Data } from "../../../providers/data";
import { ProfilePageBase } from "../profile-page-base";

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage extends ProfilePageBase {

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
    console.log('Contact-page data for duties:', this.user, this.user.male);

    if (!this.user.email || !this.user.email.includes('@',)) {
      this.toastMsg(this.translateService.instant('INVALID_EMAIL'));
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
