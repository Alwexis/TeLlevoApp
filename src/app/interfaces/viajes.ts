import { ViajeStatus } from "../enums/viaje-status";
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
    conductor: string;
    pasajeros: string[];
    valoraciones: Valoracion[];
    estatus: ViajeStatus;
}