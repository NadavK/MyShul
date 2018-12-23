import { Component } from '@angular/core';
import { AlertController, IonicPage, Loading, LoadingController, NavController, NavParams} from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import {Auth} from "../../providers/auth";
import {Data} from "../../providers/data";
import {User} from "../../models/user";
import {MainPage} from "../pages";

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  loading: Loading;
  credentials: { first_name: string, last_name: string, username: string, password: string, csrf: string } = {
    first_name: 'first',
    last_name: 'last',
    username: '',
    password: 'test',
    csrf: 'csrf'
  };
  from_welcome_page: boolean;       // This page is the app's first-page, but only to try and auto-login, and if it fails it goes to the welcome-screen. If this flag is true, then it means we arrived form the welcome-screen (regular login)

  constructor(public navCtrl: NavController,
              public auth: Auth,
              private loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public data: Data,
              private alertCtrl: AlertController,
              public navParams: NavParams) {
    this.from_welcome_page = navParams.get('from_welcome_page');
    console.log('login c"tor');

    this.verify_token();    //Try to auto-login
    this.credentials.first_name = auth.currentUser.first_name;
    this.credentials.last_name = auth.currentUser.last_name;
    this.credentials.password = auth.currentUser.password;
  }

  private verify_token() {
    this.showLoading();
    this.auth.verify_session().subscribe(allowed => {
      if (allowed) {
        console.log('verify_token.allowedlogin:', allowed);
        this.login_successful();
      } else {
        //this.showError("Access Denied");    no reason to show error - just show the login screen (don't nav to main-page)
        this.showError();
      }
    },
    error => {
      console.log('loading login error: ' + error);
      this.showError(error);
    });
  }

  private login_successful() {
    console.log('login_successful3');
    setTimeout(() => {
      this.data.loadAll().then(res => {
        //Splashscreen.hide();
        this.loading.dismiss().catch(() => {});
        this.navCtrl.setRoot(MainPage);
      });

    });
  }

  public login() {
    if (!this.credentials.first_name || !this.credentials.last_name || !this.credentials.password) {
      this.showError(this.translateService.instant('SET_CREDENTIALS'));
      return;
    }

    this.showLoading();
    this.credentials.username = User.generate_username(this.credentials.first_name, this.credentials.last_name);
    this.auth.login(this.credentials).subscribe(allowed => {
        if (allowed) {
          console.log('allowedlogin.:', allowed);
          this.login_successful();
        } else {
          this.showError(this.translateService.instant('LOGIN_ERROR'));
        }
      },
      error => {
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    this.loading.present();
  }

  showError(text?: string) {
    setTimeout(() => {
      this.loading.dismiss().catch(() => {});
    });

    if (!this.from_welcome_page) {        // if we did not arrive on the login page from the welcome-page, then this is the app-startup and auto-login failed, so show the welcome-page
      this.navCtrl.setRoot('WelcomePage');
      return;
    }

    if (!text)
      return;

    let alert = this.alertCtrl.create({
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  /*
  // Attempt to login in through our User service
  doLogin() {
    this.user.login(this.user).subscribe((resp) => {
      this.navCtrl.push(MainPage);
    }, (err) => {
      this.navCtrl.push(MainPage);
      // Unable to log in
      let toast = this.toastCtrl.create({
        message: this.loginErrorString,
        duration: 3000,
        position: 'top'
      });
      toast.present();
    });
  }
  */
}
