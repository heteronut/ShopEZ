// Sample catalog used to demonstrate and test ShopEZ. These are seed
// entries written for this project, not listings copied from a real store.
// Product photos were not supplied, so the client shows a labelled
// placeholder panel with the category name instead of an image.
const products = [
  {
    title: "Nova X5 Smartphone (128 GB, Ocean Blue)",
    description: "6.6 inch Full HD+ display, 50 MP rear camera, 8 MP front camera, 5000 mAh battery with 18 W charging, 6 GB RAM and 128 GB storage, dual SIM 5G.",
    price: 14999, discount: 20, category: "Mobiles", gender: "Unisex", sizes: [], stock: 25,
  },
  {
    title: "PixelPro 12 Smartphone (256 GB, Graphite)",
    description: "6.4 inch AMOLED display at 120 Hz, 64 MP triple rear camera, in-display fingerprint reader, 4700 mAh battery, 12 GB RAM and 256 GB storage.",
    price: 52999, discount: 10, category: "Mobiles", gender: "Unisex", sizes: [], stock: 12,
  },
  {
    title: "SoundWave Wireless Headphones with Mic",
    description: "Over-ear Bluetooth 5.3 headphones, up to 40 hours of playback per charge, built-in microphone for calls, foldable earcups, AUX cable included in the box.",
    price: 2999, discount: 33, category: "Electronics", gender: "Unisex", sizes: [], stock: 40,
  },
  {
    title: "CineMax 80 cm (32 inch) HD Ready Smart TV",
    description: "32 inch HD Ready panel, built-in streaming apps, two HDMI ports and one USB port, 20 W speakers, wall mount kit included.",
    price: 12499, discount: 38, category: "Electronics", gender: "Unisex", sizes: [], stock: 8,
  },
  {
    title: "MechType Backlit Mechanical Keyboard",
    description: "Full-size mechanical keyboard with tactile brown switches, single-colour backlight with three brightness levels, USB wired connection, metal top plate.",
    price: 3499, discount: 29, category: "Electronics", gender: "Unisex", sizes: [], stock: 30,
  },
  {
    title: "Men Slim Fit Cotton Casual Shirt",
    description: "Slim fit shirt in 100 percent combed cotton, button-down collar, full sleeves, machine washable. Check the size chart before ordering.",
    price: 1299, discount: 54, category: "Fashion", gender: "Men", sizes: ["S", "M", "L", "XL"], stock: 60,
  },
  {
    title: "Women Floral Print A-Line Kurti",
    description: "A-line kurti with a floral print, three-quarter sleeves, calf length, rayon fabric. Hand wash separately in cold water.",
    price: 1499, discount: 47, category: "Fashion", gender: "Women", sizes: ["S", "M", "L", "XL"], stock: 45,
  },
  {
    title: "Unisex Cotton Hooded Sweatshirt",
    description: "Hooded sweatshirt in brushed cotton fleece, kangaroo pocket, ribbed cuffs and hem. Suitable for mild winter wear.",
    price: 1799, discount: 44, category: "Fashion", gender: "Unisex", sizes: ["S", "M", "L", "XL"], stock: 35,
  },
  {
    title: "Men Chronograph Watch with Leather Strap",
    description: "Analog chronograph-look dial, genuine leather strap, quartz movement, splash resistant. Comes with a one year manufacturer warranty card.",
    price: 2499, discount: 50, category: "Fashion", gender: "Men", sizes: [], stock: 15,
  },
  {
    title: "ProGrip Non-Slip Yoga Mat, 6 mm",
    description: "6 mm thick anti-skid yoga mat, 183 cm by 61 cm, sweat resistant surface, carrying strap included. Wipe clean after use.",
    price: 899, discount: 39, category: "Sports-Equipment", gender: "Unisex", sizes: [], stock: 80,
  },
  {
    title: "Adjustable Dumbbell Set, 10 kg",
    description: "Pair of adjustable dumbbells with removable cast iron plates totalling 10 kg, chrome handles with knurled grip, spin-lock collars.",
    price: 2199, discount: 27, category: "Sports-Equipment", gender: "Unisex", sizes: [], stock: 20,
  },
  {
    title: "Organic Brown Rice, 5 kg",
    description: "Unpolished brown rice, 5 kg pack, sourced from certified organic farms, best before 6 months from the packing date printed on the bag.",
    price: 649, discount: 15, category: "Groceries", gender: "Unisex", sizes: [], stock: 100,
  },
  {
    title: "Cold Pressed Groundnut Oil, 1 L (Pack of 2)",
    description: "Two 1 litre bottles of cold pressed groundnut oil, no added colour or preservatives, suitable for deep frying and everyday cooking.",
    price: 549, discount: 18, category: "Groceries", gender: "Unisex", sizes: [], stock: 70,
  },
];

module.exports = products;
