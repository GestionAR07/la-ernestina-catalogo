export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  category: string;
  imageUrl?: string;
  presentations: string[]; // e.g., ['bolsa de 10 kg', 'bolsa de 15 kg']
  price?: number; // optional price per presentation
  stockStatus: 'Disponible' | 'Consultar' | 'Sin stock';
  isFeatured?: boolean; // for future promotions
  isPopular?: boolean; // for "Los más pedidos"
}
