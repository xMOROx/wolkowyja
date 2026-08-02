export const EVENT_DETAILS = {
  title: "Wielkie Ognisko w Wołkowyi",
  locationName: "Wołkowyja (nad Jeziorem Solińskim)",
  coords: {
    lat: 49.341933,
    lng: 22.433710
  },
  dateString: "Sobota, 15 Sierpnia 2026",
  timeString: "godz. 17:00",
  targetDate: "2026-08-15T17:00:00"
};

export const INITIAL_GUESTS = [
  {
    id: "g1",
    name: "Patryk (Organizator)",
    status: "yes",
    plusCount: 1,
    transport: "car_driver",
    bringing: "Drewno, gitara, głośnik JBL",
    createdAt: Date.now() - 3600000 * 24
  },
  {
    id: "g2",
    name: "Michał & Ania",
    status: "yes",
    plusCount: 1,
    transport: "car_passenger",
    bringing: "Kiełbaski z dzika, sosy, musztarda",
    createdAt: Date.now() - 3600000 * 18
  },
  {
    id: "g3",
    name: "Bartek",
    status: "yes",
    plusCount: 0,
    transport: "car_driver",
    bringing: "Napoje, lód i kubeczki",
    createdAt: Date.now() - 3600000 * 12
  },
  {
    id: "g4",
    name: "Kasia",
    status: "maybe",
    plusCount: 0,
    transport: "needs_ride",
    bringing: "Sałatka ziemniaczana",
    createdAt: Date.now() - 3600000 * 5
  }
];

export const INITIAL_CHECKLIST = [
  { id: "c1", item: "Kiełbaski & Podroby (5kg)", claimedBy: "Michał", completed: true },
  { id: "c2", item: "Chleb świeży & bułki", claimedBy: null, completed: false },
  { id: "c3", item: "Musztarda, Keczup, Sos Chrzanowy", claimedBy: "Michał", completed: true },
  { id: "c4", item: "Sztućce, Talerzyki i Kubeczki jednorazowe", claimedBy: null, completed: false },
  { id: "c5", item: "Gitara & Śpiewnik ogniskowy", claimedBy: "Patryk", completed: true },
  { id: "c6", item: "Głośnik Bluetooth (Bezprzewodowy)", claimedBy: "Patryk", completed: true },
  { id: "c7", item: "Worki na śmieci", claimedBy: null, completed: false },
  { id: "c8", item: "Kijki do pieczenia kiełbasek (10 szt.)", claimedBy: "Bartek", completed: true },
  { id: "c9", item: "Zapasowe Drewno / Rozpałka", claimedBy: "Patryk", completed: true },
  { id: "c10", item: "Napoje chłodzące / Soki", claimedBy: "Bartek", completed: true }
];

export const INITIAL_CARPOOLS = [
  {
    id: "cp1",
    driver: "Patryk",
    from: "Rzeszów (Centrum)",
    seats: 3,
    time: "15:30",
    note: "Wyjazd spod Millenium Hall"
  },
  {
    id: "cp2",
    driver: "Bartek",
    from: "Sanok",
    seats: 2,
    time: "16:15",
    note: "Mogę zabrać kogoś po drodze z Leska"
  }
];
