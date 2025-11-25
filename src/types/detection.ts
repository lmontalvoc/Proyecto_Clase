export interface Detection {
  id: string;
  label: string;
  confidence: number; // 0 - 100
  createdAt: string;  // fecha y hora en texto
  imageUri: string;
  notes?: string;
}
