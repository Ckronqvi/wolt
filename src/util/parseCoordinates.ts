export const parseCoordinates = (
  value: string,
  type: "lat" | "lon"
): number | null => {
  if (!value) return null;
  value = value.trim().toUpperCase();

  // Match number with optional direction (N/S/E/W)
  const match = /^(-?\d+(\.\d+)?)([NSWE])?$/.exec(value);

  if (!match) return null;

  // match is a array with the following elements:
  // 0: full match
  // 1: number
  // 2: decimal part (if any)
  // 3: direction (if any)

  let num = parseFloat(match[1]);
  const direction = match[3];

  // Validate direction and adjust sign
  if (direction) {
    if (
      (type === "lat" && (direction === "N" || direction === "S")) ||
      (type === "lon" && (direction === "E" || direction === "W"))
    ) {
      if (direction === "S" || direction === "W") num = -Math.abs(num);
    } else {
      return null; // Invalid direction for the given type
    }
  }

  // Validate range
  if (
    (type === "lat" && (num < -90 || num > 90)) ||
    (type === "lon" && (num < -180 || num > 180))
  ) {
    return null;
  }

  return num;
};

export const isValidCoordinate = (
  value: string,
  type: "lat" | "lon"
): boolean => {
  return parseCoordinates(value, type) !== null;
};
