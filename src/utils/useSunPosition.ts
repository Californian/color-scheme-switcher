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

  const checkSunlightRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    setSunPositionNeedsChecking(true);
  }, [latitude, longitude, altitude]);

  useEffect(() => {
    if (sunPositionNeedsChecking) {
      const now = new Date();
      if (latitude === null || longitude === null) {
        return;
      }

      const { [riseKey]: riseDate, [setKey]: setDate } = getSunTimes(
        now,
        latitude ?? 0,
        longitude ?? 0,
        altitude ?? 0
      );

      setSunIsUp(now > riseDate && now < setDate);

      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      const { [riseKey]: tomorrowRiseDate } = getSunTimes(
        tomorrow,
        latitude || 0,
        longitude || 0,
        altitude || 0
      );
      const nowMs = now.getTime();
      const timeToNextCheck =
        now < riseDate
          ? riseDate.getTime() - nowMs
          : now < setDate
          ? setDate.getTime() - nowMs
          : tomorrowRiseDate.getTime() - nowMs;
      checkSunlightRef.current = setTimeout(() => {
        setSunPositionNeedsChecking(true);
      }, timeToNextCheck);

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
