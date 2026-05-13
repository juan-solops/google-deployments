import { Map, MapPin, Sun, Umbrella, Camera, Info, Bus, Plane, Utensils, Waves, Calendar } from "lucide-react";

export const categories = [
  { id: "overview", label: "Overview", icon: Info },
  { id: "destinations", label: "Top Destinations", icon: MapPin },
  { id: "beaches", label: "Best Beaches", icon: Umbrella },
  { id: "activities", label: "Activities", icon: Camera },
  { id: "agenda", label: "Cultural Agenda", icon: Calendar },
  { id: "practical", label: "Practical Info", icon: Map },
];

export interface Event {
  id: string;
  name: string;
  date: string;
  dateStart?: string; // ISO date format for calendar
  location: string;
  type: string;
  description: string;
  detailedDescription: string;
  officialLink: string;
  image: string;
  lat: number;
  lng: number;
  highlights?: string[];
  schedule?: string[];
  price?: string;
  howToGetThere?: string;
  travelTips?: string[];
  localSecret?: string;
}

export const culturalEvents: Event[] = [
  {
    id: 'san-antonio-2026',
    name: 'Fiestas de San Antonio Abad',
    date: 'January 2026',
    dateStart: '2026-01-18',
    location: 'Arona Town',
    type: 'Traditional',
    description: 'Traditional blessing of animals and one of the oldest Romerías on the island.',
    detailedDescription: 'San Antonio Abad is the patron saint of animals, and in Arona, this translates into a vibrant celebration where locals bring their pets and livestock to be blessed. The ritual dates back centuries and is a core part of the harvest cycle in the south.',
    officialLink: 'https://www.arona.org',
    image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
    lat: 28.0988,
    lng: -16.6806,
    highlights: ['Animal Blessing Ritual', 'Baile de Magos', 'Traditional Romería'],
    schedule: ['10:00 - High Mass', '11:30 - Animal Blessing at Church Square', '13:00 - Romería (Pilgrimage) starts'],
    price: 'Free',
    howToGetThere: 'Buses 480 and 482 from Los Cristianos to Arona Casco.',
    travelTips: ['Wear traditional Canarian dress to blend in', 'Bring your pet for the blessing', 'Arrive early as parking is impossible'],
    localSecret: 'The best "Carne con Papas" is served behind the church at the local social club.'
  },
  {
    id: 'almendro-flor-2026',
    name: 'Almendro en Flor',
    date: 'Jan - Feb 2026',
    dateStart: '2026-02-01',
    location: 'Santiago del Teide',
    type: 'Nature & Culture',
    description: 'A celebration of the almond blossoms in the highlands of Santiago del Teide.',
    detailedDescription: 'When the almond trees bloom in the hills of Santiago del Teide, the landscape turns white and pink. This natural phenomenon signifies the end of winter in the highlands and is celebrated with walking tours and culinary events.',
    officialLink: 'https://www.santiagodelteide.es',
    image: 'https://images.unsplash.com/photo-1542360492-9694e9ef4883?auto=format&fit=crop&q=80&w=800',
    lat: 28.2347,
    lng: -16.8156,
    highlights: ['Almond Blossom Trails', 'Traditional Sweet Tasting', 'Photography Contest'],
    schedule: ['09:00 - Guided hiking starts', '12:00 - Local craft market opens', '14:00 - Folklore music performances'],
    price: 'Free (Tours around €5)',
    howToGetThere: 'TF-82 motorway to Santiago del Teide. Bus 460 from Costa Adeje.',
    travelTips: ['Wear comfortable hiking shoes', 'Bring a camera for the blossoms', 'Try the "Almendrada" traditional cake'],
    localSecret: 'The route from Santiago del Teide to Arguayo has the highest concentration of blossoming trees.'
  },
  {
    id: 'carnaval-cristianos-2026',
    name: 'Los Cristianos Carnival 2026',
    date: 'March 2026',
    dateStart: '2026-03-06',
    location: 'Los Cristianos',
    type: 'Festival',
    description: 'The southern edition of the island\'s biggest party. Street parades, music, and elaborate costumes.',
    detailedDescription: 'The Carnival of Los Cristianos is the most important carnival event in the south. It spans 10 days of non-stop celebration, from drag queen galas to the massive closing street parade.',
    officialLink: 'https://www.arona.org',
    image: 'https://images.unsplash.com/photo-1514525253361-bee243870eb2?auto=format&fit=crop&q=80&w=800',
    lat: 28.0526,
    lng: -16.7167,
    highlights: ['Gran Coso (Main Parade)', 'Drag Queen Gala', 'Burial of the Sardine'],
    schedule: ['20:00 - Opening Parade', '22:00 - Street Party at the Plaza', 'Closing Day - Burial of the Sardine'],
    price: 'Free entry for street events',
    howToGetThere: 'Walk from Playa de las Américas or take any bus to Los Cristianos bus station.',
    travelTips: ['Planning to stay late? Use the special night bus service', 'Wear a costume (disfraz) to fully enjoy the vibe', 'Watch the parade from the beach promenade'],
    localSecret: 'The best atmosphere is in the small streets leading to the harbor on the night of the Burial of the Sardine.'
  },
  {
    id: 'sansofe-2026',
    name: 'Sansofé Summer Festival',
    date: 'July - August 2026',
    dateStart: '2026-07-01',
    location: 'El Médano',
    type: 'Concerts & Movies',
    description: 'A two-month cultural program with outdoor cinema, live concerts, and sporting events.',
    detailedDescription: 'Sansofé is the star cultural program of the summer in Granadilla. It aims to revitalize the town of El Médano with daily activities for all ages, emphasizing local talent and family enjoyment.',
    officialLink: 'https://www.granadilladeabona.org',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800',
    lat: 28.0450,
    lng: -16.5367,
    highlights: ['Outdoor Cinema on the Beach', 'Sunset Jazz Sessions', 'Folklore encounters'],
    schedule: ['Wednesdays: Movie Night at 21:00', 'Fridays: Live concerts at the Plaza', 'Weekends: Sports competitions'],
    price: 'Mostly Free',
    howToGetThere: 'TF-1 motorway exit for El Médano. Buses 470, 408 connect from South Airport.',
    travelTips: ['Bring a light sweater for the evening wind', 'Arrive early at the plaza for the best seats', 'Check the weekly program at the local tourist office'],
    localSecret: 'The "Cinema on the Beach" often has local food stalls with amazing grilled sardines nearby.'
  },
  {
    id: 'pascua-florida-2026',
    name: 'Pascua Florida Adeje',
    date: 'April 2026',
    dateStart: '2026-04-02',
    location: 'Adeje',
    type: 'Exhibition',
    description: 'The streets of Adeje are decorated with incredible floral sculptures and art installations during Holy Week.',
    detailedDescription: 'Pascua Florida is a unique artistic and cultural event in the Canary Islands. During Holy Week, the historic center of Adeje is transformed into an open-air museum where local artists create ephemeral sculptures using flowers.',
    officialLink: 'https://www.adeje.es',
    image: 'https://images.unsplash.com/photo-1501333190101-705b7501a357?auto=format&fit=crop&q=80&w=800',
    lat: 28.1189,
    lng: -16.7291,
    highlights: ['Floral Sculptures', 'Holy Week Processions', 'Historic Art Walk'],
    schedule: ['10:00 - Sculptures reveal', '18:00 - Guided art tour', '20:00 - Night illumination'],
    price: 'Free',
    howToGetThere: 'TF-1 to Adeje town exit. Bus 473 from Los Cristianos.',
    travelTips: ['The best time to visit is Thursday morning when flowers are freshest', 'Wear comfortable shoes for the hilly streets', 'Combine with a visit to the Barranco del Infierno nearby'],
    localSecret: 'There is a small hidden garden in the town hall courtyard that has the most delicate sculpture every year.'
  },
  {
    id: 'san-juan-2026',
    name: 'San Juan Night',
    date: 'June 23rd, 2026',
    dateStart: '2026-06-23',
    location: 'Coastal areas',
    type: 'Traditional',
    description: 'The shortest night of the year is celebrated with bonfires on the beaches and ritual baths at midnight.',
    detailedDescription: 'Noche de San Juan is one of the most magical nights in Tenerife. Thousands gather on the beaches to light bonfires and take a purifying swim at midnight to welcome the summer solstice.',
    officialLink: 'https://www.arona.org',
    image: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&q=80&w=800',
    lat: 28.0617,
    lng: -16.7317,
    highlights: ['Beach Bonfires', 'Midnight Swim', 'Live Music on the sand'],
    schedule: ['21:00 - Bonfires lighting', '23:00 - Live concerts', '00:00 - Midnight ritual bath'],
    price: 'Free',
    howToGetThere: 'Walk to any major beach like Playa de las Vistas or Playa Fañabé.',
    travelTips: ['Arrive before sunset to find a spot on the sand', 'Bring old wood for your own bonfire (obey local rules)', 'Keep your belongings safe while swimming'],
    localSecret: 'The smaller beach of La Enramada in La Caleta has a more local feel than the big tourist beaches.'
  }
];

export const destinationsList = [
  {
    name: "Costa Adeje",
    description: "Upscale resort area known for luxury hotels, chic boutiques, and fine dining.",
    detailedDescription: "Costa Adeje is the newest and most upscale resort area in Tenerife South. It features luxury 5-star hotels, high-end shopping centers like Plaza del Duque, and sophisticated dining. The promenade stretches for miles, offering beautiful views of the neighboring island of La Gomera, especially at sunset.",
    highlights: ["Playa del Duque", "Siam Park", "High-end shopping"],
    bestTime: "Late afternoon for sunsets, or Tuesday/Thursday for the local market.",
    suitability: "Luxury travelers, families, and shopping enthusiasts.",
    whatToBring: ["Elegant evening wear", "Comfortable walking shoes for the promenade", "Sunscreen"],
    nearbyRecommendations: ["La Caleta fisherman village", "Siam Park", "Plaza del Duque"],
    travelTips: ["Book restaurants in advance during peak season", "Visit the promenade at twilight for the best views", "The Tuesday/Thursday market is great for local crafts"],
    howToGetThere: "Accessible via the TF-1 motorway. Numerous bus lines (467, 473) connect it to the rest of the south.",
    localSecret: "Head to 'La Caleta' at the edge of Costa Adeje for authentic seafood in a traditional village setting.",
    safetyTips: "Generally very safe. Keep an eye on belongings in crowded market areas.",
    image: "https://images.unsplash.com/photo-1616851475769-d47e4eb1e6df?auto=format&fit=crop&q=80&w=800",
    lat: 28.0847,
    lng: -16.7331
  },
  {
    name: "Playa de las Américas",
    description: "The party capital of Tenerife, famous for its vibrant nightlife, surfing, and bustling promenades.",
    detailedDescription: "Purpose-built in the 1960s, Playa de las Américas is famous for its vibrant atmosphere. By day, it's a surfer's paradise with consistent waves and numerous surf schools. By night, Veronicas Strip and the Safari Centre come alive with neon lights, clubs, and bars. It's the most energetic town in the south.",
    highlights: ["Veronicas Strip", "Surfing spots", "Endless bars and clubs"],
    bestTime: "Nighttime for the atmosphere, or early morning for the best surf.",
    suitability: "Young travelers, surfers, and nightlife seekers.",
    whatToBring: ["Surfboard or rental money", "Clubwear", "Earplugs if staying near Veronicas"],
    nearbyRecommendations: ["Los Cristianos (walking distance)", "Siam Mall", "Puerto Colón"],
    travelTips: ["The best surf conditions are usually in the morning", "Be mindful of street promoters in the nightlife areas", "Try the 'Safari Centre' for a more upscale evening vibe"],
    howToGetThere: "Located directly off the TF-1. Most southern bus routes stop at the Central Bus Station here.",
    localSecret: "Walk to the 'Patch' area for some of the best-value international restaurants away from the main strip.",
    safetyTips: "Stay with friends at night. Be cautious with street promoters and unauthorized street vendors.",
    image: "https://images.unsplash.com/photo-1544485300-880c58e947c6?auto=format&fit=crop&q=80&w=800",
    lat: 28.0583,
    lng: -16.7320
  },
  {
    name: "Los Cristianos",
    description: "A former fishing village that retains some of its original charm, offering a more relaxed, family-friendly vibe.",
    detailedDescription: "Once a quiet fishing village, Los Cristianos has grown into a bustling resort while retaining much of its original Canarian charm, evident in its older architecture and pedestrianized center. It features a major busy port with daily ferries to La Gomera, La Palma, and El Hierro. The beaches are sheltered, making it ideal for families.",
    highlights: ["Ferry port to La Gomera", "Las Vistas beach", "Seafood restaurants"],
    bestTime: "Sunday morning for the market, or early morning to watch the ferries arrive.",
    suitability: "Families, older travelers, and those seeking a traditional feel.",
    whatToBring: ["Beach gear", "Camera for the harbor", "Walking shoes"],
    nearbyRecommendations: ["Montana de Guaza for hiking", "Monkey Park", "Ferry to La Gomera"],
    travelTips: ["Visit the Church square for a taste of local life", "The ferry terminal has great views for photos", "Sundays feature a massive market near the Arona Gran Hotel"],
    howToGetThere: "Connected by the TF-1. It is the main hub for ferry travel and has a large central bus station.",
    localSecret: "The small side streets near the old harbor hide the most authentic 'Guachinches' (local eateries).",
    safetyTips: "Take care of wallets in the Sunday market. The port area can be very busy.",
    image: "https://images.unsplash.com/photo-1632766324376-7ebafad11666?auto=format&fit=crop&q=80&w=800",
    lat: 28.0526,
    lng: -16.7167
  },
  {
    name: "El Médano",
    description: "A laid-back, bohemian town world-renowned for windsurfing and kitesurfing.",
    detailedDescription: "Unlike the manicured resorts further west, El Médano offers a laid-back, bohemian atmosphere. The constant trade winds make it a world-class destination for kitesurfing and windsurfing, frequently hosting world championships. The town is centered around a lively plaza filled with cafes and surf shops, and dominated by the striking Montaña Roja volcanic cone.",
    highlights: ["Kitesurfing", "Montaña Roja", "Bohemian cafes"],
    bestTime: "Windy days (most days!) for the spectacle, or sunset at the plaza.",
    suitability: "Water sports enthusiasts, hikers, and bohemian souls.",
    whatToBring: ["Windbreaker", "Sturdy shoes for hiking Montaña Roja", "Action camera"],
    nearbyRecommendations: ["Los Abrigos fishing village", "Playa de la Tejita", "Cave dwellings"],
    travelTips: ["Climb Montaña Roja for sunrise or sunset", "Check the wind forecast before planning a beach day", "Visit on Saturdays for the local farmers market (Mercadillo)"],
    howToGetThere: "Just 10 minutes from the South Airport. Bus routes 470 and 408 connect it to other towns.",
    localSecret: "Walk along the coast toward 'Los Abrigos' for incredible natural rock pools and cave dwellings.",
    safetyTips: "The wind can be strong; watch your hats! Be careful when hiking the mountain in strong gusts.",
    image: "https://images.unsplash.com/photo-1582236589327-0466be5ee821?auto=format&fit=crop&q=80&w=800",
    lat: 28.0450,
    lng: -16.5367
  }
];

export const beaches = [
  {
    name: "Playa del Duque",
    location: "Costa Adeje",
    description: "A premium beach with golden sand imported from the Sahara, sun loungers, and calm waters.",
    detailedDescription: "Considered the most exclusive beach in the south, Playa del Duque features pristine golden sand imported from the Sahara desert. It's surrounded by high-end resorts, luxury boutiques, and stylish beach clubs. The water is protected by breakwaters, making it calm and excellent for swimming. Striped beach huts and premium sun loungers complete the elegant aesthetic.",
    type: "Golden Sand / Family / Luxury",
    bestTime: "Early morning to secure a prime sun lounger spot.",
    suitability: "Families and travelers looking for comfort and luxury.",
    whatToBring: ["Light reading", "Sunscreen", "Beach towel"],
    nearbyRecommendations: ["El Mirador shopping mall", "The promenade walk to La Caleta"],
    travelTips: ["Arrive early to secure the best loungers", "The beach is fully accessible for disabled visitors", "Shower facilities are top-notch but may have a small fee"],
    howToGetThere: "Follow the promenade in Costa Adeje westward. There is a large paid parking lot nearby.",
    safetyTips: "The beach has flags; always check for green (safe) before swimming.",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    lat: 28.0906,
    lng: -16.7441,
  },
  {
    name: "Playa de las Vistas",
    location: "Los Cristianos",
    description: "One of the longest beaches in the south. Great facilities and a spectacular fountain.",
    detailedDescription: "Spanning between Los Cristianos and Las Américas, this long sweep of golden sand is protected by an artificial breakwater, making it extremely safe for children. It features a spectacular fountain shooting water high into the air. The promenade behind the beach is packed with restaurants, cafes, and shops. It also offers excellent accessible facilities for wheelchair users.",
    type: "Golden Sand / Family / Accessible",
    bestTime: "Always good, but beautiful at sunset with the fountain lights.",
    suitability: "Families with kids and people with reduced mobility.",
    whatToBring: ["Snorkel gear (some fish near the rocks)", "Inflatable toys for kids"],
    nearbyRecommendations: ["Golden Mile shopping", "Los Cristianos Harbor"],
    travelTips: ["The central fountain makes for great photos at night", "Perfect for long beach walks across the bay", "There is a dedicated area for people with reduced mobility"],
    howToGetThere: "Walking distance from the center of Los Cristianos. Easily reachable via the main promenade.",
    safetyTips: "Very safe due to breakwaters. Lifeguards are on duty daily.",
    image: "https://images.unsplash.com/photo-1520113412548-5256e5df4698?auto=format&fit=crop&q=80&w=800",
    lat: 28.0519,
    lng: -16.7214,
  },
  {
    name: "Playa de la Tejita",
    location: "El Médano",
    description: "A stunning natural beach tucked next to the Montaña Roja volcanic cone. More exposed to the wind.",
    detailedDescription: "A striking, wild beach with natural dark sand stretching over a kilometer. Its most defining feature is the dramatic view of the 171-meter tall Montaña Roja (Red Mountain) towering at its eastern end. Because it's open to the elements, it can get quite windy. The easternmost section right beneath the mountain is famously nudist-friendly. A true escape from the resort beaches.",
    type: "Natural Dark Sand / Wild / Nudist friendly",
    bestTime: "Early morning before the trade winds pick up.",
    suitability: "Nature lovers, nudists, and those avoiding crowds.",
    whatToBring: ["Full picnic and water", "Wind shelter/tent", "Strong sunscreen"],
    nearbyRecommendations: ["Montaña Roja hike", "Chiringuito Pirata"],
    travelTips: ["Bring your own shade and plenty of water", "The western end is better for wind-shelter", "Check if there's an event at the Chiringuito Pirata nearby"],
    howToGetThere: "Park at the base of Montaña Roja and walk about 5 minutes through the natural trail.",
    safetyTips: "Rip currents can be strong when windy. Stay within your depth.",
    image: "https://images.unsplash.com/photo-1499596395995-17d4a20bde15?auto=format&fit=crop&q=80&w=800",
    lat: 28.0315,
    lng: -16.5522,
  },
  {
    name: "Playa Fañabé",
    location: "Costa Adeje",
    description: "Action-packed beach with water sports, beach clubs, and an endless array of restaurants.",
    detailedDescription: "If you want action, Fañabé is the place. The sand is a mix of natural dark volcanic and imported lighter sand. It is lined with multiple levels of terraces filled with international restaurants, bars, and shops. Down on the water edge, you can rent jet skis, go parasailing, or relax at upscale beach clubs with Balinese beds and live DJs.",
    type: "Dark Sand / Active / Water Sports",
    bestTime: "Afternoon (around 4 PM) when the beach clubs are most lively.",
    suitability: "Adventure seekers, groups of friends, and active families.",
    whatToBring: ["GoPro for water sports", "Party vibes", "Wallet for beach clubs"],
    nearbyRecommendations: ["Playa del Duque (neighboring)", "San Eugenio Shopping Center"],
    travelTips: ["Try the sunset cocktails at the beach clubs", "Excellent place for parasailing and jet-skiing", "The 'Beach Club' vibe peaks around 4 PM"],
    howToGetThere: "Centrally located in Costa Adeje with multiple public parking areas nearby.",
    safetyTips: "Follow instructions from water sports operators carefully.",
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&q=80&w=800",
    lat: 28.0831,
    lng: -16.7371,
  }
];

export const activities = [
  {
    name: "Whale & Dolphin Watching",
    description: "Take a boat tour from Puerto Colón or Los Cristianos. The waters between Tenerife and La Gomera are a permanent home to pilot whales.",
    detailedDescription: "The southwestern coast of Tenerife is one of the top locations globally for cetacean watching. A resident colony of short-finned pilot whales and bottlenose dolphins lives in the deep waters between Tenerife and La Gomera. Tours range from 2-hour trips on large catamarans to 4-5 hour excursions on traditional wooden sailboats or luxury yachts, often including a swim stop and food.",
    price: "€25 - €60",
    bestTime: "Morning trips for calmer waters and better visibility.",
    suitability: "Wildlife enthusiasts and families.",
    whatToBring: ["Sunglasses (polarized if possible)", "Light jacket", "Motion sickness bands if prone"],
    nearbyRecommendations: ["Puerto Colón marina", "Leisure stroll along the coastal path"],
    travelTips: ["Book a morning trip for calmer seas", "Look for boats with the 'Blue Boat' flag (responsible operators)", "Bring sunscreen and a light jacket (it gets windy)"],
    howToGetThere: "Most tours depart from Puerto Colón (Costa Adeje) or the Los Cristianos harbor.",
    safetyTips: "Choose certified operators to ensure respectful distances from the animals.",
    image: "https://images.unsplash.com/photo-1506543730435-e2c1d4553a84?auto=format&fit=crop&q=80&w=800",
    lat: 28.0772,
    lng: -16.7378,
  },
  {
    name: "Siam Park",
    description: "Repeatedly voted the world's best water park. Features Thai-themed architecture and thrilling rides.",
    detailedDescription: "Ranked as the #1 water park in the world by TripAdvisor users multiple times. Siam Park is a massive, meticulously themed Thai paradise. The signature ride is the Tower of Power, a near-vertical 28-meter drop that shoots you through a transparent tube within an aquarium full of sharks and rays. It also features a massive wave pool claiming to produce the largest artificial waves in the world.",
    price: "€42 Adult / €30 Child",
    bestTime: "Weekdays, arriving 30 minutes before official opening.",
    suitability: "Thrill-seekers, teenagers, and active families.",
    whatToBring: ["Quick-dry swimwear", "Water shoes/socks", "Minimal belongings (rent a locker)"],
    nearbyRecommendations: ["Siam Mall (next door)", "Magma Art & Congress"],
    travelTips: ["Get there 30 mins before opening to beat the queues", "Buy tickets online in advance", "The 'Twin Ticket' with Loro Parque is a great deal"],
    howToGetThere: "A free shuttle bus runs regularly from various points in Playa de las Américas and Costa Adeje.",
    safetyTips: "Follow height and health restrictions for each ride. Use high-SPF waterproof sunscreen.",
    image: "https://images.unsplash.com/photo-1582650050854-e0eb363806f3?auto=format&fit=crop&q=80&w=800",
    lat: 28.0725,
    lng: -16.7275,
  },
  {
    name: "Teide National Park",
    description: "While in the center of the island, it's easily accessible from the south. Visit the highest peak in Spain. Pack warm clothes!",
    detailedDescription: "A UNESCO World Heritage site and the most visited national park in Spain. Its centerpiece is Mount Teide, a dormant volcano standing at 3,718 meters—the highest peak in Spain. The landscape is alien, featuring vast craters, lava flows, and unique rock formations like the Roques de García. You can take a cable car near the summit, but remember the air is thin and it's cold up there, even if the beaches below are roasting.",
    price: "Free entry, Cable car ~€40",
    bestTime: "Sunset for incredible views, or late night for world-class stargazing.",
    suitability: "Hikers, photographers, and nature enthusiasts.",
    whatToBring: ["Warm layers (it can be freezing at the peak!)", "Sturdy hiking boots", "Plenty of water"],
    nearbyRecommendations: ["Roques de García", "Observatorio del Teide"],
    travelTips: ["Book the cable car weeks in advance", "The temperature drops significantly—bring layers", "Stay for stargazing; it's one of the world's best spots"],
    howToGetThere: "Public bus line 342 goes from Costa Adeje directly to the park once a day. Car rental is best.",
    safetyTips: "Be aware of altitude sickness signs. Stay on marked trails to protect the fragile ecosystem.",
    image: "https://images.unsplash.com/photo-1541804246062-8e3ad5d3d45d?auto=format&fit=crop&q=80&w=800",
    lat: 28.2723,
    lng: -16.6425,
  },
  {
    name: "Surfing in Las Américas",
    description: "Great waves year-round for beginners and pros alike. Plenty of surf schools available on the beach.",
    detailedDescription: "Las Américas is the epicenter of surfing in southern Tenerife. The coast here is dotted with various surf breaks over rocky reefs. 'La Izquierda' (The Left) is famous for experienced surfers, catching a long, fast left-hand break. For complete beginners, the beaches around El Medio offer gentler, rolling waves and a plethora of surf schools providing boards and expert instruction.",
    price: "€30 - €40 per lesson",
    bestTime: "Early morning when the wind is light and the 'Golden Mile' is quiet.",
    suitability: "Active individuals and adventure seekers of all ages.",
    whatToBring: ["Board shorts/swimsuit", "Rash guard", "Waterproof watch"],
    nearbyRecommendations: ["The Golden Mile shopping promenade", "Hard Rock Cafe"],
    travelTips: ["Rent a board for the whole day if you plan to stay", "Wear a rash guard to prevent wax rub", "The tide significantly changes the wave quality"],
    howToGetThere: "Head to the 'Golden Mile' area in Las Américas; the surf schools are clustered on the beach front.",
    safetyTips: "Respect the 'locals' at the advanced breaks. Always surf with someone else.",
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&q=80&w=800",
    lat: 28.0581,
    lng: -16.7335,
  }
];

export const practicalInfo = [
  {
    icon: Plane,
    title: "Airport (TFS)",
    content: "Tenerife South Airport (Reina Sofía) handles the vast majority of tourist flights. It is located just 15-20 minutes away from the main southern resorts."
  },
  {
    icon: Sun,
    title: "Weather",
    content: "The south of Tenerife boasts 300+ days of sunshine a year. Winters average 20-22°C (68-72°F) and summers 26-28°C (79-82°F). It rarely rains."
  },
  {
    icon: Bus,
    title: "Transport",
    content: "Public buses (TITSA - look for the green buses) are reliable and cheap. Taxis are plentiful but more expensive. Renting a car is recommended if you plan to explore the island."
  },
  {
    icon: Utensils,
    title: "Food & Drink",
    content: "Try 'Papas Arrugadas' (wrinkly potatoes) with 'Mojo' sauce. Seafood is excellent. Tap water is safe to drink but most tourists prefer bottled water due to the high mineral taste."
  }
];
