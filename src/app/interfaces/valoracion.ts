import { Usuario } from "./usuarios";
import { Viaje } from "./viajes";

export interface Valoracion {
    id: number;
    viaje: Viaje;
    usuario: Usuario;
    valoracion: number;
    comentario: string;
}
