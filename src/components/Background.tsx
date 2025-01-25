import { useMemo, useRef, useCallback } from "react";

interface Position {
  x: number;
  y: number;
};

interface BubbleGradientProps {
  color: string;
  baseDelay?: number;
  coordinates: Position[];
  addCoordinate: (newCoord: Position) => void;
}

const getRandomPosition = (): Position => ({
  x: Math.random() * 80 + 5,
  y: Math.random() * 85 + 5,
});

const getRandomSize = (): number => Math.random() * 9 + 5;

const getRandomDelay = (): number => -(Math.random() * 10);

const BUBBLE_DISTANCE_THRESHOLD = 20;

const calculateDistance = (pos1: Position, pos2: Position): number => {
  return Math.sqrt((pos1.x - pos2.x) ** 2 + (pos1.y - pos2.y) ** 2);
};

// BubbleGradient component
const BubbleGradient = ({
  color,
  baseDelay = 0,
  coordinates,
  addCoordinate,
}: BubbleGradientProps) => {
  // Memoize the position calculation
  const position = useMemo(() => {
    let newPosition: Position;
    let isTooClose = false;
    let loopBreaker = 0;

    do {
      loopBreaker++;
      newPosition = getRandomPosition();
      isTooClose = coordinates.some(
        (coord) =>
          calculateDistance(newPosition, coord) < BUBBLE_DISTANCE_THRESHOLD,
      );
    } while (isTooClose && loopBreaker < BUBBLE_DISTANCE_THRESHOLD);

    // Call addCoordinate to update coordinates after finding a valid position
    addCoordinate(newPosition);

    return newPosition;
  }, [coordinates, addCoordinate]);

  // Memoize size and delay
  const size = useMemo(getRandomSize, []);
  const delay = useMemo(() => getRandomDelay() + baseDelay, [baseDelay]);

  return (
    <div
      className="absolute rounded-full blur-5xl animate-pulselight"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        width: `${size}vw`,
        height: `${size}vw`,
        background: color,
        animationDelay: `${delay}s`,
      }}
    />
  );
};

const AnimatedGradientBackground = () => {
  // Coordinates ref to store all the coordinates of bubbles
  const coordinates = useRef<Position[]>([]);

  // Callback function to add new coordinates to the coordinates list
  const addCoordinate = useCallback((newCoord: Position) => {
    coordinates.current.push(newCoord);
  }, []);

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none overflow-hidden bg-[#00C5EA]">
      <div className="absolute inset-0 animate-bubble">
        <div className="absolute inset-0">
          <BubbleGradient
            color="#fff"
            baseDelay={1}
            coordinates={coordinates.current}
            addCoordinate={addCoordinate}
          />
          <BubbleGradient
            color="#fff"
            baseDelay={2}
            coordinates={coordinates.current}
            addCoordinate={addCoordinate}
          />
          <BubbleGradient
            color="#fff"
            baseDelay={4}
            coordinates={coordinates.current}
            addCoordinate={addCoordinate}
          />
          <BubbleGradient
            color="#fff"
            baseDelay={1}
            coordinates={coordinates.current}
            addCoordinate={addCoordinate}
          />
          <BubbleGradient
            color="#fff"
            baseDelay={3}
            coordinates={coordinates.current}
            addCoordinate={addCoordinate}
          />
        </div>
      </div>
    </div>
  );
};

export default AnimatedGradientBackground;
