import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Nav, Platform } from 'ionic-angular';

import { FirstRunPage } from '../pages/pages';
import { Settings } from '../providers/providers';

@Component({
  template: `<ion-menu [content]="content">
    <ion-header>
      <ion-toolbar>
        <ion-title>Pages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <button menuClose ion-item *ngFor="let p of pages" (click)="openPage(p)">
          {{p.title}}
        </button>
      </ion-list>
    </ion-content>

  </ion-menu>
  <ion-nav #content [root]="rootPage"></ion-nav>`
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [
    { title: 'Tutorial', component: 'TutorialPage' },
    { title: 'Welcome', component: 'WelcomePage' },
    { title: 'Tabs', component: 'TabsPage' },
    { title: 'Cards', component: 'CardsPage' },
    { title: 'Content', component: 'ContentPage' },
    { title: 'Login', component: 'LoginPage' },
    { title: 'Signup', component: 'SignupPage' },
    { title: 'Master Detail', component: 'ListMasterPage' },
    { title: 'Menu', component: 'MenuPage' },
    { title: 'Profile', component: 'ProfilePage' },
    { title: 'Search', component: 'SearchPage' }
  ]

  constructor(private translate: TranslateService, public platform: Platform, settings: Settings, private statusBar: StatusBar, private splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('he');

    const browserLang = this.translate.getBrowserLang();

    console.log('BrowserLang: ', browserLang);
    if (browserLang && (browserLang == 'he' || browserLang == 'he-IL' || browserLang == 'iw-IL')) {
      console.log('Setting language to he');
      this.translate.use('he'); // Set your language here
      this.platform.setLang('he', false);
      this.platform.setDir('rtl', true);
    } else {
      console.log('Setting language to en');
      this.translate.use('en'); // Set your language here
      this.platform.setLang('en', false);
      this.platform.setDir('ltr', true);
    }

    /*this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
    this.translate.use('he'); // Set your language here
    this.platform.setDir('rtl', true);
    this.globalization.getPreferredLanguage()
      .then(res => {
        console.log('getPreferredLanguage: ', res);
        if (res.value != 'he' && res.value != 'he-IL' && res.value != 'iw-IL') {
          console.log('Changing language to en');
          this.translate.use('en'); // Set your language here
          this.platform.setDir('ltr', true);
        }
      })
      .catch(e => console.log('getPreferredLanguage ERROR: ', e));
    this.globalization.getLocaleName()
      .then(res => console.log('getLocaleName: ', res))
      .catch(e => console.log('getLocaleName ERROR: ', e));
    */
    //this.platform.setLang(language, updateDocument)
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
