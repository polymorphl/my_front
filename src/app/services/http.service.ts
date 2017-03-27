import {Injectable} from '@angular/core'
import { Http, Response, Headers, RequestOptions } from '@angular/http'
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HttpService {

  private _backendUrl:string;

  constructor(private http: Http) {
    this._backendUrl = '/api'
  }

  private _extractAuthorization(){
    return localStorage.getItem('tkn');
  }

  private _parseMessages(data){
    if(data.meta.msgs.length > 0){
      data.meta.msgs.forEach((msg)=>{
        // 0: module, 1: type, 2: field, 3: id
        let split = msg.msg.split('.');
        data[split[1]] = data[split[1]] || [];
        data[split[1]].push({
          msg: msg.msg,
          module: split[0],
          field: split[2],
          id: parseInt(split[3])
        })
      });
    }
    return data;
  }

  private _createAuthorizationHeader(headers: Headers) {
    let tkn = this._extractAuthorization();
    headers.append('authorization', tkn);
    return headers;
  }

  private _extractResponse(res:any) {
    let data = this._parseMessages(res.json());
    return { headers: res.headers, data: data}
  }

  private _handleError(error:any): Observable<any> {
    console.info('ERROR - HTTP');
    console.error(error);
    try {
      return Observable.throw(error.json().meta);
    } catch (e) {
      return Observable.throw(error.json());
    }
  }

  public get(url: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers = this._createAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.get(`${this._backendUrl}${url}`, options)
      .map((res:Response) => { return this._extractResponse(res); })
      .catch(this._handleError)
  }

  public post(url: string, data: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers = this._createAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(`${this._backendUrl}${url}`, data, options)
      .map((res:Response) => { return this._extractResponse(res); })
      .catch(this._handleError)
  }

  public delete(url: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers = this._createAuthorizationHeader(headers);
    // console.log('DELETE - HEADERS', JSON.stringify(headers, null, 2));
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.delete(`${this._backendUrl}${url}`, options)
      .map((res:Response) => { return this._extractResponse(res); })
      .catch(this._handleError)
  }
}
