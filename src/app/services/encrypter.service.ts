import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncrypterService {

  constructor(private _http: HttpClient) {}

  encrypt(data) {
    return this._http.get('https://api.hashify.net/hash/sha256/hex?value=' + data);
  }
}
