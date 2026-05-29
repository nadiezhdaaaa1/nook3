/**
 * Geographic data for map rendering — kept separate so we don't have to
 * touch each CityConfig file. Coordinates are approximate centroids,
 * good enough for marker placement & zoom-to-fit.
 */
import type { CityId } from "./types";

export interface CityMapData {
  center: [number, number]; // [lat, lng]
  zoom: number;
  // partial: not every neighborhood needs a centroid
  neighborhoods: Record<string, [number, number]>;
}

const NYC_NB: Record<string, [number, number]> = {
  // Manhattan
  "Upper West Side": [40.787, -73.975],
  "Upper East Side": [40.773, -73.96],
  "Midtown": [40.754, -73.984],
  "Hell's Kitchen": [40.764, -73.991],
  "Chelsea": [40.747, -74.0],
  "Greenwich Village": [40.733, -74.0],
  "East Village": [40.727, -73.984],
  "West Village": [40.735, -74.005],
  "SoHo": [40.723, -74.0],
  "Tribeca": [40.716, -74.009],
  "Financial District": [40.708, -74.011],
  "Lower East Side": [40.718, -73.987],
  "Harlem": [40.811, -73.946],
  "East Harlem": [40.795, -73.94],
  "Washington Heights": [40.84, -73.939],
  "Inwood": [40.867, -73.921],
  "Murray Hill": [40.747, -73.978],
  "Gramercy": [40.737, -73.984],
  "Flatiron": [40.741, -73.99],
  "Yorkville": [40.776, -73.949],
  // Brooklyn
  "Williamsburg": [40.708, -73.957],
  "Greenpoint": [40.73, -73.951],
  "Bushwick": [40.694, -73.921],
  "Bedford-Stuyvesant": [40.687, -73.941],
  "Crown Heights": [40.668, -73.944],
  "Park Slope": [40.672, -73.978],
  "Prospect Heights": [40.679, -73.969],
  "Fort Greene": [40.689, -73.974],
  "Clinton Hill": [40.689, -73.964],
  "DUMBO": [40.703, -73.989],
  "Brooklyn Heights": [40.696, -73.994],
  "Cobble Hill": [40.687, -73.998],
  "Carroll Gardens": [40.679, -74.0],
  "Red Hook": [40.676, -74.011],
  "Sunset Park": [40.654, -74.011],
  "Bay Ridge": [40.625, -74.029],
  "Flatbush": [40.642, -73.958],
  "Ditmas Park": [40.638, -73.962],
  // Queens
  "Long Island City": [40.748, -73.948],
  "Astoria": [40.772, -73.93],
  "Sunnyside": [40.744, -73.92],
  "Woodside": [40.745, -73.905],
  "Jackson Heights": [40.755, -73.886],
  "Forest Hills": [40.719, -73.844],
  "Ridgewood": [40.708, -73.901],
  "Flushing": [40.764, -73.83],
  "Rego Park": [40.726, -73.862],
  // Bronx
  "Mott Haven": [40.81, -73.92],
  "Concourse": [40.831, -73.92],
  "Riverdale": [40.9, -73.91],
  "Fordham": [40.862, -73.901],
  "Pelham Bay": [40.85, -73.83],
  // Staten Island
  "St. George": [40.643, -74.077],
  "Stapleton": [40.629, -74.077],
  "Tompkinsville": [40.636, -74.075],
};

const LA_NB: Record<string, [number, number]> = {
  "Santa Monica": [34.019, -118.491],
  "Venice": [33.985, -118.469],
  "Mar Vista": [34.0, -118.43],
  "Culver City": [34.022, -118.396],
  "Brentwood": [34.052, -118.475],
  "West LA": [34.043, -118.443],
  "Westwood": [34.063, -118.444],
  "Downtown LA": [34.04, -118.246],
  "Arts District": [34.041, -118.232],
  "Little Tokyo": [34.05, -118.24],
  "Chinatown": [34.063, -118.238],
  "Echo Park": [34.078, -118.26],
  "Silver Lake": [34.087, -118.27],
  "Los Feliz": [34.106, -118.286],
  "Highland Park": [34.116, -118.193],
  "Eagle Rock": [34.139, -118.211],
  "Mount Washington": [34.097, -118.215],
  "Sherman Oaks": [34.151, -118.449],
  "Studio City": [34.143, -118.395],
  "North Hollywood": [34.172, -118.378],
  "Burbank": [34.181, -118.309],
  "Glendale": [34.142, -118.255],
  "El Segundo": [33.919, -118.416],
  "Hermosa Beach": [33.862, -118.4],
  "Manhattan Beach": [33.885, -118.41],
  "Redondo Beach": [33.849, -118.388],
  "Hollywood": [34.092, -118.328],
  "West Hollywood": [34.09, -118.385],
  "Mid-City": [34.05, -118.34],
  "Koreatown": [34.062, -118.301],
};

const SF_NB: Record<string, [number, number]> = {
  "Mission": [37.76, -122.418],
  "SoMa": [37.778, -122.4],
  "Hayes Valley": [37.776, -122.425],
  "Castro": [37.762, -122.435],
  "Nob Hill": [37.793, -122.415],
  "Russian Hill": [37.801, -122.418],
  "Marina": [37.803, -122.437],
  "Pacific Heights": [37.793, -122.435],
  "Sunset": [37.751, -122.494],
  "Richmond": [37.78, -122.483],
  "Oakland Downtown": [37.804, -122.271],
  "Rockridge": [37.844, -122.252],
  "Berkeley": [37.871, -122.273],
  "Emeryville": [37.831, -122.285],
  "Alameda": [37.765, -122.241],
  "South San Francisco": [37.654, -122.408],
  "San Mateo": [37.563, -122.325],
  "Burlingame": [37.584, -122.366],
  "Redwood City": [37.485, -122.236],
  "San Jose Downtown": [37.336, -121.89],
  "Mountain View": [37.386, -122.083],
  "Palo Alto": [37.442, -122.143],
  "Sunnyvale": [37.369, -122.036],
};

const CHI_NB: Record<string, [number, number]> = {
  "Loop": [41.879, -87.629],
  "West Loop": [41.881, -87.65],
  "River North": [41.892, -87.634],
  "Streeterville": [41.893, -87.62],
  "Lincoln Park": [41.921, -87.648],
  "Lakeview": [41.94, -87.652],
  "Wicker Park": [41.908, -87.677],
  "Logan Square": [41.929, -87.708],
  "Bucktown": [41.918, -87.679],
  "Pilsen": [41.857, -87.66],
  "Hyde Park": [41.794, -87.59],
};

export const CITY_MAP: Record<CityId, CityMapData> = {
  nyc: { center: [40.7128, -74.006], zoom: 11, neighborhoods: NYC_NB },
  la: { center: [34.0522, -118.2437], zoom: 10, neighborhoods: LA_NB },
  "sf-bay": { center: [37.7749, -122.4194], zoom: 9, neighborhoods: SF_NB },
  chicago: { center: [41.8781, -87.6298], zoom: 11, neighborhoods: CHI_NB },
  dc: { center: [38.9072, -77.0369], zoom: 12, neighborhoods: {} },
  boston: { center: [42.3601, -71.0589], zoom: 12, neighborhoods: {} },
  seattle: { center: [47.6062, -122.3321], zoom: 11, neighborhoods: {} },
  miami: { center: [25.7617, -80.1918], zoom: 11, neighborhoods: {} },
  austin: { center: [30.2672, -97.7431], zoom: 11, neighborhoods: {} },
  philadelphia: { center: [39.9526, -75.1652], zoom: 12, neighborhoods: {} },
};
