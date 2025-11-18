

export interface MenuItemType {
  id: string;
  name: string;
  price: number;
  priceHot?: number;
  priceCold?: number;
  description: string;
  image?: string;
  is_recommended?: boolean;
  is_best_seller?: boolean;
  is_customer_choice?: boolean;
  potential_allergens?: string[];
  nutrition?: { [key: string]: string };
  tasting_notes?: string[];
  pairings?: string[];
  ingredients?: string[];
  tasting_profile?: {
    sweetness: number; // 1-5
    body: number; // 1-5
    acidity: number; // 1-5
  };
  [key: string]: any;
}

export interface MenuSectionType {
  section_name: string;
  items: MenuItemType[];
}

export interface CartItemType extends MenuItemType {
  quantity: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  title: string;
  category: string;
}

export interface WebsiteSettings {
  cafeName: string;
  tagline: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundStart: string;
  backgroundMid: string;
  backgroundEnd: string;
  backgroundMode: 'gradient' | 'solid' | 'image';
  backgroundColor: string;
  backgroundImageUrl: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  panelColor: string;
  heroMediaType: 'video' | 'image';
  heroVideoUrl: string;
  heroPosterUrl: string;
  heroImageUrl: string;
  menuBackgroundMode: 'image' | 'video';
  menuBackgroundImageUrl: string;
  menuBackgroundVideoUrl: string;
  allergenNotice: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItemType[];
  totalPrice: number;
  serviceMode: 'dine-in' | 'take-out';
  queueNumber?: number;
}

export interface Toast {
    id: number;
    message: string;
    type: 'success' | 'info';
}

export interface PromotionType {
    name: string;
    description: string;
    tagline: string;
    image: string;
}

export interface ExpenseEntry {
  id: string;
  description: string;
  amount: number;
  category: 'materials' | 'operations';
  date: string;
}