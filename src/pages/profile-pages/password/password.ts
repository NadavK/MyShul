import { Component } from '@angular/core';
import { LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';
import {Auth} from "../../../providers/auth";
import {ProfilePageBase} from "../profile-page-base";
import {Data} from "../../../providers/data";

@Component({
  selector: 'page-password',
  templateUrl: 'password.html'
})
export class PasswordPage extends ProfilePageBase {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type

  // Our translated text strings
  //private password_confirm: string;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public auth: Auth,
              public data: Data,
              public navParams: NavParams) {
    super(navCtrl, toastCtrl, loadingCtrl, translateService, data, navParams);
  }

  done() {
    console.log('DONE', this.data.datastore.user.first_name, this.data.datastore.user.last_name);
    if (!this.data.datastore.user.password || this.data.datastore.user.password.length < 6) {
      // Unable to sign up
      this.toastMsg(this.translateService.instant('SET_PASSWORD'));
      return;
    }
    /*if (this.data.datastore.user.password != this.password_confirm) {
      // Unable to sign up
      this.toastMsg(this.translateService.instant('PASSWORD_DONT_MATCH_ERROR'));
      return;
    }*/
    this.doSignup();
  }

  doSignup() {
    this.showLoading();

    this.auth.signup(this.data.datastore.user.signupInfo())
      .subscribe((data) => {
        console.log('signup:', data);
        this.data.setUser(data);
        this.loading.dismiss().catch(() => {});
        this.NextPage();
    }, (err) => {
      // Unable to sign up
        console.log('err:', err);
      this.toastMsg(this.translateService.instant('SIGNUP_ERROR') + '\n' + err);
      this.loading.dismiss().catch(() => {});
    });
  }


}
