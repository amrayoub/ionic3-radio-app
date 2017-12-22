import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Media,MediaObject } from '@ionic-native/media';

import { Station } from '../../constant/station';
import { Subject } from 'rxjs/Subject';
import { streamDefaults } from '../../constant/stream';
import { Subscription } from 'rxjs/Subscription';

/*
  Generated class for the MediaStreamProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MediaStreamProvider {

  private currentStreamFile:MediaObject
  private activeStation:Station  
  private isStreaming:boolean
  private local_song:string
  private timeout:number
  private localMeta:any

  private httpsubscriptions:Subscription
  public streamMeta:Subject<any>

  public streamState:Subject<boolean>

  constructor(private http: HttpClient,private media:Media) {
    this.activeStation = null
    this.isStreaming = false
    this.local_song = null
    this.timeout =0
    this.localMeta =null
    this.streamState = new Subject()  
    this.streamMeta = new Subject()
  }

  public changeStream(station:Station){
    this.activeStation = station
    if(this.currentStreamFile){
      this.currentStreamFile.stop()
      this.currentStreamFile.release()
    }
    this.streamState.next(false)
    this.isStreaming = false
    this.updateStreamMeta()
  }

  public getStreamState():boolean{
    return this.isStreaming
  }

  public getCurrentMeta(){
    return this.localMeta
  }

  public pauseStream(){
    this.currentStreamFile.pause()
    this.streamState.next(false)
    this.isStreaming = false
  }

  public resumeStream(){
    this.currentStreamFile.play()
    this.streamMeta.next(true)
    this.isStreaming = true
  }

  public getActiveStation():Station{
    return this.activeStation;
  }

  private updateStreamMeta(){
    let stationUrl = streamDefaults.playback_ext  ==
     'mp3' ? this.activeStation.getMP3PlaybackURL() :
      this.activeStation.getAACPlaybackURL()
      this.currentStreamFile = this.media.create(streamDefaults.base_url+stationUrl)

      this.dispose()
      this.currentStreamFile.play()
      this.getStreamMeta(stationUrl)
  }

  private getStreamMeta(stationUrl:string){
    this.httpsubscriptions = this.http.get<any>('http://stream-meta.jdevcloud.com/?action=stationMeta&id='+stationUrl)
    .subscribe({
      next:(e)=>{
        let song = e.song
        return (song != this.local_song && song != '181.fm - Music Promo60') ? this.getSongMeta(song,stationUrl) : this.refreshStreamMeta(stationUrl);
      },
      error:(e)=>{
        return
      }
    })
  }

  private getSongMeta(song:string,stationUrl:string){
    let key =  song
    if(song.indexOf('f/')!= -1){
      key = song.replace('f/','feat. ')
      key = key.substring(0,key.lastIndexOf(' -'))
    }
    this.httpsubscriptions = this.http.get<any>("http://stream-meta.jdevcloud.com/?action=songMeta&key="+key)
    .subscribe(e=>{
      let d = {...e,song:key}
      this.localMeta = d
      this.streamMeta.next(d)
    })
    this.local_song = song
    this.refreshStreamMeta(stationUrl)
  }

  private refreshStreamMeta(stationUrl:string){
    this.timeout = setTimeout(() => {
      this.getStreamMeta(stationUrl)
    }, 29000);
    this.timeout
  }

  public dispose(){
    if(this.httpsubscriptions != undefined){
      this.httpsubscriptions.unsubscribe()
    }
    clearTimeout(this.timeout||1)
  }

}


