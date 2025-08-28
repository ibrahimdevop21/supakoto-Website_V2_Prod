import { useEffect, useMemo, useState } from "react";
import { CONTACT_NUMBERS, type RegionKey } from "../data/contactNumbers";

type Options = { locale?: string };

const GEO_CACHE_KEY = "sk_geo_country"; // stores EG or UAE

export function useGeoRegion({ locale = "en" }: Options) {
  const [region, setRegion] = useState<RegionKey | null>(null);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on client side before any operations
  useEffect(() => {
    setIsClient(true);
  }, []);

  // 1) Manual override (?region=EG|UAE)
  useEffect(() => {
    if (!isClient || typeof window === 'undefined') return;
    
    const sp = new URLSearchParams(window.location.search);
    const override = sp.get("region")?.toUpperCase();
    if (override === "EG" || override === "UAE") {
      setRegion(override as RegionKey);
      try {
        sessionStorage.setItem(GEO_CACHE_KEY, override);
      } catch (e) {
        // Ignore storage errors in production
      }
    }
  }, [isClient]);

  // 2) Cached value
  useEffect(() => {
    if (!isClient || typeof window === 'undefined' || region) return;
    
    try {
      const cached = sessionStorage.getItem(GEO_CACHE_KEY);
      if (cached === "EG" || cached === "UAE") {
        setRegion(cached as RegionKey);
      }
    } catch (e) {
      // Ignore storage errors in production
    }
  }, [region, isClient]);

  // 3) Fetch by IP (ipwho.is) if no override/cache
  useEffect(() => {
    if (!isClient || typeof window === 'undefined' || region) return;
    
    let cancelled = false;

    (async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout
        
        const res = await fetch("https://ipwho.is/", { 
          cache: "no-store",
          signal: controller.signal
        });
        clearTimeout(timeoutId);
        
        const data = await res.json();
        const code = (data?.country_code as string | undefined)?.toUpperCase();
        const inferred: RegionKey = code === "EG" ? "EG" : "UAE";
        if (!cancelled) {
          setRegion(inferred);
          try {
            sessionStorage.setItem(GEO_CACHE_KEY, inferred);
          } catch (e) {
            // Ignore storage errors in production
          }
        }
      } catch {
        const fallback: RegionKey = locale === "ar" ? "EG" : "UAE";
        if (!cancelled) {
          setRegion(fallback);
          try {
            sessionStorage.setItem(GEO_CACHE_KEY, fallback);
          } catch (e) {
            // Ignore storage errors in production
          }
        }
      }
    })();

    return () => { cancelled = true; };
  }, [region, locale]);

  const numbers = useMemo(() => {
    const key: RegionKey = region ?? (locale === "ar" ? "EG" : "UAE");
    return CONTACT_NUMBERS[key];
  }, [region, locale]);

  return { region: region ?? (locale === "ar" ? "EG" : "UAE"), numbers };
}
