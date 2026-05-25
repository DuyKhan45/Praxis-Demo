// Test script for local NLP parsing logic.
// Run with: node scripts/test-ai-parser.js

// Re-implemented parser logic matching useAi.js exactly for headless node testing
function localParseQuery(query) {
  const q = query.toLowerCase();
  
  const filters = {
    city: null,
    type: null,
    maxPrice: null,
    minRating: null,
    minBeds: null,
    amenities: []
  };

  if (q.includes('hanoi') || q.includes('hà nội') || q.includes('ba dinh') || q.includes('tay ho') || q.includes('hoan kiem') || q.includes('dong da')) {
    filters.city = 'Hanoi';
  } else if (q.includes('ho chi minh') || q.includes('hcmc') || q.includes('saigon') || q.includes('sài gòn') || q.includes('thao dien') || q.includes('district 1') || q.includes('district 2') || q.includes('district 3')) {
    filters.city = 'Ho Chi Minh City';
  } else if (q.includes('da nang') || q.includes('đà nẵng') || q.includes('son tra') || q.includes('hai chau') || q.includes('my khe')) {
    filters.city = 'Da Nang';
  }

  if (q.includes('studio') || q.includes('room')) {
    filters.type = 'Studio';
  } else if (q.includes('apartment') || q.includes('condo') || q.includes('flat') || q.includes('penthouse')) {
    filters.type = 'Apartment';
  } else if (q.includes('house') || q.includes('villa') || q.includes('townhouse')) {
    filters.type = 'House';
  }

  const priceRegexes = [
    /under\s*\$?(\d+)/,
    /below\s*\$?(\d+)/,
    /less\s*than\s*\$?(\d+)/,
    /max(?:imum)?\s*\$?(\d+)/,
    /budget\s*of\s*\$?(\d+)/,
    /\$?(\d+)\s*or\s*less/
  ];

  for (let regex of priceRegexes) {
    const match = q.match(regex);
    if (match && match[1]) {
      filters.maxPrice = parseInt(match[1]);
      break;
    }
  }

  if (!filters.maxPrice) {
    if (q.includes('cheap') || q.includes('budget') || q.includes('pocket-friendly') || q.includes('affordable')) {
      filters.maxPrice = 45;
    }
  }

  if (q.includes('top rated') || q.includes('best') || q.includes('popular') || q.includes('highly rated')) {
    filters.minRating = 4.8;
  }

  const bedMatch = q.match(/(\d+)\s*bed/);
  if (bedMatch && bedMatch[1]) {
    filters.minBeds = parseInt(bedMatch[1]);
  }

  const amenityMap = {
    'wifi': 'Wi-Fi',
    'wi-fi': 'Wi-Fi',
    'internet': 'Wi-Fi',
    'workspace': 'Workspace',
    'desk': 'Workspace',
    'work': 'Workspace',
    'pool': 'Pool',
    'swim': 'Pool',
    'gym': 'Gym',
    'fitness': 'Gym',
    'garden': 'Garden',
    'yard': 'Garden',
    'kitchen': 'Kitchen',
    'cook': 'Kitchen',
    'elevator': 'Elevator',
    'lift': 'Elevator',
    'wash': 'Washing Machine',
    'laundry': 'Washing Machine',
    'security': 'Security',
    'safe': 'Security',
    'balcony': 'Balcony',
    'terrace': 'Balcony'
  };

  Object.keys(amenityMap).forEach(key => {
    if (q.includes(key)) {
      const val = amenityMap[key];
      if (!filters.amenities.includes(val)) {
        filters.amenities.push(val);
      }
    }
  });

  return { filters };
}

// Test Suite
const testCases = [
  {
    query: "Show me studios in Hanoi under $50",
    expected: {
      city: "Hanoi",
      type: "Studio",
      maxPrice: 50,
      minRating: null,
      minBeds: null,
      amenities: []
    }
  },
  {
    query: "looking for an apartment in Saigon with a dedicated workspace and high speed internet",
    expected: {
      city: "Ho Chi Minh City",
      type: "Apartment",
      maxPrice: null,
      minRating: null,
      minBeds: null,
      amenities: ["Workspace", "Wi-Fi"]
    }
  },
  {
    query: "cheap house in Da Nang with a pool and gym",
    expected: {
      city: "Da Nang",
      type: "House",
      maxPrice: 45,
      minRating: null,
      minBeds: null,
      amenities: ["Pool", "Gym"]
    }
  },
  {
    query: "best 2 bed place in Hoan Kiem with kitchen and elevator",
    expected: {
      city: "Hanoi",
      type: null,
      maxPrice: null,
      minRating: 4.8,
      minBeds: 2,
      amenities: ["Kitchen", "Elevator"]
    }
  }
];

let passed = 0;
console.log("Running AI Search Parser Tests...\n");

testCases.forEach((tc, idx) => {
  const result = localParseQuery(tc.query);
  const resultFilters = result.filters;
  let matches = true;

  // Verify properties
  for (let key in tc.expected) {
    if (key === 'amenities') {
      // Check arrays match
      const expectedArray = tc.expected.amenities.sort();
      const actualArray = resultFilters.amenities.sort();
      if (expectedArray.length !== actualArray.length || !expectedArray.every((v, i) => v === actualArray[i])) {
        matches = false;
        console.error(`❌ Test #${idx + 1} Failed: Amenities mismatch. Expected [${expectedArray}], got [${actualArray}]`);
      }
    } else {
      if (resultFilters[key] !== tc.expected[key]) {
        matches = false;
        console.error(`❌ Test #${idx + 1} Failed: Key "${key}" mismatch. Expected "${tc.expected[key]}", got "${resultFilters[key]}"`);
      }
    }
  }

  if (matches) {
    passed++;
    console.log(`✅ Test #${idx + 1} Passed: "${tc.query}"`);
  }
});

console.log(`\nResults: ${passed}/${testCases.length} tests passed.`);
process.exit(passed === testCases.length ? 0 : 1);
