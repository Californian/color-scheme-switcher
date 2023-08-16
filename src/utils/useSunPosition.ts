import { useState, useEffect, useRef } from "react";

import { getSunTimes } from "@/utils";

const useSunPosition = (
  latitude: number | null,
  longitude: number | null,
  altitude: number = 0,
  riseKey: string = "sunriseEnd",
  setKey: string = "sunsetEnd"
) => {
  const [sunIsUp, setSunIsUp] = useState<boolean | undefined>(undefined);

  const [sunPositionNeedsChecking, setSunPositionNeedsChecking] =
    useState<boolean>(false);

  useEffect(() => {
    setSunPositionNeedsChecking(true);
  }, [latitude, longitude, altitude]);

  const checkSunlightRef = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => {
    if (sunPositionNeedsChecking) {
      const now = new Date();
      if (latitude === null || longitude === null) {
        return;
      }

      const sunTimes = getSunTimes(
        now,
        latitude ?? 0,
        longitude ?? 0,
        altitude ?? 0
      );

      const [riseTime, setTime] = [sunTimes[riseKey], sunTimes[setKey]];

      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      const { [riseKey]: tomorrowSunriseEnd } = getSunTimes(
        tomorrow,
        latitude || 0,
        longitude || 0,
        altitude || 0
      );

      const nowMs = now.getTime();
      const timeToNextCheck =
        now < riseTime
          ? riseTime.getTime() - nowMs
          : now < setTime
            ? setTime.getTime() - nowMs
            : tomorrowSunriseEnd.getTime() - nowMs;
      checkSunlightRef.current = setTimeout(() => {
        setSunPositionNeedsChecking(true);
      }, timeToNextCheck);

      setSunIsUp(now > riseTime && now < setTime);
      setSunPositionNeedsChecking(false);
    }

    return () => {
      if (!sunPositionNeedsChecking) {
        clearTimeout(checkSunlightRef.current);
      }
    };
  }, [sunPositionNeedsChecking, latitude, longitude]);

  return sunIsUp;
};

export { useSunPosition };
