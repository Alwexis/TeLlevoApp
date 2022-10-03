import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(private _storage: Storage) { 
  }

  async init(key = null, params = null) {
    await this._storage.create();
    if (key && params) { await this._storage.set(key, params); }
  }

  getData(key) {
    return this._storage.get(key);
  }

  async addData(key, data) {
    //const storedData = await this._storage.get(key) || [];
    return this._storage.set(key, data) || [];
  }

  async removeData(key, index) {
    const storedData = await this._storage.get(key) || [];
    storedData.splice(index, 1);
    return this._storage.set(key, storedData);
  }
}
