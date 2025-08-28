export interface BranchContact {
  id: string;
  name_en: string;
  name_ar: string;
  phone: string;
  whatsapp: string;
  isHQ?: boolean;
}

export const BRANCH_CONTACTS: BranchContact[] = [
  {
    id: 'dubai',
    name_en: 'Dubai HQ',
    name_ar: 'دبي - المقر الرئيسي',
    phone: '+971 50 626 5404',
    whatsapp: '971506265404',
    isHQ: true
  },
  {
    id: 'cairo_5th',
    name_en: 'Cairo - New Cairo',
    name_ar: 'القاهرة - التجمع الخامس',
    phone: '+20 12 24464637',
    whatsapp: '201224464637'
  },
  {
    id: 'cairo_maadi',
    name_en: 'Cairo - Maadi',
    name_ar: 'القاهرة - المعادي',
    phone: '+20 12 24464637',
    whatsapp: '201224464637'
  },
  {
    id: 'cairo_zayed',
    name_en: 'Cairo - Sheikh Zayed',
    name_ar: 'القاهرة - الشيخ زايد',
    phone: '+20 12 24464637',
    whatsapp: '201224464637'
  },
  {
    id: 'damietta',
    name_en: 'Damietta',
    name_ar: 'دمياط',
    phone: '+20 11 08184162',
    whatsapp: '201108184162'
  }
];
