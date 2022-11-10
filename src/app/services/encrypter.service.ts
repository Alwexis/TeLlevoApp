import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EncrypterService {

  constructor(private _http: HttpClient) { }

  /**
   * @param { String } data: Objeto a encriptar.
   * @returns { Observable } Objeto encriptado.
   * @deprecated Use localEncrypt instead.
   */
  encrypt(data: string) {
    return this._http.get('https://api.hashify.net/hash/sha256/hex?value=' + data);
  }

  /**
   * @param { String } data: String a encriptar.
   * @returns { String } String encriptado.
   */
  localEncrypt(data: string): string {
    const splittedData = data.split('');
    let newString = '';
    for (const char of splittedData) {
      const newChar = char.charCodeAt(0);
      newString += newChar * 127 + ' ';
    }
    if (newString.endsWith(' ')) { newString = newString.slice(0, -1); }
    return newString;
  }

  /**
   * @param { String } data: Objeto a desencriptar.
   * @return { String } Objeto desencriptado.
   */
  localDencrypt(data: string): string {
    const splittedData = data.split(' ');
    let newString = '';
    for (const char of splittedData) {
      const newChar = String.fromCharCode(parseInt(char, 10) / 127);
      newString += newChar;
    }
    return newString;
  }
}
