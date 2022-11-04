import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuarios';
import { Viaje, Viajes } from '../interfaces/viajes';
import { StorageService } from './storage.service';
import { Valoracion } from '../interfaces/valoracion';
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
      this.viajesData = await this._storage.addData('viajes', { viajes: new Map<string, Viaje>() });
    }
  }

  getFrom(user: Usuario) {
    return [...this.viajesData.viajes.values()].filter(viaje => viaje.conductor.correo == user.correo);
  }

  get() {
    return this.viajesData;
  }

  getViaje(id) {
    return this.viajesData.viajes.get(id);
  }

  async scheduleViaje(viaje: {}) {
    let lastId;
    if (this.viajesData.viajes.size > 0) {
      lastId = [...this.viajesData.viajes.values()].sort(viaje => viaje.id)[this.viajesData.viajes.size - 1].id;
    } else { lastId = 1; }
    let newViaje: Viaje = {
      id: lastId,
      fecha: viaje['fecha'],
      hora: viaje['hora'],
      destino: viaje['destino'],
      precio: viaje['precio'],
      capacidad: viaje['capacidad'],
      descripcion: viaje['descripcion'],
      conductor: viaje['conductor'],
      pasajeros: [],
      valoraciones: [],
      estatus: ViajeStatus.PENDING,
    } 
    this.viajesData.viajes.set(lastId.toString(), newViaje);
    let added = await this._storage.addData('viajes', this.viajesData);
    return added != null;
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
}
