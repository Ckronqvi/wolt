import { describe, expect, test } from "vitest";
import { parseCoordinates, isValidCoordinate } from "../src/util/parseCoordinates";

describe("parseLatLong", () => {
  test("correctly parses latitude values with N/S", () => {
    expect(parseCoordinates("48.8566N", "lat")).toBe(48.8566);
    expect(parseCoordinates("48.8566S", "lat")).toBe(-48.8566);
    expect(parseCoordinates("-48.8566", "lat")).toBe(-48.8566);
    expect(parseCoordinates("90N", "lat")).toBe(90);
    expect(parseCoordinates("90S", "lat")).toBe(-90);
  });

  test("correctly parses longitude values with E/W", () => {
    expect(parseCoordinates("2.3522E", "lon")).toBe(2.3522);
    expect(parseCoordinates("2.3522W", "lon")).toBe(-2.3522);
    expect(parseCoordinates("-2.3522", "lon")).toBe(-2.3522);
    expect(parseCoordinates("180E", "lon")).toBe(180);
    expect(parseCoordinates("180W", "lon")).toBe(-180);
  });

  test("handles invalid latitudes", () => {
    expect(parseCoordinates("91N", "lat")).toBeNull(); 
    expect(parseCoordinates("100S", "lat")).toBeNull(); 
    expect(parseCoordinates("textN", "lat")).toBeNull(); 
    expect(parseCoordinates("", "lat")).toBeNull(); 
  });

  test("handles invalid longitudes", () => {
    expect(parseCoordinates("181E", "lon")).toBeNull(); 
    expect(parseCoordinates("200W", "lon")).toBeNull(); 
    expect(parseCoordinates("textW", "lon")).toBeNull(); 
    expect(parseCoordinates("", "lon")).toBeNull(); 
  });

  test("rejects incorrect directional suffixes", () => {
    expect(parseCoordinates("48.8566E", "lat")).toBeNull(); 
    expect(parseCoordinates("2.3522N", "lon")).toBeNull(); 
    expect(parseCoordinates("48.8566S", "lon")).toBeNull(); 
    expect(parseCoordinates("2.3522W", "lat")).toBeNull(); 
  });

  test("accepts valid numbers without direction letters", () => {
    expect(parseCoordinates("48.8566", "lat")).toBe(48.8566);
    expect(parseCoordinates("-48.8566", "lat")).toBe(-48.8566);
    expect(parseCoordinates("2.3522", "lon")).toBe(2.3522);
    expect(parseCoordinates("-2.3522", "lon")).toBe(-2.3522);
  });

  test("handles whitespace", () => {
    expect(parseCoordinates(" 48.8566N ", "lat")).toBe(48.8566);
    expect(parseCoordinates(" 2.3522E ", "lon")).toBe(2.3522);
  });

  test("is valid coordinate", () => {
    expect(isValidCoordinate("48.8566N", "lat")).toBe(true);
    expect(isValidCoordinate("2.3522E", "lon")).toBe(true);
    expect(isValidCoordinate("48.8566S", "lat")).toBe(true);
    expect(isValidCoordinate("-2.3522W", "lon")).toBe(true);
  });
});