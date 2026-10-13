export interface Nursery {
  id: number;
  name: string;
  image: string;
  gallery?: string[];
  badge?: {
    text: string;
    type: 'gold' | 'trending' | 'discount' | 'new' | 'exclusive';
  } | null;
  rating: number;
  reviewsCount: number;
  city: 'riyadh' | 'jeddah' | 'dammam' | 'khobar' | 'makkah';
  cityName: string;
  district: string;
  distance: string;
  tags: string[];
  ageGroup: Array<'infants' | 'toddlers' | 'preschool' | 'afterschool'>;
  curriculum: Array<'national' | 'montessori' | 'bilingual' | 'reggio' | 'stem' | 'quran'>;
  amenities: Array<'cctv' | 'organic_food' | 'pool' | 'nurse' | 'transport' | 'smart_class'>;
  hours: Array<'morning' | 'extended' | 'weekend'>;
  price: number;
  originalPrice?: number | null;
  description: string;
  phone?: string;
  whatsapp?: string;
  address?: string;
  capacity?: number;
  teacherChildRatio?: string;
  hasLicense: boolean;
  licenseNumber?: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface FilterState {
  searchQuery: string;
  city: string;
  maxBudget: number;
  priceRange: [number, number];
  minRating: number | null;
  ageGroups: string[];
  curriculums: string[];
  amenities: string[];
  operatingHours: string[];
  quickTag: string | null;
}

export interface TourBooking {
  nurseryId: number;
  nurseryName: string;
  parentName: string;
  parentPhone: string;
  childAge: string;
  visitDate: string;
  timeSlot: string;
  notes?: string;
}

export interface ConsultationRequest {
  parentName: string;
  phone: string;
  city: string;
  childAge: string;
  budgetPreference: string;
  preferredTime: string;
}

export interface FacilityPhoto {
  id: string;
  url: string;
  title: string;
  caption: string;
  uploadedBy: string;
  category: 'classroom' | 'playground' | 'sleep' | 'dining' | 'activities';
}

export interface UserReview {
  id: string;
  nurseryId: number;
  userId: string;
  userName: string;
  userAvatar?: string;
  userBadge?: string;
  rating: number;
  date: string;
  comment: string;
  facilityPhotos?: string[];
  childAgeGroup?: string;
  helpfulCount?: number;
  verifiedParent?: boolean;
}
