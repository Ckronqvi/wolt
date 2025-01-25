export default class PriceCalculator {
  /**
   * Calculate the small order surcharge.
   * @param cartValue - The value of the cart in cents.
   * @param orderMinimumNoSurcharge - The minimum order value to avoid surcharge in cents.
   * @returns The small order surcharge in cents.
   */
  static calculateSmallOrderSurcharge(
    cartValue: number,
    orderMinimumNoSurcharge: number,
  ): number {
    const surcharge = orderMinimumNoSurcharge - cartValue;
    return Math.max(surcharge, 0);
  }

  /**
   * Calculate the delivery fee based on the distance ranges and distance.
   * @param distance - The delivery distance in meters.
   * @param basePrice - The base price for the delivery fee in cents.
   * @param distanceRanges - The distance range rules from the API response.
   * @returns The delivery fee in cents, or null if delivery is not possible.
   */
  static calculateDeliveryFee(
    distance: number,
    basePrice: number,
    distanceRanges: {
      min: number;
      max: number;
      a: number;
      b: number;
      flag: unknown;
    }[],
  ): number | null {
    for (const range of distanceRanges) {
      if (distance >= range.min && (distance < range.max || range.max === 0)) {
        if (range.max === 0 && distance >= range.min) {
          return null; // Delivery not possible
        }
        const distancePart = Math.round((range.b * distance) / 10);
        return basePrice + range.a + distancePart;
      }
    }
    return null; // No matching range found
  }

  static calculateTotalPrice(
    cartValue: number,
    smallOrderSurcharge: number,
    deliveryFee: number,
  ): number {
    return cartValue + smallOrderSurcharge + deliveryFee;
  }
  /**
   * Calculate the distance between two geographic points using the Haversine formula (was easier than figuring out some approximation).
   * @param lat1 - Latitude of the first point in degrees.
   * @param lon1 - Longitude of the first point in degrees.
   * @param lat2 - Latitude of the second point in degrees.
   * @param lon2 - Longitude of the second point in degrees.
   * @returns The distance between the two points in meters.
   */
  static haversineFormula(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number {
    const R = 6371000; // Radius of Earth in meters

    // Convert degrees to radians
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

    const φ1 = toRadians(lat1);
    const φ2 = toRadians(lat2);
    const Δφ = toRadians(lat2 - lat1);
    const Δλ = toRadians(lon2 - lon1);

    // Haversine formula
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Distance in meters
    return R * c;
  }
}
