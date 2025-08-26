import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ url }) => {
  const searchParams = url.searchParams;
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const zoom = searchParams.get('z') || '14';
  const id = searchParams.get('id');

  // If we have an ID, try to serve pre-baked image first
  if (id) {
    try {
      // Try to serve pre-generated map image
      const imagePath = `/maps/${id}.jpg`;
      const response = await fetch(new URL(imagePath, url.origin));
      if (response.ok) {
        const imageBuffer = await response.arrayBuffer();
        return new Response(imageBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=3600'
          }
        });
      }
    } catch (error) {
      console.log(`Pre-baked image not found for ${id}, falling back to coordinates`);
    }
  }

  // Fallback: generate static map URL using coordinates
  if (!lat || !lng) {
    return new Response('Missing lat/lng parameters', { status: 400 });
  }

  // Use OpenStreetMap static map service or similar
  // For now, we'll redirect to a simple static map service
  const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/pin-s-building+bf1e2e(${lng},${lat})/${lng},${lat},${zoom}/600x400@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;

  try {
    const response = await fetch(staticMapUrl);
    if (response.ok) {
      const imageBuffer = await response.arrayBuffer();
      return new Response(imageBuffer, {
        headers: {
          'Content-Type': 'image/png',
          'Cache-Control': 'public, max-age=3600'
        }
      });
    }
  } catch (error) {
    console.error('Failed to fetch static map:', error);
  }

  // Final fallback: return a simple placeholder
  return new Response('Static map unavailable', { status: 500 });
};
