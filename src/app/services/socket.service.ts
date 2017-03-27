import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService{
  private url = 'https://127.0.0.1:3000'; // TODO: Add dynamic url
  private socket: any;
  private _rooms: Object = {};
  private _options = {
    secure: false,
    reconnection: true,
    reconnectionDelay: 500,
    reconnectionDelayMax: 3000,
    query: { token: null }
  };

  constructor(){

  }

  private _accessTkn() {
    return localStorage.getItem('tkn');
  }


  init(){
    this.socket.on('disconnect', ()=>{
      console.error('disconnected from socket');
    });
    this.socket.on('error', (err) => {
      console.info('[WebSocket]: onError');
      console.error(err);
    });
  }

  connect(successCB, errorCB){
    this.socket = io.connect(this.url, Object.assign({},this._options));
    let reconnectPrepared = false;
    this.socket.on('connect', ()=>{
      if(!reconnectPrepared){ // do only once connection behaviour
        this.socket.emit('authenticate', {tkn: this._accessTkn()})
          .on('authenticated', ()=>{
            this.init();
            successCB({error:false});
          })
          .on('unauthorized', ()=>{
            this.socket.disconnect();
            errorCB({error: true});
          })
          .on('reconnect', ()=>{
            // define only once reconnect behaviour
            this.socket.emit('authenticate',{tkn: this._accessTkn()});
            if(!reconnectPrepared){
              reconnectPrepared = true;
              this.socket.on('authenticated', ()=>{
                this.socket.emit('room:join', Object.keys(this._rooms));
              });
            }
          });
      }
    });
  }
  disconnect(){
    this.socket.disconnect();
  }
  emit(tag: string, data: string){
    this.socket.emit(tag, data);
  }
  getSocketStatusStream(){
    let observable = Observable.create( observer => {
      this.socket.on('disconnect', ()=>{
        observer.next(false);
      });
      this.socket.on('connected', ()=>{
        observer.next(true);
      });
      observer.next(this.socket.connected);
    });
    return observable;
  }
  on(tag: string, fn: Function){
    this.socket.on(tag, fn);
    return ()=>{
      this.socket.removeListener(tag, fn);
    }
  }

  join(tags: Array<string>): Array<any>{
    let fn;
    // set the update observable stream
    let room = Observable.create( observer => {
      this.socket.emit('room:join', tags);
      fn = (data) => {
        observer.next(data);
      };
      tags.forEach((tag)=>{
        if(!this._rooms[tag] || this._rooms[tag].length == 0){
          this._rooms[tag] = [];
          this.socket.on(`${tag}:update`, this.handleRoomUpdate(tag))
        }
        this._rooms[tag].push(fn);
      });
    });

    // return the update stream and close method
    return [room, ()=>{
      tags.forEach((tag)=>{
        this._rooms[tag].splice(this._rooms[tag].indexOf(fn), 1);
        if(this._rooms[tag].length == 0){
          this.socket.emit('room:leave', tag);
          this.socket.removeAllListeners(`${tag}:update`)
        }
      });
    }];
  }

  private handleRoomUpdate(tag){
    return (data)=>{
      this._rooms[tag].forEach(function(fn){
        fn(data);
      });
    }
  }

}
