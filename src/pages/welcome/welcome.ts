import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, ToastController} from 'ionic-angular';
import {AppVersion} from "@ionic-native/app-version";
import {TranslateService} from "@ngx-translate/core";
import {Auth} from "../../providers/auth";

//import { LoginPage } from '../login/login';
//import { SignupPage } from '../signup/signup';

/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
 */
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController, public translateService: TranslateService,
              private alertCtrl: AlertController, public toastCtrl: ToastController,
              private appVersion: AppVersion) {
  }

  login() {
    this.navCtrl.push('LoginPage', {from_welcome_page: true});
  }

  signup() {
    this.presentSiteCode();
  }

  presentSiteCode() {
    let alert = this.alertCtrl.create({
      title: this.translateService.instant('SITE_CODE_TITLE'),
      message: this.translateService.instant('SITE_CODE_MSG'),
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'site_code',
          placeholder: this.translateService.instant('SITE_CODE_LABEL'),
          type: 'number'
        }
      ],
      buttons: [
        {
          text: this.translateService.instant('CANCEL_BUTTON'),
          role: 'cancel',
          //handler: () => {
          //}
        },
        {
          text: this.translateService.instant('NEXT_BUTTON'),
          handler: (data) => {
            this.doSiteCodeCheck(data.site_code);
          }
        }
      ]
    });
    alert.present();
  }

  doSiteCodeCheck(site_code) {
    console.log('Checking site code');
    if (site_code == "45825" || site_code == "4582500")
      this.navCtrl.push('SignupPage');
    else
      this.toastMsg(this.translateService.instant('BAD_SITE_CODE'));
  }

  toastMsg(text: string) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 6000,
      position: 'top'
    });
    toast.present();
  }


  versions() {
    return "X";
    /*return this.appVersion.getAppName() + ", " +
      this.appVersion.getPackageName() + ", " +
      this.appVersion.getVersionCode() + ", " +
      this.appVersion.getVersionNumber();*/
  }
}
