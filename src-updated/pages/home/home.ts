import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { genres } from '../../constant/genres';
import { Observable } from 'rxjs/Observable';
import { Genre } from '../../constant/genre';
import "rxjs/add/observable/of";
import { StationPage } from '../station/station';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements AfterViewInit {

  public genres:Observable<Genre[]>

  constructor(public navCtrl: NavController) {

  }

  ngAfterViewInit(){
    this.genres = Observable.of(genres)
  }

  gotoStations(genre:Genre){
    this.navCtrl.push(StationPage,genre)
  }
}
