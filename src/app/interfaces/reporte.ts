export interface Reporte {
    id: number;
    motivo: string;
    descripcion: string;
    usuarioReportado: string;
    usuario: string;
    fecha: string;
}

export interface Reportes {
    lastId: number;
    reportes: Reporte[];
}