import {Component, ViewChild} from '@angular/core';
import {IonicPage, Loading, LoadingController, NavController, NavParams, Platform, Slides, ToastController} from 'ionic-angular';
import {TranslateService} from '@ngx-translate/core';
import {User} from "../../models/user";
import {Data} from "../../providers/data";
import {Auth} from "../../providers/auth";

@IonicPage()
@Component({
  selector: 'page-signup-related-user',
  templateUrl: 'signup-related-user.html'
})
export class SignupRelatedUserPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  //swiper: any;
  @ViewChild('slides') slides: Slides;
  loading: Loading;
  user: User;

  constructor(public navCtrl: NavController,
              public toastCtrl: ToastController,
              private loadingCtrl: LoadingController,
              public translateService: TranslateService,
              public platform: Platform,
              public data: Data,
              public auth: Auth,
              public navParams: NavParams) {
    let username = navParams.get('username');

    /*this.data.getUser(username).then((user: User) => {
      this.user = user;
      console.log('Using spouse user:', user.username, user);
      console.log('Using user father id:', user.father.id);
    });*/
    //this.user = new User();   //Just so page will not have null object
    //this.data.getUser(username).subscribe((user: User) => {
    this.data.getUser(username).subscribe((user: User) => {
      this.user = user;
      console.log('Using user (signup-related):', user.username, user)
    });

  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: this.translateService.instant('PLEASE_WAIT'),
    });
    this.loading.present();
  }

  slideNext(){
    //if(this.swiper){
    //  this.swiper.unlockSwipes();
    //}
    console.log('CLICKED2');
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

  slidePrevious(){
    console.log('CLICKED_BACK');
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  onIonDrag(event){
    this.slides.lockSwipes(true);

    console.log('DRAGGED')
    //this.swiper = event;
    //this.swiper.lockSwipes();
  }

  complete(direction: number)
  {
    console.log('complete (related), beginning, end, pop-ctrl: ', direction, this.slides.isBeginning(), this.slides.isEnd(), this.navCtrl.getPrevious());
    if (direction > 0) {          //Next
      if (this.slides.isEnd()) {
        console.log('popping');
        this.navCtrl.pop();
      }
      else {
        console.log('next');
        this.slideNext();
      }
    } else if (direction < 0) {   //Previous
      if (this.slides.isBeginning()) {
        console.log('popping');
        this.navCtrl.pop();
      }
      else {
        console.log('previous');
        this.slidePrevious();
      }
    } else {                       //Cancel
      console.log('popping');
      this.navCtrl.pop();
    }
  }

  ionViewCanEnter() {
    return this.auth.redirect_if_not_authenticated(this.navCtrl);
  }
}
