import {Component} from '@angular/core';
import {AlertController, Loading, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {Auth} from "../../../providers/auth";
import {ProfilePageBase} from "../profile-page-base";
import {Data} from "../../../providers/data";
import {CheckUser} from "../../../models/check_user";

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class AccountPage extends ProfilePageBase {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  loading: Loading;
  verified_user_details: string;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public auth: Auth,
              public data: Data,
              private alertCtrl: AlertController,
              public navParams: NavParams) {
    super(navCtrl, toastCtrl, loadingCtrl, translateService, data, navParams);
  }

  done() {
    if (!this.data.datastore.user.first_name || !this.data.datastore.user.last_name) {
      // Unable to sign up
      this.toastMsg(this.translateService.instant('SET_NAMES'));
      return;
    }

    this.doCheck();
  }

  doCheck() {
    this.showLoading();

    this.auth.check(this.user, check_user => {
      console.log('Check: ', check_user);
      this.loading.dismiss().catch(() => {
      });
      if (check_user.error) {
        this.toastMsg(check_user.error);
      }
      else if (check_user.exists) {     // User exist, is it verified?
        if (check_user.verified) {
          console.log('Check: Verified');
          this.toastMsg(this.translateService.instant('USER_ALREADY_EXISTS'));
        }
        else if (check_user.valid_verification_code) {
          console.log('Check: verification_code_ok');
          this.NextPage();
        }
        else {
          console.log('Check: Confirm User');
          //Validate that the user is who they say they are - ask for validation code
          this.presentConfirmUser(check_user).then(proceed => {
            console.log('confirmed add: ', proceed);
            if (proceed) this.doCheck();
          });
        }
      }
      else {     // User does not exist, so we can create this new user
        console.log('Check: Does not exist');
        this.NextPage();
      }
    });
  }

  presentConfirmUser(check_user: CheckUser): Promise<any> {
    return new Promise((resolve, reject) => {
      let msg: string;
      if (check_user.relation == 'spouse')
        msg = this.translateService.instant('SIGNUP_CODE_MSG_SIGNUP_SPOUSE');
      else //if (check_user.relation == 'child')
        msg = this.translateService.instant('SIGNUP_CODE_MSG_SIGNUP_CHILD');
      let alert = this.alertCtrl.create({
        title: this.translateService.instant('CONFIRM_USER_TITLE'),
        message: msg,
        enableBackdropDismiss: false,
        inputs: [
          {
            name: 'verification_code',
            placeholder: this.translateService.instant('SIGNUP_CODE_LABEL'),
            type: 'number'
          }
        ],
        buttons: [
          {
            text: this.translateService.instant('CANCEL_BUTTON'),
            role: 'cancel',
            handler: () => {
              resolve(false);
            }
          },
          {
            text: this.translateService.instant('NEXT_BUTTON'),
            handler: (data) => {
              this.user.verification_code = data.verification_code;
              resolve(true);
            }
          }
        ]
      });
      alert.present();
    });
  }

  presentVerificationSignUp() {
    let alert = this.alertCtrl.create({
      title: this.translateService.instant('SIGNUP_CODE_TITLE'),
      message: this.translateService.instant('SIGNUP_CODE_MSG_SIGNUP'),
      enableBackdropDismiss: false,
      inputs: [
        {
          name: 'verification_code',
          placeholder: this.translateService.instant('SIGNUP_CODE_LABEL'),
          type: 'number'
        }
      ],
      buttons: [
        {
          text: this.translateService.instant('CANCEL_BUTTON'),
          role: 'cancel',
          handler: () => {
            //this.user.first_name = null;
            //this.user.last_name = null;
            this.user.verification_code = null;
            this.verified_user_details = null;
          }
        },
        {
          text: this.translateService.instant('NEXT_BUTTON'),
          handler: (data) => {
            this.user.verification_code = data.verification_code;
            this.doGetProfiles();
          }
        }
      ]
    });
    alert.present();
  }

  doGetProfiles() {
    console.log('Getting profiles');
    this.showLoading();
    this.auth.get_profiles(this.user.verification_code).subscribe(profiles => {
        console.log('Got profiles: ', profiles);
        this.loading.dismiss().catch(() => {
        });
        // No profiles returned?
        if (Object.keys(profiles).length == 0) {
          this.toastMsg(this.translateService.instant('BAD_SIGNUP_CODE'));
        }
        // only a single profile was returned? so pick it
        else if (Object.keys(profiles).length == 1) {
          for (let id in profiles) {
            this.setUser(profiles[id], id);
          }
        }
        else {
          this.presentProfiles(profiles);
        }
      },
      error => {
        this.loading.dismiss().catch(() => {
        });
        this.toastMsg(this.translateService.instant('BAD_SIGNUP_CODE'));
      });
  }

  setUser(profile, profile_id?) {
    this.user.first_name = profile.first_name;
    this.user.last_name = profile.last_name;
    this.user.id = profile_id;
    //this.user.verification_code = check_user.verification_code;
    this.verified_user_details = profile.first_name || profile.full_name;
    console.log('Check: Confirmed sign-up code');
  }

  presentProfiles(profiles: any) {
    let msg: string;
    let alert = this.alertCtrl.create({
      title: this.translateService.instant('SIGNUP_CODE_TITLE'),
      //message: this.translateService.instant('CONFIRM_FAMILY_LABEL') + '<BR>' + family,
      message: msg,
      enableBackdropDismiss: false,
      buttons: [
        {
          text: this.translateService.instant('CANCEL_BUTTON'),
          role: 'cancel',
          handler: () => {
            this.user.verification_code = null;
            this.verified_user_details = null;
          }
        },
        {
          text: this.translateService.instant('NEXT_BUTTON'),
          handler: (id) => {
            this.setUser(profiles[id], id);
            //this.doVerificationCheck(this.user);
          }
        }
      ]
    });

    for (let id in profiles) {
      alert.addInput({
        type: 'radio',
        label: profiles[id].first_name ? profiles[id].first_name + ' ' + profiles[id].last_name : profiles[id].full_name,
        value: id
      });
    }
    alert.present();
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: this.translateService.instant('PLEASE_WAIT'),
    });
    this.loading.present();
  }

}
