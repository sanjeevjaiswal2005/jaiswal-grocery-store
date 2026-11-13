import 'dotenv/config';
import mongoose from 'mongoose';
import { Category, Product } from '../models/index.js';

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is required. Configure backend/.env before seeding the catalog.');
  process.exit(1);
}

const categories = [
  { name: 'Fresh Fruits', slug: 'fresh-fruits', description: 'Seasonal fruit for every day.', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?auto=format&fit=crop&w=900&q=85' },
  { name: 'Vegetables', slug: 'vegetables', description: 'Fresh vegetables for everyday cooking.', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=900&q=85' },
  { name: 'Dairy & Eggs', slug: 'dairy-eggs', description: 'Everyday dairy and farm fresh eggs.', image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=85' },
  { name: 'Pantry Staples', slug: 'pantry-staples', description: 'The essentials behind a good meal.', image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=900&q=85' },
  { name: 'Bakery', slug: 'bakery', description: 'Freshly baked everyday favorites.', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=900&q=85' },
  { name: 'Snacks & Drinks', slug: 'snacks-drinks', description: 'A little something for snack time.', image: 'https://images.unsplash.com/photo-1621939514649-280e2aa9f2f9?auto=format&fit=crop&w=900&q=85' },
  { name: 'Biscuits & Wafers', slug: 'biscuits-wafers', description: 'Biscuits, cookies, crackers, and savory wafers.', image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=900&q=85' },
  { name: 'Chocolates & Sweets', slug: 'chocolates-sweets', description: 'Chocolate bars, wafer treats, and little sweets.', image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=900&q=85' },
  { name: 'Cold Drinks & Juices', slug: 'cold-drinks', description: 'Chilled drinks, juices, and bottled water.', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=900&q=85' },
  { name: 'Packaged Foods', slug: 'packaged-foods', description: 'Quick meals and useful packaged grocery items.', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=900&q=85' },
  { name: 'Spices & Masalas', slug: 'spices-masalas', description: 'Everyday spices for the home kitchen.', image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=900&q=85' },
  { name: 'Home & Cleaning', slug: 'home-cleaning', description: 'Cleaning and household essentials for daily use.', image: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=900&q=85' },
  { name: 'Personal Care', slug: 'personal-care', description: 'Everyday personal care and bathroom essentials.', image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85' }
];

const catalog = [
  ['fresh-fruits','Alphonso Mangoes','Sweet, fragrant seasonal mangoes.', 'kg', 220, 260, 28, 'photo-1553279768-865429fa0078'],
  ['fresh-fruits','Red Apples','Crisp apples with a naturally sweet bite.', 'kg', 180, 210, 35, 'photo-1560806887-1e4cd0b6cbd6'],
  ['fresh-fruits','Robusta Bananas','A convenient, energy-rich everyday fruit.', 'dozen', 60, 72, 42, 'photo-1571771894821-ce9b6c11b08e'],
  ['fresh-fruits','Sweet Oranges','Juicy oranges selected for their freshness.', 'kg', 95, 115, 30, 'photo-1547514701-42782101795e'],
  ['vegetables','Tomatoes','Ripe red tomatoes for curries and salads.', 'kg', 42, 50, 45, 'photo-1546094096-0df4bcaaa337'],
  ['vegetables','Farm Fresh Potatoes','A versatile kitchen staple, sorted for quality.', 'kg', 32, 38, 60, 'photo-1518977676601-b53f82aba655'],
  ['vegetables','Baby Spinach','Tender green leaves, ready for your favorite dishes.', 'bunch', 35, 42, 26, 'photo-1576045057995-568f588f82fb'],
  ['vegetables','Green Capsicum','Fresh, crunchy capsicum for everyday cooking.', '500 g', 48, 58, 32, 'photo-1563565375-f3fdfdbefa83'],
  ['dairy-eggs','Whole Milk','Pasteurized whole milk for your daily cup.', 'litre', 64, 68, 38, 'photo-1563636619-e9143da7973b'],
  ['dairy-eggs','Farm Eggs','Protein-rich eggs for breakfast and baking.', '6 pack', 54, 60, 50, 'photo-1518569656558-1f25e69d93d7'],
  ['dairy-eggs','Plain Curd','Creamy set curd made for everyday meals.', '500 g', 40, 48, 22, 'photo-1488477181946-6428a0291777'],
  ['dairy-eggs','Salted Butter','Smooth salted butter for toast and cooking.', '100 g', 58, 64, 24, 'photo-1589985270826-4b7bb135bc9d'],
  ['dairy-eggs','Toned Milk','Fresh toned milk for tea, coffee, and breakfast.', '500 ml', 34, 36, 36, 'photo-1563636619-e9143da7973b'],
  ['dairy-eggs','Full Cream Milk','Rich full cream milk for home and family use.', '500 ml', 38, 40, 28, 'photo-1563636619-e9143da7973b'],
  ['dairy-eggs','Fresh Paneer','Soft paneer cubes for curries and snacks.', '200 g', 95, 110, 18, 'photo-1631452180519-c014fe946bc7'],
  ['dairy-eggs','Cheese Slices','Mild cheese slices for sandwiches and burgers.', '200 g', 135, 150, 14, 'photo-1486297678162-eb2a19b0a32d'],
  ['pantry-staples','Basmati Rice','Aromatic long grain rice for special meals.', 'kg', 145, 165, 40, 'photo-1586201375761-83865001e31c'],
  ['pantry-staples','Toor Dal','Cleaned split pigeon peas, rich in protein.', 'kg', 138, 155, 33, 'photo-1515543904379-3d757afe72e4'],
  ['pantry-staples','Whole Wheat Atta','Stone-ground whole wheat flour for soft rotis.', '5 kg', 245, 275, 26, 'photo-1627485937980-221c88ac04f9'],
  ['pantry-staples','Cold Pressed Groundnut Oil','A versatile cooking oil with a mellow flavor.', 'litre', 190, 215, 21, 'photo-1474979266404-7eaacbcd87c5'],
  ['bakery','Whole Wheat Bread','Soft whole wheat loaf, freshly baked.', 'loaf', 48, 55, 20, 'photo-1509440159596-0249088772ff'],
  ['bakery','Multigrain Bread','A hearty loaf with a mix of wholesome grains.', 'loaf', 62, 70, 16, 'photo-1586444248902-2f64eddc13df'],
  ['bakery','Pav Buns','Soft, fluffy buns for a quick snack or meal.', '6 pack', 36, 42, 18, 'photo-1608198093002-ad4e005484df'],
  ['bakery','Butter Croissant','Flaky, buttery pastry for a small treat.', 'piece', 55, 65, 12, 'photo-1555507036-ab1f4038808a'],
  ['snacks-drinks','Roasted Almonds','Crunchy roasted almonds for a wholesome snack.', '200 g', 210, 240, 18, 'photo-1508061253366-f7da158b6d46'],
  ['snacks-drinks','Masala Peanuts','A crunchy, gently spiced tea-time favorite.', '200 g', 75, 88, 24, 'photo-1566478989037-eec170784d0b'],
  ['snacks-drinks','Masala Chai','A warming blend of tea and aromatic spices.', '250 g', 145, 165, 30, 'photo-1576092768241-dec231879fc3'],
  ['snacks-drinks','Tender Coconut Water','Refreshing coconut water for a sunny afternoon.', 'piece', 45, 55, 20, 'photo-1553909489-cd47e0ef937f'],
  ['biscuits-wafers','Glucose Biscuits','A familiar light biscuit for tea time.', '100 g', 10, 12, 80, 'photo-1558961363-fa8fdf82db35'],
  ['biscuits-wafers','Marie Biscuits','Crisp, lightly sweet biscuits for everyday snacking.', '120 g', 20, 24, 60, 'photo-1558961363-fa8fdf82db35'],
  ['biscuits-wafers','Vanilla Cream Biscuits','Crunchy sandwich biscuits with a vanilla cream center.', '100 g', 20, 25, 55, 'photo-1590080877777-6a4cc8e40cf3'],
  ['biscuits-wafers','Salted Crackers','Crisp salted crackers to share with tea.', '100 g', 25, 30, 42, 'photo-1590080877777-6a4cc8e40cf3'],
  ['biscuits-wafers','Butter Cookies','Golden butter cookies for a small everyday treat.', '150 g', 45, 52, 28, 'photo-1499636136210-6f4ee915583e'],
  ['biscuits-wafers','Salted Potato Wafers','Thin, crispy salted potato wafers.', '60 g', 20, 24, 48, 'photo-1566478989037-eec170784d0b'],
  ['biscuits-wafers','Masala Potato Wafers','Crunchy potato wafers with a mild masala seasoning.', '60 g', 20, 24, 44, 'photo-1566478989037-eec170784d0b'],
  ['biscuits-wafers','Banana Wafers','Crisp banana wafers for tea-time snacking.', '150 g', 50, 58, 26, 'photo-1571771894821-ce9b6c11b08e'],
  ['chocolates-sweets','Milk Chocolate Bar','Smooth milk chocolate in a handy sharing bar.', '40 g', 40, 45, 38, 'photo-1606313564200-e75d5e30476c'],
  ['chocolates-sweets','Dark Chocolate Bar','Rich dark chocolate for a little afternoon treat.', '50 g', 75, 85, 22, 'photo-1511381939415-e44015466834'],
  ['chocolates-sweets','Chocolate Wafer Bar','Light wafer layers covered in chocolate.', '30 g', 20, 24, 48, 'photo-1606313564200-e75d5e30476c'],
  ['chocolates-sweets','Assorted Toffees','A colorful mix of individually wrapped toffees.', '100 g', 35, 42, 36, 'photo-1582058091505-f87a2e55a40f'],
  ['cold-drinks','Cola Soft Drink','Chilled carbonated cola drink for sharing.', '750 ml', 40, 45, 36, 'photo-1513558161293-cdaf765edfd7'],
  ['cold-drinks','Lemon Lime Soda','Sparkling lemon-lime drink, best served chilled.', '750 ml', 40, 45, 30, 'photo-1513558161293-cdaf765edfd7'],
  ['cold-drinks','Orange Fruit Drink','Refreshing orange-flavored drink for snack time.', '600 ml', 35, 40, 32, 'photo-1544145945-f90425340c7e'],
  ['cold-drinks','Mango Fruit Drink','Sweet mango drink for a quick refreshment.', '600 ml', 35, 40, 30, 'photo-1546173159-315724a31696'],
  ['cold-drinks','Packaged Drinking Water','Convenient sealed drinking water bottle.', '1 litre', 20, 20, 72, 'photo-1523362628745-0c100150b504'],
  ['packaged-foods','Instant Noodles','Quick-cooking noodles for a fast snack or meal.', '70 g', 15, 18, 90, 'photo-1612929633738-8fe44f7ec841'],
  ['packaged-foods','Penne Pasta','Durum wheat pasta for an easy family meal.', '500 g', 65, 75, 26, 'photo-1551183053-bf91a1d81141'],
  ['packaged-foods','Tomato Ketchup','Classic tomato ketchup for snacks and sandwiches.', '200 g', 50, 58, 30, 'photo-1472476443507-c7a5948772fc'],
  ['packaged-foods','Rolled Oats','A simple pantry breakfast for busy mornings.', '500 g', 110, 125, 22, 'photo-1517673132405-a56a62b18caf'],
  ['packaged-foods','Puffed Rice','Light, crisp puffed rice for bhel and snack mixes.', '250 g', 30, 35, 40, 'photo-1604908176997-125f25cc6f3d'],
  ['spices-masalas','Turmeric Powder','Ground turmeric for everyday Indian cooking.', '100 g', 35, 42, 34, 'photo-1615485500704-8e990f9900f5'],
  ['spices-masalas','Red Chilli Powder','Ground red chilli with a warm, balanced heat.', '100 g', 48, 56, 28, 'photo-1596040033229-a9821ebd058d'],
  ['spices-masalas','Coriander Powder','Aromatic ground coriander for curries and dals.', '100 g', 32, 38, 30, 'photo-1596040033229-a9821ebd058d'],
  ['spices-masalas','Cumin Seeds','Whole cumin seeds for tempering and seasoning.', '100 g', 42, 48, 25, 'photo-1596040033229-a9821ebd058d'],
  ['spices-masalas','Garam Masala','A warming spice blend for everyday meals.', '50 g', 45, 52, 24, 'photo-1596040033229-a9821ebd058d'],
  ['home-cleaning','Laundry Detergent Powder','Everyday detergent powder for household laundry.', '1 kg', 120, 138, 24, 'photo-1563453392212-326f5e854473'],
  ['home-cleaning','Dishwash Liquid','Liquid dish cleaner for plates and kitchenware.', '500 ml', 85, 98, 21, 'photo-1563453392212-326f5e854473'],
  ['home-cleaning','Dishwash Bar','A handy dishwashing bar for everyday cleaning.', '200 g', 20, 24, 35, 'photo-1563453392212-326f5e854473'],
  ['home-cleaning','Floor Cleaner','Fresh-scented floor cleaner for home surfaces.', '500 ml', 95, 110, 18, 'photo-1563453392212-326f5e854473'],
  ['home-cleaning','Safety Matches','Everyday household matchboxes.', '10 pack', 12, 15, 45, 'photo-1586864387967-d02ef85d93e8'],
  ['personal-care','Bathing Soap','Gentle everyday bathing soap.', '125 g', 38, 45, 40, 'photo-1608248543803-ba4f8c70ae0b'],
  ['personal-care','Toothpaste','Mint toothpaste for the daily oral-care routine.', '100 g', 65, 75, 30, 'photo-1609840114035-3c981b782dfe'],
  ['personal-care','Shampoo Sachet Pack','Single-use shampoo sachets in a convenient multipack.', '20 pack', 45, 52, 26, 'photo-1608248543803-ba4f8c70ae0b'],
  ['personal-care','Tissue Paper Roll','Soft paper roll for everyday household use.', '2 pack', 55, 65, 23, 'photo-1583947215259-38e31be8751f'],
  // Branded general-store favourites. Prices are editable starter prices, not live MRP data.
  ['cold-drinks','Coca-Cola Original Taste','Classic Coca-Cola chilled soft drink.', '750 ml', 40, 40, 36, 'photo-1513558161293-cdaf765edfd7', 'Coca-Cola'],
  ['cold-drinks','Coca-Cola Original Taste 250 ml','Single-serve Coca-Cola chilled soft drink.', '250 ml', 20, 20, 36, 'photo-1513558161293-cdaf765edfd7', 'Coca-Cola'],
  ['cold-drinks','Coca-Cola Zero Sugar','Coca-Cola taste with zero sugar.', '300 ml', 40, 40, 18, 'photo-1513558161293-cdaf765edfd7', 'Coca-Cola'],
  ['cold-drinks','Thums Up','Strong fizzy cola soft drink.', '750 ml', 40, 40, 30, 'photo-1513558161293-cdaf765edfd7', 'Coca-Cola'],
  ['cold-drinks','Sprite','Lemon-lime sparkling soft drink.', '750 ml', 40, 40, 30, 'photo-1513558161293-cdaf765edfd7', 'Coca-Cola'],
  ['cold-drinks','Fanta Orange','Orange-flavoured sparkling soft drink.', '750 ml', 40, 40, 24, 'photo-1544145945-f90425340c7e', 'Coca-Cola'],
  ['cold-drinks','Limca','Lemon and lime sparkling soft drink.', '750 ml', 40, 40, 24, 'photo-1513558161293-cdaf765edfd7', 'Coca-Cola'],
  ['cold-drinks','Maaza Mango Drink','Mango fruit drink, best served chilled.', '600 ml', 40, 40, 24, 'photo-1546173159-315724a31696', 'Coca-Cola'],
  ['cold-drinks','Minute Maid Pulpy Orange','Orange drink with juicy pulp.', '400 ml', 35, 35, 18, 'photo-1544145945-f90425340c7e', 'Coca-Cola'],
  ['cold-drinks','Kinley Packaged Drinking Water','Sealed packaged drinking water.', '1 litre', 20, 20, 48, 'photo-1523362628745-0c100150b504', 'Coca-Cola'],
  ['dairy-eggs','Amul Taaza Toned Milk','Amul toned milk for tea, coffee, and everyday use.', '500 ml', 29, 29, 24, 'photo-1563636619-e9143da7973b', 'Amul'],
  ['dairy-eggs','Amul Taaza Toned Milk 1 L','Amul toned milk family pack.', '1 litre', 57, 57, 18, 'photo-1563636619-e9143da7973b', 'Amul'],
  ['dairy-eggs','Amul Gold Full Cream Milk','Rich Amul full cream milk.', '500 ml', 34, 34, 24, 'photo-1563636619-e9143da7973b', 'Amul'],
  ['dairy-eggs','Amul Gold Full Cream Milk 1 L','Rich Amul full cream milk family pack.', '1 litre', 67, 67, 18, 'photo-1563636619-e9143da7973b', 'Amul'],
  ['dairy-eggs','Gokul Toned Milk','Gokul toned milk for everyday use.', '500 ml', 30, 30, 24, 'photo-1563636619-e9143da7973b', 'Gokul'],
  ['dairy-eggs','Gokul Toned Milk 1 L','Gokul toned milk family pack.', '1 litre', 59, 59, 18, 'photo-1563636619-e9143da7973b', 'Gokul'],
  ['dairy-eggs','Gokul Full Cream Milk','Rich Gokul full cream milk.', '500 ml', 35, 35, 18, 'photo-1563636619-e9143da7973b', 'Gokul'],
  ['chocolates-sweets','Cadbury Dairy Milk ₹10','Cadbury Dairy Milk chocolate bar, ₹10 pack.', 'piece', 10, 10, 48, 'photo-1606313564200-e75d5e30476c', 'Cadbury'],
  ['chocolates-sweets','Cadbury Dairy Milk ₹20','Cadbury Dairy Milk chocolate bar, ₹20 pack.', 'piece', 20, 20, 42, 'photo-1606313564200-e75d5e30476c', 'Cadbury'],
  ['chocolates-sweets','Cadbury Dairy Milk ₹30','Cadbury Dairy Milk chocolate bar, ₹30 pack.', 'piece', 30, 30, 36, 'photo-1606313564200-e75d5e30476c', 'Cadbury'],
  ['chocolates-sweets','Cadbury Dairy Milk ₹35','Cadbury Dairy Milk chocolate bar, ₹35 pack.', 'piece', 35, 35, 30, 'photo-1606313564200-e75d5e30476c', 'Cadbury'],
  ['chocolates-sweets','Cadbury Celebrations Gift Pack','Assorted Cadbury chocolates in a gift pack.', 'gift pack', 150, 150, 12, 'photo-1606313564200-e75d5e30476c', 'Cadbury'],
  ['biscuits-wafers','Sunfeast Dark Fantasy Expressions Gift Pack','Assorted filled cookies in the Sunfeast Dark Fantasy Expressions gift pack.', '322 g', 201, 400, 22, 'https://cdn.grofers.com/da/cms-assets/cms/product/de8c9701-91ec-4f90-bd55-e4a3a8c192de.jpg', 'Sunfeast'],
  ['biscuits-wafers','Parle Platina Hide & Seek Chocolate Chip Cookies 100 g','Chocolate chip cookies made with Parle Platina Hide & Seek.', '100 g', 27, 30, 38, 'https://www.bbassets.com/media/uploads/p/l/302121_15-parle-hide-seek-chocolate.jpg', 'Parle'],
  ['biscuits-wafers','Sunfeast Dark Fantasy Choco Fills','Chocolate-filled cookies with a rich, soft center.', '69 g', 39, 40, 30, 'https://services.kpnfresh.com/media/v1/products/images/ad43020c-6b34-4a3f-b5c9-92603a0c731a/sunfeast-dark-fantasy-choco-fills-cookies.webp?c_type=C1', 'Sunfeast'],
  ['biscuits-wafers','Britannia Good Day Cashew Biscuits','Crunchy cashew cookies for tea time.', '200 g', 45, 50, 30, 'https://www.jiomart.com/images/product/original/490176188/britannia-good-day-cashew-cookies-200-g-product-images-o490176188-p490176188-0-202403141240.jpg', 'Britannia'],
  ['biscuits-wafers','Soul Bakes Double Choco-Chip Cookies','Handcrafted double chocolate chip cookies.', '125 g', 299, 299, 10, 'https://cdn.grofers.com/da/cms-assets/cms/product/d77c1a4680314e07a05061b116fe932a.jpeg', 'Soul Bakes'],
  ['biscuits-wafers','Parle Platina Hide & Seek Chocolate Chip Cookies','Parle Platina chocolate chip cookies in a sharing pack.', '200 g', 42, 60, 28, 'https://www.jiomart.com/images/product/original/491062930/parle-platina-hide-amp-seek-chocolate-chips-cookies-200-g-product-images-o491062930-p590033307-0-202205180127.jpg?im=Resize%3D%281000%2C1000%29', 'Parle', ['https://cdn.grofers.com/cdn-cgi/image/f%3Dauto%2Cfit%3Dscale-down%2Cq%3D85%2Cmetadata%3Dnone%2Cw%3D480%2Ch%3D480/app/images/products/full_screen/pro_55360.jpg', 'https://www.bbassets.com/media/uploads/p/xl/40009931_10-parle-hide-seek-chocolate.jpg']],
  ['biscuits-wafers','Parle-G Glucose Biscuits','Classic Parle-G glucose biscuits for tea and everyday snacking.', '250 g', 25, 30, 40, 'photo-1558961363-fa8fdf82db35', 'Parle'],
  ['biscuits-wafers','Britannia Bourbon Cream Biscuits','Chocolate biscuits with a smooth cream filling.', '150 g', 30, 35, 32, 'photo-1499636136210-6f4ee915583e', 'Britannia'],
  ['biscuits-wafers','Britannia Marie Gold Biscuits','Light, crisp tea-time Marie biscuits.', '250 g', 40, 50, 28, 'photo-1558961363-fa8fdf82db35', 'Britannia']
];

const imageUrl = id => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=85`;
const productImage = value => value.startsWith('http') ? value : imageUrl(value);
const featuredSlugs = new Set(['glucose-biscuits', 'salted-potato-wafers', 'milk-chocolate-bar', 'cola-soft-drink', 'instant-noodles', 'toned-milk', 'coca-cola-original-taste', 'amul-taaza-toned-milk', 'cadbury-dairy-milk-10']);

try {
  await mongoose.connect(process.env.MONGODB_URI);
  const categoryIds = new Map();
  for (const [index, category] of categories.entries()) {
    const saved = await Category.findOneAndUpdate({ slug: category.slug }, { $setOnInsert: { ...category, sortOrder: index, active: true } }, { upsert: true, new: true });
    categoryIds.set(category.slug, saved._id);
  }
  let inserted = 0;
  for (const [index, [categorySlug, name, description, unit, price, compareAtPrice, stock, image, brand, images]] of catalog.entries()) {
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const result = await Product.updateOne({ slug }, { $setOnInsert: { name, slug, description, unit, price, compareAtPrice, stock, image: productImage(image), ...(images ? { images } : {}), category: categoryIds.get(categorySlug), sku: `JGS-${String(index + 1).padStart(4, '0')}`, ...(brand ? { brand } : {}), featured: index < 8 || featuredSlugs.has(slug), active: true, lowStockAt: 8 } }, { upsert: true });
    inserted += result.upsertedCount || 0;
  }
  console.log(`Catalog ready: ${categories.length} categories, ${catalog.length} products (${inserted} newly added).`);
} catch (error) {
  console.error(`Catalog seeding failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
