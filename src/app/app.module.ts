import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { Media } from '@ionic-native/media';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { GenreBrowserPage } from '../pages/genre-browser/genre-browser';
import { MediaStreamServiceProvider } from '../providers/media-stream-service/media-stream-service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GenreBrowserPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GenreBrowserPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Media,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MediaStreamServiceProvider
  ]
})
export class AppModule {}
