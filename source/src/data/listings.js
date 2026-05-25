export const listings = [
  {
    id: "hanoi-1",
    title: "Modern Studio, Ba Dinh",
    description: "A bright, compact studio in the historic Ba Dinh district. Features a dedicated workspace, fast fiber-optic Wi-Fi, and a quiet street environment. Perfect for digital nomads and business travelers.",
    type: "Studio",
    price: 42,
    rating: 4.9,
    location: {
      city: "Hanoi",
      district: "Ba Dinh",
      address: "15 Doi Can Street, Ba Dinh, Hanoi"
    },
    coordinates: { lat: 21.0354, lng: 105.8290 },
    beds: 1,
    baths: 1,
    tag: "New",
    amenities: ["Wi-Fi", "Workspace", "Air conditioning", "Kitchen", "Elevator"],
    theme: "blue", // matches mockup's blue background & building icon
    icon: "building"
  },
  {
    id: "hanoi-2",
    title: "Garden Villa, Tay Ho",
    description: "Spacious house near West Lake with a private lush green garden. Offers high ceilings, fully equipped modern kitchen, and beautiful terrace views. A quiet retreat away from the city center bustle.",
    type: "House",
    price: 89,
    rating: 4.7,
    location: {
      city: "Hanoi",
      district: "Tay Ho",
      address: "42 Xuan Dieu Road, Tay Ho, Hanoi"
    },
    coordinates: { lat: 21.0610, lng: 105.8210 },
    beds: 2,
    baths: 2,
    tag: null,
    amenities: ["Wi-Fi", "Kitchen", "Garden", "Air conditioning", "Balcony", "Parking"],
    theme: "green", // matches mockup's green background & house icon
    icon: "home"
  },
  {
    id: "hanoi-3",
    title: "City View Apt, Hoan Kiem",
    description: "Premium high-rise apartment in the heart of Hanoi, just minutes walking from Hoan Kiem Lake. Exquisite city views, washing machine, and 24/7 security. Walk to local cafes, restaurants, and temples.",
    type: "Apartment",
    price: 55,
    rating: 4.8,
    location: {
      city: "Hanoi",
      district: "Hoan Kiem",
      address: "10 Ly Thuong Kiet Street, Hoan Kiem, Hanoi"
    },
    coordinates: { lat: 21.0245, lng: 105.8540 },
    beds: 1,
    baths: 1,
    tag: "Top pick",
    amenities: ["Wi-Fi", "Workspace", "Air conditioning", "Elevator", "Washing Machine", "Security"],
    theme: "yellow", // matches mockup's yellow background & high-rise icon
    icon: "hotel"
  },
  {
    id: "hanoi-4",
    title: "Cozy Room, Dong Da",
    description: "A pocket-friendly, warm studio room with a skylight window. Close to universities and local street food stalls. Quiet local residential community.",
    type: "Studio",
    price: 28,
    rating: 4.6,
    location: {
      city: "Hanoi",
      district: "Dong Da",
      address: "88 Chua Boc Street, Dong Da, Hanoi"
    },
    coordinates: { lat: 21.0110, lng: 105.8280 },
    beds: 1,
    baths: 1,
    tag: "Budget-friendly",
    amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Desk"],
    theme: "pink", // matches mockup's pink background & room icon
    icon: "smile"
  },
  {
    id: "hanoi-5",
    title: "Luxury West Lake Penthouse",
    description: "Stunning penthouse in Tay Ho overlooking the entire West Lake. Floor-to-ceiling glass windows, private infinity pool, gym access, and a large sunset terrace.",
    type: "Apartment",
    price: 180,
    rating: 4.95,
    location: {
      city: "Hanoi",
      district: "Tay Ho",
      address: "12 Quang An Street, Tay Ho, Hanoi"
    },
    coordinates: { lat: 21.0650, lng: 105.8150 },
    beds: 3,
    baths: 3.5,
    tag: "Top pick",
    amenities: ["Wi-Fi", "Workspace", "Air conditioning", "Pool", "Gym", "Balcony", "Kitchen", "Elevator"],
    theme: "purple",
    icon: "sparkles"
  },
  {
    id: "hcmc-1",
    title: "Sleek Studio near Ben Thanh",
    description: "Modern minimalist studio located in District 1, Ho Chi Minh City. Features smart home accessories, fast Wi-Fi, and a rooftop common terrace. Close to street food markets and shops.",
    type: "Studio",
    price: 45,
    rating: 4.85,
    location: {
      city: "Ho Chi Minh City",
      district: "District 1",
      address: "120 Le Thanh Ton, District 1, HCMC"
    },
    coordinates: { lat: 10.7735, lng: 106.6975 },
    beds: 1,
    baths: 1,
    tag: "New",
    amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Elevator", "Washing Machine"],
    theme: "blue",
    icon: "building"
  },
  {
    id: "hcmc-2",
    title: "Thao Dien Riverview Condo",
    description: "Elegant apartment in Thao Dien (District 2), the digital nomad hub. Stunning balcony view of the Saigon River, high-speed Wi-Fi, workspace, shared pool, and professional gym.",
    type: "Apartment",
    price: 68,
    rating: 4.76,
    location: {
      city: "Ho Chi Minh City",
      district: "District 2",
      address: "15 Nguyen Van Huong, Thao Dien, District 2, HCMC"
    },
    coordinates: { lat: 10.8062, lng: 106.7320 },
    beds: 2,
    baths: 2,
    tag: "Top pick",
    amenities: ["Wi-Fi", "Workspace", "Air conditioning", "Pool", "Gym", "Balcony", "Kitchen", "Elevator", "Security"],
    theme: "yellow",
    icon: "hotel"
  },
  {
    id: "hcmc-3",
    title: "Nomad Loft, Binh Thanh",
    description: "Industrial loft-style studio in Binh Thanh, right next to District 1. High speed fiber internet, spacious workstation, and cozy kitchen corner. Lots of cool local cafes nearby.",
    type: "Studio",
    price: 35,
    rating: 4.7,
    location: {
      city: "Ho Chi Minh City",
      district: "Binh Thanh",
      address: "240 Nguyen Huu Canh, Binh Thanh, HCMC"
    },
    coordinates: { lat: 10.7950, lng: 106.7150 },
    beds: 1,
    baths: 1,
    tag: "Budget-friendly",
    amenities: ["Wi-Fi", "Workspace", "Air conditioning", "Kitchen", "Washing Machine"],
    theme: "pink",
    icon: "smile"
  },
  {
    id: "hcmc-4",
    title: "Heritage House, District 3",
    description: "Charming traditional French colonial style town house with a hidden courtyard. High ceilings, wooden beams, and antique furniture. Experience old Saigon vibes with modern comforts.",
    type: "House",
    price: 75,
    rating: 4.88,
    location: {
      city: "Ho Chi Minh City",
      district: "District 3",
      address: "12 Vo Van Tan, District 3, HCMC"
    },
    coordinates: { lat: 10.7780, lng: 106.6900 },
    beds: 2,
    baths: 1.5,
    tag: null,
    amenities: ["Wi-Fi", "Air conditioning", "Kitchen", "Garden", "Balcony"],
    theme: "green",
    icon: "home"
  },
  {
    id: "danang-1",
    title: "My Khe Beachfront Studio",
    description: "Step straight onto the sand of My Khe Beach. Modern studio with stunning panoramic ocean views, private balcony, and fast Wi-Fi. Watch the sunrise from your bed.",
    type: "Studio",
    price: 38,
    rating: 4.92,
    location: {
      city: "Da Nang",
      district: "Son Tra",
      address: "258 Vo Nguyen Giap, Son Tra, Da Nang"
    },
    coordinates: { lat: 16.0620, lng: 108.2465 },
    beds: 1,
    baths: 1,
    tag: "Budget-friendly",
    amenities: ["Wi-Fi", "Air conditioning", "Balcony", "Kitchen", "Elevator"],
    theme: "blue",
    icon: "building"
  },
  {
    id: "danang-2",
    title: "Han River View Apartment",
    description: "High-floor luxury apartment facing the Han River. Watch the famous Dragon Bridge fire show from the balcony. Fully functional workspace, kitchen, rooftop infinity pool, and gym.",
    type: "Apartment",
    price: 60,
    rating: 4.82,
    location: {
      city: "Da Nang",
      district: "Hai Chau",
      address: "182 Bach Dang Street, Hai Chau, Da Nang"
    },
    coordinates: { lat: 16.0685, lng: 108.2225 },
    beds: 2,
    baths: 2,
    tag: "Top pick",
    amenities: ["Wi-Fi", "Workspace", "Air conditioning", "Pool", "Gym", "Balcony", "Kitchen", "Elevator", "Security"],
    theme: "yellow",
    icon: "hotel"
  },
  {
    id: "danang-3",
    title: "Eco-Friendly Beach Villa",
    description: "Sustainable green villa located in a quiet enclave near the beach. Solar powered, private garden patio, and natural air cooling. Perfect for a relaxing eco-conscious vacation.",
    type: "House",
    price: 110,
    rating: 4.79,
    location: {
      city: "Da Nang",
      district: "Ngu Hanh Son",
      address: "55 Truong Sa Road, Ngu Hanh Son, Da Nang"
    },
    coordinates: { lat: 16.0410, lng: 108.2580 },
    beds: 3,
    baths: 3,
    tag: "New",
    amenities: ["Wi-Fi", "Kitchen", "Garden", "Air conditioning", "Balcony", "Parking"],
    theme: "green",
    icon: "home"
  }
];
