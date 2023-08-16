import { useState, useEffect, useRef } from "react";

import { getSunTimes } from "@/utils";

const useSunPosition = (
  latitude: number | null,
  longitude: number | null,
  altitude: number = 0,
  riseKey: string = "sunriseEnd",
  setKey: string = "sunsetEnd"
) => {
  // Initialize state variables and their setters.
  const [sunIsUp, setSunIsUp] = useState<boolean | undefined>(undefined);
  const [sunPositionNeedsChecking, setSunPositionNeedsChecking] =
    useState<boolean>(false);

  // Keep a reference to the timeout function which is used to check for changes
  // at sunrise/sunset.
  const checkSunlightRef = useRef<ReturnType<typeof setTimeout>>();

  // Whenever the given position changes, indicate that sun's position needs
  // checking again.
  useEffect(() => {
    setSunPositionNeedsChecking(true);
  }, [latitude, longitude, altitude]);

  // Whenever something changes which could affect the status of the sun's
  // position, check it again.
  useEffect(() => {
    if (sunPositionNeedsChecking) {
      const now = new Date();

      // Do not set any value if insufficient information is provided.
      if (latitude === null || longitude === null) {
        return;
      }

      // Get datetimes of the sunrise and sunset for the current day.
      const { [riseKey]: riseDate, [setKey]: setDate } = getSunTimes(
        now,
        latitude ?? 0,
        longitude ?? 0,
        altitude ?? 0
      );

      // Set daylight state.
      setSunIsUp(now > riseDate && now < setDate);

      // Track changes to up/down state of sun on next sunrise/sunset.
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      // We could calculate the sunrise offset between days or estimate that it
      // will be 24 hours or use a worst-case estimate, but this is accurate
      // and easy and shouldn't require an inordinate amount of computation
      // since it happens locally, asynchronously, every 24 hours.
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

      // Confirm that the sun position has been checked.
      setSunPositionNeedsChecking(false);
    }

    // Return a callback to cleanup timers if this is run again before the timer
    // is called.
    return () => {
      if (!sunPositionNeedsChecking) {
        clearTimeout(checkSunlightRef.current);
      }
    };
  }, [sunPositionNeedsChecking, latitude, longitude]);

  return sunIsUp;
};

export { useSunPosition };
