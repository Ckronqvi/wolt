import { describe, it, expect } from "vitest";
import PriceCalculator from "../src/util/PriceCalculator";

describe("PriceCalculator", () => {
  describe("calculateSmallOrderSurcharge", () => {
    it("should return 0 if cartValue is greater than or equal to orderMinimumNoSurcharge", () => {
      const cartValue = 1500; 
      const orderMinimumNoSurcharge = 1500;
      const surcharge = PriceCalculator.calculateSmallOrderSurcharge(cartValue, orderMinimumNoSurcharge);
      expect(surcharge).toBe(0);
    });

    it("should return the correct surcharge if cartValue is less than orderMinimumNoSurcharge", () => {
      const cartValue = 1200; 
      const orderMinimumNoSurcharge = 1500; 
      const surcharge = PriceCalculator.calculateSmallOrderSurcharge(cartValue, orderMinimumNoSurcharge);
      expect(surcharge).toBe(300); 
    });
  });

  describe("calculateDeliveryFee", () => {
    it("should calculate delivery fee for given distance in the valid range", () => {
      const distance = 500;
      const basePrice = 100; 
      const distanceRanges = [
        { min: 0, max: 1000, a: 50, b: 2, flag: null }, // falls under this range
        { min: 1000, max: 2000, a: 100, b: 3, flag: null },
      ];
      const deliveryFee = PriceCalculator.calculateDeliveryFee(distance, basePrice, distanceRanges); // 100 + 50 + (2 * 500 / 10) = 250
      expect(deliveryFee).toBe(250); 
    });

    it("should return null if the distance is beyond the available ranges", () => {
      const distance = 2500; 
      const basePrice = 100; 
      const distanceRanges = [
        { min: 0, max: 1000, a: 50, b: 2, flag: null },
        { min: 1000, max: 2000, a: 100, b: 3, flag: null },
      ];
      const deliveryFee = PriceCalculator.calculateDeliveryFee(distance, basePrice, distanceRanges);
      expect(deliveryFee).toBeNull();
    });

    it("should return null if distance is same as max distance", () => {
      const distance = 1000;
      const basePrice = 100;
      const distanceRanges = [
        { min: 0, max: 1000, a: 50, b: 2, flag: null },
        { min: 1000, max: 0, a: 100, b: 3, flag: null },
      ];
      const deliveryFee = PriceCalculator.calculateDeliveryFee(distance, basePrice, distanceRanges);
      expect(deliveryFee).toBeNull();
    });
  });

  // https://www.nhc.noaa.gov/gccalc.shtml (Haversine formula calculator)
  describe("haversineFormula", () => {
    it("should calculate the correct distance between two points", () => {
      const lat1 = 63.8415; // (Kokkola)
      const lon1 = 23.1250; 

      const lat2 = 60.1699; // (Helsinki)
      const lon2 = 24.9384; 

      const distance = Math.round(PriceCalculator.haversineFormula(lat1, lon1, lat2, lon2));
      expect(Math.round(distance / 1000)).toBeCloseTo(419, 0); 
    });

    it("should handle the same point and return 0", () => {
      const lat1 = 63.8415;
      const lon1 = 23.1250;
      const lat2 = lat1;
      const lon2 = lon1;

      const distance = PriceCalculator.haversineFormula(lat1, lon1, lat2, lon2);
      expect(distance).toBe(0);
    });

    it("should calculate the correct distance between two points", () => {
      const lat1 = 60.1699;
      const lon1 = 24.9384;
      const lat2 = 60.2010;
      const lon2 = 24.9202;

      const distance = Math.round(PriceCalculator.haversineFormula(lat1, lon1, lat2, lon2));
      expect(Math.round(distance / 1000)).toBe(4);
    });
  });
});