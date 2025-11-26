export type GPU = {
  id: string | number;
  model: string;
  provider: string;
  price: number;
  vram: number;
  type: 'High-End' | 'Mid-Range' | 'Budget';
  providerType?: 'Cloud' | 'Marketplace'; // <--- New Field
  lastUpdated?: Date;
};
