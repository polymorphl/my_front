import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

import { SocketURL } from '../config/constants';

@Injectable()
export class SocketService {

  private _url = SocketURL;
  private _socket: any;
  private _rooms: Object = {};
  private _options = {
    secure: false,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000,
    query: { token: null }
  };

  constructor() { }

  private extractToken() {
    return localStorage.getItem('tkn');
  }

  private initialize(){
    this._socket.on('disconnect', ()=>{
      console.error('[WebSocket]: disconnected from socket');
    });
    this._socket.on('error', (err) => {
      console.error('[WebSocket]: onError', err);
    });
  }

  public connect(successCB, errorCB){
    this._socket = io.connect(this._url, Object.assign({},this._options));
    let reconnectPrepared = false;
    this._socket.on('connect', ()=>{
      if(!reconnectPrepared){ // do only once connection behaviour
        this._socket.emit('authenticate', {tkn: this.extractToken()})
          .on('authenticated', ()=>{
            this.initialize();
            successCB({error:false});
          })
          .on('unauthorized', ()=>{
            this._socket.disconnect();
            errorCB({error: true});
          })
          .on('reconnect', ()=>{
            // define only once reconnect behaviour
            this._socket.emit('authenticate',{tkn: this.extractToken()});
            if(!reconnectPrepared){
              reconnectPrepared = true;
              this._socket.on('authenticated', ()=>{
                this._socket.emit('room:join', Object.keys(this._rooms));
              });
            }
          });
      }
    });
  }

  public disconnect(){
    this._socket.disconnect();
  }

  public emit(tag: string, data: string){
    this._socket.emit(tag, data);
  }

  public getSocketStatusStream(){
    let observable = Observable.create( observer => {
      this._socket.on('disconnect', ()=>{
        observer.next(false);
      });
      this._socket.on('connected', ()=>{
        observer.next(true);
      });
      observer.next(this._socket.connected);
    });
    return observable;
  }

  public on(tag: string, fn: Function){
    this._socket.on(tag, fn);
    return ()=>{
      this._socket.removeListener(tag, fn);
    }
  }

  public join(tags: Array<string>):Array<any> {
    let fn;
    // set the update observable stream
    let room = Observable.create( observer => {
      this._socket.emit('room:join', tags);
      fn = (data) => {
        observer.next(data);
      };
      tags.forEach((tag)=>{
        if(!this._rooms[tag] || this._rooms[tag].length == 0){
          this._rooms[tag] = [];
          this._socket.on(`${tag}:update`, this.handleRoomUpdate(tag))
        }
        this._rooms[tag].push(fn);
      });
    });

    // return the update stream and close method
    return [room, ()=>{
      tags.forEach((tag)=>{
        this._rooms[tag].splice(this._rooms[tag].indexOf(fn), 1);
        if(this._rooms[tag].length == 0){
          this._socket.emit('room:leave', tag);
          this._socket.removeAllListeners(`${tag}:update`)
        }
      });
    }];
  }

  public handleRoomUpdate(tag){
    return (data)=>{
      this._rooms[tag].forEach(function(fn){
        fn(data);
      });
    }
  }

}
