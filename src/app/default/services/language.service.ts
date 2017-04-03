import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {TranslateService} from "ng2-translate";

import {HttpService} from './http.service';
import {SharedService} from './shared.service';

@Injectable()
export class LanguageService {

  private _isLoggedIn:boolean = false;

  constructor(private _ts:TranslateService, private _http: HttpService, private _shared: SharedService) {
     this._shared.get('isLoggedIn').subscribe(d => {this._isLoggedIn = d});
  }

  public autoDetectLanguage() {
    let locale = this._ts.getBrowserLang();
    this.setLanguage(locale);
  }

  public setLanguage(locale: any) {
    this._ts.use(locale);
  }

  public updateLanguage(locale: string) {
    let tmp = { locale: locale };
    this.setLanguage(locale);
    if (this._isLoggedIn) {
      return this.updateRemote(tmp);
    }
  }

  public updateRemote(locale: any): Observable<any> {
    return this._http.post(`/i18n/update`, locale);
  }



}
