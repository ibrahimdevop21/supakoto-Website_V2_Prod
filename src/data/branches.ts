export interface Branch {
  id: 'cairo_5th' | 'maadi' | 'sheikh_zayed' | 'damietta' | 'dubai';
  name: string; // Arabic display name
  address: string; // Arabic
  phones: string[]; // primary first
  whatsapp?: string; // international format without + for wa.me
  lat: number;
  lng: number;
  hours: string[]; // Arabic lines
  gmaps: string; // Google Maps directions/share URL
  isHQ?: boolean; // Mark headquarters
}

export const BRANCHES: Branch[] = [
  {
    id: 'dubai',
    name: 'سوباكوتو دبي - المقر الرئيسي',
    address: 'الكوز 4، دبي، الإمارات العربية المتحدة',
    phones: ['+971 50 626 5404', '+971 55 205 4478'],
    whatsapp: '971506265404',
    lat: 25.13424,
    lng: 55.23184,
    hours: ['السبت–الجمعة: 10ص–8م', 'الأحد: مغلق'],
    gmaps: 'https://maps.google.com/maps?q=25.13424,55.23184',
    isHQ: true
  },
  {
    id: 'cairo_5th',
    name: 'سوباكوتو القاهرة - التجمع الخامس',
    address: 'التجمع الخامس، القاهرة الجديدة، محافظة القاهرة',
    phones: ['+20 12 24464637', '+20 11 08184162'],
    whatsapp: '201108184162',
    lat: 30.018919121730043,
    lng: 31.432121498113556,
    hours: ['السبت–الجمعة: 10ص–8م'],
    gmaps: 'https://maps.google.com/maps?q=30.018919121730043,31.432121498113556'
  },
  {
    id: 'maadi',
    name: 'سوباكوتو القاهرة - المعادي',
    address: 'داخل مركز سكودا المعادي، 199 شارع وادي دجلة، زهراء المعادي، القاهرة',
    phones: ['+20 12 24464637'],
    whatsapp: '201224464637',
    lat: 29.959868385272628,
    lng: 31.320307057672636,
    hours: ['السبت–الجمعة: 10ص–8م'],
    gmaps: 'https://maps.google.com/maps?q=29.959868385272628,31.320307057672636'
  },
  {
    id: 'sheikh_zayed',
    name: 'سوباكوتو الجيزة - الشيخ زايد',
    address: 'الشيخ زايد الأولى، محافظة الجيزة',
    phones: ['+20 11 27232340'],
    whatsapp: '201127232340',
    lat: 30.019907567782525,
    lng: 30.97782899999999,
    hours: ['السبت–الجمعة: 10ص–8م'],
    gmaps: 'https://maps.google.com/maps?q=30.019907567782525,30.97782899999999'
  }
];
