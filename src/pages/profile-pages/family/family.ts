import {AlertController, NavParams} from 'ionic-angular';
import {Component} from '@angular/core';
import {LoadingController, NavController, ToastController} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {Auth} from "../../../providers/auth";
import {ProfilePageBase} from "../profile-page-base";
import {Data} from "../../../providers/data";
import {Profiles} from "../../../providers/profiles";
import {User} from "../../../models/user";
import {UserBase} from "../../../models/user-base";

@Component({
  selector: 'page-family',
  templateUrl: 'family.html'
})
export class FamilyPage extends ProfilePageBase {

  newUser: User;
  showPasswordText_child: boolean[] = [];

  constructor(public navCtrl: NavController,
              private alertCtrl: AlertController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public auth: Auth,
              public data: Data,
              public profiles: Profiles,
              public navParams: NavParams) {
    super(navCtrl, toastCtrl, loadingCtrl, translateService, data, navParams);
  }

  presentNewUserPrompt(title: string, last_name?): Promise<any> {
    this.newUser = new User();

    return new Promise((resolve, reject) => {

      let alert = this.alertCtrl.create({
        title: title,
        //subTitle: "subtitle",
        //message: "message" ,
        inputs: [
          {
            name: 'first_name',
            placeholder: this.translateService.instant('FIRST_NAME'),
            type: 'text'
          },
          {
            name: 'last_name',
            placeholder: this.translateService.instant('LAST_NAME'),
            type: 'text',
            value: last_name
          }
        ],
        buttons: [
          {
            text: this.translateService.instant('CANCEL_BUTTON'),
            role: 'cancel',
            handler: data => {
              console.log('Cancel clicked');
              resolve(false);
            }
          },
          {
            text: this.translateService.instant('ADD'),
            handler: data => {
              this.newUser.first_name = data.first_name;
              this.newUser.last_name = data.last_name;
              this.checkAccount().then(result => {
                console.log('checkAccount returned ', result);
                if (result) return resolve(true);
              });
            }
          }
        ]
      });
      alert.present();
    });
  }

  clickedAddSpouse() {
    //Prompt the user for the name
    this.presentNewUserPrompt(this.translateService.instant('SPOUSE'), this.user.last_name).then(add => {
      if (add) {
        //Set gender
        this.newUser.gender = this.user.spouse_default_gender;

        //Call add API
        this.profiles.addSpouse(this.user, this.newUser).subscribe(json => {
            this.loading.dismiss().catch(() => {});
            //Create user and add to datastore
            let spouse = this.data.addSpouse(json);

            //Continue to add new user details
            this.relatedUserWizard(spouse);

            //this.data.spouse
            //  .subscribe((spouse: User) => this.spouse = spouse);
            //this.data.children

          },
          error => {
            this.loading.dismiss().catch(() => {});
            this.toastMsg(error);
          });
      }
    });
  }

  clickedAddChild() {
    //Prompt the user for the name
    this.presentNewUserPrompt(this.translateService.instant('CHILD'), this.user.last_name).then(add => {
      if (add) {
          //Set new_user_title from father
          if (this.user.male)
              this.newUser.title = this.user.title;
          else if (this.user.spouse)     // spouse must be male...
              this.newUser.title = this.user.spouse.title;

        //Call add API
        this.profiles.addChild(this.user, this.newUser).subscribe(json => {
          this.loading.dismiss().catch(() => {});
          //Create user and add to datastore
          let child = this.data.addChild(json);


          console.log('PARENT USER:', this.user);
          console.log('PARENT USER TITLE:', this.user.title);



          //Continue to add new user details
          this.relatedUserWizard(child);
          },
          error => {
            this.loading.dismiss().catch(() => {});
            this.toastMsg(error);
          });
      }
    });
  }

  relatedUserWizard(user: UserBase) {
    if (user.read_only)
      return;
    //this.showLoading();
    //this.clickedAddChild();

    this.navCtrl.push('SignupRelatedUserPage', {username: user.username});
  }

  checkAccount(): Promise<boolean> {
    return new Promise((resolve) => {
      this.showLoading();
      this.auth.check(this.newUser, check_user => {
        this.loading.dismiss().catch(() => {});
        console.log('Check: ', check_user);
        console.log('Check.error: ', check_user.error);
        console.log('Check.exist: ', check_user.exists);
        if (check_user.error) {
          this.toastMsg(check_user.error);
          resolve(false);
        }
        else if (check_user.exists) {     // User exists, is it verified?
          this.toastMsg(this.translateService.instant('USER_ALREADY_EXISTS'));
          resolve(false);
        }
        else {     // User does not exist, so we can create this new user
          console.log('Check: Does not exist');
          resolve(true);
        }
      });
    });
  }

  showVerificationCodeHelp(show: boolean = true) {
    if (show)
      this.toastMsg(this.translateService.instant('SIGNUP_CODE_HELP_CONFIG'));
    else
      this.dismissToast();
  }


  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: this.translateService.instant('PLEASE_WAIT'),
    });
    this.loading.present();
  }

  done() {
    this.Done();
  }

}
