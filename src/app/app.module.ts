import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from "@angular/router";
import { Http, HttpModule } from '@angular/http';

// -----------------------------------

// --- My dependancies (node_modules)

// -- Sidebar
import { SidebarModule } from 'ng-sidebar';
// -- FlexLayout
import { FlexLayoutModule } from "@angular/flex-layout";
// -- i18n
import { PushNotificationsModule, SimpleNotificationsModule } from 'angular2-notifications';
import {TranslateModule, TranslateLoader, TranslateStaticLoader} from 'ng2-translate';
// - i18n Loader for extenal locale
export function createTranslateLoader(http: Http) {
  return new TranslateStaticLoader(http, '/api/i18n', '');
}

// -----------------------------------

// --- My Local components
import { SpinnerComponent } from './default/components/spinner/spinner.component';
import { AppComponent } from './default/app/app.component';
import { TopBarComponent } from './default/components/topBar/my-topbar.component';
import { LanguageSelectorComponent } from './default/components/languageSelector/languageselector.component';
import { LoginComponent } from './default/components/login/login.component';
import { RegisterComponent } from './default/components/register/register.component';
import { ForgotComponent } from './default/components/forgot/forgot.component';
import { ResetComponent } from './default/components/reset/reset.component';
// - My Local pages
import { HomePageComponent } from './default/pages/home/home-page.component';

// --- My local services
import { HttpService } from './default/services/http.service';
import { LanguageService } from './default/services/language.service';
import { SocketService } from './default/services/socket.service';
import { AuthService } from './default/services/auth.service';
import { SharedService } from './default/services/shared.service';
import { ToastService } from './default/services/toast.service';
import { NotificationService } from './default/services/notification.service';

// --- My local router
import { RoutingModule } from './routing.module';

// -----------------------------------

// --- Module declaration

@NgModule({
  declarations: [
    AppComponent,
    TopBarComponent,
    LanguageSelectorComponent,
    LoginComponent,
    ForgotComponent,
    ResetComponent,
    RegisterComponent,
    HomePageComponent
  ],
  exports: [],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,

    // Sidebar
    SidebarModule.forRoot(),

    // Flex Layout
    FlexLayoutModule,

    // Push + Toast
    PushNotificationsModule,
    SimpleNotificationsModule.forRoot(),

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
    AuthService,
    ToastService,
    NotificationService
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
  constructor(private _auth: AuthService, private _language: LanguageService) {
    this._auth.pingAuth().subscribe(
      (data)=> {
        if (!data) {
          this._language.autoDetectLanguage();
        } else {
          this._language.setLanguage(data.settings.language);
          //this._ns.init();
          //if(this._router.url == "/home") {
          //  this._router.navigate(['/profile']);
          //}
        }
      }
    );
  }
}
