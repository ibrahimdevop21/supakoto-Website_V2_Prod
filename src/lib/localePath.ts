export type Locale = 'en' | 'ar';

export function switchLocalePath(currentPath: string, target: Locale): string {
  // Normalize
  if (!currentPath || currentPath === '') currentPath = '/';

  const isArabic = currentPath === '/ar' || currentPath.startsWith('/ar/');
  if (target === 'ar') {
    if (isArabic) return currentPath;                // already ar
    return currentPath === '/' ? '/ar' : `/ar${currentPath}`;
  } else {
    // target en
    if (!isArabic) return currentPath;               // already en
    return currentPath === '/ar' ? '/' : currentPath.replace(/^\/ar(?=\/)/, '');
  }
}
