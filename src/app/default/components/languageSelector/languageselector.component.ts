import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'my-language-selector',
  template: `
    <div id="core_languageSelector" *ngIf="_defaultLanguage">
      <select #langSelector (change)="updateLanguage(langSelector.value)">
        <option *ngFor="let lang of availableLanguages" value="{{lang}}" [selected]="_defaultLanguage === lang">
          {{ ('languageNames.' + lang) | translate }}
        </option>
      </select>
    </div>
  `,
  styles: [`
    #core_languageSelector {
      display: inline-block;
      height: 24px;
    }
    select { height: 24px; }
  `]
})
export class LanguageSelectorComponent implements OnInit {

  public availableLanguages: any;
  private _defaultLanguage: string;

  @Input()
  set defaultLang(locale: string) {
    this._defaultLanguage = locale;
  }

  @Output() changeState = new EventEmitter<boolean>();

  constructor() {
    this.availableLanguages = ['fr', 'en'];
  }

  ngOnInit() {}

  updateLanguage(locale) {
    this.changeState.emit(locale);
  }

}
