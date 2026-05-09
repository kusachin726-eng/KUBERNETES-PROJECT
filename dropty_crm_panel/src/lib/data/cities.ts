export type CitiesStatus = "active" | "inactive" | "blocked";

export interface Cities {
  country: string;
  state: string;
  city: string;
  pincode?: string;
  status: CitiesStatus;
  countryCode?: string;
}

const CITIES: Cities[] = [
  {
    country: "India",
    state: "Bihar",
    city: "Purnia",
    pincode: "854301",
    countryCode: "IN",
    status: "active",
  },
  {
    country: "India",
    state: "Guwahati",
    city: "Kamrup",
    pincode: "854301",
    countryCode: "IN",

    status: "inactive",
  },
  {
    country: "India",
    state: "Punjab",
    city: "Ludhiana",
    pincode: "854301",
    countryCode: "IN",

    status: "active",
  },
  {
    country: "India",
    state: "Tamil Nadu",
    city: "Chennai",
    pincode: "854301",
    countryCode: "IN",

    status: "active",
  },
  {
    country: "India",
    state: "Uttar Pradesh",
    city: "Lucknow",
    pincode: "854301",
    countryCode: "IN",

    status: "active",
  },
  {
    country: "India",
    state: "Maharashtra",
    city: "Mumbai",
    pincode: "854301",
    countryCode: "IN",

    status: "active",
  },
];

export function listCities() {
  return CITIES;
}
