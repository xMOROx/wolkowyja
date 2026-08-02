export const EVENT_DETAILS = {
  title: "Bieszczadzkie Ognisko w Wołkowyi",
  locationName: "Wołkowyja, nad Jeziorem Solińskim",
  coords: {
    lat: 49.341933,
    lng: 22.433710
  },
  dateString: "Sobota, 12 Września 2026",
  timeString: "Najwcześniejszy przyjazd: 18:00 - 19:00",
  rsvpDeadlineString: "Potwierdzenia do: 6 Września 2026 (godz. 23:59)",
  eventTargetDate: "2026-09-12T18:00:00",
  rsvpDeadlineDate: "2026-09-06T23:59:59",
  hostPhone: "+48 600 000 000",
  hostPhoneRaw: "600000000",
  arrivalInstructions: "Jadąc główną drogą z Polańczyka wjeżdżasz do Wołkowyi. Za kapliczką po lewej stronie skręć w utwardzoną drogę szutrową prowadzącą w stronę jeziora. Po około 150 metrach szukaj czarnej bramki po prawej stronie. Gdy będziesz 10 minut przed celem – zadzwoń lub napisz, wyjdziemy na drogę!"
};

export const ALCOHOL_OPTIONS = [
  { value: "beer", label: "Piwo" },
  { value: "vodka", label: "Wódka" },
  { value: "wine", label: "Wino" },
  { value: "whisky", label: "Whisky / Bourbon" },
  { value: "cider", label: "Cydr / Napoje niskoalkoholowe" },
  { value: "non_alcoholic", label: "Bezalkoholowe / Nie piję" }
];

export const INITIAL_GUESTS = [
  {
    id: "g1",
    name: "Patryk (Organizator)",
    status: "yes",
    plusCount: 1,
    isDrinking: true,
    alcoholType: "Piwo, Whisky",
    bringing: "Zapas drewna, kijki, głośnik bezprzewodowy",
    createdAt: Date.now() - 3600000 * 24
  },
  {
    id: "g2",
    name: "Michał & Ania",
    status: "yes",
    plusCount: 1,
    isDrinking: true,
    alcoholType: "Wino, Piwo",
    bringing: "Kiełbaski z dzika, sos chrzanowy, musztarda",
    createdAt: Date.now() - 3600000 * 18
  },
  {
    id: "g3",
    name: "Bartek",
    status: "yes",
    plusCount: 0,
    isDrinking: false,
    alcoholType: "Bezalkoholowe (Kierowca)",
    bringing: "Soki, woda, kubeczki jednorazowe",
    createdAt: Date.now() - 3600000 * 12
  },
  {
    id: "g4",
    name: "Kasia",
    status: "maybe",
    plusCount: 0,
    isDrinking: true,
    alcoholType: "Wino",
    bringing: "Sałatka ziemniaczana",
    createdAt: Date.now() - 3600000 * 5
  }
];

export const INITIAL_CHECKLIST = [
  { id: "c1", item: "Kiełbaski i wyroby na ognisko (5kg)", claimedBy: "Michał", completed: true },
  { id: "c2", item: "Chleb świeży i bułki", claimedBy: null, completed: false },
  { id: "c3", item: "Musztarda, keczup i sosy", claimedBy: "Michał", completed: true },
  { id: "c4", item: "Talerzyki, kubki i sztućce jednorazowe", claimedBy: null, completed: false },
  { id: "c5", item: "Gitara i śpiewnik", claimedBy: "Patryk", completed: true },
  { id: "c6", item: "Głośnik bezprzewodowy Bluetooth", claimedBy: "Patryk", completed: true },
  { id: "c7", item: "Worki na śmieci i papierowe ręczniki", claimedBy: null, completed: false },
  { id: "c8", item: "Kijki do pieczenia kiełbasek", claimedBy: "Patryk", completed: true },
  { id: "c9", item: "Suche drewno i rozpałka", claimedBy: "Patryk", completed: true },
  { id: "c10", item: "Lód w kostkach i napoje bezalkoholowe", claimedBy: "Bartek", completed: true }
];
