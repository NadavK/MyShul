import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';
import {DutiesPage} from "./duties";
import {Autosize} from "../../../components/autosize";

@NgModule({
  declarations: [
    DutiesPage,
    Autosize
  ],
  imports: [
    IonicPageModule.forChild(DutiesPage),
    TranslateModule.forChild()
  ],
  exports: [
    DutiesPage
  ]
})
export class DutiesPageModule { }
