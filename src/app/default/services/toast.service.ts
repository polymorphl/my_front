import {Injectable} from '@angular/core'
import {TranslateService} from "ng2-translate";
import {NotificationsService} from "angular2-notifications/components";

@Injectable()
export class ToastService {

  constructor(private _ts: TranslateService,
              private _toast: NotificationsService) {}

  getErrorTitle(): string {
    let errorTitle = {};
    this._ts.get('error').subscribe((res: Object) => { errorTitle = res; });
    return errorTitle.toString();
  }

  getSuccessTitle(): string {
    let successTitle = {};
    this._ts.get('success').subscribe((res: Object) => { successTitle = res; });
    return successTitle.toString();
  }

  getInfoTitle(): string {
    let infoTitle = {};
    this._ts.get('info').subscribe((res: Object) => { infoTitle = res; });
    return infoTitle.toString();
  }

  getFields(input, field) {
    debugger;
    return input.map(function(o) {
      return o[field];
    });
  }

  translateStatic(data: any):Object {
    let o = this.getFields(data, 'msg');
    let r = {};
    this._ts.get(o).subscribe((res: Object) => {
      r = res;
    });
    return r;
  }

  static formatData(data: any) {
    let keys = Object.keys(data);
    let n = keys.length;
    if (n > 1) {
      let msgs = [];
      for (let key in data) {
        msgs.push(data[key]);
      }
      return msgs.toString().split(',').join('<br><br>');
    } else {
      return data[keys[0]];
    }
  }

  popError(data: any) {
    let errorMsgs = this.translateStatic(data);
    errorMsgs = ToastService.formatData(errorMsgs);
    let opt = {
      timeOut: 6000,
      showProgressBar: true,
      pauseOnHover: true
    };
    this._toast.error(this.getErrorTitle(), errorMsgs.toString(), opt);
  }

  popSuccess(data: any) {
    let successMsgs = this.translateStatic(data);
    successMsgs = ToastService.formatData(successMsgs);
    let opt = {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true
    };
    this._toast.success(this.getSuccessTitle(), successMsgs.toString(), opt);
  }

  popInfo(data: any) {
    let infoMsgs = this.translateStatic(data);
    infoMsgs = ToastService.formatData(infoMsgs);
    let opt = {
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true
    }
    this._toast.info(this.getInfoTitle(), infoMsgs.toString(), opt);
  }

}
