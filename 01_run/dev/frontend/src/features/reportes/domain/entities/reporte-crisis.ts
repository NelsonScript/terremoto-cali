export interface ReporteCrisis {
  tipo: string;
  departamento: string;
  municipio: FormDataEntryValue | null;
  descripcion: FormDataEntryValue | null;
  ubicacion: FormDataEntryValue | null;
  contacto: FormDataEntryValue | null;
}
