import { useState, useRef, useEffect } from "react";

interface Coords {
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
}

interface State {
  loading: boolean;
  timestamp: number | null;
  coords: Coords;
  error: GeolocationPositionError | Error | null;
}

const useGeolocation = (
  shouldRequest: boolean,
  positionOptions?: PositionOptions
) => {
  const [state, setState] = useState<State>({
    loading: true,
    timestamp: null,
    coords: {
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: null,
      longitude: null,
      speed: null,
    },
    error: null,
  });

  const optionsRef = useRef(positionOptions);

  useEffect(() => {
    if (!shouldRequest) {
      setState((s) => ({
        ...s,
        loading: false,
        error: new Error("Position not requested."),
      }));

      return;
    }

    const onEvent: PositionCallback = ({ coords, timestamp }) => {
      setState({
        loading: false,
        timestamp,
        coords,
        error: null,
      });
    };

    const onEventError: PositionErrorCallback = (error) => {
      setState((s) => ({
        ...s,
        loading: false,
        error,
      }));
    };

    navigator.geolocation.getCurrentPosition(
      onEvent,
      onEventError,
      optionsRef.current
    );

    const watchId = navigator.geolocation.watchPosition(
      onEvent,
      onEventError,
      optionsRef.current
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [shouldRequest]);

  return state;
};

export { useGeolocation };
