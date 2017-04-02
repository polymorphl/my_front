import {Injectable} from '@angular/core'
import {BehaviorSubject} from "rxjs";
import 'rxjs/add/operator/filter';

@Injectable()
export class SharedService {

  private _observers: Object = {};
  private _data: Object;
  private PENDING: string = 'my--shared--pending';

  constructor() {
    this._data = {};
  }

  public setData (key: string, value: any): void{
    this._data[key] = value;
    if(!this._observers[key]){
      this._observers[key] = new BehaviorSubject(this._data[key]).filter((data)=>{
        return data !== this.PENDING;
      });
    }
    this._observers[key].next(value);
  }

  public clearData(key: string): boolean{
    if(this._data[key]){
      delete this._data[key];
      this._observers[key].next(this.PENDING);
      return true;
    }
    return false;
  }

  public getData (key: string): any {
    if(this._data[key] !== this.PENDING){
      return this._data[key];
    }
    else {
      return null;
    }
  }

  public get(key: string){
    if(!this._observers[key]){
      this._data[key] = this.PENDING;
      this._observers[key] = new BehaviorSubject(this._data[key]).filter((x, idx)=>{
        let bool = x !== this.PENDING;
        return bool;
      });
    }
    return this._observers[key];
  }

}
