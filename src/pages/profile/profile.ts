import {Component} from '@angular/core';
import {IonicPage, ModalController, NavController, NavParams } from 'ionic-angular';

import {TranslateService} from '@ngx-translate/core';
import {User} from "../../models/user";
import {Data} from "../../providers/data";
import {Auth} from "../../providers/auth";

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  user: User;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public data: Data,
              public translate: TranslateService,
              private auth: Auth,
              public modalCtrl: ModalController) {
    //this.user = new User();   //Just so page will not have null object
    console.log('ProfilePage c\'tor');
    this.data.user.subscribe((user: User) => {
      this.user = user;
      console.log('Using user (profile):', user.username, user);
    });
	}

/*
	getSuitableLanguage(language) {
		language = language.substring(0, 2).toLowerCase();
		return availableLanguages.some(x => x.code == language) ? language : defaultLanguage;
	}*/
  logout(){
    this.auth.logout();
    this.navCtrl.setRoot('WelcomePage');
  }

  ionViewCanEnter() {
    return this.auth.redirect_if_not_authenticated(this.navCtrl);
  }

  /*addItem() {
    let addModal = this.modalCtrl.create('ItemCreatePage');     // For testing Hebrew on R'ee's mobile
    addModal.onDidDismiss(null);
    addModal.present();
  }*/
}
