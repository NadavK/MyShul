import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {IonicPage, NavController, Platform, Slides, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-item-create',
  templateUrl: 'item-create.html'
})
export class ItemCreatePage {
  @ViewChild('fileInput') fileInput;
  @ViewChild('slides') slides: Slides;

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public platform: Platform) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
      about: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss().catch(() => {});
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  next() {
    if (this.slides.isEnd()) {
      console.log('popping');
      this.navCtrl.pop();
    }
    else {
      console.log('next');
      this.slideNext();
    }
    //this.viewCtrl.dismiss(this.form.value);
  }

  back() {
    if (this.slides.isBeginning()) {
      console.log('beginning - not doing anything');
    }
    else {
      console.log('next');
      this.slidePrevious();
    }
    //this.viewCtrl.dismiss(this.form.value);
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
}
