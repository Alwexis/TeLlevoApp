export interface Valoracion {
    id: number;
    viaje: number;
    usuario: string;
    valoracion: number;
    comentario: string;
}

export interface Valoraciones {
    valoraciones: Map<string, Valoracion>;
    lastId: number;
}