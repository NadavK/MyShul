import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {PasswordPage} from "./password";

@NgModule({
  declarations: [
    PasswordPage,
  ],
  imports: [
    IonicPageModule.forChild(PasswordPage),
    TranslateModule.forChild()
  ],
  exports: [
    PasswordPage
  ]
})
export class PasswordPageModule { }
