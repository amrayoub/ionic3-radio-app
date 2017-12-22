import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Genre } from '../../constant/genre';
import { Station } from '../../constant/station';
import { MediaStreamProvider } from '../../providers/media-stream/media-stream';

/**
 * Generated class for the StationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-station',
  templateUrl: 'station.html',
})
export class StationPage implements OnInit {

  genre:Genre
  stations:Station[]
  activeStation:Station
  isStreaming:boolean
  streamMeta:any

  constructor(public navCtrl: NavController, public navParams: NavParams, private mediaStream:MediaStreamProvider) {
  }

  ngOnInit(){
    this.genre = this.navParams.data
    this.stations = this.genre.getstations()
    this.mediaStream.streamState.subscribe(e=>{
      this.isStreaming = e
    })
  
      this.mediaStream.streamMeta.subscribe(e=>{
        this.streamMeta = e
      })


    this.isStreaming = this.mediaStream.getStreamState()
    this.activeStation = this.mediaStream.getActiveStation()
    this.streamMeta = this.mediaStream.getCurrentMeta()
  }

  setActivteStation(station:Station){
    if(this.isActiveStation(station.getID())){
      if(this.isStreaming != true){
        this.mediaStream.pauseStream()
      }else{
        this.mediaStream.resumeStream();
      }
    }else{
      this.activeStation = station
      this.mediaStream.changeStream(station)
    }
  }

  isActiveStation(id:string):boolean{
    return this.activeStation != null ? this.activeStation.getID() == id :false;
  }
  setStreamMetaImage(image){
    if(image)
    return{
      'background-image':`url(${image})`
    }
  }





}
