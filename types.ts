export interface GeneratedOS {
  id: string;
  name: string;
  description: string;
  html: string;
  createdAt: number;
}

export enum ViewMode {
  PREVIEW = 'PREVIEW',
  CODE = 'CODE',
}

export interface GenerationResponse {
  name: string;
  description: string;
  html: string;
}
