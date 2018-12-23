import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {ParentPage} from "./parent";

@NgModule({
  declarations: [
    ParentPage,
  ],
  imports: [
    IonicPageModule.forChild(ParentPage),
    TranslateModule.forChild()
  ],
  exports: [
    ParentPage
  ]
})
export class ParentPageModule { }
