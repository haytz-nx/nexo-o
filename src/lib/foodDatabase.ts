import type { FoodCategory, FoodItem, ServingOption } from "./types";

const g = (): ServingOption => ({ unit: "g", label: "g", grams: 1 });
const kg = (): ServingOption => ({ unit: "kg", label: "kg", grams: 1000 });
const ml = (): ServingOption => ({ unit: "ml", label: "ml", grams: 1 });
const L = (): ServingOption => ({ unit: "L", label: "L", grams: 1000 });
const unidade = (grams: number): ServingOption => ({ unit: "unidade", label: "unidade", grams });
const fatia = (grams: number): ServingOption => ({ unit: "fatia", label: "fatia", grams });
const xicara = (grams: number): ServingOption => ({ unit: "xicara", label: "xícara", grams });
const colherSopa = (grams: number): ServingOption => ({
  unit: "colher-sopa",
  label: "colher de sopa",
  grams,
});
const colherCha = (grams: number): ServingOption => ({
  unit: "colher-cha",
  label: "colher de chá",
  grams,
});

const solid = (...extra: ServingOption[]) => [g(), kg(), ...extra];
const liquid = (...extra: ServingOption[]) => [ml(), L(), ...extra];

export const FOOD_CATEGORY_META: Record<FoodCategory, { label: string; emoji: string }> = {
  meats: { label: "Carnes e Ovos", emoji: "🥩" },
  fruits: { label: "Frutas", emoji: "🍎" },
  vegetables: { label: "Vegetais", emoji: "🥦" },
  dairy: { label: "Laticínios", emoji: "🥛" },
  drinks: { label: "Bebidas", emoji: "🥤" },
  grains: { label: "Grãos e Cereais", emoji: "🍞" },
  nuts: { label: "Oleaginosas e Sementes", emoji: "🥜" },
  processed: { label: "Processados", emoji: "🍫" },
};

let seq = 0;
function id(name: string): string {
  seq += 1;
  return `${name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")}-${seq}`;
}

function food(
  name: string,
  category: FoodCategory,
  per100: FoodItem["per100"],
  servings: ServingOption[],
  aliases: string[] = []
): FoodItem {
  return { id: id(name), name, category, per100, servings, aliases };
}

export const FOODS: FoodItem[] = [
  // ---------- MEATS & EGGS ----------
  food(
    "Peito de Frango Grelhado",
    "meats",
    { calories: 165, carbs: 0, protein: 31, fat: 3.6, fiber: 0, sugar: 0, sodium: 74 },
    solid(unidade(120)),
    ["frango", "chicken"]
  ),
  food(
    "Coxa de Frango Assada",
    "meats",
    { calories: 209, carbs: 0, protein: 26, fat: 11, fiber: 0, sugar: 0, sodium: 90 },
    solid(unidade(110)),
    ["frango"]
  ),
  food(
    "Carne Bovina Moída (magra)",
    "meats",
    { calories: 215, carbs: 0, protein: 26, fat: 12, fiber: 0, sugar: 0, sodium: 66 },
    solid(),
    ["carne", "boi", "beef"]
  ),
  food(
    "Bife de Alcatra Grelhado",
    "meats",
    { calories: 190, carbs: 0, protein: 29, fat: 8, fiber: 0, sugar: 0, sodium: 60 },
    solid(unidade(150)),
    ["carne", "boi", "alcatra"]
  ),
  food(
    "Picanha Grelhada",
    "meats",
    { calories: 289, carbs: 0, protein: 24, fat: 21, fiber: 0, sugar: 0, sodium: 58 },
    solid(),
    ["carne", "boi"]
  ),
  food(
    "Lombo de Porco Assado",
    "meats",
    { calories: 242, carbs: 0, protein: 27, fat: 14, fiber: 0, sugar: 0, sodium: 62 },
    solid(),
    ["porco", "pork"]
  ),
  food(
    "Bacon Frito",
    "meats",
    { calories: 541, carbs: 1.4, protein: 37, fat: 42, fiber: 0, sugar: 0, sodium: 1717 },
    solid(fatia(8)),
    ["porco", "bacon"]
  ),
  food(
    "Tilápia Grelhada",
    "meats",
    { calories: 128, carbs: 0, protein: 26, fat: 2.7, fiber: 0, sugar: 0, sodium: 56 },
    solid(unidade(140)),
    ["peixe", "fish"]
  ),
  food(
    "Salmão Grelhado",
    "meats",
    { calories: 208, carbs: 0, protein: 20, fat: 13, fiber: 0, sugar: 0, sodium: 59 },
    solid(),
    ["peixe", "fish", "salmao"]
  ),
  food(
    "Atum em Lata (água)",
    "meats",
    { calories: 116, carbs: 0, protein: 26, fat: 0.8, fiber: 0, sugar: 0, sodium: 247 },
    solid(),
    ["peixe", "fish", "atum"]
  ),
  food(
    "Camarão Cozido",
    "meats",
    { calories: 99, carbs: 0.2, protein: 24, fat: 0.3, fiber: 0, sugar: 0, sodium: 111 },
    solid(),
    ["seafood", "frutos do mar"]
  ),
  food(
    "Peito de Peru",
    "meats",
    { calories: 135, carbs: 0, protein: 30, fat: 1, fiber: 0, sugar: 0, sodium: 55 },
    solid(fatia(20)),
    ["turkey", "peru"]
  ),
  food(
    "Ovo Cozido",
    "meats",
    { calories: 155, carbs: 1.1, protein: 13, fat: 11, fiber: 0, sugar: 1.1, sodium: 124 },
    [g(), unidade(50)],
    ["egg", "ovos"]
  ),
  food(
    "Ovo Frito",
    "meats",
    { calories: 196, carbs: 0.9, protein: 14, fat: 15, fiber: 0, sugar: 0.4, sodium: 207 },
    [g(), unidade(50)],
    ["egg", "ovos"]
  ),

  // ---------- FRUITS ----------
  food(
    "Banana Nanica",
    "fruits",
    { calories: 89, carbs: 23, protein: 1.1, fat: 0.3, fiber: 2.6, sugar: 12, sodium: 1 },
    [g(), kg(), unidade(100)],
    ["banana"]
  ),
  food(
    "Banana Prata",
    "fruits",
    { calories: 98, carbs: 26, protein: 1.3, fat: 0.2, fiber: 2, sugar: 14, sodium: 1 },
    [g(), kg(), unidade(70)],
    ["banana"]
  ),
  food(
    "Banana Maçã",
    "fruits",
    { calories: 87, carbs: 22, protein: 1.2, fat: 0.3, fiber: 2.1, sugar: 12, sodium: 1 },
    [g(), kg(), unidade(90)],
    ["banana"]
  ),
  food(
    "Banana Ouro",
    "fruits",
    { calories: 107, carbs: 28, protein: 1.1, fat: 0.2, fiber: 1.9, sugar: 15, sodium: 1 },
    [g(), kg(), unidade(35)],
    ["banana"]
  ),
  food(
    "Maçã",
    "fruits",
    { calories: 52, carbs: 14, protein: 0.3, fat: 0.2, fiber: 2.4, sugar: 10, sodium: 1 },
    [g(), kg(), unidade(130)],
    ["apple"]
  ),
  food(
    "Laranja",
    "fruits",
    { calories: 47, carbs: 12, protein: 0.9, fat: 0.1, fiber: 2.4, sugar: 9, sodium: 0 },
    [g(), kg(), unidade(150)],
    ["orange"]
  ),
  food(
    "Uva",
    "fruits",
    { calories: 69, carbs: 18, protein: 0.7, fat: 0.2, fiber: 0.9, sugar: 16, sodium: 2 },
    [g(), kg(), xicara(151)],
    ["grape"]
  ),
  food(
    "Manga",
    "fruits",
    { calories: 60, carbs: 15, protein: 0.8, fat: 0.4, fiber: 1.6, sugar: 14, sodium: 1 },
    [g(), kg(), unidade(200)],
    ["mango"]
  ),
  food(
    "Mamão",
    "fruits",
    { calories: 43, carbs: 11, protein: 0.5, fat: 0.3, fiber: 1.7, sugar: 8, sodium: 8 },
    [g(), kg(), unidade(400)],
    ["papaya"]
  ),
  food(
    "Melancia",
    "fruits",
    { calories: 30, carbs: 8, protein: 0.6, fat: 0.2, fiber: 0.4, sugar: 6, sodium: 1 },
    [g(), kg(), xicara(152)],
    ["watermelon"]
  ),
  food(
    "Abacaxi",
    "fruits",
    { calories: 50, carbs: 13, protein: 0.5, fat: 0.1, fiber: 1.4, sugar: 10, sodium: 1 },
    [g(), kg(), xicara(165)],
    ["pineapple"]
  ),
  food(
    "Kiwi",
    "fruits",
    { calories: 61, carbs: 15, protein: 1.1, fat: 0.5, fiber: 3, sugar: 9, sodium: 3 },
    [g(), kg(), unidade(76)],
    ["kiwi"]
  ),
  food(
    "Morango",
    "fruits",
    { calories: 32, carbs: 7.7, protein: 0.7, fat: 0.3, fiber: 2, sugar: 4.9, sodium: 1 },
    [g(), kg(), xicara(152)],
    ["strawberry"]
  ),
  food(
    "Pera",
    "fruits",
    { calories: 57, carbs: 15, protein: 0.4, fat: 0.1, fiber: 3.1, sugar: 10, sodium: 1 },
    [g(), kg(), unidade(178)],
    ["pear"]
  ),
  food(
    "Abacate",
    "fruits",
    { calories: 160, carbs: 8.5, protein: 2, fat: 15, fiber: 6.7, sugar: 0.7, sodium: 7 },
    [g(), kg(), unidade(200)],
    ["avocado"]
  ),
  food(
    "Melão",
    "fruits",
    { calories: 34, carbs: 8, protein: 0.8, fat: 0.2, fiber: 0.9, sugar: 8, sodium: 16 },
    [g(), kg(), xicara(160)],
    ["melon"]
  ),
  food(
    "Limão",
    "fruits",
    { calories: 29, carbs: 9.3, protein: 1.1, fat: 0.3, fiber: 2.8, sugar: 2.5, sodium: 2 },
    [g(), kg(), unidade(60)],
    ["lemon"]
  ),
  food(
    "Tangerina",
    "fruits",
    { calories: 53, carbs: 13, protein: 0.8, fat: 0.3, fiber: 1.8, sugar: 10, sodium: 2 },
    [g(), kg(), unidade(88)],
    ["tangerine", "mexerica", "bergamota"]
  ),

  // ---------- VEGETABLES ----------
  food(
    "Alface",
    "vegetables",
    { calories: 15, carbs: 2.9, protein: 1.4, fat: 0.2, fiber: 1.3, sugar: 0.8, sodium: 28 },
    [g(), kg(), xicara(36)],
    ["lettuce"]
  ),
  food(
    "Tomate",
    "vegetables",
    { calories: 18, carbs: 3.9, protein: 0.9, fat: 0.2, fiber: 1.2, sugar: 2.6, sodium: 5 },
    [g(), kg(), unidade(123)],
    ["tomato"]
  ),
  food(
    "Cenoura",
    "vegetables",
    { calories: 41, carbs: 10, protein: 0.9, fat: 0.2, fiber: 2.8, sugar: 4.7, sodium: 69 },
    [g(), kg(), unidade(61)],
    ["carrot"]
  ),
  food(
    "Brócolis",
    "vegetables",
    { calories: 34, carbs: 6.6, protein: 2.8, fat: 0.4, fiber: 2.6, sugar: 1.7, sodium: 33 },
    [g(), kg(), xicara(91)],
    ["broccoli"]
  ),
  food(
    "Espinafre",
    "vegetables",
    { calories: 23, carbs: 3.6, protein: 2.9, fat: 0.4, fiber: 2.2, sugar: 0.4, sodium: 79 },
    [g(), kg(), xicara(30)],
    ["spinach"]
  ),
  food(
    "Cebola",
    "vegetables",
    { calories: 40, carbs: 9.3, protein: 1.1, fat: 0.1, fiber: 1.7, sugar: 4.2, sodium: 4 },
    [g(), kg(), unidade(110)],
    ["onion"]
  ),
  food(
    "Pepino",
    "vegetables",
    { calories: 15, carbs: 3.6, protein: 0.7, fat: 0.1, fiber: 0.5, sugar: 1.7, sodium: 2 },
    [g(), kg(), unidade(300)],
    ["cucumber"]
  ),
  food(
    "Batata Inglesa Cozida",
    "vegetables",
    { calories: 87, carbs: 20, protein: 1.9, fat: 0.1, fiber: 1.8, sugar: 0.9, sodium: 5 },
    [g(), kg(), unidade(170)],
    ["potato", "batata"]
  ),
  food(
    "Batata Doce Cozida",
    "vegetables",
    { calories: 86, carbs: 20, protein: 1.6, fat: 0.1, fiber: 3, sugar: 4.2, sodium: 55 },
    [g(), kg(), unidade(150)],
    ["sweet potato", "batata doce"]
  ),
  food(
    "Abóbora",
    "vegetables",
    { calories: 26, carbs: 6.5, protein: 1, fat: 0.1, fiber: 0.5, sugar: 2.8, sodium: 1 },
    [g(), kg(), xicara(116)],
    ["pumpkin"]
  ),
  food(
    "Pimentão",
    "vegetables",
    { calories: 31, carbs: 6, protein: 1, fat: 0.3, fiber: 2.1, sugar: 4.2, sodium: 4 },
    [g(), kg(), unidade(120)],
    ["pepper", "pimentao"]
  ),
  food(
    "Beterraba",
    "vegetables",
    { calories: 43, carbs: 10, protein: 1.6, fat: 0.2, fiber: 2.8, sugar: 7, sodium: 78 },
    [g(), kg(), unidade(82)],
    ["beet"]
  ),
  food(
    "Couve",
    "vegetables",
    { calories: 49, carbs: 9, protein: 4.3, fat: 0.9, fiber: 3.6, sugar: 2.3, sodium: 43 },
    [g(), kg(), xicara(67)],
    ["kale", "couve"]
  ),
  food(
    "Repolho",
    "vegetables",
    { calories: 25, carbs: 5.8, protein: 1.3, fat: 0.1, fiber: 2.5, sugar: 3.2, sodium: 18 },
    [g(), kg(), xicara(89)],
    ["cabbage"]
  ),

  // ---------- DAIRY ----------
  food(
    "Leite Integral",
    "dairy",
    { calories: 61, carbs: 4.8, protein: 3.2, fat: 3.3, fiber: 0, sugar: 5.1, sodium: 43 },
    liquid(xicara(244)),
    ["milk"]
  ),
  food(
    "Leite Desnatado",
    "dairy",
    { calories: 34, carbs: 5, protein: 3.4, fat: 0.1, fiber: 0, sugar: 5, sodium: 42 },
    liquid(xicara(245)),
    ["milk"]
  ),
  food(
    "Queijo Mussarela",
    "dairy",
    { calories: 280, carbs: 3.1, protein: 22, fat: 20, fiber: 0, sugar: 1, sodium: 620 },
    solid(fatia(20)),
    ["cheese", "queijo"]
  ),
  food(
    "Queijo Minas Frescal",
    "dairy",
    { calories: 264, carbs: 3.2, protein: 17, fat: 20, fiber: 0, sugar: 3.2, sodium: 346 },
    solid(fatia(30)),
    ["cheese", "queijo"]
  ),
  food(
    "Iogurte Natural",
    "dairy",
    { calories: 61, carbs: 4.7, protein: 3.5, fat: 3.3, fiber: 0, sugar: 4.7, sodium: 46 },
    solid(unidade(170)),
    ["yogurt", "iogurte"]
  ),
  food(
    "Iogurte Grego",
    "dairy",
    { calories: 97, carbs: 3.6, protein: 9, fat: 5, fiber: 0, sugar: 3.6, sodium: 36 },
    solid(unidade(170)),
    ["yogurt", "iogurte"]
  ),
  food(
    "Manteiga",
    "dairy",
    { calories: 717, carbs: 0.1, protein: 0.9, fat: 81, fiber: 0, sugar: 0.1, sodium: 11 },
    solid(colherSopa(14), colherCha(5)),
    ["butter"]
  ),
  food(
    "Cream Cheese",
    "dairy",
    { calories: 342, carbs: 4.1, protein: 6, fat: 34, fiber: 0, sugar: 3.2, sodium: 321 },
    solid(colherSopa(15)),
    ["cream cheese"]
  ),
  food(
    "Requeijão",
    "dairy",
    { calories: 264, carbs: 3.2, protein: 9, fat: 24, fiber: 0, sugar: 3, sodium: 430 },
    solid(colherSopa(20)),
    ["requeijao"]
  ),

  // ---------- DRINKS ----------
  food(
    "Água",
    "drinks",
    { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0, sugar: 0, sodium: 0 },
    liquid(),
    ["water"]
  ),
  food(
    "Café sem Açúcar",
    "drinks",
    { calories: 2, carbs: 0, protein: 0.3, fat: 0, fiber: 0, sugar: 0, sodium: 5 },
    liquid(xicara(240)),
    ["coffee", "cafe"]
  ),
  food(
    "Chá sem Açúcar",
    "drinks",
    { calories: 1, carbs: 0.3, protein: 0, fat: 0, fiber: 0, sugar: 0, sodium: 3 },
    liquid(xicara(240)),
    ["tea", "cha"]
  ),
  food(
    "Suco de Laranja Natural",
    "drinks",
    { calories: 45, carbs: 10, protein: 0.7, fat: 0.2, fiber: 0.2, sugar: 8.4, sodium: 1 },
    liquid(xicara(248)),
    ["juice", "suco"]
  ),
  food(
    "Suco de Uva Industrializado",
    "drinks",
    { calories: 60, carbs: 15, protein: 0.1, fat: 0, fiber: 0.2, sugar: 14, sodium: 5 },
    liquid(xicara(248)),
    ["juice", "suco"]
  ),
  food(
    "Refrigerante de Cola",
    "drinks",
    { calories: 42, carbs: 10.6, protein: 0, fat: 0, fiber: 0, sugar: 10.6, sodium: 4 },
    liquid(unidade(350)),
    ["soda", "refrigerante", "coca"]
  ),
  food(
    "Refrigerante Guaraná",
    "drinks",
    { calories: 39, carbs: 10, protein: 0, fat: 0, fiber: 0, sugar: 10, sodium: 9 },
    liquid(unidade(350)),
    ["soda", "refrigerante"]
  ),
  food(
    "Energético",
    "drinks",
    { calories: 45, carbs: 11, protein: 0, fat: 0, fiber: 0, sugar: 11, sodium: 105 },
    liquid(unidade(250)),
    ["energy drink", "energetico"]
  ),
  food(
    "Isotônico",
    "drinks",
    { calories: 24, carbs: 6, protein: 0, fat: 0, fiber: 0, sugar: 6, sodium: 41 },
    liquid(unidade(500)),
    ["sports drink", "isotonico", "gatorade"]
  ),

  // ---------- GRAINS ----------
  food(
    "Arroz Branco Cozido",
    "grains",
    { calories: 130, carbs: 28, protein: 2.7, fat: 0.3, fiber: 0.4, sugar: 0.1, sodium: 1 },
    solid(xicara(158)),
    ["rice", "arroz"]
  ),
  food(
    "Arroz Integral Cozido",
    "grains",
    { calories: 123, carbs: 26, protein: 2.7, fat: 1, fiber: 1.8, sugar: 0.4, sodium: 4 },
    solid(xicara(195)),
    ["rice", "arroz"]
  ),
  food(
    "Feijão Carioca Cozido",
    "grains",
    { calories: 76, carbs: 14, protein: 4.8, fat: 0.5, fiber: 8.5, sugar: 0.3, sodium: 2 },
    solid(xicara(172)),
    ["beans", "feijao"]
  ),
  food(
    "Feijão Preto Cozido",
    "grains",
    { calories: 77, carbs: 14, protein: 4.5, fat: 0.5, fiber: 8.7, sugar: 0.3, sodium: 2 },
    solid(xicara(172)),
    ["beans", "feijao"]
  ),
  food(
    "Aveia em Flocos",
    "grains",
    { calories: 389, carbs: 66, protein: 17, fat: 6.9, fiber: 10.6, sugar: 1, sodium: 2 },
    solid(colherSopa(15), xicara(90)),
    ["oats", "aveia"]
  ),
  food(
    "Pão Francês",
    "grains",
    { calories: 300, carbs: 58, protein: 9, fat: 3.1, fiber: 2.3, sugar: 3, sodium: 543 },
    [g(), unidade(50)],
    ["bread", "pao"]
  ),
  food(
    "Pão de Forma Integral",
    "grains",
    { calories: 247, carbs: 41, protein: 13, fat: 3.4, fiber: 6.5, sugar: 5, sodium: 400 },
    [g(), fatia(25)],
    ["bread", "pao"]
  ),
  food(
    "Macarrão Cozido",
    "grains",
    { calories: 158, carbs: 31, protein: 5.8, fat: 0.9, fiber: 1.8, sugar: 0.6, sodium: 1 },
    solid(xicara(140)),
    ["pasta", "macarrao"]
  ),
  food(
    "Milho Cozido",
    "grains",
    { calories: 96, carbs: 21, protein: 3.4, fat: 1.5, fiber: 2.4, sugar: 4.5, sodium: 15 },
    solid(unidade(90), xicara(154)),
    ["corn", "milho"]
  ),
  food(
    "Quinoa Cozida",
    "grains",
    { calories: 120, carbs: 21, protein: 4.4, fat: 1.9, fiber: 2.8, sugar: 0.9, sodium: 7 },
    solid(xicara(185)),
    ["quinoa"]
  ),
  food(
    "Granola",
    "grains",
    { calories: 471, carbs: 64, protein: 10, fat: 20, fiber: 7, sugar: 24, sodium: 20 },
    solid(colherSopa(15), xicara(122)),
    ["granola"]
  ),
  food(
    "Tapioca",
    "grains",
    { calories: 240, carbs: 60, protein: 0, fat: 0, fiber: 0.5, sugar: 0.5, sodium: 4 },
    solid(unidade(60)),
    ["tapioca"]
  ),
  food(
    "Cuscuz de Milho",
    "grains",
    { calories: 112, carbs: 24, protein: 2.5, fat: 0.5, fiber: 1.7, sugar: 0.4, sodium: 3 },
    solid(xicara(150)),
    ["cuscuz"]
  ),

  // ---------- NUTS & SEEDS ----------
  food(
    "Amendoim Torrado",
    "nuts",
    { calories: 567, carbs: 16, protein: 26, fat: 49, fiber: 8.5, sugar: 4, sodium: 18 },
    solid(colherSopa(9)),
    ["peanuts", "amendoim"]
  ),
  food(
    "Amêndoas",
    "nuts",
    { calories: 579, carbs: 22, protein: 21, fat: 50, fiber: 12.5, sugar: 4.4, sodium: 1 },
    solid(colherSopa(10)),
    ["almonds", "amendoas"]
  ),
  food(
    "Castanha de Caju",
    "nuts",
    { calories: 553, carbs: 30, protein: 18, fat: 44, fiber: 3.3, sugar: 5.9, sodium: 12 },
    solid(colherSopa(10)),
    ["cashew", "castanha"]
  ),
  food(
    "Castanha do Pará",
    "nuts",
    { calories: 656, carbs: 12, protein: 14, fat: 66, fiber: 7.5, sugar: 2.3, sodium: 3 },
    solid(unidade(5)),
    ["brazil nut", "castanha"]
  ),
  food(
    "Noz",
    "nuts",
    { calories: 654, carbs: 14, protein: 15, fat: 65, fiber: 6.7, sugar: 2.6, sodium: 2 },
    solid(unidade(5)),
    ["walnut", "noz"]
  ),
  food(
    "Chia",
    "nuts",
    { calories: 486, carbs: 42, protein: 17, fat: 31, fiber: 34, sugar: 0, sodium: 16 },
    solid(colherSopa(12)),
    ["chia"]
  ),
  food(
    "Linhaça",
    "nuts",
    { calories: 534, carbs: 29, protein: 18, fat: 42, fiber: 27, sugar: 1.6, sodium: 30 },
    solid(colherSopa(10)),
    ["flaxseed", "linhaca"]
  ),
  food(
    "Semente de Abóbora",
    "nuts",
    { calories: 559, carbs: 15, protein: 30, fat: 49, fiber: 6, sugar: 1.4, sodium: 7 },
    solid(colherSopa(9)),
    ["pumpkin seeds"]
  ),

  // ---------- PROCESSED FOODS ----------
  food(
    "Chocolate ao Leite",
    "processed",
    { calories: 535, carbs: 59, protein: 7.7, fat: 30, fiber: 3.4, sugar: 51, sodium: 79 },
    solid(unidade(25)),
    ["chocolate"]
  ),
  food(
    "Biscoito Recheado",
    "processed",
    { calories: 480, carbs: 68, protein: 5.5, fat: 20, fiber: 1.8, sugar: 32, sodium: 240 },
    solid(unidade(12)),
    ["cookies", "biscoito"]
  ),
  food(
    "Bala/Doce",
    "processed",
    { calories: 394, carbs: 98, protein: 0, fat: 0.2, fiber: 0, sugar: 80, sodium: 40 },
    solid(unidade(5)),
    ["candy", "bala", "doce"]
  ),
  food(
    "Batata Chips",
    "processed",
    { calories: 536, carbs: 53, protein: 6.6, fat: 34, fiber: 4.4, sugar: 0.3, sodium: 525 },
    solid(xicara(28)),
    ["chips", "batata frita de pacote"]
  ),
  food(
    "Miojo (Macarrão Instantâneo)",
    "processed",
    { calories: 436, carbs: 60, protein: 9, fat: 17, fiber: 2, sugar: 3, sodium: 1730 },
    solid(unidade(85)),
    ["instant noodles", "miojo"]
  ),
  food(
    "Sorvete de Creme",
    "processed",
    { calories: 207, carbs: 24, protein: 3.5, fat: 11, fiber: 0.7, sugar: 21, sodium: 80 },
    solid(xicara(66)),
    ["ice cream", "sorvete"]
  ),
  food(
    "Nuggets de Frango",
    "processed",
    { calories: 296, carbs: 16, protein: 15, fat: 19, fiber: 1, sugar: 0.5, sodium: 490 },
    solid(unidade(17)),
    ["fast food", "nuggets"]
  ),
  food(
    "Lasanha Congelada",
    "processed",
    { calories: 132, carbs: 14, protein: 7, fat: 5.3, fiber: 1.2, sugar: 3.8, sodium: 380 },
    solid(),
    ["frozen meal", "lasanha"]
  ),
  food(
    "Pizza de Mussarela",
    "processed",
    { calories: 266, carbs: 33, protein: 11, fat: 10, fiber: 2.3, sugar: 3.8, sodium: 598 },
    solid(fatia(107)),
    ["pizza"]
  ),
  food(
    "Hambúrguer (fast food)",
    "processed",
    { calories: 295, carbs: 27, protein: 17, fat: 14, fiber: 1.5, sugar: 5, sodium: 460 },
    solid(unidade(150)),
    ["hamburger", "burger"]
  ),
  food(
    "Batata Frita (fast food)",
    "processed",
    { calories: 312, carbs: 41, protein: 3.4, fat: 15, fiber: 3.8, sugar: 0.3, sodium: 210 },
    solid(),
    ["french fries", "batata frita"]
  ),
  food(
    "Salgadinho de Pacote",
    "processed",
    { calories: 542, carbs: 57, protein: 7, fat: 32, fiber: 3, sugar: 2, sodium: 700 },
    solid(xicara(28)),
    ["snacks", "salgadinho"]
  ),
  food(
    "Achocolatado em Pó",
    "processed",
    { calories: 396, carbs: 82, protein: 5.8, fat: 4.3, fiber: 4.8, sugar: 74, sodium: 100 },
    solid(colherSopa(10)),
    ["chocolate powder", "achocolatado"]
  ),
];

export function searchFoods(query: string, category?: FoodCategory | "all"): FoodItem[] {
  const q = query.trim().toLowerCase();
  let pool = FOODS;
  if (category && category !== "all") {
    pool = pool.filter((f) => f.category === category);
  }
  if (!q) return pool.slice(0, 40);

  const normalized = q.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const scored = pool
    .map((f) => {
      const name = f.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const aliasHit = (f.aliases ?? []).some((a) =>
        a.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").includes(normalized)
      );
      let score = -1;
      if (name === normalized) score = 100;
      else if (name.startsWith(normalized)) score = 80;
      else if (name.includes(normalized)) score = 60;
      else if (aliasHit) score = 50;
      return { f, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((x) => x.f).slice(0, 30);
}

export function getFoodById(foodId: string): FoodItem | undefined {
  return FOODS.find((f) => f.id === foodId);
}
