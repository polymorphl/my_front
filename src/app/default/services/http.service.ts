import {Injectable} from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import {Observable} from 'rxjs/Rx';

@Injectable()
export class HttpService {

  private _endpointURL:string;

  constructor(private http: Http) {
    this._endpointURL = '/api'
  }

  private extractTokenFromLocalStorage(){
    return localStorage.getItem('tkn');
  }

  private appendAuthorizationHeader(headers: Headers) {
    let tkn = this.extractTokenFromLocalStorage();
    headers.append('authorization', tkn);
    return headers;
  }

  private extractResponseObject(res:any) {
    return { headers: res.headers, data: res.json()}
  }

  private handleError(error:any): Observable<any> {
    console.info('ERROR - from HTTP Service', error);
    try {
      return Observable.throw(error.json().meta);
    } catch (e) {
      return Observable.throw(error.json());
    }
  }

  public get(url: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers = this.appendAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.get(`${this._endpointURL}${url}`, options)
      .map((res:Response) => { return this.extractResponseObject(res); })
      .catch(this.handleError)
  }

  public post(url: string, data: any): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers = this.appendAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.post(`${this._endpointURL}${url}`, data, options)
      .map((res:Response) => { return this.extractResponseObject(res); })
      .catch(this.handleError)
  }

  public delete(url: string): Observable<any> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    headers = this.appendAuthorizationHeader(headers);
    let options = new RequestOptions({ headers: headers, withCredentials: true });
    return this.http.delete(`${this._endpointURL}${url}`, options)
      .map((res:Response) => { return this.extractResponseObject(res); })
      .catch(this.handleError)
  }
}
