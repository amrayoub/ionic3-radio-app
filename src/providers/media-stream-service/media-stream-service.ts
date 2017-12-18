import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Station } from '../../app/globals/station';
import { Media, MediaObject } from '@ionic-native/media';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
/*
  Generated class for the MediaStreamServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MediaStreamServiceProvider {
  private streamURLs = {
    stream: 'http://listen.181fm.com'
  }

  private defaultStreamQuality = 'aac';
  private station: Station = null
  private mediaFile: MediaObject
  private meta:stream_meta = null
  public streamMeta: BehaviorSubject<stream_meta> = new BehaviorSubject(this.meta)
  public streamPause: Subject<boolean> = new Subject()
  private uSubscriptions: Subscription
  private httpSubscriptions: Subscription

  private local_song: string = ''
  private timeout = 0


  constructor(private http: HttpClient, private media: Media) {
    this.httpSubscriptions = new Subscription()
    this.uSubscriptions = new Subscription()
    this.streamPause.next(false)
  }

  pauseStream() {
    this.mediaFile.pause()
    this.streamPause.next(true)
  }
  resumeStream() {
    this.streamPause.next(false)
    this.mediaFile.play()
  }

  getActiveStation(): Station {
    return this.station
  }

  changeStreamSource(station: Station) {
    this.station = station
    if (this.mediaFile) {
      this.mediaFile.stop()
      this.mediaFile.release()
      this.mediaFile = null
    }
    this.updateStreamMeta()
    this.streamPause.next(false)
  }


  private updateStreamMeta() {
    let stationURL = this.defaultStreamQuality == 'mp3' ? this.station.getMP3PlaybackURL() : this.station.getAACPlaybackURL();

    this.mediaFile = this.media.create(this.streamURLs.stream + '/' + stationURL)

    this.mediaFile.onError.subscribe(e => {
      if (e == this.media.MEDIA_ERR_NONE_SUPPORTED) {
        this.mediaFile = this.media.create(this.streamURLs.stream + ':' + this.station.getPlaybackFallbackPort())
      }
    })

    this.die()
    this.uSubscriptions.add(this.httpSubscriptions)
    this.mediaFile.play()
    this.getStationMeta(stationURL)
  }

  private getStationMeta(station) {
    this.httpSubscriptions = this.http.get<any>(`http://localhost/radio/?id=${station}&action=stationMeta`)
      .subscribe({
        next: (e) => {
          return (e.song != this.local_song && e.song != '181.fm - Music Promo60') ? this.getSongMeta(e.song, station) : this.refreshStreamMeta(station)
        },
        error: (e) => {
          alert(JSON.stringify(e))
        }
      })
  }

  private getSongMeta(song: string, station) {
    var s = song
    if (song.indexOf('f/') != -1) {
      s = song.replace('f/', 'feat. ')
      s = s.substring(0, s.lastIndexOf(' -'))
    }

    this.httpSubscriptions = this.http.get<stream_meta>(`http://localhost/radio/?action=songMeta&key=${s}`)
      .subscribe(e => {
        let d = { ...e, song: s }
        this.meta = d
        this.streamMeta.next(d)
      })
    this.local_song = song
    this.refreshStreamMeta(station)
  }

  private refreshStreamMeta(station) {
    this.timeout = setTimeout(() => {
      this.getStationMeta(station)
    }, 22000)
    this.timeout
  }
  die() {
    this.uSubscriptions.unsubscribe();
    clearTimeout(this.timeout || 1)
  }
}

export interface stream_meta {
  readonly Title: string
  readonly Artist: string
  readonly Image: string
  readonly LargeImage: string
  song: string
}