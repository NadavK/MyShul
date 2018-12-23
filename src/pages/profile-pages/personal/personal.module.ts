import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {PersonalPage} from "./personal";

@NgModule({
  declarations: [
    PersonalPage,
  ],
  imports: [
    IonicPageModule.forChild(PersonalPage),
    TranslateModule.forChild()
  ],
  exports: [
    PersonalPage
  ]
})
export class PersonalPageModule { }
