import {EventEmitter, Input, Output} from '@angular/core';
import {Loading, LoadingController, NavController, NavParams, Toast, ToastController} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {User} from "../../models/user";
import {Data} from "../../providers/data";
import {MainPage} from "../pages";


export abstract class ProfilePageBase {
  user: User;
  loading: Loading;
  toast: Toast;
  @Output() complete = new EventEmitter();

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              public loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public data: Data,
              public navParams: NavParams) {

    let username = navParams.get('username');
    console.log("ProfilePageBase:", username);

    //this.user = new User();   //Just so page will not have null object
    this.data.getUser(username).subscribe((user: User) => {
      //this.data.user.subscribe((user: User) => {
      this.user = user;
      console.log('Using user (settings-page-base):', user.username, user)
    });


    /*
        //this.data.user
        //  .subscribe((user: User) => this.user = user);

        if (!user_type || user_type == 'user') {
          this.data.user
            .subscribe((user: User) => this.user = user);
        } else if (user_type == 'spouse') {
          this.data.spouse
            .subscribe((spouse: User) => this.user = spouse);
        } else if (user_type == 'child') {
          this.data.children
            .subscribe((child: User[]) => this.user = child[user_index]);
        }
    */
    //this.data.loadAll().then(result => {
    //    //this.companies =  result;
    //});

  }

  _mode: string = '';

  get mode() {
    return this._mode;
  }

  @Input()
  set mode(mode: string) {
    // Here you can do what you want with the variable
    console.log('set mode', mode);
    this._mode = (mode && mode.trim()) || '';
  }

  get signup() {
    return this._mode == 'signup';
  }

  get edit() {
    return this._mode == 'edit';
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: this.translateService.instant('PLEASE_WAIT'),
    });
    this.loading.present();
  }


  // Sometimes if the submit button did not have a 'clicked-on' then the button didn't do anything.
  // A 'clicked-on' seems to fix this.
  clickedNext() {
    console.log('clickedNext - doing done');
    this.done();
  }

  clickedBack() {
    console.log('clickedBack');
    this.PreviousPage();
  }

  abstract done();

  NextPage() {
    this.complete.next(+1);
  }

  PreviousPage() {
    this.complete.next(-1);
  }

  Cancel() {
    this.complete.next(0);
  }

  Done() {
    this.navCtrl.setRoot(MainPage);
  }

  toastMsg(text: string) {
    this.toast = this.toastCtrl.create({
      message: text,
      duration: 10000,
      position: 'top'
    });
    this.toast.present();
  }

  dismissToast() {
    if (this.toast) {
      this.toast.dismiss();
    }
  }

}
