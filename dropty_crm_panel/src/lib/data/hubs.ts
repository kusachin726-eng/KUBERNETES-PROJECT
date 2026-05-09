export type CustomerStatus = "active" | "inactive" ;

export type Hub = {
  id: string;
  state: string;
  city: string;
  address: string;
  status: CustomerStatus;
  createdAt: string; // ISO date
};


const HUBS: Hub[] = [
  {
    id: "hub_1001",
    state: "Rajasthan",
    city: "Jaipur",
    address: "Vidhyadhar Nage",
    status: "active",
    createdAt: "2026-01-10",
  },
  {
    id: "hub_1002",
    state: "Uttar Pradesh",
    city: "Noida",
    address: "Sector 62",
    status: "inactive",
    createdAt: "2026-01-09",
  },
  {
    id: "hub_1003",
    state: "Rajasthan",
    city: "Jodhpur",
    address: "Part 1",
    status: "inactive",
    createdAt: "2026-01-07",
  },
];

export function listHubs() {
  return HUBS;
}


