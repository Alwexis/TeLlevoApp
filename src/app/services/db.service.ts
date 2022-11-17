import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  // private _url = 'http://localhost:3000/';
  //? Subir repositorio de la API a Github y hacer deploy en Railway.app. Para volverla una API pública.
  private _url = 'https://tellevoappapi-production.up.railway.app/'

  constructor(private _http: HttpClient) { }

  /**
   * @param { String } collection Nombre de la colección de MongoDB 
   * @param { Object | null } query? Lista de parámetros para el objeto a buscar.
   * @returns { Promise<Object> } Lista de Objetos encontrados.
   * @examples
   *  get('Usuarios', { rut: '12345678-9' });
   *  get('Usuarios');
   */
  get(collection: string, query?: [string]) {
    let url = this._url + collection;
    if (query != undefined) {
      url += '?';
      query.forEach(q => {
        url += q + '&';
      })
    }
    if (url.endsWith('&')) url = url.replace('&', '');
    return this._http.get(url).toPromise();
  }

  /**
   * @param collection: Nombre de la colección de MongoDB 
   * @param data: Objeto a insertar.
   * @returns { Promise<Object> } Objeto insertado.
   * @example insertOne('Usuarios', { rut: '12345678-9', nombre: 'Jenniffer' })
   */
  insertOne(collection: string, data: {}, autoIncrement?: boolean): Promise<Object> {
    const url = this._url + collection;
    const body = {
      objectToInsert: data,
      autoIncrement: autoIncrement
    }
    return this._http.post(url, body).toPromise();
  }

  /**
   * @param collection: Nombre de la colección de MongoDB
   * @param data: Lista de objetos a insertar.
   * @returns { Observable<Object> } Lista de objetos insertados.
   * @example insertMany('Usuarios', [ { nombre: 'Fabian' }, { nombre: 'Rodrigo' }, { nombre: 'Jano' } ])
   */
  insertMany(collection: string, data: [{}]) {
    const url = this._url + collection;
    const body = {
      objectToInsert: data,
      autoIncrement: false
    }
    return this._http.post(url, data)
  }
  
  /**
   * @param collection Nombre de la colección de MongoDB.
   * @param query Objeto a actualizar.
   * @param data Objeto a insertar.
   * @example updateOne('Usuarios', 'rut=20.919.721-9', { rut: '21.619.555-8', nombre: 'Aaron' })
   */
  async updateOne(collection: string, query: [string], data: {}) {
    let url = this._url + collection;
    if (query != undefined) {
      url += '?';
      query.forEach(q => {
        url += q + '&';
      })
    }
    if (url.endsWith('&')) url = url.replace('&', '');
    return await this._http.put(url, data).toPromise();
  }

  /**
   * @param collection: Nombre de la colección de MongoDB 
   * @param query: Objetos a actualizar.
   * @param data: Objeto a insertar.
   * @example updateOne('Usuarios', 'viaje=5', { viaje: 5 })
   */
  updateMany(collection: string, query: string, data: {}) {
    let url = this._url + collection + '?' + query;
    return this._http.put(url, data).subscribe(resx => { return resx });;
  }
  /*
  @param collection: Nombre de la colección de MongoDB
  @param query: Objeto a eliminar.
  * Ejemplo: deleteOne('Usuarios', 'rut=20.919.721-9')
  */
  deleteOne(collection: string, query: [string]) {
    let url = this._url + collection;
    if (query != undefined) {
      url += '?';
      query.forEach(q => {
        url += q + '&';
      })
    }
    if (url.endsWith('&')) url = url.replace('&', '');
    return this._http.delete(url);
  }
  /*
  @param collection: Nombre de la colección de MongoDB
  @param query: Objetos a eliminar.
  * Ejemplo: deleteOne('Usuarios', ['rut=20.919.721-9', 'nombre=Ariel'])
  */
  deleteMany(collection: string, query: [string]) {
    let url = this._url + collection;
    if (query != undefined) {
      url += '?';
      query.forEach(q => {
        url += q + '&';
      })
    }
    if (url.endsWith('&')) url = url.replace('&', '');
    return this._http.delete(url);
  }
}
