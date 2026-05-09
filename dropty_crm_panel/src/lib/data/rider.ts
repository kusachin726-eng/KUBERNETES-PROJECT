// export type RiderStatus = "active" | "inactive" | "blocked";

export interface Rider {
  id: string;
  image: string;
  email: string;
  country?: string;
  name: string;
  phone: string;
  city: string;
 status: boolean; // true = active, false = inactive

  state: string;
  createdAt: string;
}


const RIDERS: Rider[] = [
  {
    id: "rid_2001",
    email:"abc@gmail.com",
    image: "/images/riders/rider-1.jpg",
    name: "Rahul Verma",
    phone: "+91 98765 43210",
    city: "Bengaluru",
    state:"Karnataka",
    country:"India",
    status: true,
    createdAt: "2026-01-10",
  },
  {
    id: "rid_2002",
      email:"abc@gmail.com",
    image: "/images/riders/rider-2.jpg",
    name: "Amit Singh",
       country:"India",
    phone: "+91 91234 56789",
    city: "Delhi",
    state:"Delhi",
   status: true,
    createdAt: "2026-01-09",
  },
  {
    id: "rid_2003",
      email:"abc@gmail.com",
    image: "/images/riders/rider-3.jpg",
    name: "Mohammed Arif",
       country:"India",
    phone: "+91 99887 77665",
    city: "Hyderabad",
    state:"Telangana",
  status: true,
    createdAt: "2026-01-08",
  },
  {
    id: "rid_2004",
      email:"abc@gmail.com",
    image: "/images/riders/rider-4.jpg",
    name: "Suresh Kumar",
       country:"India",
    phone: "+91 90123 45678",
    city: "Chennai",
    state:"Tamil Nadu",
  status: true,
    createdAt: "2026-01-07",
  },
  {
    id: "rid_2005",
      email:"abc@gmail.com",
    image: "/images/riders/rider-5.jpg",
    name: "Vikram Patel",
       country:"India",
    phone: "+91 93456 78901",
    city: "Ahmedabad",
    state:"Gujarat",
 status: true,
    createdAt: "2026-01-06",
  },
  {
    id: "rid_2006",
      email:"abc@gmail.com",
    image: "/images/riders/rider-6.jpg",
    name: "Ankit Sharma",
       country:"India",
    phone: "+91 95678 12345",
    city: "Jaipur",
    state:"Rajasthan",
status: true,
    createdAt: "2026-01-04",
  },
];

export function listRiders() {
  return RIDERS;
}
