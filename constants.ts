import { MenuSectionType, PromotionType } from './types';

// Logo paths from components folder
export const CAFE_LOGO = new URL('./components/logo.png', import.meta.url).href;
export const HEADER_LOGO = new URL('./components/header.png', import.meta.url).href;

export const MENU_DATA: MenuSectionType[] = [
  {
    "section_name": "Butter Brew Series",
    "items": [
      {
        "id": "classic-butter",
        "name": "Classic Butter",
        "price": 170,
        "description": "Our signature concoction. A sweet, creamy, and buttery sparkling drink that's become a local legend.",
        "image": "https://images.unsplash.com/photo-1579888063322-a9f8a559d6e8?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"],
        "is_recommended": true,
        "tasting_notes": ["Sweet", "Creamy", "Butterscotch", "Vanilla"],
        "ingredients": ["Carbonated water", "House-made butterscotch syrup", "Rich cream foam"],
        "nutrition": {
          "Serving Size": "16 oz",
          "Calories": "280",
          "Sugar": "45g",
          "Caffeine": "0mg"
        },
        "pairings": ["Pumpkin Pasties", "TriBeCa Cookies"]
      },
      {
        "id": "hot-brew",
        "name": "Hot Brew",
        "price": 169,
        "description": "A comforting, milk-based hot drink with a delightful hint of shortbread flavor.",
        "image": "https://images.unsplash.com/photo-1598910100582-6415f9498263?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy", "Gluten", "Wheat"]
      },
      {
        "id": "espresso-based-brew",
        "name": "Espresso Based",
        "price": 170,
        "description": "Our Hot Butter Brew with a bold kick of freshly pulled espresso.",
        "image": "https://images.unsplash.com/photo-1572498725821-2e663d27b872?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "caramel-butter-brew",
        "name": "Caramel Butter Brew",
        "price": 175,
        "description": "Our signature butter brew layered with a ribbon of burnt caramel and topped with spiced foam.",
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"],
        "tasting_notes": ["Caramel", "Butterscotch", "Warm Spice"]
      }
    ]
  },
  {
    "section_name": "Coffee",
    "items": [
      {
        "id": "americano",
        "name": "Americano",
        "price": 100,
        "description": "A classic, robust brew. Espresso shots topped with hot water creating a light layer of crema. Available Hot or Iced.",
        "image": "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": [],
        "tasting_profile": { "sweetness": 1, "acidity": 3, "body": 2 }
      },
      {
        "id": "cafe-latte",
        "name": "Cafe Latte",
        "price": 140,
        "description": "Smooth, creamy, and perfectly balanced. Made with a shot of espresso and steamed milk. Available Hot or Iced.",
        "image": "https://images.unsplash.com/photo-1572442388796-11668a65343d?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"],
        "tasting_profile": { "sweetness": 2, "acidity": 2, "body": 3 }
      },
      {
        "id": "vanilla-latte",
        "name": "Vanilla Latte",
        "price": 150,
        "description": "A touch of sweet vanilla for a smooth experience. Available Hot or Iced.",
        "image": "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "cafe-mocha",
        "name": "Cafe Mocha",
        "price": 150,
        "description": "Rich chocolate meets bold espresso. A decadent treat. Available Hot or Iced.",
        "image": "https://images.unsplash.com/photo-1599399105439-0731f24d1808?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy", "Soy"]
      },
      {
        "id": "butterscotch-macchiato",
        "name": "Butterscotch Macchiato",
        "price": 150,
        "description": "A sweet and comforting butterscotch delight. Available Hot or Iced.",
        "image": "https://images.unsplash.com/photo-1563868045-849993e17112?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"],
        "is_recommended": true,
        "tasting_profile": { "sweetness": 4, "acidity": 2, "body": 3 }
      },
      {
        "id": "spanish-latte",
        "name": "Spanish Latte",
        "price": 150,
        "description": "Creamy and sweet with condensed milk for a rich texture. Available Hot or Iced.",
        "image": "https://images.unsplash.com/photo-1623193219330-348638361b1b?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "hazelnut-caramel-macchiato",
        "name": "Hazelnut Caramel Macchiato",
        "price": 165,
        "description": "A velvety macchiato sweetened with hazelnut praline and drizzled caramel.",
        "image": "https://images.unsplash.com/photo-1459755486867-b55449bb39ff?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy", "Nuts"],
        "tasting_profile": { "sweetness": 4, "acidity": 2, "body": 3 }
      },
      {
        "id": "midnight-cold-brew",
        "name": "Midnight Cold Brew",
        "price": 160,
        "description": "Slow-steeped cold brew with smoked sugar syrup and a citrus mist finish.",
        "image": "https://images.unsplash.com/photo-1495474472287-4d713b20e473?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": []
      }
    ]
  },
  {
    "section_name": "Non-Coffee",
    "items": [
      {
        "id": "mango-milk",
        "name": "Mango Milk",
        "price": 160,
        "description": "A refreshing and creamy cold mango and milk blend.",
        "image": "https://images.unsplash.com/photo-1600718374567-3a785f2648c2?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "blueberry-milk",
        "name": "Blueberry Milk",
        "price": 160,
        "description": "A sweet and fruity cold blueberry drink, perfect for a sunny day.",
        "image": "https://images.unsplash.com/photo-1633940113428-14251241ed32?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "hot-choco",
        "name": "Hot Choco",
        "price": 120,
        "description": "A classic comfort drink, rich and velvety, topped with toasted marshmallows.",
        "image": "https://images.unsplash.com/photo-1600891964348-c57a9c2b2b2b?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy", "Soy"]
      },
      {
        "id": "salted-caramel-cocoa",
        "name": "Salted Caramel Cocoa",
        "price": 165,
        "description": "Dark cocoa blended with caramel cream and a sprinkle of smoked sea salt.",
        "image": "https://images.unsplash.com/photo-1510626176961-4b37d0f0b56c?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      }
    ]
  },
  {
    "section_name": "Signatures",
    "items": [
      {
        "id": "lily",
        "name": "Lily",
        "price": 160,
        "description": "Strawberry Latte drizzled with a rich cheesecake sauce. Available Hot or Cold.",
        "image": "https://images.unsplash.com/photo-1581598501194-de4c781ab4a5?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy", "Gluten", "Wheat"]
      },
      {
        "id": "helga",
        "name": "Helga",
        "price": 160,
        "description": "Banana choco latte, a comforting and sweet blend for any mood. Available Hot or Cold.",
        "image": "https://images.unsplash.com/photo-1571597956485-a78d0f505672?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy", "Soy"],
        "is_recommended": true
      },
      {
        "id": "loony",
        "name": "Loony",
        "price": 160,
        "description": "Blue moon latte for a touch of whimsy and delightful flavor. Available Hot or Cold.",
        "image": "https://images.unsplash.com/photo-1579781403211-6b26a693f545?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "merlin",
        "name": "Merlin",
        "price": 160,
        "description": "Matcha latte with brown sugar syrup for a perfect energy boost. Available Hot or Cold.",
        "image": "https://images.unsplash.com/photo-1543353383-91b3b55a2d04?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "aurora-berry-latte",
        "name": "Aurora Berry Latte",
        "price": 170,
        "description": "A layered latte with blackberry compote, lavender cream, and espresso.",
        "image": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"],
        "is_recommended": true
      }
    ]
  },
  {
    "section_name": "Matcha Series",
    "items": [
      {
        "id": "strawberry-matcha",
        "name": "Strawberry Matcha",
        "price": 180,
        "description": "A beautiful three-layer drink with strawberry milk and Matcha cloud foam on top.",
        "image": "https://images.unsplash.com/photo-1583232141014-5591b3d7a8d6?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "mango-matcha",
        "name": "Mango Matcha",
        "price": 180,
        "description": "A vibrant three-layer drink with sweet Mango milk and a shot of earthy Matcha.",
        "image": "https://images.unsplash.com/photo-1627855322495-253c57f951e0?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "blueberry-matcha",
        "name": "Blueberry Matcha",
        "price": 180,
        "description": "A unique three-layer drink with Blueberry milk and Matcha cloud foam on top.",
        "image": "https://images.unsplash.com/photo-1618193138244-3221947e4522?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "yuzu-matcha-fizz",
        "name": "Yuzu Matcha Fizz",
        "price": 185,
        "description": "Bright yuzu citrus with sparkling matcha and a touch of vanilla cream.",
        "image": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      }
    ]
  },
  {
    "section_name": "Refreshers",
    "items": [
      {
        "id": "aphrodite",
        "name": "Aphrodite",
        "price": 160,
        "description": "An enchanting sparkling butterfly pea lemonade that changes color.",
        "image": "https://images.unsplash.com/photo-1625944192004-92931557c688?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": [],
        "is_recommended": true
      },
      {
        "id": "pumpkin-fizzles",
        "name": "Pumpkin Fizzles",
        "price": 160,
        "description": "A festive sparkling drink with pumpkin spice and a splash of milk.",
        "image": "https://images.unsplash.com/photo-1541518339599-8a474c151c72?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "mango-fizzles",
        "name": "Mango Fizzles",
        "price": 160,
        "description": "A bright and bubbly sparkling drink with sweet mango puree.",
        "image": "https://images.unsplash.com/photo-1553787499-65f62a9024f2?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": []
      },
      {
        "id": "blueberry-cream-fizzles",
        "name": "Blueberry Cream Fizzles",
        "price": 175,
        "description": "A delightful sparkling blueberry drink topped with a creamy salted foam.",
        "image": "https://images.unsplash.com/photo-1502741224143-943846247f8b?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "mermaids-kiss",
        "name": "Mermaid's Kiss",
        "price": 160,
        "description": "A beautiful sparkling strawberry drink with a shimmering, swirling effect.",
        "image": "https://images.unsplash.com/photo-1613242784384-9a6b166945a8?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": []
      },
      {
        "id": "draculas-iced-tea",
        "name": "Dracula's Iced Tea",
        "price": 170,
        "description": "A bloody good mix of Strawberry and Hibiscus tea with Strawberry Popping Boba.",
        "image": "https://images.unsplash.com/photo-1627485290233-a2799c7594f4?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": []
      },
      {
        "id": "lychee-starlight-spritzer",
        "name": "Lychee Starlight Spritzer",
        "price": 165,
        "description": "Sparkling lychee lemonade with edible glitter and basil seeds for a celestial finish.",
        "image": "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": []
      }
    ]
  },
  {
    "section_name": "Milkshakes",
    "items": [
      { "id": "cocoa-fantasy", "name": "Cocoa Fantasy", "price": 199, "description": "A rich and decadent chocolate milkshake for the ultimate chocolate lover.", "image": "https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=600&q=80", "potential_allergens": ["Dairy", "Soy"] },
      { "id": "butter-brew-milkshake", "name": "Butter Brew Milkshake", "price": 199, "description": "Our classic signature flavor, now frozen, thick, and creamy.", "image": "https://images.unsplash.com/photo-1619149479378-c0603f2a74c7?auto=format&fit=crop&w=600&q=80", "potential_allergens": ["Dairy"] },
      { "id": "vanilla-stardust", "name": "Vanilla Stardust", "price": 199, "description": "A classic vanilla shake with a touch of edible glitter for a starry twist.", "image": "https://images.unsplash.com/photo-1563805042-7622c021c383?auto=format&fit=crop&w=600&q=80", "potential_allergens": ["Dairy"] },
      { "id": "strawberry-burst", "name": "Strawberry Burst", "price": 199, "description": "Bursting with the flavor of fresh, sweet strawberries.", "image": "https://images.unsplash.com/photo-1623124299434-6c1eb2a042e4?auto=format&fit=crop&w=600&q=80", "potential_allergens": ["Dairy"] },
      { "id": "enchanted-oreo", "name": "Enchanted Oreo", "price": 199, "description": "A spellbinding cookies and cream shake that's irresistibly good.", "image": "https://images.unsplash.com/photo-1586985289936-a8a9352bd617?auto=format&fit=crop&w=600&q=80", "potential_allergens": ["Dairy", "Gluten", "Wheat", "Soy"] },
      { "id": "coffee-cosmos", "name": "Coffee Cosmos", "price": 199, "description": "For those who need a cosmic caffeine kick in a creamy, frozen form.", "image": "https://images.unsplash.com/photo-1603201883398-a69ab1844783?auto=format&fit=crop&w=600&q=80", "potential_allergens": ["Dairy"], "is_recommended": true }
    ]
  },
  {
    "section_name": "Bites",
    "items": [
      {
        "id": "breadsticks",
        "name": "Breadsticks",
        "price": 150,
        "description": "3 pcs filled breadsticks with garlic and cheese dip. Choice of Beef Taco, Chicken Pesto or Cheesy Pepperoni.",
        "image": "https://images.unsplash.com/photo-1599307743523-ce2a7f516c8f?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy"]
      },
      {
        "id": "potato-fries",
        "name": "Potato Fries",
        "price": 190,
        "description": "A generous mix of Shoestring Fries and Potato Wedges served with garlic and cheese dip.",
        "image": "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"]
      },
      {
        "id": "fish-and-chips",
        "name": "Fish & Chips",
        "price": 220,
        "description": "Our classic battered fish fried to golden perfection, with fries and our signature tartar sauce.",
        "image": "https://images.unsplash.com/photo-1598679253443-4c60b25203b2?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Seafood", "Gluten", "Wheat", "Dairy"]
      },
      {
        "id": "dragon-scale-nachos",
        "name": "Dragon Scale Nachos",
        "price": 299,
        "description": "Nacho chips smothered with our special beefy sauce, fresh tomatoes, and melted cheese.",
        "image": "https://images.unsplash.com/photo-1563245372-f217242f2759?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"],
        "is_recommended": true
      },
      {
        "id": "griffin-wings-platter",
        "name": "Griffin Wings Platter",
        "price": 320,
        "description": "Twice-cooked chicken wings tossed in honey chili glaze with garden herb dip.",
        "image": "https://images.unsplash.com/photo-1608039729295-87f3b0a7adbc?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy", "Soy"],
        "is_recommended": true
      }
    ]
  },
  {
    "section_name": "Burgers & Sliders",
    "items": [
      {
        "id": "phoenix-sliders",
        "name": "Phoenix Sliders",
        "price": 249,
        "description": "Honey glazed chicken fillet, crisp coleslaw, and a special garlic mayo sauce in 3 mini homemade buns. Served with fries.",
        "image": "https://images.unsplash.com/photo-1607013251379-e6eecfffe234?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy"]
      },
      {
        "id": "wild-hog-sliders",
        "name": "Wild Hog Sliders",
        "price": 259,
        "description": "Pork Adobo Flakes, signature cheese sauce, scrambled egg, and pesto sauce in 3 mini homemade buns. Served with fries.",
        "image": "https://images.unsplash.com/photo-1551615593-ef5fe247e8f7?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy", "Soy"]
      },
      {
        "id": "whomper",
        "name": "Whomper",
        "price": 249,
        "description": "150g beef burger, in-house sauce, cheese, sunny-side-up egg, bacon, and caramelized onions. Served with fries.",
        "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy"],
        "is_recommended": true
      },
      {
        "id": "umami-burger",
        "name": "Umami Burger",
        "price": 259,
        "description": "Mayo wasabi, lettuce, 150g beef burger, pickled onions and a bit of pure crab fat for an umami bomb. Served with fries.",
        "image": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy", "Seafood"]
      }
    ]
  },
  {
    "section_name": "Pasta",
    "items": [
      {
        "id": "pesto-penne",
        "name": "Pesto Penne",
        "price": 249,
        "description": "Penne pasta topped with our vibrant homemade pesto sauce and sprinkled with parmesan cheese.",
        "image": "https://images.unsplash.com/photo-1611270629569-b57573dc5c4b?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy", "Nuts"]
      },
      {
        "id": "taverns-special-lasagna",
        "name": "Tavern's Special Lasagna",
        "price": 349,
        "description": "100% premium ground beef with layers of cheesy goodness. Small Tray (1-2 Pax): P349 / Big Tray (3-4 Pax): P650.",
        "image": "https://images.unsplash.com/photo-1574894709920-31b29d1dc559?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy"]
      },
      {
        "id": "elder-crabs-aligue-pasta",
        "name": "Elder Crab's Aligue Pasta",
        "price": 249,
        "description": "Pure crab fat cooked with coconut cream, served with scallops and crumbled chicharon. Not for the faint-hearted!",
        "image": "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Seafood", "Dairy"],
        "is_recommended": true
      },
      {
        "id": "queens-kiniing-carbonara",
        "name": "Queen's Kiniing Carbonara",
        "price": 249,
        "description": "Not your usual carbonara. An authentic recipe topped with local Cordilleran smoked meat called Kiniing.",
        "image": "https://images.unsplash.com/photo-1588013273468-31508b946d4d?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat"]
      }
    ]
  },
  {
    "section_name": "Rice Meals",
    "items": [
      {
        "id": "honey-garlic-phoenix-thighs",
        "name": "Honey Garlic Phoenix Thighs",
        "price": 199,
        "description": "Deep fried chicken thigh fillet coated with pure honey and toasted garlic. Served with rice, tomato, and garlic dip.",
        "image": "https://images.unsplash.com/photo-1606843048512-3c13b3c3b00f?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Soy"]
      },
      {
        "id": "wild-hog-adobo-flakes",
        "name": "Wild Hog Adobo Flakes",
        "price": 199,
        "description": "Pork Adobo Flakes served with rice sprinkled with toasted garlic, tomato on the side and sunny side up egg.",
        "image": "https://images.unsplash.com/photo-1598514983318-72a356a6d638?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Soy"]
      },
      {
        "id": "krakens-surprise",
        "name": "Kraken's Surprise",
        "price": 199,
        "description": "Our special Aligue rice topped with fried squid. Served with a sunny side up egg on the side.",
        "image": "https://images.unsplash.com/photo-1560717845-968431ac5069?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Seafood"]
      },
      {
        "id": "lemon-butter-fish",
        "name": "Lemon Butter Fish",
        "price": 249,
        "description": "Crispy fish fillet served with a zesty lemon butter garlic sauce.",
        "image": "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Seafood", "Dairy"]
      },
      {
        "id": "ember-skillet-steak",
        "name": "Ember Skillet Steak",
        "price": 299,
        "description": "Seared beef slices with roasted garlic gravy, buttered vegetables, and herb rice.",
        "image": "https://images.unsplash.com/photo-1561758033-d89a9ad46330?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"],
        "is_recommended": true
      }
    ]
  },
  {
    "section_name": "Desserts & Salads",
    "items": [
      {
        "id": "tribeca-cookies",
        "name": "TriBeCa Cookies",
        "price": 149,
        "description": "Delicious and chewy oatmeal cookies mixed with Triple Chocolate. Served by 3's.",
        "image": "https://images.unsplash.com/photo-1583229434451-d8a4f932454a?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy", "Soy", "Peanuts", "Nuts"]
      },
      {
        "id": "affogato",
        "name": "Affogato",
        "price": 180,
        "description": "2 scoops of vanilla ice cream drowned in a shot of hot espresso. A classic dessert for coffee lovers.",
        "image": "https://images.unsplash.com/photo-1586999232870-80a507851147?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"],
        "is_recommended": true
      },
      {
        "id": "campfire-smores",
        "name": "Campfire S'mores",
        "price": 299,
        "description": "Roast your marshmallows with our portable campfire s'mores kit, complete with biscuits and chocolate dip.",
        "image": "https://images.unsplash.com/photo-1549615520-8071a905102f?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy", "Soy"]
      },
      {
        "id": "herbology-salad",
        "name": "Herbology Salad",
        "price": 249,
        "description": "Lettuce romaine, bacon bits, red onions, croutons and parmesan cheese with our in-house yogurt garlic dressing.",
        "image": "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy"],
        "is_recommended": true
      },
      {
        "id": "pumpkin-pasties",
        "name": "Pumpkin Pasties",
        "price": 259,
        "description": "Our own version of sweet British pumpkin pasties. Served with butterscotch sauce on the side.",
        "image": "https://images.unsplash.com/photo-1627998634937-54215c136371?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy"]
      },
      {
        "id": "starlit-parfait",
        "name": "Starlit Berry Parfait",
        "price": 219,
        "description": "Layers of vanilla bean yoghurt, macerated berries, shortbread crumble, and lemon zest.",
        "image": "https://images.unsplash.com/photo-1527519481150-72ce12c0b029?auto=format&fit=crop&w=600&q=80",
        "potential_allergens": ["Dairy", "Gluten", "Wheat"],
        "is_recommended": true
      }
    ]
  },
  {
    "section_name": "Group Packages",
    "items": [
      {
        "id": "feast-for-a-queen",
        "name": "Feast for a Queen",
        "price": 1199,
        "description": "A shareable group bundle for 4. Includes Honey Garlic Thigh Fillet, Fish Fillet, Lasagna, and 4 cups of plain rice.",
        "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
        "potential_allergens": ["Seafood", "Gluten", "Wheat", "Dairy", "Soy"]
      },
      {
        "id": "travellers-choice",
        "name": "Traveller's Choice",
        "price": 799,
        "description": "Perfect for 2. Includes 2 Butter Brews, 1 small Lasagna, and 1 choice of Sliders (Phoenix or Wild Hog).",
        "image": "https://images.unsplash.com/photo-1526398977654-22b69b7fd9b7?auto=format&fit=crop&w=800&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy", "Soy"]
      },
      {
        "id": "wizards-meal",
        "name": "Wizard's Meal",
        "price": 1499,
        "description": "A great deal for 3. Includes 3 Butter Brews, 1 big Lasagna, 1 choice of Sliders, and 1 Potato Fries.",
        "image": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy", "Soy"]
      },
      {
        "id": "faerie-feast",
        "name": "Faerie Feast",
        "price": 1999,
        "description": "A delightful feast for 5. Includes 5 Butter Brews, 1 big Lasagna, 1 choice of Sliders, 1 Potato Fries, and 1 Dragon Scale Nachos.",
        "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy", "Soy"]
      },
      {
        "id": "marauders-banquet",
        "name": "Marauder's Banquet",
        "price": 3999,
        "description": "The ultimate party package for 10. Includes 10 Butter Brews, 2 big Lasagnas, 3 choices of Sliders, 2 Potato Fries, and 1 Dragon Scale Nachos.",
        "image": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
        "potential_allergens": ["Gluten", "Wheat", "Dairy", "Soy"],
        "is_recommended": true
      }
    ]
  }
];

export const CAFE_INFO = {
    address: "47 Kisad Road Montinola Subd, Baguio, 2600 Benguet",
    phone: "0915 672 3579",
    email: "orders@maraudersbrew.co.uk",
    operatingHours: {
        notice: "Closed on Mondays",
        schedule: "Tuesday – Sunday: 12:00 PM – 9:00 PM"
    },
    social: {
        instagram: "https://instagram.com",
        facebook: "https://facebook.com",
        twitter: "https://twitter.com",
    },
    mapsEmbedUrl: "https://maps.google.com/maps?q=47%20Kisad%20Road%20Montinola%20Subd%2C%20Baguio%2C%202600%20Benguet&z=16&output=embed"
};

export const PROMOTIONS: PromotionType[] = [
  {
    name: "Thirsty Thursday",
    description: "Every Thursday, all day long! A special treat for our loyal patrons.",
    tagline: "Buy 1 Get 1 on Classic Butter Brew",
    image: "https://images.unsplash.com/photo-1556742059-4351b000a649?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Afternoon Delight",
    description: "Our Anniversary special! Valid from Tuesday to Friday, 2-5 PM.",
    tagline: "Unbeatable deals to brighten your afternoon.",
    image: "https://images.unsplash.com/photo-1497515114629-f71d767d0461?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Classic Brew Special",
    description: "Enjoy our signature Butter Brew for only Php 120 during our Afternoon Delight hours.",
    tagline: "A classic for a special price.",
    image: "https://images.unsplash.com/photo-1598910100582-6415f9498263?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Sweet Pairing",
    description: "Get a FREE TriBeCa Cookie with any Hot Drink purchase during our Afternoon Delight hours.",
    tagline: "The perfect match.",
    image: "https://images.unsplash.com/photo-1495474472287-4d713b20e473?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Pasta & Brews",
    description: "Order a Pesto Penne and get a FREE Classic Butter Brew on us.",
    tagline: "A meal made in heaven.",
    image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Signature Sips",
    description: "All our Cold Signature Drinks are yours for just Php 139 during Afternoon Delight.",
    tagline: "Stay cool with a discount.",
    image: "https://images.unsplash.com/photo-1613242784384-9a6b166945a8?auto=format&fit=crop&w=1200&q=80"
  },
  {
    name: "Lunch Power-Up",
    description: "Receive a FREE Americano with any order of Burgers, Sliders, or Pasta.",
    tagline: "Get that extra boost.",
    image: "https://images.unsplash.com/photo-1511920183353-3c0a1a8c3d79?auto=format&fit=crop&w=1200&q=80"
  }
];

export const ALLERGENS_LIST = [
    'Wheat',
    'Dairy',
    'Soy',
    'Seafood',
    'Nuts',
    'Peanuts',
    'Gluten'
];

export interface GalleryImage {
    id: string;
    url: string;
    title: string;
    category: string;
}

export const GALLERY_IMAGES: GalleryImage[] = [
    { id: 'g1', url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80', title: "Marauder's Brew Interior", category: 'Ambiance' },
    { id: 'g2', url: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?auto=format&fit=crop&w=800&q=80', title: 'Signature Butter Brew', category: 'Drinks' },
    { id: 'g3', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80', title: 'Artisan Beverages', category: 'Drinks' },
    { id: 'g4', url: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80', title: 'Cozy Dining Space', category: 'Ambiance' },
    { id: 'g5', url: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80', title: 'Gourmet Delights', category: 'Ambiance' },
    { id: 'g6', url: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=800&q=80', title: 'Relaxing Corner', category: 'Ambiance' },
    { id: 'g7', url: 'https://images.unsplash.com/photo-1574894709920-31b29d1dc559?auto=format&fit=crop&w=800&q=80', title: 'Culinary Creations', category: 'Ambiance' },
    { id: 'g8', url: 'https://images.unsplash.com/photo-1572442388796-11668a65343d?auto=format&fit=crop&w=800&q=80', title: 'Specialty Drinks', category: 'Drinks' },
    { id: 'g9', url: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=800&q=80', title: 'Special Events', category: 'Events' },
    { id: 'g10', url: 'https://images.unsplash.com/photo-1583229434451-d8a4f932454a?auto=format&fit=crop&w=800&q=80', title: 'Dessert Selection', category: 'Ambiance' },
    { id: 'g11', url: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?auto=format&fit=crop&w=800&q=80', title: 'Magical Atmosphere', category: 'Ambiance' },
    { id: 'g12', url: 'https://images.unsplash.com/photo-1556742059-4351b000a649?auto=format&fit=crop&w=800&q=80', title: 'Gatherings & Celebrations', category: 'Events' }
];