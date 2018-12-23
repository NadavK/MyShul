import {Component, ViewChild} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, Platform, Slides, ToastController} from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {User} from "../../models/user";
import {Data} from "../../providers/data";

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  user: User;
  loading: Loading;

  @ViewChild('slides') slides: Slides;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public platform: Platform,
              public data: Data) {
    this.data.newUser().subscribe((user: User) => {
      this.user = user;
      console.log('Using user (signup):', user)
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: this.translateService.instant('PLEASE_WAIT'),
    });
    this.loading.present();
  }

  slideNext() {
    //if(this.swiper){
    //  this.swiper.unlockSwipes();
    //}
    console.log('CLICKED2')
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  slidePrevious() {
    console.log('CLICKED_BACK')
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  onIonDrag(event) {
    this.slides.lockSwipes(true);

    console.log('DRAGGED', event);
    //this.slides.getActiveIndex().done();
    //this.swiper = event;
    //this.swiper.lockSwipes();
  }

  ///-1 for back, 0 to stop, +1 for next
  complete(direction: number) {
    console.log('complete: ', direction);
    if (direction > 0) {          //Next
      if (this.slides.isEnd())
        this.navCtrl.setRoot('ProfilePage');
      else
        this.slideNext();
    } else if (direction < 0) {   //Previous
      if (this.slides.isBeginning())
        this.navCtrl.pop();
      else
        this.slidePrevious();
    } else                        //Cancel
      this.navCtrl.pop();
  }
}
