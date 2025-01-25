interface DistanceRange {
  min: number;
  max: number;
  a: number;
  b: number;
  flag: string | null;
}

interface DynamicData {
  minCartValue: number;
  basePrice: number;
  distanceRanges: DistanceRange[];
}

interface StaticVenueData {
  venue_raw: {
    location: {
      coordinates: [number, number];
    };
  };
}

type Result<T> = { success: true; data: T } | { success: false; error: string };

const API_URL =
  "https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues";

export const fetchStaticData = async (
  venueSlug: string
): Promise<Result<[number, number]>> => {
  try {
    const response = await fetch(`${API_URL}/${venueSlug}/static`);

    if (!response.ok) {
      // Try to extract error details from the response body
      const errorData = (await response.json()) as { message?: string };
      const errorMessage =
        (errorData as { message?: string }).message ??
        "Failed to fetch static data";

      return {
        success: false,
        error: `Failed to fetch static data: ${errorMessage}`,
      };
    }

    const data = await response.json() as StaticVenueData;
    return { success: true, data: data.venue_raw.location.coordinates };
  } catch (error) {
    return {
      success: false,
      error: `Error fetching static data: ${(error as Error).message}`,
    };
  }
};

export const fetchDynamicData = async (
  venueSlug: string
): Promise<Result<DynamicData>> => {
  try {
    const response = await fetch(`${API_URL}/${venueSlug}/dynamic`);
    if (!response.ok) {
      const errorData = (await response.json()) as { message?: string };
      const errorMessage =
        (errorData as { message?: string }).message ??
        "Failed to fetch dynamic data";

      return {
        success: false,
        error: `Failed to fetch dynamic data: ${errorMessage}`,
      };
    }
    const data = await response.json() as { venue_raw: { delivery_specs: { order_minimum_no_surcharge: number; delivery_pricing: { base_price: number; distance_ranges: DistanceRange[] } } } };
    return {
      success: true,
      data: {
        minCartValue: data.venue_raw.delivery_specs.order_minimum_no_surcharge,
        basePrice: data.venue_raw.delivery_specs.delivery_pricing.base_price,
        distanceRanges:
          data.venue_raw.delivery_specs.delivery_pricing.distance_ranges,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Error fetching dynamic data: " + (error as Error).message,
    };
  }
};
