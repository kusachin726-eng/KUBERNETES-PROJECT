export type AirlineStatus = "active" | "inactive";

export interface Airline {
  id: string;
  name: string;
  code: string;
  email: string;

  logo: string;
  country: string;
  status: AirlineStatus;
  createdAt: string; // ISO date
}
const AIRLINES: Airline[] = [
  {
    id: "air_1001",
    name: "SpiceJet",
    code: "SG",
    email: "support@airindia.com",
    
    logo: "/images/airlines/air-india.png",
    country: "India",
    status: "active",
    createdAt: "2026-01-10",
  },
  {
    id: "air_1002",
    name: "IndiGo",
    code: "6E",
    email: "care@goindigo.in",
   
    logo: "/images/airlines/indigo.png",
    country: "India",
    status: "active",
    createdAt: "2026-01-09",
  },
//   {
//     id: "air_1003",
//     name: "Vistara",
//     code: "UK",
//     email: "customercare@airvistara.com",
//     // phone: "+91 928 922 8888",
//     logo: "/images/airlines/vistara.png",
//     country: "India",
//     status: "inactive",
//     createdAt: "2026-01-08",
//   },
//   {
//     id: "air_1004",
//     name: "Emirates",
//     code: "EK",
//     email: "support@emirates.com",
//     // phone: "+971 600 555555",
//     logo: "/images/airlines/emirates.png",
//     country: "UAE",
//     status: "active",
//     createdAt: "2026-01-07",
//   },
//   {
//     id: "air_1005",
//     name: "Qatar Airways",
//     code: "QR",
//     email: "support@qatarairways.com",
//     // phone: "+974 4144 5555",
//     logo: "/images/airlines/qatar.png",
//     country: "Qatar",
//     status: "inactive",
//     createdAt: "2026-01-06",
//   },
];
export function listAirlines(){
    return AIRLINES
}