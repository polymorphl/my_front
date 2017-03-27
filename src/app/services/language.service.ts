import {Injectable} from '@angular/core'
import {Observable} from "rxjs";
import {TranslateService} from "ng2-translate";

import {HttpService} from './http.service';

@Injectable()
export class LanguageService {

  constructor(private ts:TranslateService,
              private http: HttpService){}

  public autoDetectLanguage() {
    let locale = this.ts.getBrowserLang();
    this.setLanguage(locale);
  }

  public setLanguage(locale: string) {
    this.ts.use(locale);
  }

  public updateLanguage(locale: string): Observable<any>{
    let tmp = { locale: locale };
    this.setLanguage(locale);
    return this.http.post(`/i18n/update`, tmp);
  }

}
