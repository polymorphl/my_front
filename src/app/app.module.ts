import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { AppComponent } from './default/app.component';
import { HomePageComponent } from './default/pages/home/home-page.component';

// My services
import { HttpService } from './default/services/http.service';
import { LanguageService } from './default/services/language.service';
import { SocketService } from './default/services/socket.service';
import { AuthService } from './default/services/auth.service';
import { SharedService } from './default/services/shared.service';

// My local routes
import { RoutingModule } from './routing.module';

// -----------------------------------

// Module declaration

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent
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
    }),

    // Routing
    RoutingModule
  ],
  providers: [
    HttpService,
    LanguageService,
    SocketService,
    SharedService,
    AuthService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor() {}
}
