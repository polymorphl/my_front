import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Http, HttpModule } from '@angular/http';

import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';

// Locals services && components
import { HttpService } from './services/http.service';
import { LanguageService } from './services/language.service';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';
import { NotificationService } from './services/notification.service';
import { AppComponent } from './app.component';

// TODO

// THINK ABOUT LANDIng MODULE

// Locals modules
//import { AppRoutingModule } from './app-routing.module';

// Loader for extenal locale
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/api/i18n', '');
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,

    // i18n module
    TranslateModule.forRoot({
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    }),

    // Application routing
    // AppRoutingModule
  ],
  providers: [
    HttpService,
    SharedService,
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

  constructor(public auth: AuthService,
              private _router: Router,
              private _ns: NotificationService,
              private _language: LanguageService) {
      auth.pingAuth().subscribe(
        (data)=> {
          if (!data) {
            this._language.autoDetectLanguage();
          } else {
            this._language.setLanguage(data.settings.language);
            this._ns.init();
            if(this._router.url == "/home") {
              this._router.navigate(['/profile']);
            }
          }
        }
      );
    }

}
