export interface Branch {
  id: string;
  country: 'Egypt' | 'UAE';
  name: string;
  address: string;
  phone: string;
  rating: number;
  workingHours: {
    en: string;
    ar: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
}

export const branches: Branch[] = [
  {
    id: 'dubai',
    country: 'UAE',
    name: 'Supakoto Dubai',
    address: 'Warehouse 48 15B St - Al Quoz - Al Quoz Industrial Area 4 - Dubai - United Arab Emirates',
    phone: '+971 55 205 4478',
    rating: 4.9,
    workingHours: {
      en: 'Sat - Thu, 10:00 AM - 6:00 PM (Friday Off)',
      ar: 'السبت - الخميس، 10:00 ص - 6:00 م (الجمعة إجازة)',
    },
    coordinates: { lat: 25.117377971600526, lng: 55.23615351779093 },
  },
  {
    id: 'giza-sheikh-zayed',
    country: 'Egypt',
    name: 'Supakoto Giza - Sheikh Zayed',
    address: '2XCH+73P, First Al Sheikh Zayed, Giza Governorate 3245070',
    phone: '+20 11 27 23 2340',
    rating: 4.8,
    workingHours: {
      en: 'Sat - Thu, 10:00 AM - 6:00 PM (Friday Off)',
      ar: 'السبت - الخميس، 10:00 ص - 6:00 م (الجمعة إجازة)',
    },
    coordinates: { lat: 30.019907567782525, lng: 30.97782899999999 },
  },
  {
    id: 'cairo-maadi',
    country: 'Egypt',
    name: 'Supakoto Cairo - Maadi',
    address: 'Inside Skoda Maadi Center, 199 Wadi Degla Street, Zahraa Al Maadi, Cairo Governorate 11742',
    phone: '+20 12 24 46 4637',
    rating: 4.8,
    workingHours: {
      en: 'Sat - Thu, 10:00 AM - 6:00 PM (Friday Off)',
      ar: 'السبت - الخميس، 10:00 ص - 6:00 م (الجمعة إجازة)',
    },
    coordinates: { lat: 29.959868385272628, lng: 31.320307057672636 },
  },
  {
    id: 'cairo-5th-settlement',
    country: 'Egypt',
    name: 'Supakoto Cairo - 5th Settlement',
    address: '2C9J+GRQ, New Cairo 1, Cairo Governorate 4730124',
    phone: '+20 12 24 46 4637',
    rating: 5.0,
    workingHours: {
      en: 'Sat - Thu, 10:00 AM - 6:00 PM (Friday Off)',
      ar: 'السبت - الخميس، 10:00 ص - 6:00 م (الجمعة إجازة)',
    },
    coordinates: { lat: 30.018919121730043, lng: 31.432121498113556 },
  },
];
