import { Time } from "@angular/common";
import { ViajeStatus } from "../enums/viaje-status";
import { Usuario } from "./usuarios";
import { Valoracion } from "./valoracion";

export interface Viajes {
    viajes: Map<string, Viaje>;
    lastId: number;
}

export interface Viaje {
    id: number;
    fecha: Date;
    destino: string;
    precio: number;
    capacidad: number;
    descripcion: string | null;
    conductor: Usuario;
    pasajeros: Usuario[];
    valoraciones: Valoracion[];
    estatus: ViajeStatus;
}