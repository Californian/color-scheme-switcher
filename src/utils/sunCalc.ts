// shortcuts for easier to read formulas
const PI = Math.PI,
  sin = Math.sin,
  cos = Math.cos,
  tan = Math.tan,
  asin = Math.asin,
  atan = Math.atan2,
  acos = Math.acos,
  rad = PI / 180;

// sun calculations are based on http://aa.quae.nl/en/reken/zonpositie.html formulas

// date/time constants and conversions
const dayMs = 1000 * 60 * 60 * 24,
  J1970 = 2440588,
  J2000 = 2451545;
const toJulian = (date: Date) => date.valueOf() / dayMs - 0.5 + J1970;
const fromJulian = (j: number) => new Date((j + 0.5 - J1970) * dayMs);
const toDays = (date: Date) => toJulian(date) - J2000;

// general calculations for position
const e = rad * 23.4397; // obliquity of the Earth
const rightAscension = (l: number, b: number) =>
  atan(sin(l) * cos(e) - tan(b) * sin(e), cos(l));
const declination = (l: number, b: number) =>
  asin(sin(b) * cos(e) + cos(b) * sin(e) * sin(l));
const azimuth = (H: number, phi: number, dec: number) =>
  atan(sin(H), cos(H) * sin(phi) - tan(dec) * cos(phi));
const altitude = (H: number, phi: number, dec: number) =>
  asin(sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H));
const siderealTime = (d: number, lw: number) =>
  rad * (280.16 + 360.9856235 * d) - lw;

const astroRefraction = (h: number) => {
  if (h < 0)
    // the following formula works for positive altitudes only.
    h = 0; // if h = -0.08901179 a div/0 would occur.

  // formula 16.4 of "Astronomical Algorithms" 2nd edition by Jean Meeus (Willmann-Bell, Richmond) 1998.
  // 1.02 / tan(h + 10.26 / (h + 5.10)) h in degrees, result in arc minutes -> converted to rad:
  return 0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179));
};

// general sun calculations
const solarMeanAnomaly = (d: number) => rad * (357.5291 + 0.98560028 * d);

const eclipticLongitude = (M: number) => {
  const C = rad * (1.9148 * sin(M) + 0.02 * sin(2 * M) + 0.0003 * sin(3 * M)), // equation of center
    P = rad * 102.9372; // perihelion of the Earth

  return M + C + P + PI;
};

const sunCoords = (d: number) => {
  const M = solarMeanAnomaly(d),
    L = eclipticLongitude(M);

  return {
    dec: declination(L, 0),
    ra: rightAscension(L, 0),
  };
};

// calculates sun position for a given date and latitude/longitude
// TODO add elevation here
const getSunPosition = (date: Date, lat: number, lng: number) => {
  const lw = rad * -lng,
    phi = rad * lat,
    d = toDays(date),
    c = sunCoords(d),
    H = siderealTime(d, lw) - c.ra;

  return {
    azimuth: azimuth(H, phi, c.dec),
    altitude: altitude(H, phi, c.dec),
  };
};

// sun positions configuration (angle, morning/rising name, evening/setting name)
const sunPositions: [number, string, string][] = [
  [6, "goldenHourEnd", "goldenHourStart"],
  [-0.3, "sunriseEnd", "sunsetStart"],
  [-0.833, "sunriseStart", "sunsetEnd"],
  [-6, "dawn", "dusk"],
  [-12, "nauticalDawn", "nauticalDusk"],
  [-18, "nightEnd", "nightStart"],
];

const addSunPosition = (angle: number, riseName: string, setName: string) => {
  sunPositions.push([angle, riseName, setName]);
};

// calculations for sun times
const J0 = 0.0009;
const julianCycle = (d: number, lw: number) =>
  Math.round(d - J0 - lw / (2 * PI));
const approxTransit = (Ht: number, lw: number, n: number) =>
  J0 + (Ht + lw) / (2 * PI) + n;
const solarTransitJ = (ds: number, M: number, L: number) =>
  J2000 + ds + 0.0053 * sin(M) - 0.0069 * sin(2 * L);
const hourAngle = (h: number, phi: number, d: number) =>
  acos((sin(h) - sin(phi) * sin(d)) / (cos(phi) * cos(d)));
const observerAngle = (altitude: number) => (-2.076 * Math.sqrt(altitude)) / 60;

// returns set time for the given sun altitude
const getSetJ = (
  h: number,
  lw: number,
  phi: number,
  dec: number,
  n: number,
  M: number,
  L: number
) => {
  const w = hourAngle(h, phi, dec),
    a = approxTransit(w, lw, n);
  return solarTransitJ(a, M, L);
};

// calculates sun times for a given date, latitude/longitude, and, optionally,
// the observer altitude (in meters) relative to the horizon
const getSunTimes = (
  date: Date,
  lat: number,
  lng: number,
  altitude: number
) => {
  altitude = altitude || 0;

  const lw = rad * -lng,
    phi = rad * lat,
    dh = observerAngle(altitude),
    d = toDays(date),
    n = julianCycle(d, lw),
    ds = approxTransit(0, lw, n),
    M = solarMeanAnomaly(ds),
    L = eclipticLongitude(M),
    dec = declination(L, 0),
    Jnoon = solarTransitJ(ds, M, L);

  const result: { [key: string]: Date } = {
    solarNoon: fromJulian(Jnoon),
    nadir: fromJulian(Jnoon - 0.5),
  };

  for (let i = 0, len = sunPositions.length; i < len; i += 1) {
    const time = sunPositions[i];
    const h0 = (time[0] + dh) * rad;

    const Jset = getSetJ(h0, lw, phi, dec, n, M, L);
    const Jrise = Jnoon - (Jset - Jnoon);

    result[time[1]] = fromJulian(Jrise);
    result[time[2]] = fromJulian(Jset);
  }

  return result;
};

export { sunPositions, addSunPosition, getSunPosition, getSunTimes };
