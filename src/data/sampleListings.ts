import type { CityId } from "@/data/cities";

export interface SampleListing {
  id: string;
  address: string;
  rent: number;
  beds: number;
  baths: number;
  neighborhood: string;
  belowMedianPct?: number;
  tag?: string; // "Likely RS", "Verified RS", etc.
  buildingNote?: string;
  image: string;
  coords?: [number, number]; // [lat, lng]
}

// Stable apartment/interior photos from Unsplash
const IMG = (id: string) =>
  `https://images.unsplash.com/${id}?w=800&q=80&auto=format&fit=crop`;

const PHOTOS = [
  IMG("photo-1502672260266-1c1ef2d93688"),
  IMG("photo-1522708323590-d24dbb6b0267"),
  IMG("photo-1493809842364-78817add7ffb"),
  IMG("photo-1560448204-e02f11c3d0e2"),
  IMG("photo-1484154218962-a197022b5858"),
  IMG("photo-1502005229762-cf1b2da7c5d6"),
  IMG("photo-1505691938895-1758d7feb511"),
  IMG("photo-1554995207-c18c203602cb"),
  IMG("photo-1540518614846-7eded433c457"),
  IMG("photo-1486304873000-235643847519"),
  IMG("photo-1567767292278-a4f21aa2d36e"),
  IMG("photo-1598928506311-c55ded91a20c"),
];
const P = (i: number) => PHOTOS[i % PHOTOS.length];

export const SAMPLE_LISTINGS: Record<CityId, SampleListing[]> = {
  nyc: [
    { id: "nyc-1",  address: "4520 Broadway, #5C",       rent: 1895, beds: 0, baths: 1, neighborhood: "Inwood",              belowMedianPct: 10, image: P(0),  coords: [40.867, -73.921] },
    { id: "nyc-2",  address: "1241 Myrtle Ave, #2",      rent: 2100, beds: 1, baths: 1, neighborhood: "Bushwick",            belowMedianPct: 14, tag: "Likely RS",   image: P(1),  coords: [40.694, -73.921] },
    { id: "nyc-3",  address: "318 E 116th St, #4A",      rent: 2295, beds: 1, baths: 1, neighborhood: "East Harlem",         belowMedianPct: 9,  image: P(2),  coords: [40.795, -73.940] },
    { id: "nyc-4",  address: "44-12 47th Ave, #3R",      rent: 2390, beds: 1, baths: 1, neighborhood: "Sunnyside",           belowMedianPct: 13, image: P(3),  coords: [40.744, -73.920] },
    { id: "nyc-5",  address: "611 Franklin Ave, #2F",    rent: 2450, beds: 1, baths: 1, neighborhood: "Crown Heights",       belowMedianPct: 11, tag: "Verified RS", buildingNote: "Clean DOB record · 0 open 311", image: P(4),  coords: [40.668, -73.944] },
    { id: "nyc-6",  address: "31-09 Steinway St, #4B",   rent: 2650, beds: 1, baths: 1, neighborhood: "Astoria",             belowMedianPct: 7,  image: P(5),  coords: [40.772, -73.930] },
    { id: "nyc-7",  address: "880 Lafayette Ave, #3R",   rent: 2895, beds: 2, baths: 1, neighborhood: "Bedford-Stuyvesant",  belowMedianPct: 12, tag: "Likely RS", image: P(6),  coords: [40.687, -73.941] },
    { id: "nyc-8",  address: "315 Eastern Pkwy, #4F",    rent: 3200, beds: 2, baths: 1, neighborhood: "Crown Heights",       belowMedianPct: 12, tag: "Verified RS", buildingNote: "2 prior 311 complaints · resolved", image: P(7),  coords: [40.668, -73.944] },
    { id: "nyc-9",  address: "55 Bedford Ave, #PH",      rent: 3450, beds: 1, baths: 1, neighborhood: "Williamsburg",        belowMedianPct: 8,  image: P(8),  coords: [40.708, -73.957] },
    { id: "nyc-10", address: "5-22 51st Ave, #11D",      rent: 3795, beds: 1, baths: 1, neighborhood: "Long Island City",    belowMedianPct: 6,  image: P(9),  coords: [40.748, -73.948] },
    { id: "nyc-11", address: "200 W 20th St, #615",      rent: 4695, beds: 1, baths: 1, neighborhood: "Chelsea",             belowMedianPct: 19, tag: "Likely RS", buildingNote: "Clean DOB record · 0 open 311", image: P(10), coords: [40.747, -74.000] },
    { id: "nyc-12", address: "232 W 81st St, #4A",       rent: 5200, beds: 2, baths: 1, neighborhood: "Upper West Side",     belowMedianPct: 14, image: P(11), coords: [40.787, -73.975] },
  ],
  la: [
    { id: "la-1",  address: "1247 N Vine St, #208",   rent: 2495, beds: 1, baths: 1, neighborhood: "Hollywood",       belowMedianPct: 14, image: P(0), coords: [34.092, -118.328] },
    { id: "la-2",  address: "2300 Sunset Blvd, #5",   rent: 1950, beds: 0, baths: 1, neighborhood: "Echo Park",       belowMedianPct: 18, image: P(1), coords: [34.078, -118.260] },
    { id: "la-3",  address: "918 N Western Ave, #3",  rent: 1850, beds: 1, baths: 1, neighborhood: "Koreatown",       belowMedianPct: 9,  tag: "Rent controlled", image: P(2), coords: [34.062, -118.301] },
    { id: "la-4",  address: "1428 Abbot Kinney, #B",  rent: 3200, beds: 1, baths: 1, neighborhood: "Venice",          belowMedianPct: 7,  image: P(3), coords: [33.991, -118.470] },
    { id: "la-5",  address: "11620 Wilshire Blvd, #410", rent: 2750, beds: 1, baths: 1, neighborhood: "Westwood",     belowMedianPct: 11, image: P(4), coords: [34.052, -118.443] },
    { id: "la-6",  address: "4322 Beverly Blvd, #2",  rent: 1990, beds: 1, baths: 1, neighborhood: "Silver Lake",     belowMedianPct: 15, image: P(5), coords: [34.077, -118.290] },
    { id: "la-7",  address: "525 S Spring St, #1108", rent: 2350, beds: 0, baths: 1, neighborhood: "Downtown",        belowMedianPct: 10, image: P(6), coords: [34.046, -118.250] },
    { id: "la-8",  address: "7820 Melrose Ave, #4",   rent: 2450, beds: 1, baths: 1, neighborhood: "West Hollywood",  belowMedianPct: 13, image: P(7), coords: [34.083, -118.358] },
    { id: "la-9",  address: "1133 N Vermont Ave, #6", rent: 2150, beds: 1, baths: 1, neighborhood: "Los Feliz",       belowMedianPct: 8,  image: P(8), coords: [34.090, -118.292] },
    { id: "la-10", address: "330 Pine Ave, #905",     rent: 1995, beds: 1, baths: 1, neighborhood: "Long Beach",      belowMedianPct: 12, image: P(9), coords: [33.768, -118.190] },
  ],
  "sf-bay": [
    { id: "sf-1",  address: "1450 Valencia St, #3",   rent: 3450, beds: 1, baths: 1, neighborhood: "Mission",         belowMedianPct: 11, tag: "Rent controlled", image: P(0), coords: [37.760, -122.418] },
    { id: "sf-2",  address: "725 14th St, #2A",       rent: 2950, beds: 0, baths: 1, neighborhood: "Castro",          belowMedianPct: 8,  image: P(1), coords: [37.762, -122.435] },
    { id: "sf-3",  address: "1820 Divisadero, #4",    rent: 3650, beds: 1, baths: 1, neighborhood: "Lower Pacific Heights", belowMedianPct: 9, image: P(2), coords: [37.785, -122.440] },
    { id: "sf-4",  address: "988 Howard St, #312",    rent: 3100, beds: 0, baths: 1, neighborhood: "SoMa",            belowMedianPct: 14, image: P(3), coords: [37.781, -122.405] },
    { id: "sf-5",  address: "2450 Hayes St, #2",      rent: 3290, beds: 1, baths: 1, neighborhood: "NoPa",            belowMedianPct: 12, tag: "Rent controlled", image: P(4), coords: [37.773, -122.448] },
    { id: "sf-6",  address: "1230 Grant Ave, #3R",    rent: 2890, beds: 1, baths: 1, neighborhood: "North Beach",     belowMedianPct: 10, image: P(5), coords: [37.800, -122.408] },
    { id: "sf-7",  address: "2300 Telegraph Ave, #408", rent: 2495, beds: 1, baths: 1, neighborhood: "Oakland · Downtown", belowMedianPct: 16, image: P(6), coords: [37.812, -122.268] },
    { id: "sf-8",  address: "5440 College Ave, #2",   rent: 2750, beds: 1, baths: 1, neighborhood: "Oakland · Rockridge", belowMedianPct: 11, image: P(7), coords: [37.844, -122.252] },
    { id: "sf-9",  address: "2100 University Ave, #5", rent: 2390, beds: 1, baths: 1, neighborhood: "Berkeley",       belowMedianPct: 13, image: P(8), coords: [37.872, -122.272] },
    { id: "sf-10", address: "1455 Market St, #1610",  rent: 3850, beds: 1, baths: 1, neighborhood: "Civic Center",    belowMedianPct: 7,  image: P(9), coords: [37.776, -122.418] },
  ],
  chicago: [
    { id: "chi-1",  address: "1820 N Damen Ave, #2R",  rent: 1850, beds: 2, baths: 1, neighborhood: "Wicker Park",    belowMedianPct: 16, image: P(0), coords: [41.908, -87.677] },
    { id: "chi-2",  address: "2440 N Lincoln Ave, #4", rent: 1650, beds: 1, baths: 1, neighborhood: "Lincoln Park",   belowMedianPct: 11, image: P(1), coords: [41.927, -87.648] },
    { id: "chi-3",  address: "3530 N Sheffield, #3R",  rent: 1450, beds: 1, baths: 1, neighborhood: "Lakeview",       belowMedianPct: 13, image: P(2), coords: [41.946, -87.654] },
    { id: "chi-4",  address: "1124 W 18th St, #2",     rent: 1290, beds: 1, baths: 1, neighborhood: "Pilsen",         belowMedianPct: 18, image: P(3), coords: [41.857, -87.656] },
    { id: "chi-5",  address: "5305 N Clark St, #5",    rent: 1390, beds: 1, baths: 1, neighborhood: "Andersonville",  belowMedianPct: 9,  image: P(4), coords: [41.978, -87.668] },
    { id: "chi-6",  address: "200 N Dearborn, #1409",  rent: 2150, beds: 1, baths: 1, neighborhood: "The Loop",       belowMedianPct: 7,  image: P(5), coords: [41.886, -87.629] },
    { id: "chi-7",  address: "1542 W Division, #3F",   rent: 1750, beds: 1, baths: 1, neighborhood: "Wicker Park",    belowMedianPct: 12, image: P(6), coords: [41.903, -87.668] },
    { id: "chi-8",  address: "2100 W Belmont, #2",     rent: 1550, beds: 2, baths: 1, neighborhood: "Roscoe Village", belowMedianPct: 15, image: P(7), coords: [41.939, -87.683] },
    { id: "chi-9",  address: "740 W Fulton Market, #806", rent: 2295, beds: 1, baths: 1, neighborhood: "West Loop",   belowMedianPct: 8,  image: P(8), coords: [41.886, -87.647] },
    { id: "chi-10", address: "4520 N Magnolia, #3N",   rent: 1395, beds: 1, baths: 1, neighborhood: "Uptown",         belowMedianPct: 14, image: P(9), coords: [41.965, -87.659] },
  ],
  dc: [
    { id: "dc-1",  address: "1419 14th St NW, #401",  rent: 2390, beds: 1, baths: 1, neighborhood: "Logan Circle",   belowMedianPct: 10, image: P(0), coords: [38.910, -77.032] },
    { id: "dc-2",  address: "2032 18th St NW, #2",    rent: 2150, beds: 1, baths: 1, neighborhood: "Adams Morgan",   belowMedianPct: 13, image: P(1), coords: [38.918, -77.042] },
    { id: "dc-3",  address: "1530 U St NW, #305",     rent: 2495, beds: 1, baths: 1, neighborhood: "U Street",       belowMedianPct: 9,  image: P(2), coords: [38.917, -77.034] },
    { id: "dc-4",  address: "4420 Connecticut Ave, #410", rent: 1990, beds: 1, baths: 1, neighborhood: "Cleveland Park", belowMedianPct: 11, image: P(3), coords: [38.940, -77.058] },
    { id: "dc-5",  address: "1245 Florida Ave NE, #2", rent: 2295, beds: 1, baths: 1, neighborhood: "H Street NE",   belowMedianPct: 14, image: P(4), coords: [38.901, -76.992] },
    { id: "dc-6",  address: "2900 Wisconsin Ave, #408", rent: 2100, beds: 1, baths: 1, neighborhood: "Glover Park",  belowMedianPct: 10, image: P(5), coords: [38.928, -77.072] },
    { id: "dc-7",  address: "1010 25th St NW, #614",  rent: 2390, beds: 0, baths: 1, neighborhood: "West End",       belowMedianPct: 12, image: P(6), coords: [38.902, -77.052] },
    { id: "dc-8",  address: "624 H St NE, #3",        rent: 1995, beds: 1, baths: 1, neighborhood: "H Street NE",    belowMedianPct: 13, image: P(7), coords: [38.900, -77.001] },
  ],
  boston: [
    { id: "bos-1",  address: "62 Brighton Ave, #3",   rent: 2750, beds: 2, baths: 1, neighborhood: "Allston",        belowMedianPct: 13, image: P(0), coords: [42.353, -71.131] },
    { id: "bos-2",  address: "228 Commonwealth Ave, #5", rent: 2495, beds: 1, baths: 1, neighborhood: "Back Bay",    belowMedianPct: 11, image: P(1), coords: [42.350, -71.082] },
    { id: "bos-3",  address: "440 Centre St, #4",     rent: 2150, beds: 1, baths: 1, neighborhood: "Jamaica Plain",  belowMedianPct: 15, image: P(2), coords: [42.310, -71.108] },
    { id: "bos-4",  address: "1184 Boylston St, #2R", rent: 2290, beds: 1, baths: 1, neighborhood: "Fenway",         belowMedianPct: 9,  image: P(3), coords: [42.345, -71.097] },
    { id: "bos-5",  address: "85 Salem St, #4",       rent: 2495, beds: 1, baths: 1, neighborhood: "North End",      belowMedianPct: 10, image: P(4), coords: [42.365, -71.055] },
    { id: "bos-6",  address: "1290 Mass Ave, #6",     rent: 2395, beds: 1, baths: 1, neighborhood: "Cambridge",      belowMedianPct: 12, image: P(5), coords: [42.387, -71.119] },
    { id: "bos-7",  address: "44 Pearl St, #3",       rent: 2150, beds: 1, baths: 1, neighborhood: "Somerville",     belowMedianPct: 14, image: P(6), coords: [42.397, -71.099] },
    { id: "bos-8",  address: "740 Tremont St, #2",    rent: 2390, beds: 1, baths: 1, neighborhood: "South End",      belowMedianPct: 11, image: P(7), coords: [42.342, -71.075] },
  ],
  seattle: [
    { id: "sea-1",  address: "1421 E Pine St, #205",  rent: 2150, beds: 1, baths: 1, neighborhood: "Capitol Hill",   belowMedianPct: 9,  image: P(0), coords: [47.615, -122.318] },
    { id: "sea-2",  address: "2030 NW Market St, #3", rent: 1895, beds: 1, baths: 1, neighborhood: "Ballard",        belowMedianPct: 12, image: P(1), coords: [47.668, -122.382] },
    { id: "sea-3",  address: "615 N 36th St, #4",     rent: 1950, beds: 1, baths: 1, neighborhood: "Fremont",        belowMedianPct: 11, image: P(2), coords: [47.651, -122.350] },
    { id: "sea-4",  address: "2200 Queen Anne Ave N, #3", rent: 2095, beds: 1, baths: 1, neighborhood: "Queen Anne", belowMedianPct: 8,  image: P(3), coords: [47.641, -122.357] },
    { id: "sea-5",  address: "415 Bellevue Ave E, #408", rent: 1790, beds: 0, baths: 1, neighborhood: "Capitol Hill", belowMedianPct: 13, image: P(4), coords: [47.621, -122.325] },
    { id: "sea-6",  address: "100 W Highland Dr, #2", rent: 2295, beds: 1, baths: 1, neighborhood: "Lower Queen Anne", belowMedianPct: 10, image: P(5), coords: [47.631, -122.358] },
    { id: "sea-7",  address: "1620 Broadway, #312",   rent: 1850, beds: 0, baths: 1, neighborhood: "First Hill",     belowMedianPct: 14, image: P(6), coords: [47.611, -122.320] },
    { id: "sea-8",  address: "4730 California Ave SW, #3", rent: 1695, beds: 1, baths: 1, neighborhood: "West Seattle", belowMedianPct: 15, image: P(7), coords: [47.561, -122.388] },
  ],
  miami: [
    { id: "mia-1",  address: "725 NE 1st Ave, #18",   rent: 2495, beds: 1, baths: 1, neighborhood: "Downtown",       belowMedianPct: 15, image: P(0), coords: [25.778, -80.190] },
    { id: "mia-2",  address: "2520 Coral Way, #305",  rent: 1990, beds: 1, baths: 1, neighborhood: "Coral Gables",   belowMedianPct: 12, image: P(1), coords: [25.749, -80.243] },
    { id: "mia-3",  address: "150 NW 25th St, #4",    rent: 2290, beds: 1, baths: 1, neighborhood: "Wynwood",        belowMedianPct: 11, image: P(2), coords: [25.802, -80.198] },
    { id: "mia-4",  address: "1500 Bay Rd, #514",     rent: 2790, beds: 1, baths: 1, neighborhood: "South Beach",    belowMedianPct: 9,  image: P(3), coords: [25.788, -80.146] },
    { id: "mia-5",  address: "3470 E Coast Ave, #1208", rent: 2495, beds: 1, baths: 1, neighborhood: "Midtown",      belowMedianPct: 13, image: P(4), coords: [25.808, -80.193] },
    { id: "mia-6",  address: "3401 N Miami Ave, #310", rent: 2195, beds: 1, baths: 1, neighborhood: "Design District", belowMedianPct: 10, image: P(5), coords: [25.812, -80.193] },
    { id: "mia-7",  address: "55 SW 9th St, #2204",   rent: 2890, beds: 1, baths: 1, neighborhood: "Brickell",       belowMedianPct: 8,  image: P(6), coords: [25.766, -80.193] },
    { id: "mia-8",  address: "920 Alton Rd, #6",      rent: 2095, beds: 0, baths: 1, neighborhood: "South Beach",    belowMedianPct: 14, image: P(7), coords: [25.778, -80.142] },
  ],
  austin: [
    { id: "aus-1",  address: "1200 E 6th St, #B",     rent: 1795, beds: 1, baths: 1, neighborhood: "East Austin",    belowMedianPct: 12, image: P(0), coords: [30.265, -97.730] },
    { id: "aus-2",  address: "2500 S Lamar Blvd, #210", rent: 1690, beds: 1, baths: 1, neighborhood: "South Lamar",  belowMedianPct: 14, image: P(1), coords: [30.247, -97.785] },
    { id: "aus-3",  address: "1815 S Congress Ave, #4", rent: 1895, beds: 1, baths: 1, neighborhood: "South Congress", belowMedianPct: 9, image: P(2), coords: [30.253, -97.751] },
    { id: "aus-4",  address: "4400 Avenue G, #2",     rent: 1450, beds: 1, baths: 1, neighborhood: "Hyde Park",      belowMedianPct: 15, image: P(3), coords: [30.305, -97.726] },
    { id: "aus-5",  address: "78 Rainey St, #1208",   rent: 2195, beds: 1, baths: 1, neighborhood: "Rainey",         belowMedianPct: 7,  image: P(4), coords: [30.260, -97.737] },
    { id: "aus-6",  address: "2200 E Cesar Chavez, #B", rent: 1650, beds: 1, baths: 1, neighborhood: "East Austin",  belowMedianPct: 13, image: P(5), coords: [30.255, -97.726] },
    { id: "aus-7",  address: "1500 W 6th St, #312",   rent: 1990, beds: 1, baths: 1, neighborhood: "Clarksville",    belowMedianPct: 10, image: P(6), coords: [30.272, -97.756] },
    { id: "aus-8",  address: "9201 N Mopac, #408",    rent: 1395, beds: 1, baths: 1, neighborhood: "North Austin",   belowMedianPct: 16, image: P(7), coords: [30.376, -97.738] },
  ],
  philadelphia: [
    { id: "phi-1",  address: "1822 Pine St, #2F",     rent: 1495, beds: 1, baths: 1, neighborhood: "Rittenhouse",    belowMedianPct: 17, image: P(0), coords: [39.946, -75.173] },
    { id: "phi-2",  address: "740 S 4th St, #3R",     rent: 1290, beds: 1, baths: 1, neighborhood: "Queen Village",  belowMedianPct: 14, image: P(1), coords: [39.939, -75.149] },
    { id: "phi-3",  address: "1100 Frankford Ave, #4", rent: 1395, beds: 1, baths: 1, neighborhood: "Fishtown",      belowMedianPct: 12, image: P(2), coords: [39.969, -75.131] },
    { id: "phi-4",  address: "2400 Brown St, #2",     rent: 1190, beds: 1, baths: 1, neighborhood: "Fairmount",      belowMedianPct: 16, image: P(3), coords: [39.967, -75.180] },
    { id: "phi-5",  address: "1234 Walnut St, #806",  rent: 1690, beds: 1, baths: 1, neighborhood: "Center City",    belowMedianPct: 10, image: P(4), coords: [39.948, -75.161] },
    { id: "phi-6",  address: "1828 N 2nd St, #3",     rent: 1150, beds: 1, baths: 1, neighborhood: "Northern Liberties", belowMedianPct: 15, image: P(5), coords: [39.971, -75.140] },
    { id: "phi-7",  address: "4520 Baltimore Ave, #2", rent: 1095, beds: 1, baths: 1, neighborhood: "West Philly",   belowMedianPct: 18, image: P(6), coords: [39.949, -75.215] },
    { id: "phi-8",  address: "1700 Spruce St, #310",  rent: 1590, beds: 1, baths: 1, neighborhood: "Rittenhouse",    belowMedianPct: 11, image: P(7), coords: [39.946, -75.169] },
  ],
};
