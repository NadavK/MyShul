import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import {SignupRelatedUserPage} from "./signup-related-user";
import {DutiesPageModule} from "../profile-pages/duties/duties.module";
import {ParentPageModule} from "../profile-pages/parent/parent.module";
import {PersonalPageModule} from "../profile-pages/personal/personal.module";

@NgModule({
  declarations: [
    SignupRelatedUserPage,
  ],
  imports: [
    IonicPageModule.forChild(SignupRelatedUserPage),
    TranslateModule.forChild(),
    DutiesPageModule,
    ParentPageModule,
    PersonalPageModule,
  ],
  exports: [
    SignupRelatedUserPage
  ]
})
export class SignupRelatedUserPageModule { }
