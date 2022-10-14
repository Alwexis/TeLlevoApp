import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuarios';
import { Viaje, Viajes } from '../interfaces/viajes';
import { StorageService } from './storage.service';
import { ViajeStatus } from '../enums/viaje-status';

@Injectable({
  providedIn: 'root'
})
export class ViajesService {

  viajesData: Viajes;

  constructor(private _storage: StorageService) {}

  async init() {
    this.viajesData = await this._storage.getData('viajes');
    if (this.viajesData == undefined || this.viajesData == null) {
      this.viajesData = await this._storage.addData('viajes', { viajes: new Map<string, Viaje>(), lastId: 0 });
    }
    return this.viajesData
  }

  getFrom(user: Usuario) {
    let viajes = [];
    this.viajesData.viajes.forEach(viaje => {
      if (viaje.conductor.correo === user.correo) {
        viajes.push(viaje);
      }
    })
    return viajes;
    //* Probar el return de abajo
    //? [...this.viajesData.viajes.values()].filter(viaje => viaje.conductor.correo == user.correo)
  }

  get() {
    return this.viajesData;
  }

  getViaje(id) {
    return this.viajesData.viajes.get(id);
  }

  async scheduleViaje(viaje: {}) {
    let viajesUser = this.getFrom(viaje['conductor']).filter(x => x.fecha == viaje['fecha']);
    if (viajesUser.length < 1) {
      this.viajesData.lastId++;
      let newViaje: Viaje = {
        id: this.viajesData.lastId,
        fecha: viaje['fecha'],
        destino: viaje['destino'],
        precio: viaje['precio'],
        capacidad: viaje['capacidad'],
        descripcion: viaje['descripcion'],
        conductor: viaje['conductor'],
        pasajeros: [],
        valoraciones: [],
        estatus: ViajeStatus.PENDING,
      }
      this.viajesData.viajes.set(this.viajesData.lastId.toString(), newViaje);
      let added = await this._storage.addData('viajes', this.viajesData);
      return added != null;
    }
    return false;
  }

  async removeViaje(id) {
    if (this.viajesData.viajes.has(id)) {
      this.viajesData.viajes.delete(id);
      await this._storage.addData('viajes', this.viajesData);
      return true;
    } else {
      return false;
    }
  }

  translateDate(date: Date) {
    let dia = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'][date.getDay()];
    let mes = ['En', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][date.getMonth()];
    let diaNum = date.getDate();
    let horas = date.getHours() > 9 ? date.getHours() : '0' + date.getHours();
    let minutos = date.getMinutes() > 9 ? date.getMinutes() : '0' + date.getMinutes();
    return `${dia} ${diaNum} de ${mes}. ${horas}:${minutos}`;
  }
}
