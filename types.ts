
export type Gender = 'ذكر' | 'أنثى';

export type Specialty = {
  id: string;
  name: string;
  tools: string;
  description: string;
  icon: string;
};

export interface AppState {
  step: 'setup' | 'camera' | 'processing' | 'result';
  gender: Gender;
  specialty: Specialty | null;
  capturedImage: string | null;
  resultImage: string | null;
  error: string | null;
}
