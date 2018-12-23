import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {FamilyPage} from "./family";

@NgModule({
  declarations: [
    FamilyPage,
  ],
  imports: [
    IonicPageModule.forChild(FamilyPage),
    TranslateModule.forChild(),
    //SignupRelatedUserPageModule,
  ],
  exports: [
    FamilyPage
  ]
})
export class FamilyPageModule { }
