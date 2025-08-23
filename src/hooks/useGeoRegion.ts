import { useEffect, useMemo, useState } from "react";
import { CONTACT_NUMBERS, type RegionKey } from "../data/contactNumbers";

type Options = { locale?: string };

const GEO_CACHE_KEY = "sk_geo_country"; // stores EG or UAE

export function useGeoRegion({ locale = "en" }: Options) {
  const [region, setRegion] = useState<RegionKey | null>(null);

  // 1) Manual override (?region=EG|UAE)
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const override = sp.get("region")?.toUpperCase();
    if (override === "EG" || override === "UAE") {
      setRegion(override as RegionKey);
      sessionStorage.setItem(GEO_CACHE_KEY, override);
    }
  }, []);

  // 2) Cached value
  useEffect(() => {
    if (region) return;
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached === "EG" || cached === "UAE") {
      setRegion(cached as RegionKey);
    }
  }, [region]);

  // 3) Fetch by IP (ipwho.is) if no override/cache
  useEffect(() => {
    if (region) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("https://ipwho.is/", { cache: "no-store" });
        const data = await res.json();
        const code = (data?.country_code as string | undefined)?.toUpperCase();
        const inferred: RegionKey = code === "EG" ? "EG" : "UAE";
        if (!cancelled) {
          setRegion(inferred);
          sessionStorage.setItem(GEO_CACHE_KEY, inferred);
        }
      } catch {
        const fallback: RegionKey = locale === "ar" ? "EG" : "UAE";
        if (!cancelled) {
          setRegion(fallback);
          sessionStorage.setItem(GEO_CACHE_KEY, fallback);
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
