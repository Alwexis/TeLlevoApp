import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DbService {

  constructor(private _http: HttpClient) { }

  /*
  @param collection: Nombre de la colección de MongoDB 
  @param query?: Lista de parámetros para el objeto a buscar.
  * Ejemplo: get('Usuarios', { rut: '12345678-9' })
  */
  get(collection: string, query?: [string]) {
    let url = 'http://localhost:3000/' + collection;
    if (query != undefined) {
      url += '?';
      query.forEach(q => {
        url += q + '&';
      })
    }
    if (url.endsWith('&')) url = url.replace('&', '');
    return this._http.get(url);
  }

  /*
  @param collection: Nombre de la colección de MongoDB 
  @param data: Objeto a insertar.
  * Ejemplo: insertOne('Usuarios', { rut: '12345678-9', nombre: 'Jenniffer' })
  */
  insertOne(collection: string, data: {}) {
    let url = 'http://localhost:3000/' + collection;
    return this._http.post(url, data).subscribe(resx => {
      console.log(resx)
    });
  }
  /*
  @param collection: Nombre de la colección de MongoDB 
  @param data: Lista de objetos a insertar.
  * Ejemplo: insertMany('Usuarios', [ { nombre: 'Fabian' }, { nombre: 'Rodrigo' }, { nombre: 'Jano' } ])
  */
  insertMany(collection: string, data: [{}]) {
    let url = 'http://localhost:3000/' + collection;
    return this._http.post(url, data)
  }
  /*
  @param collection: Nombre de la colección de MongoDB 
  @param query: Objeto a actualizar.
  @param data: Objeto a insertar.
  * Ejemplo: updateOne('Usuarios', 'rut=20.919.721-9', { rut: '21.619.555-8', nombre: 'Aaron' })
  */
  updateOne(collection: string, query: [string], data: {}) {
    let url = 'http://localhost:3000/' + collection;
    if (query != undefined) {
      url += '?';
      query.forEach(q => {
        url += q + '&';
      })
    }
    if (url.endsWith('&')) url = url.replace('&', '');
    return this._http.put(url, data);
  }
  /*
  @param collection: Nombre de la colección de MongoDB 
  @param query: Objetos a actualizar.
  @param data: Objeto a insertar.
  * Ejemplo: updateOne('Usuarios', 'viaje=5', { viaje: 5 })
  */
  updateMany(collection: string, query: string, data: {}) {
    let url = 'http://localhost:3000/' + collection + '?' + query;
    return this._http.put(url, data);
  }
  /*
  @param collection: Nombre de la colección de MongoDB
  @param query: Objeto a eliminar.
  * Ejemplo: deleteOne('Usuarios', 'rut=20.919.721-9')
  */
  deleteOne(collection: string, query: [string]) {
    let url = 'http://localhost:3000/' + collection;
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
    let url = 'http://localhost:3000/' + collection;
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
