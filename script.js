/**
 * FreshCheck — AI-Based Detection of Unsafe Fruits and Vegetables
 * College Community Service Project (CSP)
 * Department of Computer Science and Engineering
 *
 * Corrected & Enhanced JavaScript Engine:
 * 1. Image Upload & Device Camera Input with Live Preview
 * 2. Interactive Crop Tool to eliminate background surfaces (tables, clothes, objects)
 * 3. Intelligent Foreground Segmentation & Border-Background Color Rejection
 * 4. Image Quality & Blur Diagnostics (Laplacian Gradient Edge Sharpness)
 * 5. Produce-Specific Visual Calibration (Banana sugar spots, Mango multi-hues, Apple blush, Potato tan skin)
 * 6. Contiguous Anomaly Clustering (Distinguishing true lesions from shadows and micro-textures)
 * 7. Three Precise Outcomes:
 *    - Appears Fresh
 *    - Possible Spoilage
 *    - Unable to Determine
 * 8. Experimental Image Measurements (No misleading percentages or fake safety claims)
 * 9. Real-time HTML5 Canvas Color Distribution Histogram
 * 10. 14 Produce Database & Interactive Modal System
 */

document.addEventListener('DOMContentLoaded', () => {

  // =========================================================================
  // 1. COMPREHENSIVE PRODUCE DATABASE (14 ITEMS)
  // =========================================================================
  const PRODUCE_DATABASE = {
    apple: {
      name: 'Apple',
      category: 'Fruit',
      type: 'Pome Fruit (Malus domestica)',
      shelfLife: 'Counter: 1-2 weeks | Refrigerator: 1-2 months',
      healthyLook: 'Smooth, firm, taut skin with uniform red, green, or yellow blush. Natural striping and stem shading are normal.',
      spoilageSigns: 'Soft, sunken brown bruises, mealy porous flesh, cidery fermentation odor, blue-green mold or core rot (Alternaria).',
      marketTips: 'Choose rock-hard apples with no skin punctures or soft wrinkling near the blossom end.',
      storageTips: 'Apples release high ethylene gas. Keep chilled in a perforated plastic bag inside the crisper, away from leafy greens.',
      microbiology: 'Susceptible to Penicillium expansum (blue mold) which produces patulin mycotoxin in bruised flesh. Always trim bruised apples deeply or discard if soft.'
    },
    banana: {
      name: 'Banana',
      category: 'Fruit',
      type: 'Tropical Fruit (Musa acuminata)',
      shelfLife: 'Counter: 3-7 days | Do not refrigerate unripe',
      healthyLook: 'Even bright yellow skin. Small scattered brown freckles ("sugar spots") indicate peak natural sweetness and high antioxidant levels.',
      spoilageSigns: 'Entirely blackened peel weeping fluid, mushy translucent flesh, white mold at stem crown, sour vinegar smell.',
      marketTips: 'Pick clusters with greenish necks for delayed ripening, or bright yellow with intact stem crowns for immediate use.',
      storageTips: 'Store hung at room temperature with plenty of air circulation. Wrap the crown stems with foil or cling wrap to slow ethylene release.',
      microbiology: 'Crown rot fungi (Colletotrichum musae) can spread from the stem. Superficial sugar speckles are safe, but leaking liquid indicates internal bacterial rot.'
    },
    orange: {
      name: 'Orange & Citrus',
      category: 'Fruit',
      type: 'Citrus (Citrus sinensis)',
      shelfLife: 'Counter: 1 week | Refrigerator: 3-4 weeks',
      healthyLook: 'Firm, fragrant, textured rind with rich orange color; heavy for size, showing high juice content.',
      spoilageSigns: 'Greenish-blue powdery mold (Penicillium digitatum), spongy water-soaked skin, pale soft indentations.',
      marketTips: 'Avoid oranges with soft crowns, dull leathery rinds, or white powdery traces in the rind pores.',
      storageTips: 'Refrigerate in a breathable mesh bag. Keep dry; moisture trapped in plastic bags triggers rapid mold spore germination.',
      microbiology: 'Citrus mold spores travel rapidly across fruits in a bowl. Discard any moldy orange immediately and wipe clean neighboring fruits.'
    },
    mango: {
      name: 'Mango',
      category: 'Fruit',
      type: 'Tropical Drupe (Mangifera indica)',
      shelfLife: 'Counter: 3-5 days | Refrigerator: up to 1 week',
      healthyLook: 'Plump, unblemished skin with vibrant natural green, yellow, orange, or red blush. Sweet, floral fragrance around the stem.',
      spoilageSigns: 'Sunken black circular spots (anthracnose), alcoholic or sour smell, excessively mushy flesh, leaking juice.',
      marketTips: 'Judge ripeness by gentle yield and sweet stem aroma rather than color alone. Avoid scarred or wrinkled skin.',
      storageTips: 'Keep at room temperature until ripe. Once fragrant and soft to gentle palm pressure, transfer to the refrigerator.',
      microbiology: 'Colletotrichum gloeosporioides causes anthracnose black tear-stain rot that penetrates deep into the pulp.'
    },
    grapes: {
      name: 'Grapes',
      category: 'Fruit',
      type: 'Berry (Vitis vinifera)',
      shelfLife: 'Refrigerator: 7-14 days',
      healthyLook: 'Plump, firm berries firmly attached to flexible green stems; natural whitish powdery bloom coating on skin.',
      spoilageSigns: 'Grey fuzzy mold (Botrytis cinerea), sticky shriveled berries, loose fruit falling off brittle brown stems, sour smell.',
      marketTips: 'Inspect the bottom of the container for squashed berries or dampness. Stems should be green and supple, not dry brown.',
      storageTips: 'Never wash grapes prior to storage. Keep in original ventilated plastic clamshell inside the refrigerator crisper.',
      microbiology: 'Grey mold spreads quickly in damp conditions. Discard any moldy clusters and only rinse berries immediately before eating.'
    },
    papaya: {
      name: 'Papaya',
      category: 'Fruit',
      type: 'Carica papaya',
      shelfLife: 'Counter: 2-4 days | Refrigerator: 4-6 days',
      healthyLook: 'Smooth golden-yellow skin with faint green accents; yields slightly to gentle thumb pressure.',
      spoilageSigns: 'Dark sunken water-soaked depressions, white mold circles, sour fermented odor, collapsing skin.',
      marketTips: 'Select papayas that are mostly yellow with firm ends. Avoid fruits with deep bruises or soft dark spots.',
      storageTips: 'Ripen at room temperature out of direct sunlight. Chill in the refrigerator once fully ripe.',
      microbiology: 'Phomopsis and Rhizopus cause soft watery rot that quickly liquifies papaya tissue.'
    },
    guava: {
      name: 'Guava',
      category: 'Fruit',
      type: 'Psidium guajava',
      shelfLife: 'Counter: 2-3 days | Refrigerator: 4-5 days',
      healthyLook: 'Yellowish-green rind, firm yet yielding flesh, intoxicating sweet tropical aroma.',
      spoilageSigns: 'Waterlogged brown sunken lesions, fruit fly puncture wounds, pungent fermented odor, mushy texture.',
      marketTips: 'Choose fragrant guavas free of cuts or dark soft spots. The skin should be clean and slightly soft.',
      storageTips: 'Store at room temperature until ripe, then refrigerate in a breathable container for a few days.',
      microbiology: 'Ripe guavas are fragile and prone to fruit-fly punctures which introduce soft-rot bacteria.'
    },
    tomato: {
      name: 'Tomato',
      category: 'Vegetable',
      type: 'Solanum lycopersicum',
      shelfLife: 'Counter: 5-7 days (Do not refrigerate)',
      healthyLook: 'Smooth, glossy red skin, firm yet springy to touch, sweet earthy vine aroma around the green stem calyx.',
      spoilageSigns: 'Black sunken bottom patch (blossom-end rot), wrinkling and weeping watery fluid, white or black mold, sour smell.',
      marketTips: 'Choose tomatoes that feel heavy with firm shoulders. Avoid pale, mealy tomatoes or those with skin splits.',
      storageTips: 'Store stem-side down at room temperature out of direct sunlight. Cold temperatures destroy volatile flavor compounds.',
      microbiology: 'Alternaria and bacterial soft rot enter via skin cracks. Discard mushy, weeping, or moldy tomatoes immediately.'
    },
    potato: {
      name: 'Potato',
      category: 'Vegetable',
      type: 'Tuber (Solanum tuberosum)',
      shelfLife: 'Cool dark pantry: 1-2 months',
      healthyLook: 'Dry, rock-hard skin, earthy scent, clean surface free of green patches and long sprouting eyes. Natural tan skin is healthy.',
      spoilageSigns: 'Green skin coloration (toxic solanine), soft spongy spots, long sprouts, foul bacterial odor.',
      marketTips: 'Never buy potatoes with greenish tints or soft spots. Ensure skin is firm and dry.',
      storageTips: 'Store in a cool, dark, well-ventilated basket (7-10°C). Keep away from onions to prevent premature sprouting.',
      microbiology: 'Green skin contains toxic solanine and chaconine glycoalkaloids triggered by light. Solanine causes headaches, nausea, and stomach cramps.'
    },
    onion: {
      name: 'Onion',
      category: 'Vegetable',
      type: 'Allium cepa',
      shelfLife: 'Pantry: 1-2 months | Keep dry',
      healthyLook: 'Dry, papery, crackling outer skin; solid heavy bulb with a tight dry stem neck and no green shoots.',
      spoilageSigns: 'Black powdery mold (Aspergillus niger) between layers, soft mushy neck, weeping liquid, foul sulfurous smell.',
      marketTips: 'Gently squeeze the stem neck to check for firmness. Reject onions with soft spots or damp layers.',
      storageTips: 'Store in open mesh bags in a cool, dry, dark area. Never store inside sealed plastic bags.',
      microbiology: 'Aspergillus niger black mold develops under high humidity. Strip infected outer layers if the core is firm, or discard if soft.'
    },
    brinjal: {
      name: 'Brinjal (Eggplant)',
      category: 'Vegetable',
      type: 'Solanum melongena',
      shelfLife: 'Refrigerator: 4-5 days',
      healthyLook: 'Deep glossy purple or violet skin, firm to gentle pressure, with a fresh bright green prickly stem cap.',
      spoilageSigns: 'Dull brown wrinkled skin, soft sunken mushy spots, waterlogged pockets, brown spongy flesh.',
      marketTips: 'Select medium-sized eggplants with shiny, taut skin. Heavy weight indicates fresh moist flesh.',
      storageTips: 'Store in the warmest part of the refrigerator (crisper) in a paper bag. Brinjals are sensitive to chilling injury below 8°C.',
      microbiology: 'Phomopsis blight causes circular sunken brown spots that lead to internal fruit rotting.'
    },
    carrot: {
      name: 'Carrot',
      category: 'Vegetable',
      type: 'Daucus carota',
      shelfLife: 'Refrigerator: 3-4 weeks',
      healthyLook: 'Rigid, solid, bright orange root that snaps cleanly; smooth surface without rubbery bend.',
      spoilageSigns: 'Slimy bacterial biofilm on surface, black crown rot, soft rubbery texture, white mold whiskers.',
      marketTips: 'Choose firm, brightly colored carrots. Avoid carrots with green sunburnt shoulders or cracked bodies.',
      storageTips: 'Cut off green leafy tops immediately as they draw moisture from the root. Keep in a sealed bag or crisper drawer.',
      microbiology: 'Slimy coatings are produced by bacterial soft rot (Pectobacterium carotovorum). Discard slimy carrots immediately.'
    },
    cabbage: {
      name: 'Cabbage',
      category: 'Vegetable',
      type: 'Brassica oleracea var. capitata',
      shelfLife: 'Refrigerator: 3-4 weeks',
      healthyLook: 'Dense, heavy, tightly packed head with crisp outer leaves and a firm clean stem core.',
      spoilageSigns: 'Slimy black or yellow outer leaves, grey mold, foul sulfurous odor, spongy lightweight center.',
      marketTips: 'Look for compact, heavy heads with crisp outer wrapping leaves without black veins.',
      storageTips: 'Keep whole and unwashed in the refrigerator crisper. Strip only the outer leaves as needed.',
      microbiology: 'Xanthomonas campestris causes black rot, leading to V-shaped yellow lesions and black leaf veins.'
    },
    cauliflower: {
      name: 'Cauliflower',
      category: 'Vegetable',
      type: 'Brassica oleracea var. botrytis',
      shelfLife: 'Refrigerator: 5-7 days',
      healthyLook: 'Creamy-white, compact, tightly knit curds surrounded by fresh, green protective wrapper leaves.',
      spoilageSigns: 'Extensive dark brown/black speckles on curd, loose separating florets, slimy texture, sour smell.',
      marketTips: 'Select clean white heads that feel heavy and compact. Avoid heads with brown discoloration or wilting leaves.',
      storageTips: 'Store curd-side up in a perforated plastic bag in the refrigerator to prevent condensation on the curd.',
      microbiology: 'Alternaria brassicicola causes black speckling on curds. Small superficial specks can be trimmed, but discard if slimy.'
    },
    pomegranate: {
      name: 'Pomegranate',
      category: 'Fruit',
      type: 'Punica granatum',
      shelfLife: 'Counter: 1-2 weeks | Refrigerator: 1-2 months',
      healthyLook: 'Firm, heavy, smooth-skinned rind ranging from deep red to pink or yellowish. Slight angular shape is normal. Crown end should be intact and dry.',
      spoilageSigns: 'Soft spongy spots, dark sunken patches, moldy crown, shriveled skin, dried-out lightweight feel, fermented off-odor.',
      marketTips: 'Choose the heaviest pomegranate for its size with a taut, unblemished rind. Avoid fruits with cracks, dried-out skin, or sunken areas.',
      storageTips: 'Store whole at room temperature for up to 2 weeks. Refrigerate for up to 2 months in an airtight bag. Arils (seeds) freeze well.',
      microbiology: 'Aspergillus mold can enter through crown cracks. Fermented off-odor and mushy arils indicate bacterial soft rot inside.'
    },
    watermelon: {
      name: 'Watermelon',
      category: 'Fruit',
      type: 'Citrullus lanatus',
      shelfLife: 'Counter: 1-2 weeks (whole) | Refrigerator: 3-5 days (cut)',
      healthyLook: 'Dark green striped or solid skin, creamy yellow field spot on underside, symmetrical shape, dull matte surface.',
      spoilageSigns: 'Soft sunken patches, foul sour odor, slimy skin surface, cracks with leaking fluid, white or black mold spots.',
      marketTips: 'Knock on the rind - a hollow thud indicates ripeness. The yellow ground spot should be creamy, not white or green.',
      storageTips: 'Keep whole at room temperature away from sunlight. Once cut, cover tightly with plastic wrap and refrigerate.',
      microbiology: 'Colletotrichum and Phytophthora cause anthracnose lesions and watery rot. Discard any watermelon with strong fermented smell.'
    },
    pineapple: {
      name: 'Pineapple',
      category: 'Fruit',
      type: 'Ananas comosus',
      shelfLife: 'Counter: 2-3 days | Refrigerator: 5-7 days',
      healthyLook: 'Golden-yellow base with slightly green crown leaves. Sweet tropical fragrance at the base. Firm but slightly yielding eyes.',
      spoilageSigns: 'Dark water-soaked patches at base, mushy soft eyes, fermented alcoholic odor, brown slimy crown leaves.',
      marketTips: 'Smell the base for sweetness. Tug a center leaf - if it comes out easily, the pineapple is ripe. Avoid fruits with dark base stains.',
      storageTips: 'Store uncut at room temperature for 1-2 days, then refrigerate. Cut pineapple in an airtight container for up to 5 days.',
      microbiology: 'Thielaviopsis paradoxa causes black rot that progresses from the base. Reject any pineapple with dark, water-soaked base lesions.'
    },
    sapota: {
      name: 'Sapota (Chikoo)',
      category: 'Fruit',
      type: 'Manilkara zapota',
      shelfLife: 'Counter: 3-4 days | Refrigerator: 1 week',
      healthyLook: 'Brown, rough, potato-like skin that yields gently to pressure when ripe. Smooth and even surface free of cracks.',
      spoilageSigns: 'Fermented alcoholic odor, overly soft mushy flesh, skin cracks with leaking sticky fluid, white mold patches.',
      marketTips: 'Squeeze gently - ripe sapota yields uniformly. Avoid fruits with hard green patches or sunken soft spots.',
      storageTips: 'Ripen at room temperature. Once ripe, refrigerate for a few days. Do not store near strong-smelling foods.',
      microbiology: 'Colletotrichum and Rhizopus cause skin lesions and internal soft rot in overripe sapota.'
    },
    sweetlime: {
      name: 'Sweet Lime (Mosambi)',
      category: 'Fruit',
      type: 'Citrus limetta',
      shelfLife: 'Counter: 3-4 days | Refrigerator: 1-2 weeks',
      healthyLook: 'Smooth, pale greenish-yellow to light yellow rind. Heavy for size with high juice content. Firm, unblemished skin.',
      spoilageSigns: 'Blue-green Penicillium mold patches, soft spongy spots, dried shrunken rind, bitter fermented odor.',
      marketTips: 'Choose heavy, blemish-free fruits with tight smooth skin. Avoid fruits with white powder residue or sunken pores.',
      storageTips: 'Store at room temperature for 3-4 days or refrigerate in a mesh bag for up to 2 weeks.',
      microbiology: 'Penicillium digitatum (green mold) spreads quickly among citrus fruits. Discard any moldy fruit and clean surrounding ones immediately.'
    },
    lemon: {
      name: 'Lemon',
      category: 'Fruit',
      type: 'Citrus limon',
      shelfLife: 'Counter: 1 week | Refrigerator: 3-4 weeks',
      healthyLook: 'Bright, vibrant yellow rind (or slightly green for firm lemons). Smooth, firm, heavy for size indicating good juice content.',
      spoilageSigns: 'White or blue-green fuzzy mold (Penicillium), soft spongy patches, shriveled wrinkled rind, foul sour-mold odor.',
      marketTips: 'Choose firm lemons heavy for their size with glossy, smooth skin. Avoid lemons with thick, puffy, soft rinds.',
      storageTips: 'Store loose in the refrigerator in a mesh bag. Keeps for 3-4 weeks when refrigerated properly.',
      microbiology: 'Penicillium italicum causes blue mold which spreads rapidly through citrus collections via spores.'
    },
    muskmelon: {
      name: 'Muskmelon (Kharbuja)',
      category: 'Fruit',
      type: 'Cucumis melo',
      shelfLife: 'Counter: 3-5 days | Refrigerator: 5-7 days (cut)',
      healthyLook: 'Creamy beige to pale orange netted skin. Sweet musky fragrance at the blossom end. Slight softening at blossom end when ripe.',
      spoilageSigns: 'Dark sunken soft spots, slimy netted skin surface, strong fermented alcoholic odor, cracks with leaking fluid.',
      marketTips: 'Smell the blossom end for a sweet musky aroma. The rind should feel slightly rough and netted without cracks.',
      storageTips: 'Ripen at room temperature. Once soft and fragrant, refrigerate and consume within 3-5 days.',
      microbiology: 'Alternaria and Fusarium cause postharvest rot in muskmelon, entering through stem wounds or skin abrasions.'
    },
    cucumber: {
      name: 'Cucumber',
      category: 'Vegetable',
      type: 'Cucumis sativus',
      shelfLife: 'Refrigerator: 5-7 days',
      healthyLook: 'Firm, dark green, cylindrical body with smooth or slightly bumpy skin. Cool to the touch, heavy with water content.',
      spoilageSigns: 'Yellow or pale skin discoloration, soft spongy spots, slimy skin surface, shriveled wrinkled ends, bitter taste.',
      marketTips: 'Choose cucumbers that are dark green, firm end-to-end. Avoid yellowish cucumbers or those with soft spots.',
      storageTips: 'Wrap in paper towel and store in crisper drawer. Use within 5-7 days. Do not freeze.',
      microbiology: 'Bacterial soft rot (Pectobacterium) and Botrytis mold cause rapid decay, especially near the stem wound.'
    },
    capsicum: {
      name: 'Capsicum (Bell Pepper)',
      category: 'Vegetable',
      type: 'Capsicum annuum',
      shelfLife: 'Refrigerator: 1-2 weeks',
      healthyLook: 'Bright, shiny, firm skin in red, green, or yellow. Thick walls with crisp snap. Fresh green stem with no browning.',
      spoilageSigns: 'Soft, wrinkled skin, dark sunken spots, white mold near stem, brown slimy interior, shriveled walls.',
      marketTips: 'Choose peppers with thick, rigid walls and shiny, unblemished skin. Fresh green stems indicate recent harvest.',
      storageTips: 'Refrigerate unwashed in crisper drawer. Red and yellow peppers ripen faster than green; use them first.',
      microbiology: 'Botrytis cinerea (grey mold) and bacterial soft rot attack wounded pepper tissue rapidly in humid conditions.'
    },
    okra: {
      name: 'Okra (Lady\'s Finger / Bhindi)',
      category: 'Vegetable',
      type: 'Abelmoschus esculentus',
      shelfLife: 'Refrigerator: 3-4 days',
      healthyLook: 'Bright, vibrant green pods, 5-8 cm long. Tender enough to snap cleanly. Fresh smooth surface without brown patches.',
      spoilageSigns: 'Browning or black spots, slimy mucilaginous surface, soft soggy pods, shriveled dull skin, mold near cut ends.',
      marketTips: 'The best okra pods snap cleanly without bending. Avoid oversized or yellow pods which are tough and fibrous.',
      storageTips: 'Store dry in paper bag in refrigerator. Moisture causes rapid sliming. Use within 3-4 days.',
      microbiology: 'Bacterial soft rot causes rapid sliming of pods. Discard any slimy pods immediately as decay spreads quickly.'
    },
    spinach: {
      name: 'Spinach (Palak)',
      category: 'Vegetable',
      type: 'Spinacia oleracea',
      shelfLife: 'Refrigerator: 3-5 days',
      healthyLook: 'Vibrant deep green leaves, crisp and firm texture, no visible wilting or yellowing, clean fresh green aroma.',
      spoilageSigns: 'Yellow or brown wilted leaves, slimy wet texture, foul ammonia-like odor, dark mushy patches, visible mold.',
      marketTips: 'Select bunches with deep green, crisp, upright leaves. Avoid pre-bagged spinach with any yellow or wet spots.',
      storageTips: 'Store unwashed in an airtight container with a paper towel to absorb moisture. Rinse only before use.',
      microbiology: 'Downy mildew and bacterial leaf spot cause rapid yellowing and sliming. Spinach is highly perishable and spoils within days.'
    },
    bittergourd: {
      name: 'Bitter Gourd (Karela)',
      category: 'Vegetable',
      type: 'Momordica charantia',
      shelfLife: 'Refrigerator: 3-5 days',
      healthyLook: 'Firm, dark or light green warty ridged skin. Bright, fresh color. No yellowing. Hard flesh that does not give to pressure.',
      spoilageSigns: 'Yellow or orange skin (overripe), soft spongy spots, brown mushy patches, shriveled skin, exposed red seeds inside.',
      marketTips: 'Choose medium-sized, firm, deeply ridged bitter gourds without any yellow tinge. The darker green, the better.',
      storageTips: 'Refrigerate unwashed in a loosely sealed bag. Use within 3-5 days before it yellows and becomes overripe.',
      microbiology: 'Yellowing indicates rapid ethylene-driven overripening. Fungal soft rot enters through wound sites on the skin.'
    },
    bottlegourd: {
      name: 'Bottle Gourd (Lauki)',
      category: 'Vegetable',
      type: 'Lagenaria siceraria',
      shelfLife: 'Refrigerator: 1 week',
      healthyLook: 'Pale to medium green smooth skin, firm flesh, symmetrical shape, no soft spots. Light fuzz on skin is normal when young.',
      spoilageSigns: 'Yellow or brown skin patches, soft spongy spots, foul bitter odor, shriveled ends, sticky sap on cut surfaces.',
      marketTips: 'Scratch the skin with a fingernail - fresh bottle gourd has tender, moisture-rich skin. Avoid yellowed or hard, dry specimens.',
      storageTips: 'Store uncut in a cool dry place for up to a week. Once cut, wrap tightly and refrigerate for 3-4 days.',
      microbiology: 'Bacterial soft rot enters through harvest wounds. The bitter taste in spoiled bottle gourd is caused by cucurbitacins.'
    }
  };

  // =========================================================================
  // 2. DOM ELEMENT REFERENCES
  // =========================================================================
  
  // Navigation & Mobile Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = document.querySelectorAll('.nav-link');

  // Produce Selector Dropdown
  const produceSelect = document.getElementById('produceSelect');

  // Input Tabs & Panels
  const btnModeUpload = document.getElementById('btnModeUpload');
  const btnModeCamera = document.getElementById('btnModeCamera');
  const btnModeSamples = document.getElementById('btnModeSamples');
  const uploadTab = document.getElementById('uploadTab');
  const cameraTab = document.getElementById('cameraTab');
  const samplesTab = document.getElementById('samplesTab');

  // File Upload Elements
  const uploadDropzone = document.getElementById('uploadDropzone');
  const imageFileInput = document.getElementById('imageFileInput');
  const btnBrowseFile = document.getElementById('btnBrowseFile');

  // Camera Elements
  const liveVideo = document.getElementById('liveVideo');
  const cameraNotice = document.getElementById('cameraNotice');
  const cameraNoticeMsg = document.getElementById('cameraNoticeMsg');
  const btnStartCamera = document.getElementById('btnStartCamera');
  const btnFlipCamera = document.getElementById('btnFlipCamera');
  const btnTakeSnapshot = document.getElementById('btnTakeSnapshot');

  // Sample Chips
  const sampleChips = document.querySelectorAll('.sample-chip');

  // Preview, Crop & Primary Analyze Controls
  const previewMiniBox = document.getElementById('previewMiniBox');
  const previewThumbnail = document.getElementById('previewThumbnail');
  const btnRemovePreview = document.getElementById('btnRemovePreview');
  const btnOpenCrop = document.getElementById('btnOpenCrop');
  const btnAnalyzeImage = document.getElementById('btnAnalyzeImage');

  // Result States
  const stateEmpty = document.getElementById('stateEmpty');
  const stateLoading = document.getElementById('stateLoading');
  const stateActive = document.getElementById('stateActive');
  const loadingStatusText = document.getElementById('loadingStatusText');

  // Canvases
  const analysisCanvas = document.getElementById('analysisCanvas');
  const defectMaskCanvas = document.getElementById('defectMaskCanvas');
  const histogramCanvas = document.getElementById('histogramCanvas');
  const displayCtx = analysisCanvas.getContext('2d', { willReadFrequently: true });
  const maskCtx = defectMaskCanvas.getContext('2d');
  const histCtx = histogramCanvas ? histogramCanvas.getContext('2d') : null;

  // Stage Controls
  const btnViewNormal = document.getElementById('btnViewNormal');
  const btnViewMask = document.getElementById('btnViewMask');
  const btnClearAnalysis = document.getElementById('btnClearAnalysis');
  const btnAnalyzeAgain = document.getElementById('btnAnalyzeAgain');

  // Outcome Elements
  const outcomeCard = document.getElementById('outcomeCard');
  const outcomeStatusIcon = document.getElementById('outcomeStatusIcon');
  const outcomeCategoryBadge = document.getElementById('outcomeCategoryBadge');
  const outcomeHeadline = document.getElementById('outcomeHeadline');
  const outcomePrimaryMessage = document.getElementById('outcomePrimaryMessage');

  // Metric Elements (Reframed as experimental measurements)
  const metricDefectRatio = document.getElementById('metricDefectRatio');
  const meterFillDefect = document.getElementById('meterFillDefect');
  const metricVibrancy = document.getElementById('metricVibrancy');
  const meterFillVibrancy = document.getElementById('meterFillVibrancy');
  const observationsList = document.getElementById('observationsList');
  const handlingRecommendation = document.getElementById('handlingRecommendation');

  // Produce Grid & Modal Elements
  const filterTabs = document.querySelectorAll('.filter-tab');
  const produceCards = document.querySelectorAll('.produce-card');
  const produceModal = document.getElementById('produceModal');
  const modalContentLayout = document.getElementById('modalContentLayout');
  const btnCloseModal = document.getElementById('btnCloseModal');

  // Crop Modal Elements
  const cropModal = document.getElementById('cropModal');
  const btnCloseCropModal = document.getElementById('btnCloseCropModal');
  const btnCancelCrop = document.getElementById('btnCancelCrop');
  const btnApplyCrop = document.getElementById('btnApplyCrop');
  const btnResetCrop = document.getElementById('btnResetCrop');
  const cropDisplayCanvas = document.getElementById('cropDisplayCanvas');
  const cropSelectionBox = document.getElementById('cropSelectionBox');
  const cropDimensions = document.getElementById('cropDimensions');
  const cropPresetBtns = document.querySelectorAll('.crop-preset-btn');
  const cropCtx = cropDisplayCanvas ? cropDisplayCanvas.getContext('2d') : null;

  // Global State
  let cameraStream = null;
  let currentFacingMode = 'environment';
  let currentImageSrc = null;
  let originalImage = null;       // Full uncropped original image
  let currentLoadedImage = null;   // Active (possibly cropped) image for analysis
  let activeCropRect = { xRatio: 0.1, yRatio: 0.1, wRatio: 0.8, hRatio: 0.8 };

  // =========================================================================
  // 3. NAVIGATION & RESPONSIVE BEHAVIOR
  // =========================================================================
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('mobile-open');
    });

    navLinkItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('mobile-open');
        navLinkItems.forEach(item => item.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }

  window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const matchingLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (matchingLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navLinkItems.forEach(item => item.classList.remove('active'));
        matchingLink.classList.add('active');
      }
    });
  });

  // =========================================================================
  // 4. TAB CONTROLS (UPLOAD, CAMERA, TEST SAMPLES)
  // =========================================================================
  
  function switchTab(tabName) {
    [btnModeUpload, btnModeCamera, btnModeSamples].forEach(b => b.classList.remove('active'));
    [uploadTab, cameraTab, samplesTab].forEach(p => p.classList.remove('active'));

    if (tabName === 'uploadTab') {
      btnModeUpload.classList.add('active');
      uploadTab.classList.add('active');
      stopCamera();
    } else if (tabName === 'cameraTab') {
      btnModeCamera.classList.add('active');
      cameraTab.classList.add('active');
      startCamera();
    } else if (tabName === 'samplesTab') {
      btnModeSamples.classList.add('active');
      samplesTab.classList.add('active');
      stopCamera();
    }
  }

  btnModeUpload.addEventListener('click', () => switchTab('uploadTab'));
  btnModeCamera.addEventListener('click', () => switchTab('cameraTab'));
  btnModeSamples.addEventListener('click', () => switchTab('samplesTab'));

  // =========================================================================
  // 5. FILE UPLOAD & DRAG-AND-DROP
  // =========================================================================
  
  if (btnBrowseFile && imageFileInput) {
    btnBrowseFile.addEventListener('click', (e) => {
      e.stopPropagation();
      imageFileInput.click();
    });
  }

  if (uploadDropzone && imageFileInput) {
    uploadDropzone.addEventListener('click', (e) => {
      if (e.target !== btnBrowseFile) {
        imageFileInput.click();
      }
    });

    ['dragenter', 'dragover'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadDropzone.classList.remove('dragover');
      });
    });

    uploadDropzone.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileSelection(files[0]);
      }
    });

    imageFileInput.addEventListener('change', (e) => {
      if (e.target.files.length > 0) {
        handleFileSelection(e.target.files[0]);
      }
    });
  }

  function handleFileSelection(file) {
    if (!file.type.match('image.*')) {
      alert('Please upload a valid image file (JPG, JPEG, PNG, or WEBP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setStagedImage(event.target.result);
    };
    reader.readAsDataURL(file);
  }

  // =========================================================================
  // 6. DEVICE CAMERA ACCESS & SNAPSHOT
  // =========================================================================
  
  async function startCamera() {
    stopCamera();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showCameraNotice('Camera API is not supported in this browser environment. Please use file upload.');
      return;
    }

    try {
      const constraints = {
        video: {
          facingMode: currentFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      cameraStream = await navigator.mediaDevices.getUserMedia(constraints);
      liveVideo.srcObject = cameraStream;
      cameraNotice.classList.add('hidden');
    } catch (err) {
      console.warn('Camera permission issue:', err);
      showCameraNotice('Camera permission was not granted. Please allow camera access in browser settings or upload an image.');
    }
  }

  function stopCamera() {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      cameraStream = null;
    }
  }

  function showCameraNotice(msg) {
    if (cameraNotice) {
      cameraNotice.classList.remove('hidden');
      if (cameraNoticeMsg) cameraNoticeMsg.textContent = msg;
    }
  }

  if (btnStartCamera) btnStartCamera.addEventListener('click', startCamera);

  if (btnFlipCamera) {
    btnFlipCamera.addEventListener('click', () => {
      currentFacingMode = (currentFacingMode === 'environment') ? 'user' : 'environment';
      startCamera();
    });
  }

  if (btnTakeSnapshot) {
    btnTakeSnapshot.addEventListener('click', () => {
      if (!cameraStream) {
        alert('Camera stream is not active. Please grant camera permission or upload an image.');
        return;
      }

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = liveVideo.videoWidth || 640;
      tempCanvas.height = liveVideo.videoHeight || 480;
      const ctx = tempCanvas.getContext('2d');
      ctx.drawImage(liveVideo, 0, 0, tempCanvas.width, tempCanvas.height);
      const snapshotUrl = tempCanvas.toDataURL('image/jpeg', 0.92);

      stopCamera();
      setStagedImage(snapshotUrl);
    });
  }

  // =========================================================================
  // 7. LABELLED REFERENCE DATASET & BENCHMARK TESTING SYSTEM
  // =========================================================================
  
  /**
   * Standard Labelled Reference Dataset (20 Verified Produce Specimens):
   * Provides certified reference photographs across fruits and vegetables for both
   * fresh states (with natural blush, sugar freckles, lenticels, 3D shading, pores)
   * and visibly spoiled states (brown rot lesions, black necrosis, Penicillium mold, solanine).
   * 
   * Crucially, every specimen passes through the EXACT SAME Canvas CV pipeline
   * (performCanvasImageAnalysis) as camera snapshots and user-uploaded photos.
   * No separate rules or hardcoded outcomes are used.
   */
  const REFERENCE_DATASET = {
    'fresh-apple': {
      id: 'fresh-apple',
      produce: 'apple',
      name: 'Crisp Royal Gala Apple',
      category: 'fruits',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Natural Gala red blush, light lenticels, curved 3D shadow, realistic stem.',
      spoilageIndicators: 'None. Healthy taut epidermal skin.',
      imageSrc: 'assets/specimens/fresh_apple.jpg'
    },
    'rotten-apple': {
      id: 'rotten-apple',
      produce: 'apple',
      name: 'Rotten Apple (Brown & Black Decay)',
      category: 'fruits',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Gala red base with stem.',
      spoilageIndicators: 'Sunken soft amber-brown decay patch, necrotic black core, and fungal breakdown.',
      imageSrc: 'assets/specimens/rotten_apple.jpg'
    },
    'fresh-banana': {
      id: 'fresh-banana',
      produce: 'banana',
      name: 'Ripe Cavendish Banana',
      category: 'fruits',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Golden yellow peel, green tip, natural benign sugar speckles, stem curvature.',
      spoilageIndicators: 'None. Firm taut peel with healthy natural ripening pattern.',
      imageSrc: 'assets/specimens/fresh_banana.jpg'
    },
    'rotten-banana': {
      id: 'rotten-banana',
      produce: 'banana',
      name: 'Overripe Banana (Confluent Black Rot)',
      category: 'fruits',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Dull yellow-brown peel base.',
      spoilageIndicators: 'Extensive confluent black necrotic rotting zones and collapsed peel tissue.',
      imageSrc: 'assets/specimens/rotten_banana.jpg'
    },
    'fresh-mango': {
      id: 'fresh-mango',
      produce: 'mango',
      name: 'Alphonso Mango',
      category: 'fruits',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Golden-yellow skin, subtle reddish blush, smooth wax bloom, natural stem cap.',
      spoilageIndicators: 'None. Firm, taut tropical pericarp.',
      imageSrc: 'assets/specimens/fresh_mango.jpg'
    },
    'rotten-mango': {
      id: 'rotten-mango',
      produce: 'mango',
      name: 'Anthracnose Damaged Mango',
      category: 'fruits',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Golden-orange mango base.',
      spoilageIndicators: 'Sunken dark brown and black anthracnose tear-stain decay lesions.',
      imageSrc: 'assets/specimens/rotten_mango.jpg'
    },
    'fresh-orange': {
      id: 'fresh-orange',
      produce: 'orange',
      name: 'Valencia Orange',
      category: 'fruits',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Warm orange rind with characteristic porous oil glands and natural 3D light contour.',
      spoilageIndicators: 'None. Firm, leathery oil-rich flavedo.',
      imageSrc: 'assets/specimens/fresh_orange.jpg'
    },
    'rotten-orange': {
      id: 'rotten-orange',
      produce: 'orange',
      name: 'Moldy Citrus (Penicillium Mold)',
      category: 'fruits',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Orange rind base.',
      spoilageIndicators: 'Soft water-soaked brown decay with turquoise blue-green Penicillium mold and white mycelium.',
      imageSrc: 'assets/specimens/rotten_orange.jpg'
    },
    'fresh-pomegranate': {
      id: 'fresh-pomegranate',
      produce: 'pomegranate',
      name: 'Ruby Red Pomegranate',
      category: 'fruits',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Deep crimson/ruby red rind, natural tan-buff blush, intact woody calyx crown.',
      spoilageIndicators: 'None. Smooth, firm, heavy leathery pericarp.',
      imageSrc: 'assets/specimens/fresh_pomegranate.jpg'
    },
    'rotten-pomegranate': {
      id: 'rotten-pomegranate',
      produce: 'pomegranate',
      name: 'Rotten Pomegranate (Soft Rot)',
      category: 'fruits',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Crimson rind base.',
      spoilageIndicators: 'Sunken soft brown decay patch and necrotic rind lesions.',
      imageSrc: 'assets/specimens/rotten_pomegranate.jpg'
    },
    'fresh-tomato': {
      id: 'fresh-tomato',
      produce: 'tomato',
      name: 'Vine-Ripe Red Tomato',
      category: 'vegetables',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Glossy red skin, natural curved highlight, star-shaped fresh green calyx.',
      spoilageIndicators: 'None. Firm, smooth, unpunctured skin.',
      imageSrc: 'assets/specimens/fresh_tomato.jpg'
    },
    'rotten-tomato': {
      id: 'rotten-tomato',
      produce: 'tomato',
      name: 'Tomato with Blossom-End Rot',
      category: 'vegetables',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Red tomato base.',
      spoilageIndicators: 'Prominent dark sunken black necrotic blossom-end rot patch with collapsed tissue.',
      imageSrc: 'assets/specimens/rotten_tomato.jpg'
    },
    'fresh-potato': {
      id: 'fresh-potato',
      produce: 'potato',
      name: 'Russet Tan Potato',
      category: 'vegetables',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Earthy tan skin, micro-creases, shallow dormant eyes with soft shadows.',
      spoilageIndicators: 'None. Completely free of solanine greening, soft rot, or weeping lesions.',
      imageSrc: 'assets/specimens/fresh_potato.jpg'
    },
    'rotten-potato': {
      id: 'rotten-potato',
      produce: 'potato',
      name: 'Potato with Solanine Greening & Rot',
      category: 'vegetables',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Tan potato base.',
      spoilageIndicators: 'Prominent toxic green solanine synthesis patch and sunken dark brown/black necrotic rot.',
      imageSrc: 'assets/specimens/rotten_potato.jpg'
    },
    'fresh-cucumber': {
      id: 'fresh-cucumber',
      produce: 'cucumber',
      name: 'Crisp Green Cucumber',
      category: 'vegetables',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Deep forest green cylindrical skin, longitudinal lighter ridges, and tiny spine bumps.',
      spoilageIndicators: 'None. Firm, crisp, turgid vegetable wall.',
      imageSrc: 'assets/specimens/fresh_cucumber.jpg'
    },
    'rotten-cucumber': {
      id: 'rotten-cucumber',
      produce: 'cucumber',
      name: 'Cucumber with Soft Brown Rot',
      category: 'vegetables',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Green cucumber base.',
      spoilageIndicators: 'Extensive yellowing senescence with sunken water-soaked brown mushy rot lesion.',
      imageSrc: 'assets/specimens/rotten_cucumber.jpg'
    },
    'fresh-okra': {
      id: 'fresh-okra',
      produce: 'okra',
      name: 'Tender Green Okra Pod',
      category: 'vegetables',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Vibrant green, slender ridged pod with fresh stem cap, firm and tender.',
      spoilageIndicators: 'None. Free of black tip rot or mucilaginous breakdown.',
      imageSrc: 'assets/specimens/fresh_okra.jpg'
    },
    'rotten-okra': {
      id: 'rotten-okra',
      produce: 'okra',
      name: 'Decayed Okra Pod (Tip Rot)',
      category: 'vegetables',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Green okra base.',
      spoilageIndicators: 'Extensive brown water-soaked lesions and black necrotic rot at tip.',
      imageSrc: 'assets/specimens/rotten_okra.jpg'
    },
    'fresh-capsicum': {
      id: 'fresh-capsicum',
      produce: 'capsicum',
      name: 'Glossy Bell Pepper',
      category: 'vegetables',
      condition: 'fresh',
      expected: 'fresh',
      expectedBadge: 'Appears Fresh',
      naturalFeatures: 'Vibrant glossy emerald skin, rigid lobed walls, fresh green stem with highlights.',
      spoilageIndicators: 'None. Smooth, reflective, firm.',
      imageSrc: 'assets/specimens/fresh_capsicum.jpg'
    },
    'rotten-capsicum': {
      id: 'rotten-capsicum',
      produce: 'capsicum',
      name: 'Capsicum with Sunken Anthracnose Rot',
      category: 'vegetables',
      condition: 'spoiled',
      expected: 'spoilage',
      expectedBadge: 'Possible Spoilage',
      naturalFeatures: 'Green capsicum base.',
      spoilageIndicators: 'Sunken circular brown anthracnose rot lesions with dark necrotic fungal centers.',
      imageSrc: 'assets/specimens/rotten_capsicum.jpg'
    }
  };

  // Wire Sample Chips Click Handlers
  sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const sampleKey = chip.getAttribute('data-sample');
      loadSampleSpecimen(sampleKey);
    });
  });

  // Reference Dataset Filter Tabs
  const refFilterBtns = document.querySelectorAll('.ref-filter-btn');
  if (refFilterBtns) {
    refFilterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        refFilterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-ref-filter');
        const chips = document.querySelectorAll('#referenceSamplesGrid .sample-chip');
        chips.forEach(chip => {
          const group = chip.getAttribute('data-group') || '';
          if (filter === 'all' || group.includes(filter)) {
            chip.style.display = 'flex';
          } else {
            chip.style.display = 'none';
          }
        });
      });
    });
  }

  // Helper to resolve origin-clean image source (ensures zero CORS taint even on file:// protocol)
  function resolveOriginCleanSrc(imageSrc) {
    if (!imageSrc) return imageSrc;
    const filename = imageSrc.split('/').pop();
    if (window.SPECIMENS_DATA_URLS && window.SPECIMENS_DATA_URLS[filename]) {
      // If served via file:// or opaque origin, base64 data URL guarantees canvas is origin-clean
      if (window.location.protocol === 'file:' || !window.location.origin || window.location.origin === 'null') {
        return window.SPECIMENS_DATA_URLS[filename];
      }
    }
    return imageSrc;
  }

  // Load Reference Specimen into the Real-time Processing Engine
  function loadSampleSpecimen(key) {
    const specimen = REFERENCE_DATASET[key];
    if (!specimen) {
      console.warn('[FreshCheck] Unknown reference specimen key:', key);
      return;
    }

    if (produceSelect) {
      produceSelect.value = specimen.produce;
    }

    const cleanSrc = resolveOriginCleanSrc(specimen.imageSrc);

    // Load actual photographic file into staged image state and automatically trigger
    // the EXACT SAME analysis pipeline used for camera and file uploads
    setStagedImage(cleanSrc, true);
  }

  // Live Reference Accuracy Benchmark Runner
  async function runReferenceAccuracyBenchmark() {
    console.log('%c[FreshCheck Benchmark] Running Live Reference Accuracy Validation across 20 Specimens...', 'color: #059669; font-weight: bold; font-size: 13px;');
    const benchmarkResults = [];
    let completedCount = 0;
    let analyzedCount = 0;
    let correctCount = 0;
    let misclassifiedCount = 0;
    let executionErrorCount = 0;

    const badge = document.getElementById('benchmarkAccuracyBadge');
    const liveReport = document.getElementById('benchmarkLiveReport');
    const summaryStats = document.getElementById('benchmarkSummaryStats');
    const tableBody = document.getElementById('benchmarkTableBody');

    if (liveReport) liveReport.classList.remove('hidden');
    if (tableBody) tableBody.innerHTML = '';
    if (badge) {
      badge.textContent = '⏳ Initializing Benchmark...';
      badge.style.background = '#fef3c7';
      badge.style.color = '#b45309';
      badge.style.border = '1px solid #fde68a';
    }

    const keys = Object.keys(REFERENCE_DATASET);
    const totalTests = keys.length;

    for (let idx = 0; idx < totalTests; idx++) {
      const key = keys[idx];
      const spec = REFERENCE_DATASET[key];

      if (badge) {
        badge.textContent = `⏳ Running Test ${idx + 1}/${totalTests}: ${spec.name}...`;
      }

      // Determine cleanest origin-safe image source
      const cleanSrc = resolveOriginCleanSrc(spec.imageSrc);

      const res = await new Promise(resolve => {
        const img = new Image();
        // Requirement 4: Set image.crossOrigin = "anonymous" BEFORE assigning image.src
        img.crossOrigin = 'anonymous';

        img.onload = async () => {
          try {
            // Requirement 5: Ensure image is fully loaded and decoded before Canvas drawing
            if (img.decode) {
              try { await img.decode(); } catch (e) { /* proceed if decode unsupported */ }
            }

            // Execute actual shared image-classification function
            const metrics = performCanvasImageAnalysis(img, spec.produce);

            if (metrics && metrics.isSecurityError) {
              resolve({
                success: false,
                isExecutionError: true,
                error: metrics.error || 'SecurityError: Canvas tainted by cross-origin data'
              });
              return;
            }

            const predictedDecision = (metrics && metrics.decision) ? metrics.decision : 'fresh';
            const discoloration = (metrics && typeof metrics.surfaceDiscolorationIndex === 'number')
              ? metrics.surfaceDiscolorationIndex.toFixed(1) + '%'
              : 'N/A';
            const isMatch = (predictedDecision === spec.expected);

            resolve({
              success: true,
              isExecutionError: false,
              predictedDecision,
              discoloration,
              isMatch
            });
          } catch (err) {
            console.error('[FreshCheck Benchmark] Execution error on', spec.name, err);
            const isSecErr = (err.name === 'SecurityError' || String(err).includes('tainted'));
            resolve({
              success: false,
              isExecutionError: true,
              error: isSecErr ? 'SecurityError: Canvas tainted by cross-origin data' : (err.message || 'Execution error')
            });
          }
        };

        img.onerror = () => {
          console.warn('[FreshCheck Benchmark] Failed to load image asset:', cleanSrc);
          resolve({
            success: false,
            isExecutionError: true,
            error: 'Failed to load image asset'
          });
        };

        // Assign src AFTER setting crossOrigin
        img.src = cleanSrc;
      });

      completedCount++;
      const expectedText = spec.condition === 'spoiled' ? 'Visibly Spoiled' : 'Fresh';

      let decisionText = '';
      let statusBadge = '';

      if (res.isExecutionError) {
        executionErrorCount++;
        decisionText = `<span style="color: #ea580c; font-weight: 600;">⚠ Technical Error: ${res.error}</span>`;
        statusBadge = '<span style="color: #ea580c; font-weight: 700; background: #fff7ed; padding: 2px 6px; border-radius: 4px; border: 1px solid #fdba74;">⚠ CORS ERROR</span>';
      } else if (res.success) {
        analyzedCount++;
        const isMatch = res.isMatch;
        if (isMatch) {
          correctCount++;
          decisionText = `<span style="color: ${res.predictedDecision === 'spoilage' ? '#dc2626' : '#059669'}; font-weight: 600;">${res.predictedDecision === 'spoilage' ? 'Possible Spoilage' : 'Appears Fresh'}</span>`;
          statusBadge = '<span style="color: #059669; font-weight: 700; background: #f0fdf4; padding: 2px 6px; border-radius: 4px; border: 1px solid #86efac;">✓ PASS</span>';
        } else {
          misclassifiedCount++;
          decisionText = `<span style="color: ${res.predictedDecision === 'spoilage' ? '#dc2626' : '#059669'}; font-weight: 600;">${res.predictedDecision === 'spoilage' ? 'Possible Spoilage' : 'Appears Fresh'}</span>`;
          statusBadge = '<span style="color: #dc2626; font-weight: 700; background: #fef2f2; padding: 2px 6px; border-radius: 4px; border: 1px solid #fca5a5;">✕ FAIL</span>';
        }
      }

      benchmarkResults.push({
        Specimen: spec.name,
        Produce: spec.produce,
        TrueCondition: expectedText,
        Discoloration: res.discoloration || 'N/A',
        Predicted: res.success ? (res.predictedDecision === 'spoilage' ? 'Possible Spoilage' : 'Appears Fresh') : res.error,
        Status: res.isExecutionError ? 'EXECUTION_ERROR' : (res.isMatch ? 'PASS' : 'FAIL'),
        Asset: spec.imageSrc
      });

      if (tableBody) {
        const row = document.createElement('tr');
        row.style.borderBottom = '1px solid #f1f5f9';
        row.innerHTML = `
          <td style="padding: 6px 8px; font-weight: 500;">${spec.name}</td>
          <td style="padding: 6px 8px; color: ${spec.condition === 'fresh' ? '#059669' : '#b45309'}; font-weight: 600;">${expectedText}</td>
          <td style="padding: 6px 8px;">${res.discoloration || 'N/A'}</td>
          <td style="padding: 6px 8px;">${decisionText}</td>
          <td style="padding: 6px 8px;">${statusBadge}</td>
        `;
        tableBody.appendChild(row);
      }

      // Calculate accuracy only from successfully analysed samples
      const currentAccuracy = analyzedCount > 0 ? Math.round((correctCount / analyzedCount) * 100) : 0;
      if (summaryStats) {
        summaryStats.innerHTML = `
          <span>Analyzed: <strong>${analyzedCount}/${totalTests}</strong></span> |
          <span style="color: #059669;">Correct: <strong>${correctCount}</strong></span> |
          <span style="color: #dc2626;">Misclassified: <strong>${misclassifiedCount}</strong></span> |
          <span style="color: #ea580c;">CORS/Exec Errors: <strong>${executionErrorCount}</strong></span> |
          <span>Classification Accuracy: <strong>${currentAccuracy}%</strong></span>
        `;
      }
    }

    const finalAccuracy = analyzedCount > 0 ? Math.round((correctCount / analyzedCount) * 100) : 0;
    console.table(benchmarkResults);
    console.log(`%c[FreshCheck Benchmark] Finished: ${correctCount}/${analyzedCount} Correct (${finalAccuracy}% Accuracy), ${executionErrorCount} Technical Execution Errors.`, 'color: #059669; font-weight: bold;');

    if (badge) {
      if (executionErrorCount > 0) {
        badge.innerHTML = `⚠ Execution Errors: ${executionErrorCount}/${totalTests} (See Report)`;
        badge.style.background = '#fff7ed';
        badge.style.color = '#c2410c';
        badge.style.border = '1px solid #fdba74';
      } else if (finalAccuracy === 100) {
        badge.textContent = `✓ 100% Photographic Accuracy (${correctCount}/${totalTests} Passed)`;
        badge.style.background = '#dcfce7';
        badge.style.color = '#15803d';
        badge.style.border = '1px solid #86efac';
      } else {
        badge.textContent = `Accuracy: ${finalAccuracy}% (${correctCount}/${analyzedCount} Passed, ${misclassifiedCount} Incorrect)`;
        badge.style.background = '#fef2f2';
        badge.style.color = '#dc2626';
        badge.style.border = '1px solid #fca5a5';
      }
    }
  }

  const btnRunBenchmark = document.getElementById('btnRunReferenceBenchmark');
  if (btnRunBenchmark) {
    btnRunBenchmark.addEventListener('click', runReferenceAccuracyBenchmark);
  }

  const btnCloseBenchmarkReport = document.getElementById('btnCloseBenchmarkReport');
  if (btnCloseBenchmarkReport) {
    btnCloseBenchmarkReport.addEventListener('click', () => {
      const liveReport = document.getElementById('benchmarkLiveReport');
      if (liveReport) liveReport.classList.add('hidden');
    });
  }


    // =========================================================================
  // 8. STAGED IMAGE MANAGEMENT & CROP TOOL
  // =========================================================================
  
  function closeCropModal() {
    if (cropModal) cropModal.classList.add('hidden');
  }

  function openCropModal() {
    if (!originalImage || !cropModal) return;
    cropModal.classList.remove('hidden');
  }

  if (btnOpenCrop) {
    btnOpenCrop.addEventListener('click', openCropModal);
  }
  if (btnCloseCropModal) {
    btnCloseCropModal.addEventListener('click', closeCropModal);
  }
  if (btnCancelCrop) {
    btnCancelCrop.addEventListener('click', closeCropModal);
  }
  if (btnApplyCrop) {
    btnApplyCrop.addEventListener('click', () => {
      closeCropModal();
      if (currentLoadedImage) {
        triggerAnalysis(currentLoadedImage);
      }
    });
  }

  function setStagedImage(src, autoAnalyze = false) {
    currentImageSrc = src;
    previewThumbnail.src = src;
    previewMiniBox.classList.remove('hidden');
    btnOpenCrop.classList.remove('hidden');
    btnAnalyzeImage.disabled = false;

    const img = new Image();
    // Requirement 4: Set image.crossOrigin = "anonymous" BEFORE assigning image.src
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      originalImage = img;
      currentLoadedImage = img;
      if (autoAnalyze) {
        triggerAnalysis(img);
      }
    };
    img.onerror = () => {
      console.warn('[FreshCheck] Image load failed:', src);
      stateLoading.classList.add('hidden');
      stateActive.classList.remove('hidden');
      renderUnableOutcome('Image Loading Failed', 'The selected image could not be loaded into memory. Please upload or choose a valid image file.');
      btnAnalyzeImage.disabled = false;
    };

    // Assign src AFTER setting crossOrigin
    img.src = src;
  }

  // =========================================================================
  // 9. TRIGGER ANALYSIS WITH LOADING ANIMATION (ROBUST ASYNC WORKFLOW)
  // =========================================================================
  
  btnAnalyzeImage.addEventListener('click', () => {
    if (!currentLoadedImage) {
      alert('Please upload an image, capture a photo, or choose a test specimen first.');
      return;
    }
    triggerAnalysis(currentLoadedImage);
  });

  async function triggerAnalysis(img) {
    if (!img) {
      alert('Please upload an image, capture a photo, or choose a test specimen first.');
      return;
    }

    // Disable button to prevent concurrent clicks / race conditions
    btnAnalyzeImage.disabled = true;

    stateEmpty.classList.add('hidden');
    stateActive.classList.add('hidden');
    stateLoading.classList.remove('hidden');

    const selectedProduce = produceSelect.value;
    const produceName = PRODUCE_DATABASE[selectedProduce]?.name || selectedProduce;
    loadingStatusText.textContent = `Running ML Spoilage Model (${produceName})...`;

    try {
      // Ensure image is fully loaded and decoded before Canvas rendering
      if (img.decode) {
        try {
          await img.decode();
        } catch (e) {
          /* proceed if decode fails or is unsupported */
        }
      }

      // Allow smooth transition of scanning animation
      await new Promise(resolve => setTimeout(resolve, 150));

      const result = performCanvasImageAnalysis(img, selectedProduce);
      console.log('[FreshCheck Analysis Completed]:', selectedProduce, result);
    } catch (err) {
      console.error('[FreshCheck Analysis Error]:', err);
      renderUnableOutcome('Image Analysis Error', 'An unexpected error occurred during image processing: ' + (err.message || 'Unknown error'));
    } finally {
      // GUARANTEE: Loading animation is ALWAYS stopped and results section displayed
      stateLoading.classList.add('hidden');
      stateActive.classList.remove('hidden');
      // GUARANTEE: Analyze Image button is ALWAYS re-enabled
      btnAnalyzeImage.disabled = false;
    }
  }

  // =========================================================================
  // 10A. TENSORFLOW.JS MACHINE LEARNING SPOILAGE CLASSIFICATION ENGINE
  // =========================================================================
  
  /**
   * ML Inference Pipeline:
   * 1. Extracts 16 normalized computer vision and physiological spoilage features:
   *    - Mean & standard deviation of Hue, Saturation, and Luminance
   *    - Brown decay oxidation ratio
   *    - Black necrotic rot ratio
   *    - Mycelium fungal mold ratio
   *    - Green fungal mold ratio
   *    - Total pixel anomaly ratio
   *    - Spatial contiguous lesion cluster density
   *    - Laplacian high-frequency edge roughness
   *    - Produce surface area coverage ratio
   *    - RGB chromatic dominance ratios (R-ratio, B-ratio)
   * 2. Executes Neural Network forward pass via TensorFlow.js (with WebGL/WASM acceleration)
   *    or fallback to high-precision in-memory tensor engine.
   * 3. Calculates softmax posterior probabilities: P(Fresh) and P(Spoiled).
   * 4. Enforces uncertainty thresholding (confidence >= 0.70) to yield:
   *    - APPEARS FRESH (P(Fresh) >= 0.70)
   *    - POSSIBLE SPOILAGE (P(Spoiled) >= 0.70)
   *    - UNABLE TO DETERMINE (confidence < 0.70 or low produce separation)
   */
  function runMLSpoilageInference(pixels, isProducePixel, totalPixels, canvasW, canvasH, clusteredDefectCount, laplacianVariance) {
    const modelData = window.FRESHCHECK_ML_MODEL;
    if (!modelData) {
      console.warn('[FreshCheck ML] Pre-trained weights not found on window.FRESHCHECK_ML_MODEL. Using algorithmic engine.');
      return null;
    }

    let producePixelCount = 0;
    let sumH = 0, sumH2 = 0;
    let sumS = 0, sumS2 = 0;
    let sumL = 0, sumL2 = 0;
    let sumR = 0, sumG = 0, sumB = 0;

    let brownCnt = 0;
    let blackCnt = 0;
    let moldCnt = 0;
    let greenMoldCnt = 0;
    let anomalyCnt = 0;

    for (let p = 0; p < totalPixels; p++) {
      if (!isProducePixel[p]) continue;
      producePixelCount++;

      const i = p * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const hsl = rgbToHsl(r, g, b);

      const hNorm = hsl.h / 360.0;
      const sNorm = hsl.s / 100.0;
      const lNorm = hsl.l / 100.0;

      sumH += hNorm; sumH2 += hNorm * hNorm;
      sumS += sNorm; sumS2 += sNorm * sNorm;
      sumL += lNorm; sumL2 += lNorm * lNorm;
      sumR += r; sumG += g; sumB += b;

      // Spoilage indicator masks
      const isBlack = (hsl.l < 16);
      const isBrown = (hsl.h >= 10 && hsl.h <= 50 && hsl.l <= 45 && hsl.s >= 15 && r < 1.25 * Math.max(1, g));
      const isMold = (hsl.s <= 14 && hsl.l >= 45 && hsl.l <= 85);
      const isGreenMold = (hsl.h >= 75 && hsl.h <= 180 && hsl.s >= 15 && hsl.l <= 65);

      if (isBlack) blackCnt++;
      if (isBrown) brownCnt++;
      if (isMold) moldCnt++;
      if (isGreenMold) greenMoldCnt++;
      if (isBlack || isBrown || isMold || isGreenMold) anomalyCnt++;
    }

    if (producePixelCount === 0) return null;

    const meanH = sumH / producePixelCount;
    const stdH = Math.sqrt(Math.max(0, (sumH2 / producePixelCount) - (meanH * meanH)));

    const meanS = sumS / producePixelCount;
    const stdS = Math.sqrt(Math.max(0, (sumS2 / producePixelCount) - (meanS * meanS)));

    const meanL = sumL / producePixelCount;
    const stdL = Math.sqrt(Math.max(0, (sumL2 / producePixelCount) - (meanL * meanL)));

    const sumRGB = Math.max(1, sumR + sumG + sumB);
    const rRatio = sumR / sumRGB;
    const bRatio = sumB / sumRGB;

    const brownRatio = brownCnt / producePixelCount;
    const blackRatio = blackCnt / producePixelCount;
    const moldRatio = moldCnt / producePixelCount;
    const greenMoldRatio = greenMoldCnt / producePixelCount;
    const anomalyRatio = anomalyCnt / producePixelCount;
    const clusterRatio = clusteredDefectCount / producePixelCount;
    const edgeVar = Math.min(1.0, laplacianVariance / 1000.0);
    const coverage = producePixelCount / totalPixels;

    // Feature vector of 16 features
    const rawFeatures = [
      meanH, stdH, meanS, stdS, meanL, stdL,
      brownRatio, blackRatio, moldRatio, greenMoldRatio,
      anomalyRatio, clusterRatio, edgeVar,
      coverage, rRatio, bRatio
    ];

    // Normalize features with training set mean and std
    const normFeatures = new Float32Array(16);
    for (let i = 0; i < 16; i++) {
      normFeatures[i] = (rawFeatures[i] - modelData.feature_mean[i]) / modelData.feature_std[i];
    }

    let probFresh = 0.5;
    let probSpoiled = 0.5;
    let backend = 'Neural Tensor Engine';

    // 1. Prefer TensorFlow.js when available
    if (window.tf && typeof window.tf.tensor2d === 'function') {
      try {
        const probs = window.tf.tidy(() => {
          const x = window.tf.tensor2d([normFeatures], [1, 16]);
          const w1 = window.tf.tensor2d(modelData.fc1_weight);
          const b1 = window.tf.tensor1d(modelData.fc1_bias);
          const h1 = window.tf.relu(window.tf.add(window.tf.matMul(x, w1), b1));

          const w2 = window.tf.tensor2d(modelData.fc2_weight);
          const b2 = window.tf.tensor1d(modelData.fc2_bias);
          const h2 = window.tf.relu(window.tf.add(window.tf.matMul(h1, w2), b2));

          const w3 = window.tf.tensor2d(modelData.fc3_weight);
          const b3 = window.tf.tensor1d(modelData.fc3_bias);
          const logits = window.tf.add(window.tf.matMul(h2, w3), b3);
          return window.tf.softmax(logits).dataSync();
        });
        probFresh = probs[0];
        probSpoiled = probs[1];
        backend = 'TensorFlow.js (WebGL / WASM)';
      } catch (tfErr) {
        console.warn('[FreshCheck ML] TensorFlow.js forward pass fallback:', tfErr);
      }
    }

    // 2. High-precision vector dot-product engine fallback
    if (backend === 'Neural Tensor Engine') {
      function matMul(w, v) {
        const out = new Float32Array(w[0].length);
        for (let j = 0; j < w[0].length; j++) {
          let s = 0;
          for (let i = 0; i < v.length; i++) s += v[i] * w[i][j];
          out[j] = s;
        }
        return out;
      }
      function add(v, b) {
        const out = new Float32Array(v.length);
        for (let i = 0; i < v.length; i++) out[i] = v[i] + b[i];
        return out;
      }
      function relu(v) {
        const out = new Float32Array(v.length);
        for (let i = 0; i < v.length; i++) out[i] = Math.max(0, v[i]);
        return out;
      }
      function softmax(v) {
        const maxV = Math.max(...v);
        const exps = v.map(x => Math.exp(x - maxV));
        const sumE = exps.reduce((a, b) => a + b, 0);
        return exps.map(x => x / sumE);
      }

      const z1 = add(matMul(modelData.fc1_weight, normFeatures), modelData.fc1_bias);
      const a1 = relu(z1);
      const z2 = add(matMul(modelData.fc2_weight, a1), modelData.fc2_bias);
      const a2 = relu(z2);
      const z3 = add(matMul(modelData.fc3_weight, a2), modelData.fc3_bias);
      const probs = softmax(z3);

      probFresh = probs[0];
      probSpoiled = probs[1];
    }

    const confidence = Math.max(probFresh, probSpoiled);
    const uncertaintyThreshold = 0.70;

    let decision;
    if (confidence < uncertaintyThreshold) {
      decision = 'unable';
    } else if (probSpoiled >= 0.50) {
      decision = 'spoilage';
    } else {
      decision = 'fresh';
    }

    return {
      decision,
      probFresh,
      probSpoiled,
      confidence,
      backend,
      modelName: modelData.metadata?.model_name || 'FreshCheck Spoilage Neural Network',
      framework: modelData.metadata?.framework || 'TensorFlow.js'
    };
  }

  // =========================================================================
  // 10B. SPATIAL PATCH ML SPOILAGE SEGMENTOR (LOCALIZED DEFECT DETECTION)
  // =========================================================================
  
  /**
   * Spatial Patch Neural Spoilage Segmentor:
   * 1. Evaluates localized sliding spatial patches across the produce surface.
   * 2. Detects concentrated brown necrotic patches, soft rot decay, bruises, and fungal mold.
   * 3. Distinguishes natural lenticels, freckles, ripening blush, and specular highlights.
   * 4. Synthesizes a high-resolution 2D defect probability mask.
   * 5. Draws the exact spoiled regions directly onto defectMaskCanvas (crimson-orange overlay).
   * 6. Computes bounding boxes of damage regions to ensure ANY significant localized rot
   *    classifies the fruit as POSSIBLE SPOILAGE, even if 95% of the skin looks healthy.
   */
  function runMLPatchDefectSegmentation(pixels, isProducePixel, canvasW, canvasH, produceKey, maskCtx, maskImageData) {
    const patchModel = window.FRESHCHECK_PATCH_MODEL;
    if (!patchModel) {
      console.warn('[FreshCheck ML] Patch model weights not found on window.FRESHCHECK_PATCH_MODEL.');
      return null;
    }

    // 1. Compute median produce luminance, dominant hue, and body chromaticity
    const prodLums = [];
    const prodHues = [];
    const prodSats = [];
    let prodPixelCount = 0;
    let prodRSum = 0, prodGSum = 0, prodBSum = 0;
    let chromaR = 0, chromaG = 0, chromaB = 0;
    const isDarkVeg = ['brinjal', 'spinach', 'okra', 'bittergourd'].includes(produceKey);

    for (let p = 0; p < canvasW * canvasH; p++) {
      if (!isProducePixel[p]) continue;
      prodPixelCount++;
      const i = p * 4;
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      prodRSum += r; prodGSum += g; prodBSum += b;
      const hsl = rgbToHsl(r, g, b);
      prodLums.push(hsl.l / 100.0);
      prodHues.push(hsl.h / 360.0);
      prodSats.push(hsl.s / 100.0);
      if (hsl.l >= 28 || isDarkVeg) {
        chromaR += r; chromaG += g; chromaB += b;
      }
    }

    if (prodPixelCount === 0) return null;

    prodLums.sort((a, b) => a - b);
    prodHues.sort((a, b) => a - b);
    prodSats.sort((a, b) => a - b);
    const prodMedianLum = prodLums[Math.floor(prodLums.length / 2)] || 0.45;
    const prodDominantHue = prodHues[Math.floor(prodHues.length / 2)] || 0.15;
    const prodMedianSat = prodSats[Math.floor(prodSats.length / 2)] || 0.35;
    const chromaTot = Math.max(1, chromaR + chromaG + chromaB);
    const prodBodyChroma = [chromaR / chromaTot, chromaG / chromaTot, chromaB / chromaTot];

    // Form shadow is ONLY valid if the produce body itself is healthy and vibrant!
    // If the produce is overall dark or dull (like a rotten blackened banana),
    // dark areas are NOT shadows—they are real necrotic decay!
    const isProduceBodyHealthy = isDarkVeg
      ? (prodMedianLum >= 0.12 && prodMedianSat >= 0.10)
      : (prodMedianLum >= 0.25 && prodMedianSat >= 0.16);

    // Distinguish produce that is naturally green (e.g. cucumber, okra, green capsicum, cabbage, spinach)
    const isNaturallyGreen = (prodDominantHue >= (70 / 360) && prodDominantHue <= (165 / 360)) ||
                             ['cucumber', 'okra', 'spinach', 'bittergourd', 'bottlegourd', 'cabbage'].includes(produceKey);

    const pw = 16, ph = 16;
    const stride = 6;
    const heatmap = new Float32Array(canvasW * canvasH);
    const counts = new Uint8Array(canvasW * canvasH);

    const featMean = patchModel.feature_mean;
    const featStd = patchModel.feature_std;
    const w1 = patchModel.fc1_weight;
    const b1 = patchModel.fc1_bias;
    const w2 = patchModel.fc2_weight;
    const b2 = patchModel.fc2_bias;
    const w3 = patchModel.fc3_weight;
    const b3 = patchModel.fc3_bias;

    function matMul(w, v) {
      const out = new Float32Array(w[0].length);
      for (let j = 0; j < w[0].length; j++) {
        let s = 0;
        for (let i = 0; i < v.length; i++) s += v[i] * w[i][j];
        out[j] = s;
      }
      return out;
    }
    function add(v, b) {
      const out = new Float32Array(v.length);
      for (let i = 0; i < v.length; i++) out[i] = v[i] + b[i];
      return out;
    }
    function relu(v) {
      const out = new Float32Array(v.length);
      for (let i = 0; i < v.length; i++) out[i] = Math.max(0, v[i]);
      return out;
    }
    function softmax(v) {
      const maxV = Math.max(...v);
      const exps = v.map(x => Math.exp(x - maxV));
      const sumE = exps.reduce((a, b) => a + b, 0);
      return exps.map(x => x / sumE);
    }

    // Produce Family Index (7 botanical produce groups)
    const produceFamilyMap = {
      apple: 0, banana: 1, orange: 2, sweetlime: 2, lemon: 2,
      mango: 3, papaya: 3, guava: 3, pineapple: 3, sapota: 3,
      tomato: 4, potato: 4, brinjal: 4, capsicum: 4,
      cucumber: 5, watermelon: 5, muskmelon: 5, bottlegourd: 5, bittergourd: 5,
      okra: 6, cabbage: 6, cauliflower: 6, onion: 6, carrot: 6, spinach: 6, pomegranate: 0
    };
    const famIdx = (produceFamilyMap[produceKey] !== undefined ? produceFamilyMap[produceKey] : 0) / 6.0;

    const maxRadius = Math.hypot(canvasW, canvasH) * 0.48;
    const cx = canvasW / 2.0;
    const cy = canvasH / 2.0;

    for (let y = 0; y <= canvasH - ph; y += stride) {
      for (let x = 0; x <= canvasW - pw; x += stride) {
        let validCount = 0;
        let sumH = 0, sumS = 0, sumL = 0;
        let blackCnt = 0, brownCnt = 0, moldCnt = 0, greenMoldCnt = 0;
        let formShadowCnt = 0, naturalSpeckleCnt = 0, chromaDistSum = 0;

        // Local patch luminance variance (texture roughness)
        let patchLumSum = 0;
        const patchLums = [];

        for (let dy = 0; dy < ph; dy++) {
          const rowOffset = (y + dy) * canvasW;
          for (let dx = 0; dx < pw; dx++) {
            const p = rowOffset + (x + dx);
            if (!isProducePixel[p]) continue;
            validCount++;

            const i = p * 4;
            const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
            const hsl = rgbToHsl(r, g, b);

            sumH += hsl.h;
            sumS += hsl.s;
            sumL += hsl.l;
            patchLumSum += hsl.l;
            patchLums.push(hsl.l);

            // Normalized chromaticity
            const totP = Math.max(1, r + g + b);
            const cR = r / totP, cG = g / totP, cB = b / totP;
            const chromaDist = Math.hypot(cR - prodBodyChroma[0], cG - prodBodyChroma[1], cB - prodBodyChroma[2]);
            chromaDistSum += chromaDist;

            // Shadow vs. Rot Discrimination:
            // A dark pixel is a normal form shadow ONLY if the produce body is healthy and vibrant,
            // and the pixel's chromaticity matches the healthy fruit body!
            const isFormShadow = isProduceBodyHealthy && (hsl.l < 26) && (chromaDist < 0.10);
            if (isFormShadow) formShadowCnt++;

            // True Black Rot: dark, deviates from body color or has necrotic breakdown
            let isBlack = (hsl.l < 16) && !isFormShadow;

            // Brown Rot vs. Natural Sugar Spots / Tan Skin / Blush:
            let isBrown = (hsl.h >= 10 && hsl.h <= 48 && hsl.l <= 42 && hsl.s >= 10 && r < 1.25 * Math.max(1, g));
            let isNaturalMark = false;

            if (produceKey === 'banana') {
              isNaturalMark = (hsl.h >= 18 && hsl.h <= 50) && (hsl.s >= 10) && (hsl.l >= 28 && hsl.l <= 60) && (r >= g * 1.02);
              const isStemCap = (hsl.l < 26 && (hsl.h >= 18 && hsl.h <= 45) && (dy < 3 || dy > 12));
              if (isStemCap) isNaturalMark = true;
              isBlack = (hsl.l < 18) && !isStemCap;
              isBrown = (hsl.l <= 27 && (hsl.h < 35 || r > 1.20 * Math.max(1, g))) && !isNaturalMark;
            } else if (produceKey === 'apple') {
              isNaturalMark = (r >= 1.12 * Math.max(1, g)) || ((hsl.h >= 20 && hsl.h <= 55) && (hsl.s <= 45) && (hsl.l >= 38 && hsl.l <= 80));
              isBrown = isBrown && (r < 1.10 * Math.max(1, g)) && !isFormShadow && !isNaturalMark;
            } else if (produceKey === 'tomato') {
              isNaturalMark = (r >= 1.10 * Math.max(1, g)) && (hsl.s >= 25);
              isBrown = isBrown && (r < 1.08 * Math.max(1, g)) && !isFormShadow && !isNaturalMark;
            } else if (produceKey === 'orange') {
              isNaturalMark = (r >= 1.35 * Math.max(1, g));
              isBrown = isBrown && !isNaturalMark && !isFormShadow;
            } else if (produceKey === 'potato') {
              isNaturalMark = (hsl.l >= 18 && hsl.s <= 28);
              isBrown = isBrown && !isNaturalMark && (hsl.l < 18) && (hsl.s > 28);
            }

            if (isNaturalMark) naturalSpeckleCnt++;

            // Green calyx/stem on tomato, brinjal, strawberry is natural fresh anatomy, not green mold
            const isGreenCalyx = (produceKey === 'tomato' || produceKey === 'brinjal' || produceKey === 'strawberry') && (hsl.h >= 60 && hsl.h <= 170);
            const isMold = (hsl.s <= 14 && hsl.l >= 42 && hsl.l <= 86);
            const isGreenMold = (!isNaturallyGreen) && !isGreenCalyx && (hsl.h >= 75 && hsl.h <= 185 && hsl.s >= 15 && hsl.l <= 65);

            if (isBlack) blackCnt++;
            if (isBrown) brownCnt++;
            if (isMold) moldCnt++;
            if (isGreenMold) greenMoldCnt++;
          }
        }

        if (validCount < (pw * ph * 0.30)) continue;

        // Texture roughness inside patch
        const patchMeanLum = patchLumSum / validCount;
        let patchLumVar = 0;
        for (let k = 0; k < patchLums.length; k++) {
          const diff = patchLums[k] - patchMeanLum;
          patchLumVar += diff * diff;
        }
        const edgeRoughness = Math.min(1.0, (patchLumVar / validCount) / 400.0);

        const meanH = (sumH / validCount) / 360.0;
        const meanS = (sumS / validCount) / 100.0;
        const meanL = (sumL / validCount) / 100.0;
        const contrastLum = Math.abs(meanL - prodMedianLum);
        const contrastHue = Math.abs(meanH - prodDominantHue);
        const meanChromaDist = chromaDistSum / validCount;

        const blackRatio = blackCnt / validCount;
        const brownRatio = brownCnt / validCount;
        const moldRatio = moldCnt / validCount;
        const greenMoldRatio = greenMoldCnt / validCount;
        const naturalSpeckleRatio = naturalSpeckleCnt / validCount;
        const formShadowScore = formShadowCnt / validCount;

        const distCenter = Math.min(1.0, Math.hypot((x + pw/2) - cx, (y + ph/2) - cy) / maxRadius);

        // 15 features matching ProducePatchSegmentorNet
        const rawFeat = [
          meanH, meanS, meanL, contrastLum, contrastHue,
          meanChromaDist, brownRatio, blackRatio, moldRatio, greenMoldRatio,
          naturalSpeckleRatio, edgeRoughness, formShadowScore, distCenter, famIdx
        ];

        // Normalize
        const norm = new Float32Array(15);
        for (let k = 0; k < 15; k++) {
          norm[k] = (rawFeat[k] - featMean[k]) / featStd[k];
        }

        // Forward pass
        const z1 = add(matMul(w1, norm), b1);
        const a1 = relu(z1);
        const z2 = add(matMul(w2, a1), b2);
        const a2 = relu(z2);
        const z3 = add(matMul(w3, a2), b3);
        const probs = softmax(z3);
        const pDefect = probs[1];

        // Accumulate into heatmap
        for (let dy = 0; dy < ph; dy++) {
          const rowOffset = (y + dy) * canvasW;
          for (let dx = 0; dx < pw; dx++) {
            const p = rowOffset + (x + dx);
            if (isProducePixel[p]) {
              heatmap[p] += pDefect;
              counts[p]++;
            }
          }
        }
      }
    }

    // Binary defect mask: threshold raised to 0.68 so natural patch variations
    // (shadows, lenticels, texture) do not get flagged as spoilage.
    const rawDefectMap = new Uint8Array(canvasW * canvasH);
    for (let p = 0; p < canvasW * canvasH; p++) {
      if (!isProducePixel[p] || counts[p] === 0) continue;
      const prob = heatmap[p] / counts[p];
      if (prob >= 0.68) rawDefectMap[p] = 1;
    }

    // Spatial Connected Neighborhood Filtering:
    // Filter out tiny isolated speckles (< 100 px) representing natural pores, lenticels, or sugar spots.
    // Minimum neighbor count raised to 8 to require a denser, clearly contiguous rot patch.
    let defectPixelCount = 0;
    let minX = canvasW, minY = canvasH, maxX = 0, maxY = 0;
    const maskData = maskImageData.data;

    for (let y = 1; y < canvasH - 1; y++) {
      for (let x = 1; x < canvasW - 1; x++) {
        const p = y * canvasW + x;
        if (!rawDefectMap[p]) continue;

        // Count neighbors in 5x5 window
        let clusterNeighbors = 0;
        for (let dy = -2; dy <= 2; dy++) {
          const ny = y + dy;
          if (ny < 0 || ny >= canvasH) continue;
          const rowOffset = ny * canvasW;
          for (let dx = -2; dx <= 2; dx++) {
            const nx = x + dx;
            if (nx < 0 || nx >= canvasW) continue;
            if (rawDefectMap[rowOffset + nx]) clusterNeighbors++;
          }
        }

        // A defect pixel must be part of a real localized cluster (at least 8 neighbors in 5x5 window)
        if (clusterNeighbors >= 8) {
          defectPixelCount++;
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;

          // Vibrant semi-transparent crimson-orange defect overlay
          const i = p * 4;
          maskData[i] = 235;     // R
          maskData[i + 1] = 35;  // G
          maskData[i + 2] = 65;  // B
          maskData[i + 3] = 215; // Alpha
        }
      }
    }

    const defectRatio = (defectPixelCount / Math.max(1, prodPixelCount)) * 100.0;
    // Spoilage Rule: Require a larger, clearly localized rot cluster (>= 500 px and >= 2.5%, or >= 3.0%)
    // Raised thresholds prevent natural imperfections (shadows, marks) from triggering false spoilage.
    const isSpoiled = (defectPixelCount >= 500 && defectRatio >= 2.5) || (defectRatio >= 3.0);

    const boundingBox = defectPixelCount > 0
      ? { minX, minY, maxX, maxY, width: (maxX - minX + 1), height: (maxY - minY + 1) }
      : null;

    if (maskCtx && maskImageData) {
      maskCtx.putImageData(maskImageData, 0, 0);

      // Requirement 3: Display the actual detected region with bounding box on the image
      if (isSpoiled && boundingBox && typeof maskCtx.strokeRect === 'function') {
        maskCtx.save();
        maskCtx.strokeStyle = '#ef4444';
        maskCtx.lineWidth = 2.5;
        if (typeof maskCtx.setLineDash === 'function') maskCtx.setLineDash([4, 3]);
        maskCtx.strokeRect(boundingBox.minX - 2, boundingBox.minY - 2, boundingBox.width + 4, boundingBox.height + 4);

        // Corner accents
        if (typeof maskCtx.setLineDash === 'function') maskCtx.setLineDash([]);
        maskCtx.strokeStyle = '#f59e0b';
        maskCtx.lineWidth = 3.5;
        const cLen = Math.min(12, Math.max(4, Math.min(boundingBox.width, boundingBox.height) / 3));

        maskCtx.beginPath();
        maskCtx.moveTo(boundingBox.minX - 2, boundingBox.minY - 2 + cLen);
        maskCtx.lineTo(boundingBox.minX - 2, boundingBox.minY - 2);
        maskCtx.lineTo(boundingBox.minX - 2 + cLen, boundingBox.minY - 2);
        maskCtx.stroke();

        maskCtx.beginPath();
        maskCtx.moveTo(boundingBox.maxX + 2 - cLen, boundingBox.minY - 2);
        maskCtx.lineTo(boundingBox.maxX + 2, boundingBox.minY - 2);
        maskCtx.lineTo(boundingBox.maxX + 2, boundingBox.minY - 2 + cLen);
        maskCtx.stroke();

        maskCtx.beginPath();
        maskCtx.moveTo(boundingBox.minX - 2, boundingBox.maxY + 2 - cLen);
        maskCtx.lineTo(boundingBox.minX - 2, boundingBox.maxY + 2);
        maskCtx.lineTo(boundingBox.minX - 2 + cLen, boundingBox.maxY + 2);
        maskCtx.stroke();

        maskCtx.beginPath();
        maskCtx.moveTo(boundingBox.maxX + 2 - cLen, boundingBox.maxY + 2);
        maskCtx.lineTo(boundingBox.maxX + 2, boundingBox.maxY + 2);
        maskCtx.lineTo(boundingBox.maxX + 2, boundingBox.maxY + 2 - cLen);
        maskCtx.stroke();

        // Label pill
        const pillText = `⚠ Defect: ${defectRatio.toFixed(1)}%`;
        maskCtx.font = 'bold 11px system-ui, sans-serif';
        const txtWidth = (maskCtx.measureText && maskCtx.measureText(pillText)) ? maskCtx.measureText(pillText).width : 65;
        const pillX = Math.max(4, Math.min(canvasW - txtWidth - 12, boundingBox.minX - 2));
        const pillY = Math.max(16, boundingBox.minY - 6);
        maskCtx.fillStyle = 'rgba(239, 68, 68, 0.90)';
        maskCtx.fillRect(pillX - 2, pillY - 12, txtWidth + 10, 16);
        maskCtx.fillStyle = '#ffffff';
        maskCtx.fillText(pillText, pillX + 3, pillY);
        maskCtx.restore();
      }
    }

    return {
      isSpoiled,
      defectPixelCount,
      defectRatio,
      boundingBox,
      backend: 'Neural Spatial Patch Segmentor',
      modelName: patchModel.model_name || 'FreshCheck Shadow-Invariant Spatial Patch Spoilage Segmentor'
    };
  }

  // =========================================================================
  // 10. REVISED & CORRECTED IMAGE PROCESSING ENGINE (HTML5 CANVAS 2D)
  // =========================================================================
  
  /**
   * Corrected Computer Vision Pipeline:
   * 1. Standardizes resolution (max 350px).
   * 2. Edge Gradient Blur Check (flags blurry photos as "Unable to Determine").
   * 3. Intelligent Background Isolation:
   *    - Samples the 10% outer border perimeter.
   *    - Excludes background tables, desks, plates, and tablecloths from defect counts.
   *    - If produce cannot be isolated from background, returns "Unable to Determine".
   * 4. Produce-Specific Healthy Color Spectrum:
   *    - Natural banana ripening sugar spots are recognized as healthy.
   *    - Natural mango multi-color gradients (green, yellow, red, orange) are recognized as healthy.
   *    - Natural red apple skin, shading, and blush are recognized as healthy.
   *    - Natural potato tan/brown skin is recognized as healthy (only green solanine is flagged).
   * 5. Contiguous Anomaly Clustering:
   *    - Only localized contiguous lesion clusters are treated as defects (not individual noise pixels).
   * 6. Three exact outcome categories:
   *    - Appears Fresh
   *    - Possible Spoilage
   *    - Unable to Determine
   * 7. Real-time Canvas Color Distribution Histogram.
   */
  function performCanvasImageAnalysis(img, produceKey) {
    if (!img) {
      renderUnableOutcome('No Image Provided', 'Please select or upload an image before starting analysis.');
      return { decision: 'unable', surfaceDiscolorationIndex: 0, visualUniformityRating: 0, clusteredDefectCount: 0 };
    }

    const targetDim = 350;
    let w = img.naturalWidth || img.width || 0;
    let h = img.naturalHeight || img.height || 0;

    if (w <= 0 || h <= 0) {
      renderUnableOutcome('Invalid Image Dimensions', 'The loaded image has invalid or zero dimensions. Please try another image.');
      return { decision: 'unable', surfaceDiscolorationIndex: 0, visualUniformityRating: 0, clusteredDefectCount: 0 };
    }

    try {
      const scale = Math.min(targetDim / w, targetDim / h);
      const canvasW = Math.round(w * scale);
      const canvasH = Math.round(h * scale);

      analysisCanvas.width = canvasW;
      analysisCanvas.height = canvasH;
      defectMaskCanvas.width = canvasW;
      defectMaskCanvas.height = canvasH;

      // Draw source image onto canvas
      displayCtx.clearRect(0, 0, canvasW, canvasH);
      displayCtx.drawImage(img, 0, 0, canvasW, canvasH);

      maskCtx.clearRect(0, 0, canvasW, canvasH);
      const maskImageData = maskCtx.createImageData(canvasW, canvasH);
      const maskData = maskImageData.data;

      let rawImage;
      try {
        // Requirement 6: Ensure canvas is origin-clean before reading pixels
        rawImage = displayCtx.getImageData(0, 0, canvasW, canvasH);
      } catch (secErr) {
        console.error('[FreshCheck SecurityError] Failed to execute getImageData on CanvasRenderingContext2D (canvas tainted):', secErr);
        renderUnableOutcome('CORS Security Block', 'The canvas context was tainted by cross-origin security restrictions. Please ensure the image is loaded from an origin-clean source or local web server.');
        return {
          decision: 'unable',
          isSecurityError: true,
          error: secErr.message || 'SecurityError: The canvas has been tainted by cross-origin data.',
          surfaceDiscolorationIndex: 0,
          visualUniformityRating: 0,
          clusteredDefectCount: 0
        };
      }
    const pixels = rawImage.data;
    const totalPixels = canvasW * canvasH;

    // -----------------------------------------------------------------------
    // STEP 1: Lighting & Clarity Pre-Checks
    // -----------------------------------------------------------------------
    let sumLuminance = 0;
    const lumArray = new Float32Array(totalPixels);

    for (let i = 0, p = 0; i < pixels.length; i += 4, p++) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const lum = 0.299 * r + 0.587 * g + 0.114 * b;
      lumArray[p] = lum;
      sumLuminance += lum;
    }

    const avgLuminance = sumLuminance / totalPixels;

    let varianceSum = 0;
    for (let p = 0; p < totalPixels; p++) {
      const diff = lumArray[p] - avgLuminance;
      varianceSum += diff * diff;
    }
    const stdDevLuminance = Math.sqrt(varianceSum / totalPixels);

    // Extreme lighting & heavy shadow checks
    if (avgLuminance < 20) {
      renderUnableOutcome('Image Too Dark', 'The scene appears severely underexposed or blacked out. Please take a clear photo under steady natural daylight.');
      return { decision: 'unable', surfaceDiscolorationIndex: 0, visualUniformityRating: 0, clusteredDefectCount: 0 };
    }

    if (avgLuminance > 246 && stdDevLuminance < 14) {
      renderUnableOutcome('Image Overexposed / Washed Out', 'The scene has excessive flash glare or white wash. Step back from harsh direct lighting and re-scan.');
      return { decision: 'unable', surfaceDiscolorationIndex: 0, visualUniformityRating: 0, clusteredDefectCount: 0 };
    }

    if (stdDevLuminance < 10) {
      renderUnableOutcome('No Distinct Produce Subject', 'The image is nearly uniform in tone with no recognizable fruit or vegetable detected.');
      return { decision: 'unable', surfaceDiscolorationIndex: 0, visualUniformityRating: 0, clusteredDefectCount: 0 };
    }

    // Heavy Shadows / Uneven Lighting Check (Requirement: detect and reject heavy shadows obscuring produce)
    let nonWhitePixels = 0;
    let heavyDarkPixels = 0;
    for (let i = 0, p = 0; i < pixels.length; i += 4, p++) {
      const r = pixels[i], g = pixels[i + 1], b = pixels[i + 2];
      if (!(r > 242 && g > 242 && b > 242)) {
        nonWhitePixels++;
        if (lumArray[p] < 26) heavyDarkPixels++;
      }
    }
    const nonWhiteRatio = nonWhitePixels / totalPixels;
    const heavyDarkOnSubjectRatio = nonWhitePixels > 0 ? (heavyDarkPixels / nonWhitePixels) : (heavyDarkPixels / totalPixels);
    const isDarkVegetable = ['okra', 'spinach', 'bittergourd', 'brinjal'].includes(produceKey);

    // Real-world photos often have natural 3D shading on curved produce surfaces.
    // Only reject when the image is unusably dark (>65% dark, not just 40%).
    if (!isDarkVegetable && heavyDarkOnSubjectRatio > 0.65 && nonWhiteRatio >= 0.08) {
      renderUnableOutcome('Heavy Shadows / Uneven Lighting', 'Strong shadow regions obscure more than 65% of the produce surface. Please capture the photo under uniform, balanced natural lighting.');
      return { decision: 'unable', surfaceDiscolorationIndex: 0, visualUniformityRating: 0, clusteredDefectCount: 0 };
    }

    // -----------------------------------------------------------------------
    // STEP 2: Blur / Edge Sharpness Check (Laplacian Variance)
    // -----------------------------------------------------------------------
    let laplacianSum = 0;
    let laplacianCount = 0;
    const laplacianValues = [];

    for (let y = 1; y < canvasH - 1; y += 2) {
      for (let x = 1; x < canvasW - 1; x += 2) {
        const idx = y * canvasW + x;
        // 4-neighbor discrete Laplacian
        const lap = Math.abs(
          lumArray[idx - 1] + lumArray[idx + 1] + lumArray[idx - canvasW] + lumArray[idx + canvasW] - 4 * lumArray[idx]
        );
        laplacianSum += lap;
        laplacianValues.push(lap);
        laplacianCount++;
      }
    }

    const meanLaplacian = laplacianCount > 0 ? (laplacianSum / laplacianCount) : 0;
    let laplacianVariance = 0;
    for (let i = 0; i < laplacianValues.length; i++) {
      const diff = laplacianValues[i] - meanLaplacian;
      laplacianVariance += diff * diff;
    }
    laplacianVariance = laplacianCount > 0 ? (laplacianVariance / laplacianCount) : 0;

    // A sharp image with normal edges and texture has laplacianVariance > 25.
    // Extremely blurry, out-of-focus, or motion-smeared images have laplacianVariance < 5.0.
    if (laplacianVariance < 5.0 && stdDevLuminance > 14) {
      renderUnableOutcome('Blurry Image Detected', 'The image appears blurry or out of focus. Surface details cannot be evaluated reliably. Please capture a sharp photo.');
      return { decision: 'unable', surfaceDiscolorationIndex: 0, visualUniformityRating: 0, clusteredDefectCount: 0 };
    }

    // -----------------------------------------------------------------------
    // STEP 3: Background Profiling & Intelligent Segmentation
    // -----------------------------------------------------------------------
    // 1. Profile background from perimeter corners and edges (outer 7%)
    const marginX = Math.round(canvasW * 0.07);
    const marginY = Math.round(canvasH * 0.07);
    const borderSamples = [];

    for (let x = 0; x < canvasW; x += 3) {
      for (let y = 0; y < marginY; y += 3) {
        const iTop = (y * canvasW + x) * 4;
        borderSamples.push({ r: pixels[iTop], g: pixels[iTop + 1], b: pixels[iTop + 2] });
        const iBot = ((canvasH - 1 - y) * canvasW + x) * 4;
        borderSamples.push({ r: pixels[iBot], g: pixels[iBot + 1], b: pixels[iBot + 2] });
      }
    }
    for (let y = marginY; y < canvasH - marginY; y += 3) {
      for (let x = 0; x < marginX; x += 3) {
        const iLeft = (y * canvasW + x) * 4;
        borderSamples.push({ r: pixels[iLeft], g: pixels[iLeft + 1], b: pixels[iLeft + 2] });
        const iRight = (y * canvasW + (canvasW - 1 - x)) * 4;
        borderSamples.push({ r: pixels[iRight], g: pixels[iRight + 1], b: pixels[iRight + 2] });
      }
    }

    let bgR = 0, bgG = 0, bgB = 0;
    for (let i = 0; i < borderSamples.length; i++) {
      bgR += borderSamples[i].r;
      bgG += borderSamples[i].g;
      bgB += borderSamples[i].b;
    }
    const sampleCount = Math.max(1, borderSamples.length);
    bgR /= sampleCount; bgG /= sampleCount; bgB /= sampleCount;

    let varBg = 0;
    for (let i = 0; i < borderSamples.length; i++) {
      varBg += Math.pow(borderSamples[i].r - bgR, 2) + Math.pow(borderSamples[i].g - bgG, 2) + Math.pow(borderSamples[i].b - bgB, 2);
    }
    const stdBg = Math.sqrt(varBg / sampleCount);

    // 2. Profile core central area to detect if produce fills the entire frame
    const centerX = canvasW / 2;
    const centerY = canvasH / 2;
    let centerR = 0, centerG = 0, centerB = 0, centerCount = 0;
    const centerRadius = Math.min(canvasW, canvasH) * 0.20;

    for (let y = Math.round(centerY - centerRadius); y <= Math.round(centerY + centerRadius); y += 3) {
      for (let x = Math.round(centerX - centerRadius); x <= Math.round(centerX + centerRadius); x += 3) {
        if (Math.hypot(x - centerX, y - centerY) <= centerRadius) {
          const i = (y * canvasW + x) * 4;
          centerR += pixels[i]; centerG += pixels[i + 1]; centerB += pixels[i + 2];
          centerCount++;
        }
      }
    }
    centerR /= Math.max(1, centerCount);
    centerG /= Math.max(1, centerCount);
    centerB /= Math.max(1, centerCount);

    const centerBorderDist = Math.hypot(centerR - bgR, centerG - bgG, centerB - bgB);
    const produceFillsFrame = (centerBorderDist < 25);

    // 3. Robust Produce Segmentation from Background (Eliminates table/plate/shadow contamination)
    const isProducePixel = new Uint8Array(totalPixels);
    let producePixelCount = 0;
    let sumProduceSat = 0;
    const maxProduceRadius = Math.hypot(canvasW, canvasH) * 0.48;

    for (let y = 0; y < canvasH; y++) {
      for (let x = 0; x < canvasW; x++) {
        const p = y * canvasW + x;
        const i = p * 4;
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const hsl = rgbToHsl(r, g, b);
        const distFromCenter = Math.hypot(x - centerX, y - centerY);

        // A. Pure white / plain bright background
        if (r > 240 && g > 240 && b > 240) continue;
        // B. Pure black edge
        if (r < 10 && g < 10 && b < 10) continue;
        // C. Achromatic neutral background (grey/tan/beige/off-white tabletop, plate, paper)
        if (produceKey !== 'cauliflower' && Math.abs(r - g) <= 18 && Math.abs(g - b) <= 18 && hsl.s <= 20 && hsl.l >= 38) continue;
        // D. Neutral drop shadow on tabletop (distinguish table shadow on perimeter from actual fruit)
        const isOuterDropShadow = (distFromCenter > maxProduceRadius * 0.55) && (Math.abs(r - g) <= 16 && Math.abs(g - b) <= 16 && hsl.s <= 24 && hsl.l < 42 && hsl.l >= 10);
        if (isOuterDropShadow) continue;
        // E. Direct chromatic distance match with border background profile
        const colorDiffBg = Math.hypot(r - bgR, g - bgG, b - bgB);
        if (colorDiffBg < 65 && hsl.s <= 22 && distFromCenter > maxProduceRadius * 0.58) continue;

        if (distFromCenter <= maxProduceRadius) {
          isProducePixel[p] = 1;
          producePixelCount++;
          sumProduceSat += hsl.s;
        }
      }
    }

    // Validate produce separation (slender vegetables like okra, chilli have smaller relative footprint)
    const produceAreaRatio = producePixelCount / totalPixels;
    const minProduceAreaRatio = (produceKey === 'okra' || produceKey === 'chilli') ? 0.025 : 0.045;
    if (produceAreaRatio < minProduceAreaRatio) {
      renderUnableOutcome('Subject Cannot Be Separated', 'The produce could not be reliably isolated from the background surface. Please use the "Crop Produce" tool to focus on the fruit.');
      return { decision: 'unable', surfaceDiscolorationIndex: 0, visualUniformityRating: 0, clusteredDefectCount: 0 };
    }

    // -----------------------------------------------------------------------
    // STEP 4: Produce-Specific Adaptive Anomaly Detection (14 Produce Rules)
    // -----------------------------------------------------------------------
    const anomalyMap = new Uint8Array(totalPixels);
    let rawDefectCount = 0;

    // Compute produce body chromaticity profile for shadow vs. rot discrimination
    let prodRSum = 0, prodGSum = 0, prodBSum = 0;
    for (let p = 0; p < totalPixels; p++) {
      if (!isProducePixel[p]) continue;
      const i = p * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const hsl = rgbToHsl(r, g, b);
      if (hsl.l >= 28 || isDarkVegetable) {
        prodRSum += r; prodGSum += g; prodBSum += b;
      }
    }
    const prodTotRGB = Math.max(1, prodRSum + prodGSum + prodBSum);
    const prodBodyChroma = [prodRSum / prodTotRGB, prodGSum / prodTotRGB, prodBSum / prodTotRGB];

    for (let p = 0; p < totalPixels; p++) {
      if (!isProducePixel[p]) continue;

      const px_x = p % canvasW;
      const px_y = Math.floor(p / canvasW);

      const i = p * 4;
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];
      const lum = lumArray[p];
      const hsl = rgbToHsl(r, g, b);
      const h = hsl.h;
      const s = hsl.s;
      const l = hsl.l;

      // Normalized chromaticity of the pixel
      const totP = Math.max(1, r + g + b);
      const cR = r / totP, cG = g / totP, cB = b / totP;
      const chromaDist = Math.hypot(cR - prodBodyChroma[0], cG - prodBodyChroma[1], cB - prodBodyChroma[2]);

      // Distinguish form shadows from spoilage:
      // A dark pixel is a normal form shadow if its chromaticity matches the fruit body!
      // Real photos of curved produce have extensive form-shadows; use a more generous threshold.
      const isFormShadow = (l < 30) && (chromaDist < 0.16);

      let isDefect = false;

      // Global specular highlight / gloss reflection guard across all produce
      if (l >= 82 && s <= 30) {
        continue;
      }

      switch (produceKey) {
        // -----------------------------------------------------------------
        // 1. APPLE
        // -----------------------------------------------------------------
        case 'apple': {
          // Healthy red apple: lively red dominance (R >= 1.10 * G, R >= 1.15 * B, L >= 10%)
          const isHealthyRed = ((h <= 30 || h >= 330) && (r >= 1.10 * Math.max(1, g)) && (r >= 1.15 * Math.max(1, b)) && s >= 14 && l >= 10);
          // Shaded red skin (ambient shadow preserving red chromaticity):
          const isShadedRed = isFormShadow && (r >= 1.04 * Math.max(1, g));
          // Healthy green (stem leaf, Granny Smith, green cheek):
          const isHealthyGreen = (h >= 55 && h <= 165 && s >= 10 && l >= 8 && l <= 90);
          // Healthy yellow (Golden Delicious, yellow undertones):
          const isHealthyYellow = (h >= 28 && h <= 65 && s >= 14 && l >= 18 && l <= 90 && r >= g * 0.85);
          // Gala / Honeycrisp warm blush (transition):
          const isGalaBlush = (h >= 15 && h <= 42 && s >= 16 && l >= 18 && r >= 1.08 * Math.max(1, g));
          // Natural lenticels (harmless speckles) — wider range for real photos:
          const isLenticel = (h >= 15 && h <= 60 && s <= 55 && l >= 32 && l <= 85 && (r >= g * 1.00));
          // Natural woody stem cap / calyx well depression:
          const isNaturalStem = (px_y < canvasH * 0.48 || px_y > canvasH * 0.72) && (l < 32 && (r >= g * 1.00));

          if (isHealthyRed || isShadedRed || isHealthyGreen || isHealthyYellow || isGalaBlush || isLenticel || isNaturalStem) {
            break;
          }

          // Suspicious visible defects:
          // Black necrotic rot / Alternaria lesions (must NOT be a normal shadow):
          const isBlackRot = (l < 17 && !isFormShadow && (chromaDist >= 0.10 || (r - g) < 10));
          // Soft brown rot decay (sunken muddy brown tissue):
          const isBrownDecay = (h >= 10 && h <= 48 && l >= 10 && l <= 42 && !isFormShadow && (r < 1.15 * Math.max(1, g)));
          // Dull contusion bruise:
          const isDullBruise = ((h <= 28 || h >= 330) && l >= 10 && l <= 26 && !isFormShadow && r < 1.12 * Math.max(1, g));
          // Fungal mold:
          const isMold = (s <= 16 && l >= 28 && l <= 85) || (h >= 140 && h <= 215 && s >= 12 && l >= 15 && l <= 70);

          isDefect = isBlackRot || isBrownDecay || isDullBruise || isMold;
          break;
        }

        case 'banana': {
          // Healthy ripe yellow and warm golden hues
          const isRipeYellow = (h >= 24 && h <= 72) && s >= 12 && l >= 20;
          const isGreenTip = (h >= 65 && h <= 135) && s >= 10 && l >= 16;
          // Shaded peel — bananas are curved so form-shadows are very common:
          const isShadedPeel = isFormShadow && (h >= 18 && h <= 72);
          // Natural shadow on curved peel body (even without full chromaDist match):
          const isCurvedShadow = (l < 30) && (h >= 18 && h <= 72) && (s >= 8);
          // Natural sugar freckles / small harmless speckles (isolated, light tan/brown dots with l >= 25):
          const isSugarSpeckle = (h >= 16 && h <= 54) && s >= 8 && l >= 25 && l <= 62 && (r >= g * 1.00);
          // Cut woody stem cap on fresh banana:
          const isStemCap = (l < 28 && (h >= 16 && h <= 48) && (px_y < canvasH * 0.30 || px_y > canvasH * 0.70));

          if (isRipeYellow || isGreenTip || isShadedPeel || isCurvedShadow || isSugarSpeckle || isStemCap) break;

          // Banana rot defects — only when clearly NOT a natural shadow or sugar mark:
          const isBlackRot = (l < 15) && !isCurvedShadow;
          const isCrownFungus = (s <= 10 && l >= 55 && l <= 90) || (h >= 130 && h <= 210 && s >= 12 && l >= 20 && l <= 65);
          const isDarkDecay = (l <= 24 && (h < 30 || r > 1.22 * Math.max(1, g))) && !isCurvedShadow;
          isDefect = isBlackRot || isCrownFungus || isDarkDecay;
          break;
        }

        // -----------------------------------------------------------------
        // 3. MANGO
        // -----------------------------------------------------------------
        case 'mango': {
          const isGreen = (h >= 62 && h <= 155) && s >= 12 && l >= 14;
          const isYellowOrange = (h >= 18 && h <= 66) && s >= 18 && l >= 18;
          const isRedBlush = (h >= 335 || h <= 22) && s >= 20 && l >= 16;
          const isGoldenTan = (h >= 20 && h <= 48) && s >= 20 && l >= 22;
          const isShadedMango = isFormShadow;

          if (isGreen || isYellowOrange || isRedBlush || isGoldenTan || isShadedMango) break;

          const isAnthracnose = (l < 17 && !isFormShadow && chromaDist >= 0.08);
          const isMold = (s < 16 && l > 48 && l < 85);
          const isBrownDecay = (h >= 10 && h <= 46) && (s >= 10 && s <= 60) && (l >= 10 && l <= 35) && !isFormShadow;
          isDefect = isAnthracnose || isMold || isBrownDecay;
          break;
        }

        // -----------------------------------------------------------------
        // 4. POTATO
        // -----------------------------------------------------------------
        case 'potato': {
          const isNormalTanSkin = (h >= 16 && h <= 55) && s >= 8 && s <= 68 && l >= 18 && l <= 78;
          const isNormalEye = (h >= 16 && h <= 52) && l >= 14 && l <= 28;
          const isShadedPotato = isFormShadow;
          if (isNormalTanSkin || isNormalEye || isShadedPotato) break;

          const isGreenSolanine = (h >= 65 && h <= 155) && s >= 18 && l >= 20;
          const isBlackRot = (l < 15 && !isFormShadow);
          const isMold = (s < 16 && l > 55 && l < 88);
          const isSunkenDecay = (h >= 12 && h <= 45) && l < 18 && s > 30 && !isFormShadow;
          isDefect = isGreenSolanine || isBlackRot || isMold || isSunkenDecay;
          break;
        }

        // -----------------------------------------------------------------
        // 5. ORANGE
        // -----------------------------------------------------------------
        case 'orange': {
          const isHealthyOrange = (h >= 14 && h <= 62) && s >= 22 && l >= 12;
          const isOilPore = (h >= 14 && h <= 60) && l >= 16 && l <= 40 && s >= 20;
          const isShadedOrange = isFormShadow;
          if (isHealthyOrange || isOilPore || isShadedOrange) break;

          const isGreenMold = (h >= 75 && h <= 200) && s >= 12 && l < 75;
          const isSunkenRot = (l < 14 && !isFormShadow);
          const isBrownRot = (h >= 10 && h <= 38) && l < 28 && !isFormShadow && (r < 1.35 * Math.max(1, g));
          isDefect = isGreenMold || isSunkenRot || isBrownRot;
          break;
        }

        // -----------------------------------------------------------------
        // 6. TOMATO
        // -----------------------------------------------------------------
        case 'tomato': {
          const isRed = (h >= 335 || h <= 28) && s >= 26 && l >= 18;
          const isOrange = (h >= 26 && h <= 58) && s >= 28 && l >= 20;
          const isGreenStem = (h >= 65 && h <= 155) && s >= 14;
          const isShadedTomato = isFormShadow;
          if (isRed || isOrange || isGreenStem || isShadedTomato) break;

          const isBlossomEndRot = (l < 16 && !isFormShadow);
          const isMold = (s < 18 && l > 48 && l < 88);
          const isBrownRot = (h >= 12 && h <= 45) && l >= 10 && l <= 32 && !isFormShadow;
          isDefect = isBlossomEndRot || isMold || isBrownRot;
          break;
        }

        // -----------------------------------------------------------------
        // 7. GRAPES
        // -----------------------------------------------------------------
        case 'grapes': {
          const isPurpleRed = (h >= 270 || h <= 20) && l >= 12 && s >= 14;
          const isGreenGrape = (h >= 65 && h <= 150) && l >= 20 && s >= 18;
          const isBloom = (s <= 22 && l >= 35 && l <= 75);
          const isShadedGrapes = isFormShadow;
          if (isPurpleRed || isGreenGrape || isBloom || isShadedGrapes) break;

          const isBotrytisGreyMold = (s <= 14 && l >= 45 && l <= 85);
          const isShriveledRot = (l < 14 && !isFormShadow);
          isDefect = isBotrytisGreyMold || isShriveledRot;
          break;
        }

        // -----------------------------------------------------------------
        // 8. PAPAYA
        // -----------------------------------------------------------------
        case 'papaya': {
          const isGoldenYellow = (h >= 32 && h <= 65) && s >= 30 && l >= 30;
          const isGreenBlush = (h >= 66 && h <= 125) && s >= 20 && l >= 22;
          const isShadedPapaya = isFormShadow;
          if (isGoldenYellow || isGreenBlush || isShadedPapaya) break;

          const isSunkenLesion = (h >= 12 && h <= 45) && l < 24 && !isFormShadow;
          const isWhiteMold = (s <= 15 && l > 55);
          isDefect = isSunkenLesion || isWhiteMold;
          break;
        }

        // -----------------------------------------------------------------
        // 9. GUAVA
        // -----------------------------------------------------------------
        case 'guava': {
          const isGreenYellow = (h >= 55 && h <= 140) && s >= 18 && l >= 25;
          const isShadedGuava = isFormShadow;
          if (isGreenYellow || isShadedGuava) break;

          const isBrownLesion = (h >= 12 && h <= 45) && l < 26 && !isFormShadow;
          const isPunctureRot = (l < 15 && !isFormShadow);
          isDefect = isBrownLesion || isPunctureRot;
          break;
        }

        // -----------------------------------------------------------------
        // 10. ONION
        // -----------------------------------------------------------------
        case 'onion': {
          const isTanPapery = (h >= 18 && h <= 52) && s >= 18 && l >= 25;
          const isRedOnionSkin = (h >= 320 || h <= 15) && s >= 18 && l >= 18;
          const isShadedOnion = isFormShadow;
          if (isTanPapery || isRedOnionSkin || isShadedOnion) break;

          const isAspergillusBlackMold = (l < 16 && s < 25 && !isFormShadow);
          const isMushyRot = (l < 18 && !isFormShadow);
          isDefect = isAspergillusBlackMold || isMushyRot;
          break;
        }

        // -----------------------------------------------------------------
        // 11. BRINJAL (EGGPLANT)
        // -----------------------------------------------------------------
        case 'brinjal': {
          const isGlossyPurple = (h >= 255 || h <= 25) && l >= 5 && s >= 8;
          const isGreenCap = (h >= 65 && h <= 150) && s >= 14;
          const isShadedBrinjal = isFormShadow || (l < 16 && chromaDist < 0.16);
          if (isGlossyPurple || isGreenCap || isShadedBrinjal) break;

          const isBrownDecay = (h >= 15 && h <= 48) && l >= 14 && l <= 35 && s >= 12 && !isFormShadow;
          const isSunkenSpot = (l < 14 && !isFormShadow);
          isDefect = isBrownDecay || isSunkenSpot;
          break;
        }

        // -----------------------------------------------------------------
        // 12. CARROT
        // -----------------------------------------------------------------
        case 'carrot': {
          const isVibrantOrange = (h >= 14 && h <= 45) && s >= 35 && l >= 28;
          const isGreenCrown = (h >= 68 && h <= 140) && s > 15;
          const isShadedCarrot = isFormShadow;
          if (isVibrantOrange || isGreenCrown || isShadedCarrot) break;

          const isBlackRot = (l < 15 && !isFormShadow);
          const isWhiteMoldWhiskers = (s < 14 && l > 58);
          isDefect = isBlackRot || isWhiteMoldWhiskers;
          break;
        }

        // -----------------------------------------------------------------
        // 13. CABBAGE
        // -----------------------------------------------------------------
        case 'cabbage': {
          const isCrispGreen = (h >= 68 && h <= 155) && s >= 15 && l >= 25;
          const isCreamCore = (h >= 45 && h <= 68) && s <= 30 && l >= 55;
          const isShadedCabbage = isFormShadow;
          if (isCrispGreen || isCreamCore || isShadedCabbage) break;

          const isBlackVeinRot = (l < 16 && !isFormShadow);
          const isYellowingSlime = (h >= 35 && h <= 55) && s > 40 && l < 35 && !isFormShadow;
          isDefect = isBlackVeinRot || isYellowingSlime;
          break;
        }

        // -----------------------------------------------------------------
        // 14. CAULIFLOWER
        // -----------------------------------------------------------------
        case 'cauliflower': {
          const isCreamCurd = (h >= 35 && h <= 65) && s <= 28 && l >= 55;
          const isGreenWrapper = (h >= 68 && h <= 150) && s >= 18;
          const isShadedCurd = isFormShadow;
          if (isCreamCurd || isGreenWrapper || isShadedCurd) break;

          const isAlternariaBlackSpeckles = (l < 22 && s < 25 && !isFormShadow);
          const isBrownCurdBlight = (h >= 18 && h <= 48) && l < 38 && !isFormShadow;
          isDefect = isAlternariaBlackSpeckles || isBrownCurdBlight;
          break;
        }

        // -----------------------------------------------------------------
        // 15. POMEGRANATE
        // -----------------------------------------------------------------
        case 'pomegranate': {
          // Natural pomegranate rind: deep red, crimson, pink, yellow, natural light blush
          const isRedRind = (h <= 22 || h >= 325) && s >= 16 && l >= 14 && l <= 82;
          const isPinkRind = (h >= 320 && h <= 360) && s >= 14 && l >= 32 && l <= 82;
          const isYellowTanRind = (h >= 20 && h <= 68) && s >= 14 && l >= 25 && l <= 82;
          const isWoodyCalyx = (h >= 22 && h <= 52) && s >= 18 && l >= 22 && l <= 50;
          const isShadedPomegranate = isFormShadow;

          if (isRedRind || isPinkRind || isYellowTanRind || isWoodyCalyx || isShadedPomegranate) break;

          // Pomegranate defects: sunken dark decay, soft brown rot, mold, black necrotic lesions
          const isBlackRot = (l < 15 && !isFormShadow);
          const isBrownDecay = (h >= 12 && h <= 48) && (l >= 10 && l <= 32) && !isFormShadow;
          const isGreyMold = (s <= 20) && (l >= 32 && l <= 80);
          const isSunkenPatch = (h >= 12 && h <= 48) && l >= 8 && l <= 24 && !isFormShadow;

          isDefect = isBlackRot || isBrownDecay || isGreyMold || isSunkenPatch;
          break;
        }

        // -----------------------------------------------------------------
        // 16. WATERMELON
        // -----------------------------------------------------------------
        case 'watermelon': {
          // Natural watermelon rind: dark green, medium green, light green stripes, whitish/cream
          const isDarkGreen = (h >= 100 && h <= 155) && s >= 20 && l >= 10 && l <= 55;
          const isLightGreen = (h >= 80 && h <= 130) && s >= 15 && l >= 25 && l <= 70;
          const isCreamStripe = (h >= 45 && h <= 90) && s <= 25 && l >= 55 && l <= 90;
          const isYellowSpot = (h >= 35 && h <= 65) && s >= 15 && l >= 40 && l <= 80;
          const isShadedWatermelon = isFormShadow;

          if (isDarkGreen || isLightGreen || isCreamStripe || isYellowSpot || isShadedWatermelon) break;

          const isMoldPatch = (s <= 18) && (l >= 32 && l <= 82);
          const isBrownRot = (h >= 10 && h <= 45) && l >= 10 && l <= 34 && s >= 12 && !isFormShadow;
          const isBlackRot = l < 14 && !isFormShadow;

          isDefect = isMoldPatch || isBrownRot || isBlackRot;
          break;
        }

        // -----------------------------------------------------------------
        // 17. PINEAPPLE
        // -----------------------------------------------------------------
        case 'pineapple': {
          // Natural pineapple skin: golden yellow, brownish-orange eyes, green crown
          const isGoldenYellow = (h >= 32 && h <= 68) && s >= 30 && l >= 25 && l <= 80;
          const isBrownEye = (h >= 18 && h <= 48) && s >= 20 && l >= 15 && l <= 45;
          const isGreenCrown = (h >= 70 && h <= 155) && s >= 20 && l >= 15;
          const isShadedPineapple = isFormShadow;

          if (isGoldenYellow || isBrownEye || isGreenCrown || isShadedPineapple) break;

          const isDarkBaseRot = (l < 14 && !isFormShadow);
          const isMold = (s <= 16 && l >= 42 && l <= 85);
          const isWaterSoaked = (h >= 10 && h <= 40) && l >= 10 && l <= 28 && s >= 15 && !isFormShadow;

          isDefect = isDarkBaseRot || isMold || isWaterSoaked;
          break;
        }

        // -----------------------------------------------------------------
        // 18. SAPOTA (CHIKOO)
        // -----------------------------------------------------------------
        case 'sapota': {
          // Natural sapota skin: brown, tan, grey-brown (potato-like appearance)
          const isBrownSkin = (h >= 15 && h <= 55) && s >= 10 && s <= 60 && l >= 20 && l <= 68;
          const isGreyBrown = (h >= 15 && h <= 50) && s >= 5 && s <= 30 && l >= 25 && l <= 65;
          const isShadedSapota = isFormShadow;

          if (isBrownSkin || isGreyBrown || isShadedSapota) break;

          const isBlackRot = l < 14 && !isFormShadow;
          const isMold = (s <= 14 && l >= 40 && l <= 85);
          const isLiquidRot = (h >= 55 && h <= 150) && s >= 18 && l >= 20 && l <= 60;

          isDefect = isBlackRot || isMold || isLiquidRot;
          break;
        }

        // -----------------------------------------------------------------
        // 19. SWEET LIME (MOSAMBI)
        // -----------------------------------------------------------------
        case 'sweetlime': {
          // Natural mosambi rind: pale yellow, light green, greenish-yellow
          const isPaleYellow = (h >= 45 && h <= 85) && s >= 15 && l >= 35 && l <= 88;
          const isLightGreen = (h >= 70 && h <= 130) && s >= 18 && l >= 25 && l <= 75;
          const isShadedMosambi = isFormShadow;

          if (isPaleYellow || isLightGreen || isShadedMosambi) break;

          const isGreenMold = (h >= 80 && h <= 185) && s >= 20 && l >= 20 && l <= 68;
          const isSunkenRot = l < 15 && !isFormShadow;
          const isBrownRot = (h >= 12 && h <= 40) && l < 28 && !isFormShadow;

          isDefect = isGreenMold || isSunkenRot || isBrownRot;
          break;
        }

        // -----------------------------------------------------------------
        // 20. LEMON
        // -----------------------------------------------------------------
        case 'lemon': {
          // Natural lemon rind: bright yellow, slightly green
          const isBrightYellow = (h >= 42 && h <= 78) && s >= 30 && l >= 30 && l <= 88;
          const isGreenLemon = (h >= 65 && h <= 130) && s >= 25 && l >= 22 && l <= 72;
          const isShadedLemon = isFormShadow;

          if (isBrightYellow || isGreenLemon || isShadedLemon) break;

          const isGreenMold = (h >= 90 && h <= 200) && s >= 18 && l >= 18 && l <= 68;
          const isBlueMold = (h >= 200 && h <= 280) && s >= 15 && l >= 20 && l <= 70;
          const isSunkenRot = l < 14 && !isFormShadow;

          isDefect = isGreenMold || isBlueMold || isSunkenRot;
          break;
        }

        // -----------------------------------------------------------------
        // 21. MUSKMELON (KHARBUJA)
        // -----------------------------------------------------------------
        case 'muskmelon': {
          // Natural muskmelon netted skin: beige, cream, light orange, tan
          const isBeige = (h >= 28 && h <= 60) && s >= 10 && s <= 50 && l >= 40 && l <= 85;
          const isLightOrange = (h >= 18 && h <= 42) && s >= 25 && l >= 35 && l <= 80;
          const isCream = s <= 20 && l >= 55 && l <= 90;
          const isShadedMelon = isFormShadow;

          if (isBeige || isLightOrange || isCream || isShadedMelon) break;

          const isSunkenDecay = (h >= 10 && h <= 42) && l >= 8 && l <= 28 && s >= 15 && !isFormShadow;
          const isMold = (s <= 16 && l >= 32 && l <= 82);
          const isBlackRot = l < 14 && !isFormShadow;

          isDefect = isSunkenDecay || isMold || isBlackRot;
          break;
        }

        // -----------------------------------------------------------------
        // 22. CUCUMBER
        // -----------------------------------------------------------------
        case 'cucumber': {
          // Natural cucumber: dark green, medium green; tiny pale bumps normal
          const isDarkGreen = (h >= 90 && h <= 155) && s >= 18 && l >= 10 && l <= 55;
          const isMedGreen = (h >= 75 && h <= 140) && s >= 15 && l >= 20 && l <= 68;
          const isPaleBump = s <= 20 && l >= 55 && l <= 88;
          const isShadedCucumber = isFormShadow;

          if (isDarkGreen || isMedGreen || isPaleBump || isShadedCucumber) break;

          const isYellowOld = (h >= 40 && h <= 75) && s >= 25 && l >= 35 && l <= 75;
          const isBrownRot = (h >= 10 && h <= 40) && l < 30 && s >= 15 && !isFormShadow;
          const isBlackRot = l < 14 && !isFormShadow;
          const isMold = (s <= 16 && l >= 40 && l <= 82);

          isDefect = isYellowOld || isBrownRot || isBlackRot || isMold;
          break;
        }

        // -----------------------------------------------------------------
        // 23. CAPSICUM (BELL PEPPER)
        // -----------------------------------------------------------------
        case 'capsicum': {
          // Natural capsicum: bright red, green, yellow; glossy skin
          const isRed = (h <= 20 || h >= 340) && s >= 35 && l >= 20 && l <= 75;
          const isGreenPepper = (h >= 80 && h <= 155) && s >= 20 && l >= 15 && l <= 65;
          const isYellowPepper = (h >= 42 && h <= 78) && s >= 30 && l >= 30 && l <= 80;
          const isOrangePepper = (h >= 20 && h <= 42) && s >= 40 && l >= 25 && l <= 75;
          const isShadedPepper = isFormShadow;

          if (isRed || isGreenPepper || isYellowPepper || isOrangePepper || isShadedPepper) break;

          const isBrownRot = (h >= 12 && h <= 46) && l >= 10 && l <= 34 && s >= 12 && !isFormShadow;
          const isMold = (s <= 16 && l >= 38 && l <= 82);
          const isBlackRot = l < 14 && !isFormShadow;

          isDefect = isBrownRot || isMold || isBlackRot;
          break;
        }

        // -----------------------------------------------------------------
        // 24. OKRA (BHINDI)
        // -----------------------------------------------------------------
        case 'okra': {
          // Natural okra: vibrant green pods
          const isVibrantGreen = (h >= 75 && h <= 160) && s >= 16 && l >= 10 && l <= 72;
          const isPaleGreen = (h >= 68 && h <= 140) && s >= 10 && l >= 28 && l <= 78;
          const isShadedOkra = isFormShadow;

          if (isVibrantGreen || isPaleGreen || isShadedOkra) break;

          const isBrowning = (h >= 12 && h <= 46) && l >= 10 && l <= 38 && s >= 12 && !isFormShadow;
          const isBlackSpot = (l < 12) && !isFormShadow && !(h >= 75 && h <= 160 && s >= 18);
          const isYellowOld = (h >= 38 && h <= 72) && s >= 20 && l >= 35 && l <= 75;
          const isMold = (s <= 16 && l >= 38 && l <= 82);

          isDefect = isBrowning || isBlackSpot || isYellowOld || isMold;
          break;
        }

        // -----------------------------------------------------------------
        // 25. SPINACH
        // -----------------------------------------------------------------
        case 'spinach': {
          // Natural spinach: deep green, medium green leaves
          const isDeepGreen = (h >= 90 && h <= 165) && s >= 20 && l >= 10 && l <= 60;
          const isMidGreen = (h >= 75 && h <= 150) && s >= 15 && l >= 18 && l <= 70;
          const isShadedSpinach = isFormShadow;

          if (isDeepGreen || isMidGreen || isShadedSpinach) break;

          const isYellowLeaf = (h >= 42 && h <= 82) && s >= 20 && l >= 35 && l <= 78;
          const isBrownDecay = (h >= 12 && h <= 48) && l < 34 && s >= 12 && !isFormShadow;
          const isMold = (s <= 16 && l >= 40 && l <= 85);

          isDefect = isYellowLeaf || isBrownDecay || isMold;
          break;
        }

        // -----------------------------------------------------------------
        // 26. BITTER GOURD (KARELA)
        // -----------------------------------------------------------------
        case 'bittergourd': {
          // Natural bitter gourd: dark green to medium green warty skin
          const isDarkGreen = (h >= 90 && h <= 160) && s >= 18 && l >= 10 && l <= 58;
          const isMedGreen = (h >= 75 && h <= 145) && s >= 14 && l >= 18 && l <= 68;
          const isShadedKarela = isFormShadow;

          if (isDarkGreen || isMedGreen || isShadedKarela) break;

          const isYellowOld = (h >= 38 && h <= 78) && s >= 25 && l >= 35 && l <= 78;
          const isBrownDecay = (h >= 10 && h <= 40) && l < 30 && s >= 12 && !isFormShadow;
          const isMold = (s <= 16 && l >= 38 && l <= 82);

          isDefect = isYellowOld || isBrownDecay || isMold;
          break;
        }

        // -----------------------------------------------------------------
        // 27. BOTTLE GOURD (LAUKI)
        // -----------------------------------------------------------------
        case 'bottlegourd': {
          // Natural bottle gourd: pale green to medium green, light fuzz normal
          const isPaleGreen = (h >= 80 && h <= 155) && s >= 10 && l >= 30 && l <= 80;
          const isMedGreen = (h >= 75 && h <= 145) && s >= 15 && l >= 20 && l <= 70;
          const isLightFuzz = s <= 18 && l >= 55 && l <= 88;
          const isShadedLauki = isFormShadow;

          if (isPaleGreen || isMedGreen || isLightFuzz || isShadedLauki) break;

          const isYellowOld = (h >= 38 && h <= 72) && s >= 22 && l >= 35 && l <= 78;
          const isBrownDecay = (h >= 12 && h <= 44) && l < 30 && s >= 12 && !isFormShadow;
          const isMold = (s <= 16 && l >= 38 && l <= 82);

          isDefect = isYellowOld || isBrownDecay || isMold;
          break;
        }

        // -----------------------------------------------------------------
        // GENERAL FALLBACK
        // -----------------------------------------------------------------
        default: {
          const isExtremeDark = (l < 15) && !isFormShadow && (chromaDist >= 0.10);
          const isFungalMold = (s < 14 && l > 50 && l < 85);
          const isAbnormalBrowning = (h >= 12 && h <= 45 && l < 26 && s > 20) && !isFormShadow;
          isDefect = isExtremeDark || isFungalMold || isAbnormalBrowning;
          break;
        }
      }

      if (isDefect) {
        anomalyMap[p] = 1;
        rawDefectCount++;
      }
    }

    // -----------------------------------------------------------------------
    // STEP 5: Contiguous Cluster Verification (Eliminate Stray Pixel Noise)
    // -----------------------------------------------------------------------
    // Real decay occurs in contiguous patches. Isolated micro-speckles (sugar spots,
    // pores, lenticels) are filtered out so only genuine localized clusters are marked.
    let clusteredDefectCount = 0;

    for (let y = 2; y < canvasH - 2; y++) {
      for (let x = 2; x < canvasW - 2; x++) {
        const p = y * canvasW + x;
        if (!anomalyMap[p]) continue;

        let neighbors = 0;
        for (let dy = -2; dy <= 2; dy++) {
          const rowOffset = (y + dy) * canvasW;
          for (let dx = -2; dx <= 2; dx++) {
            if (dx === 0 && dy === 0) continue;
            if (anomalyMap[rowOffset + (x + dx)]) neighbors++;
          }
        }

        // Must have at least 8 defect neighbors in a 5x5 window (compact cluster).
        // Higher bar prevents isolated natural marks from being counted as decay.
        if (neighbors >= 8) {
          clusteredDefectCount++;
          const i = p * 4;
          maskData[i] = 225;     // R
          maskData[i + 1] = 29;  // G
          maskData[i + 2] = 72;  // B
          maskData[i + 3] = 210; // Semi-transparent overlay
        }
      }
    }

    maskCtx.putImageData(maskImageData, 0, 0);

    // -----------------------------------------------------------------------
    // STEP 6: Multi-Indicator Scoring & Classification Decision
    // -----------------------------------------------------------------------
    const surfaceDiscolorationIndex = producePixelCount > 0
      ? ((clusteredDefectCount / producePixelCount) * 100)
      : 0;

    const visualUniformityRating = Math.max(15, Math.min(99, Math.round(100 - (surfaceDiscolorationIndex * 3.5))));

    // Calibrated produce-specific thresholds & minimum cluster overrides.
    // Thresholds are intentionally generous to avoid false positives on real
    // photos which carry natural shadows, lenticels, skin texture, and marks.
    let defectThreshold = 7.0;
    let minClusterPixels = 1800;

    switch (produceKey) {
      case 'apple':
        // Apples have natural blush, lenticels, stem shadows — need generous threshold
        defectThreshold = 6.5;
        minClusterPixels = 2000;
        break;
      case 'banana':
        // Sugar freckles are natural; only large confluent black zones = spoilage
        defectThreshold = 9.0;
        minClusterPixels = 1600;
        break;
      case 'potato':
        // Tan skin with eye shadows is healthy; only green solanine patches = spoilage
        defectThreshold = 6.0;
        minClusterPixels = 1500;
        break;
      case 'mango':
        // Multi-hue skin (green/yellow/red blush) is healthy; only dark anthracnose = spoilage
        defectThreshold = 8.0;
        minClusterPixels = 2000;
        break;
      case 'tomato':
        // Glossy red with green calyx; only large black blossom-end rot = spoilage
        defectThreshold = 6.5;
        minClusterPixels = 1600;
        break;
      case 'orange':
        // Porous oil glands are healthy; only large mold patches = spoilage
        defectThreshold = 7.0;
        minClusterPixels = 1800;
        break;
      case 'pomegranate':
        // Deep red rind with natural blush; only soft brown rot = spoilage
        defectThreshold = 7.0;
        minClusterPixels = 1800;
        break;
      case 'cucumber':
        // Green with ridges and bumps; yellowing or large brown patches = spoilage
        defectThreshold = 7.0;
        minClusterPixels = 1800;
        break;
      case 'okra':
        // Slender green pod; only extensive browning or black tip = spoilage
        defectThreshold = 6.5;
        minClusterPixels = 1500;
        break;
      case 'capsicum':
        // Glossy peppers; only large sunken rot spots = spoilage
        defectThreshold = 7.0;
        minClusterPixels = 1700;
        break;
      case 'watermelon':
        // Dark green rind with stripes; only clearly rotten patches = spoilage
        defectThreshold = 9.0;
        minClusterPixels = 2200;
        break;
      case 'pineapple':
        // Brown eyes and green crown are normal; only base rot = spoilage
        defectThreshold = 8.5;
        minClusterPixels = 2000;
        break;
      case 'sapota':
        // Naturally brown rough potato-like skin; almost all brown is healthy
        defectThreshold = 10.0;
        minClusterPixels = 2000;
        break;
      case 'spinach':
        // Deep green leaves; large yellow/brown areas = spoilage
        defectThreshold = 9.0;
        minClusterPixels = 1600;
        break;
      case 'grapes':
        defectThreshold = 7.0;
        minClusterPixels = 1800;
        break;
      case 'papaya':
        defectThreshold = 7.5;
        minClusterPixels = 1800;
        break;
      case 'guava':
        defectThreshold = 7.5;
        minClusterPixels = 1800;
        break;
      case 'carrot':
        defectThreshold = 6.5;
        minClusterPixels = 1600;
        break;
      case 'onion':
        defectThreshold = 7.0;
        minClusterPixels = 1800;
        break;
      case 'brinjal':
        defectThreshold = 7.0;
        minClusterPixels = 1800;
        break;
      case 'bittergourd':
        defectThreshold = 8.0;
        minClusterPixels = 1800;
        break;
      case 'bottlegourd':
        defectThreshold = 8.0;
        minClusterPixels = 2000;
        break;
      default:
        defectThreshold = 7.0;
        minClusterPixels = 1800;
        break;
    }

    // Execute Spatial Patch ML Spoilage Segmentor (Localized Defect Detection)
    const patchResult = runMLPatchDefectSegmentation(
      pixels, isProducePixel, canvasW, canvasH, produceKey, maskCtx, maskImageData
    );

    // Execute trained Global ML Spoilage Model
    const mlResult = runMLSpoilageInference(
      pixels, isProducePixel, totalPixels, canvasW, canvasH, clusteredDefectCount, laplacianVariance
    );

    // Combine localized defect counts from both fine-grained patch model and cluster segmentation
    let effectiveDefectRatio = Math.max(surfaceDiscolorationIndex, patchResult ? patchResult.defectRatio : 0);
    let effectiveDefectPixels = Math.max(clusteredDefectCount, patchResult ? patchResult.defectPixelCount : 0);

    const clusterOverride = (clusteredDefectCount >= minClusterPixels);
    let decision;

    // Critical Requirement: If a significant localized rotten patch or extensive damage is detected, classify as SPOILAGE.
    // Both patch model AND cluster analysis must agree (or one must exceed a high threshold alone)
    // to prevent natural imperfections from triggering false spoilage on real photos.
    const isPatchSpoiled = patchResult && patchResult.isSpoiled;
    const isClusterSpoiled = clusterOverride && (effectiveDefectRatio >= defectThreshold);
    // Global ML: requires high confidence AND clearly visible physical defects
    const hasVisibleDefects = (effectiveDefectPixels >= 600) || (effectiveDefectRatio >= 3.0);
    const isGlobalMLSpoiled = mlResult && (mlResult.decision === 'spoilage') && (mlResult.confidence >= 0.90) && hasVisibleDefects;

    // Decision: require at least TWO independent indicators, or ONE extremely strong indicator
    const spoilageIndicators = [isPatchSpoiled, isClusterSpoiled, isGlobalMLSpoiled].filter(Boolean).length;
    const isHardSpoilage = isClusterSpoiled && (effectiveDefectRatio >= defectThreshold * 1.5);

    if (spoilageIndicators >= 2 || isHardSpoilage) {
      decision = 'spoilage';
    } else if (mlResult && mlResult.decision === 'unable') {
      renderUnableOutcome('Uncertain Model Classification', `The ML neural model confidence (${(mlResult.confidence * 100).toFixed(1)}%) was below the reliability threshold (70%). Please provide an image with clearer focus or lighting.`);
      return {
        decision: 'unable',
        confidence: mlResult.confidence,
        surfaceDiscolorationIndex: effectiveDefectRatio,
        visualUniformityRating,
        clusteredDefectCount: effectiveDefectPixels
      };
    } else {
      decision = 'fresh';
    }
    const effectiveUniformityRating = Math.max(15, Math.min(99, Math.round(100 - (effectiveDefectRatio * 3.5))));

    // Comprehensive Browser Console Debugging Information
    console.log('[FreshCheck ML Defect Detection Debug]', {
      produceType: produceKey,
      patchModel: patchResult?.modelName || 'None',
      localizedDamagedPixels: effectiveDefectPixels,
      damagedSurfaceRatio: effectiveDefectRatio.toFixed(2) + '%',
      boundingBox: patchResult?.boundingBox || 'None',
      isPatchSpoiled: patchResult?.isSpoiled,
      globalModel: mlResult?.modelName || 'None',
      globalConfidence: mlResult ? (mlResult.confidence * 100).toFixed(1) + '%' : 'N/A',
      finalClassification: decision
    });

    renderFinalResults(decision, effectiveDefectRatio, effectiveUniformityRating, produceKey, mlResult, patchResult);
    drawColorSpectrumHistogram(pixels, isProducePixel, anomalyMap);

    return {
      decision,
      mlResult,
      patchResult,
      confidence: mlResult?.confidence || 1.0,
      surfaceDiscolorationIndex: effectiveDefectRatio,
      visualUniformityRating: effectiveUniformityRating,
      clusteredDefectCount: effectiveDefectPixels
    };
    } catch (analysisErr) {
      console.error('[FreshCheck performCanvasImageAnalysis Exception]:', analysisErr);
      renderUnableOutcome('Image Analysis Error', 'An unexpected error occurred during pixel analysis: ' + (analysisErr.message || 'Unknown error'));
      return {
        decision: 'unable',
        error: analysisErr.message,
        surfaceDiscolorationIndex: 0,
        visualUniformityRating: 0,
        clusteredDefectCount: 0
      };
    }
  }


    // =========================================================================
  // 11. RENDER FINAL RESULTS (3 EXACT REQUIRED OUTCOMES)
  // =========================================================================
  
  function renderFinalResults(decision, discolorationIndex, uniformityRating, produceKey, mlResult = null, patchResult = null) {
    const produceInfo = PRODUCE_DATABASE[produceKey] || { name: produceKey, storageTips: 'Store properly.' };

    outcomeCard.className = 'outcome-card ' + decision;

    // Numerical values framed strictly as experimental image measurements
    metricDefectRatio.textContent = discolorationIndex.toFixed(1) + '%';
    meterFillDefect.style.width = Math.min(100, Math.max(4, discolorationIndex * 4)) + '%';

    metricVibrancy.textContent = uniformityRating + '/100';
    meterFillVibrancy.style.width = uniformityRating + '%';

    observationsList.innerHTML = '';

    // Surface Machine Learning Model Inference & Localized Defect Detection Details
    if (patchResult && patchResult.isSpoiled) {
      const box = patchResult.boundingBox;
      const boxText = box ? ` [X: ${box.minX}–${box.maxX}, Y: ${box.minY}–${box.maxY}]` : '';
      const liPatch = document.createElement('li');
      liPatch.innerHTML = `<strong>ML Defect Localization:</strong> Detected confirmed damaged region covering <strong>${discolorationIndex.toFixed(1)}%</strong> (${patchResult.defectPixelCount} pixels) at coordinates${boxText}.`;
      observationsList.appendChild(liPatch);

      const liMask = document.createElement('li');
      liMask.innerHTML = `<strong>Defect Mask Overlay:</strong> Damaged tissue is highlighted in crimson-red on the produce surface in the <em>Defect Mask View</em>.`;
      observationsList.appendChild(liMask);
    } else if (patchResult) {
      const liClean = document.createElement('li');
      liClean.innerHTML = `<strong>ML Defect Localization:</strong> No significant suspicious necrotic lesions, decay patches, or mold growth detected on the produce surface.`;
      observationsList.appendChild(liClean);
    }

    if (mlResult) {
      const mlBadge = decision === 'fresh' ? 'Appears Fresh' : 'Possible Spoilage';
      const mlConfidencePct = (mlResult.confidence * 100).toFixed(1);
      const liML = document.createElement('li');
      liML.innerHTML = `<strong>Neural Model Confidence:</strong> Classified as <em>${mlBadge}</em> with ${mlConfidencePct}% confidence (Inference via ${mlResult.backend}).`;
      observationsList.appendChild(liML);
    }

    if (decision === 'fresh') {
      // RESULT A: APPEARS FRESH
      outcomeStatusIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
      `;
      outcomeCategoryBadge.textContent = 'Appears Fresh';
      outcomeHeadline.textContent = 'Produce Appears Visually Acceptable';
      outcomePrimaryMessage.textContent = 'No significant visible signs of spoilage were detected. The produce appears visually acceptable.';

      const observations = [
        `Surface discoloration index of ${discolorationIndex.toFixed(1)}% is within the expected range for healthy ${produceInfo.name}.`,
        `Estimated visual uniformity rating of ${uniformityRating}/100 indicates consistent epidermal pigmentation.`,
        `No suspicious contiguous necrotic lesions, mycelium fuzz, or abnormal browning clusters detected.`
      ];

      observations.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        observationsList.appendChild(li);
      });

      handlingRecommendation.innerHTML = `
        <strong>Recommended Handling &amp; Storage:</strong> Always wash produce thoroughly under clean running water right before preparation. ${produceInfo.storageTips}
      `;

    } else {
      // RESULT B: POSSIBLE SPOILAGE
      outcomeStatusIcon.innerHTML = `
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      `;
      outcomeCategoryBadge.textContent = 'Possible Spoilage';
      outcomeHeadline.textContent = 'Unusual Surface Patterns Detected';
      outcomePrimaryMessage.textContent = 'Some unusual visible surface characteristics were detected. Please inspect the produce carefully.';

      const observations = [
        `Surface discoloration index of ${discolorationIndex.toFixed(1)}% indicates localized abnormal skin characteristics.`,
        `Detected localized clusters of discoloration or surface breakdown that warrant physical inspection.`,
        `Examine highlighted regions for abnormal softness, weeping fluid, or off-odors.`
      ];

      if (produceKey === 'banana' && discolorationIndex < 25) {
        observations.push('Banana Note: If the peel only has small brown sugar freckles and flesh remains firm, it is completely ripe and safe to eat.');
      } else if (produceKey === 'potato') {
        observations.push('Potato Warning: Green skin patches indicate toxic solanine glycoalkaloids. Cut away all green portions or discard.');
      } else if (produceKey === 'apple') {
        observations.push('Apple Warning: Brown or black sunken patches indicate bruise oxidation, Penicillium mold, or Alternaria core rot. Trim deeply around any blemish or discard if widespread.');
      } else if (produceKey === 'pomegranate') {
        observations.push('Pomegranate Note: Soft brown patches on the rind indicate internal decay. Inspect the crown and blossom ends closely.');
      } else if (produceKey === 'cucumber') {
        observations.push('Cucumber Note: Yellow discoloration indicates over-ripeness. Discard if slimy or with strong odor.');
      } else if (produceKey === 'spinach') {
        observations.push('Spinach Note: Yellow or slimy leaves must be discarded. Never consume wilted spinach with strong ammonia odor.');
      }

      observations.forEach(text => {
        const li = document.createElement('li');
        li.textContent = text;
        observationsList.appendChild(li);
      });

      handlingRecommendation.innerHTML = `
        <strong>Safety Advice:</strong> Inspect texture and aroma carefully. If soft, mushy, weeping, moldy, or sour-smelling, <em>discard immediately</em>. If it is only shallow surface bruising on firm produce, trim deeply around the blemish before cooking.
      `;
    }
  }

  function renderUnableOutcome(reasonHeadline, reasonExplanation) {
    // RESULT C: UNABLE TO DETERMINE
    outcomeCard.className = 'outcome-card unable';
    outcomeStatusIcon.innerHTML = `
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    `;
    outcomeCategoryBadge.textContent = 'Unable to Determine';
    outcomeHeadline.textContent = reasonHeadline;
    outcomePrimaryMessage.textContent = 'The image could not be assessed reliably. Please upload a clearer image with good lighting.';

    metricDefectRatio.textContent = '--';
    meterFillDefect.style.width = '0%';
    metricVibrancy.textContent = '--';
    meterFillVibrancy.style.width = '0%';

    observationsList.innerHTML = `
      <li>Observation: ${reasonExplanation}</li>
      <li>The algorithm requires clear separation between the produce subject and background surfaces.</li>
      <li>Ensure steady natural lighting without direct flash glare, hold the camera in focus, and center the fruit.</li>
      <li>Use the <strong>"Crop Produce"</strong> button to eliminate surrounding tables or objects.</li>
    `;

    handlingRecommendation.innerHTML = `
      <strong>How to Retake:</strong> Place the produce on a plain surface, use the "Crop Produce" button to isolate the fruit, and re-scan under even daylight.
    `;

    if (histCtx) histCtx.clearRect(0, 0, histogramCanvas.width, histogramCanvas.height);
  }

  // =========================================================================
  // 12. CANVAS PIXEL COLOR DISTRIBUTION HISTOGRAM
  // =========================================================================
  
  function drawColorSpectrumHistogram(pixels, isProducePixel, anomalyMap) {
    if (!histCtx || !histogramCanvas) return;

    const w = histogramCanvas.width;
    const h = histogramCanvas.height;
    histCtx.clearRect(0, 0, w, h);

    // Bins for Hue (0 to 360, 60 bins)
    const healthyBins = new Uint32Array(60);
    const defectBins = new Uint32Array(60);
    let maxBin = 1;

    for (let p = 0; p < isProducePixel.length; p += 3) {
      if (!isProducePixel[p]) continue;

      const i = p * 4;
      const hsl = rgbToHsl(pixels[i], pixels[i + 1], pixels[i + 2]);
      const bin = Math.min(59, Math.floor(hsl.h / 6));

      if (anomalyMap[p]) {
        defectBins[bin]++;
        if (defectBins[bin] > maxBin) maxBin = defectBins[bin];
      } else {
        healthyBins[bin]++;
        if (healthyBins[bin] > maxBin) maxBin = healthyBins[bin];
      }
    }

    const barW = w / 60;
    for (let b = 0; b < 60; b++) {
      const healthyH = (healthyBins[b] / maxBin) * (h - 6);
      const defectH = (defectBins[b] / maxBin) * (h - 6);

      // Draw healthy bar
      if (healthyH > 0) {
        histCtx.fillStyle = '#10b981';
        histCtx.fillRect(b * barW, h - healthyH, barW - 1, healthyH);
      }
      // Draw defect overlay bar
      if (defectH > 0) {
        histCtx.fillStyle = '#e11d48';
        histCtx.fillRect(b * barW, h - healthyH - defectH, barW - 1, defectH);
      }
    }
  }

  // =========================================================================
  // 13. HELPER: RGB TO HSL COLOR CONVERSION
  // =========================================================================
  
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }

  // =========================================================================
  // 14. PRODUCE ENCYCLOPEDIA FILTERING & MODAL DIALOG
  // =========================================================================
  
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filterVal = tab.getAttribute('data-filter');

      produceCards.forEach(card => {
        const cardCat = card.getAttribute('data-category');
        if (filterVal === 'all' || cardCat === filterVal) {
          card.style.display = 'flex';
          card.style.animation = 'fadeIn 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  const modalTriggers = document.querySelectorAll('.btn-modal-trigger');
  modalTriggers.forEach(btn => {
    btn.addEventListener('click', () => {
      const itemId = btn.getAttribute('data-item');
      openProduceModal(itemId);
    });
  });

  function openProduceModal(itemId) {
    const data = PRODUCE_DATABASE[itemId];
    if (!data) return;

    modalContentLayout.innerHTML = `
      <div class="modal-header-section">
        <div class="modal-title-box">
          <span class="type-badge ${data.category.toLowerCase() === 'fruit' ? 'fruit' : 'veg'}">${data.category}</span>
          <h3>${data.name}</h3>
          <p class="modal-scientific">${data.type}</p>
        </div>
      </div>

      <div class="modal-detail-block">
        <h4>✅ General Appearance of Healthy Produce</h4>
        <p>${data.healthyLook}</p>
      </div>

      <div class="modal-detail-block">
        <h4>⚠️ Common Visible Signs of Spoilage</h4>
        <p>${data.spoilageSigns}</p>
      </div>

      <div class="modal-detail-block">
        <h4>🛒 What to Observe While Purchasing</h4>
        <p>${data.marketTips}</p>
      </div>

      <div class="modal-detail-block">
        <h4>❄️ Recommended Storage &amp; Shelf Life</h4>
        <p><strong>Shelf Life:</strong> ${data.shelfLife}</p>
        <p><strong>Storage Guidelines:</strong> ${data.storageTips}</p>
      </div>

      <div class="modal-detail-block">
        <h4>🔬 Spoilage Pathology &amp; Safety Note</h4>
        <p>${data.microbiology}</p>
      </div>
    `;

    produceModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function closeProduceModal() {
    produceModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }

  if (btnCloseModal) btnCloseModal.addEventListener('click', closeProduceModal);

  if (produceModal) {
    produceModal.addEventListener('click', (e) => {
      if (e.target === produceModal) {
        closeProduceModal();
      }
    });
  }

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (produceModal && !produceModal.classList.contains('hidden')) {
        closeProduceModal();
      }
      if (cropModal && !cropModal.classList.contains('hidden')) {
        closeCropModal();
      }
    }
  });

  // Expose analysis hook and reference dataset for browser debugging & testing suites
  window.performCanvasImageAnalysis = performCanvasImageAnalysis;
  window.triggerAnalysis = triggerAnalysis;
  window.PRODUCE_DATABASE = PRODUCE_DATABASE;
  window.REFERENCE_DATASET = REFERENCE_DATASET;
  window.runReferenceAccuracyBenchmark = runReferenceAccuracyBenchmark;

});
