export interface OpeningSlot {
  day: string;
  from: string;
  to: string;
}

export interface RestaurantInfo {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  coordinates: { lat: number; lng: number };
  googleMapsUrl?: string;
  openingHours?: {
    weekly: OpeningSlot[];
  };
}

export interface SliderSlide {
  id: string;
  url: string;
  order: number;
  active: boolean;
}
