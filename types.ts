
export interface ComponentInfo {
  nazwa: string;
  typ: string;
  opis: string;
}

export interface PriceEstimate {
  element: string;
  cena: string;
  zrodlo?: string;
}

export interface AnalysisResult {
  tytul: string;
  opis: string;
  detale: string[];
  ocena_techniczna: string;
  jakosc_budowy: string;
  komponenty: ComponentInfo[];
  ceny_szacunkowe: PriceEstimate[];
  oferta: {
    punkty_kluczowe: string[];
    rekomendacje: string[];
  };
  email_draft: string;
  zgodnosc_z_normami: string;
  klauzula_bezpieczenstwa: string;
}

export interface ImageFile {
  file: File;
  preview: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
