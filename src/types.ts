export interface ServiceItem {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface PackageItem {
  id: number;
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

export interface PortfolioItem {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  tags: string[];
}

export interface ContactForm {
  name: string;
  mobileNumber: string;
  email: string;
  place: string;
}

export enum PackageType {
  Silver = 'Silver',
  Gold = 'Gold',
  Diamond = 'Diamond'
}