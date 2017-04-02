import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Http, HttpModule } from '@angular/http';

// -----------------------------------

// My dependancies
// -- i18n
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';
// -- i18n Loader for extenal locale
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/api/i18n', '');
}

// -----------------------------------

// My Local component
import { AppComponent } from './app.component';

// My services
import { HttpService } from './services/http.service';
import { LanguageService } from './services/language.service';
import { SocketService } from './services/socket.service';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';

// -----------------------------------

// Module declaration

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,

    // i18n module
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  providers: [
    HttpService,
    LanguageService,
    SocketService,
    SharedService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {}
}
