import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { SignupPage } from './signup';
import {AccountPageModule} from "../profile-pages/account/account.module";
import {ContactPageModule} from "../profile-pages/contact/contact.module";
import {DutiesPageModule} from "../profile-pages/duties/duties.module";
import {FamilyPageModule} from "../profile-pages/family/family.module";
import {PasswordPageModule} from "../profile-pages/password/password.module";
import {ParentPageModule} from "../profile-pages/parent/parent.module";
import {PersonalPageModule} from "../profile-pages/personal/personal.module";
import {SignupRelatedUserPageModule} from "../signup-related-user/signup-related-user.module";

@NgModule({
  declarations: [
    SignupPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupPage),
    TranslateModule.forChild(),
    AccountPageModule,
    ContactPageModule,
    DutiesPageModule,
    FamilyPageModule,
    PasswordPageModule,
    ParentPageModule,
    PersonalPageModule,
    SignupRelatedUserPageModule,
  ],
  exports: [
    SignupPage
  ]
})
export class SignupPageModule { }
