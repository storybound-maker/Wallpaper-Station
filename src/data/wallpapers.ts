import { Wallpaper, CategoryInfo, Collection } from '../types';

export const CATEGORIES_DATA: CategoryInfo[] = [
  {
    name: 'Anime',
    description: '1000+ downloadable wallpapers from all top anime series: Naruto, One Piece, Attack on Titan, Demon Slayer, Jujutsu Kaisen, Dragon Ball, Solo Leveling, and more.',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
    count: 1000,
    accentColor: '#F59E0B',
  },
  {
    name: 'Cyberpunk',
    description: 'Neon drenched alleys, rain slicked streets, high-tech low-life futures.',
    coverUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',
    count: 105,
    accentColor: '#D946EF',
  },
  {
    name: 'Space',
    description: 'Distant galaxies, nebulae, cosmic dust, and celestial wonders.',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    count: 85,
    accentColor: '#8B5CF6',
  },
  {
    name: 'Nature',
    description: 'Serene mountain peaks, lush forests, deep oceans, and golden horizons.',
    coverUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop',
    count: 95,
    accentColor: '#10B981',
  },
  {
    name: 'Gaming',
    description: 'High-octane game environments, synthwave aesthetics, and esports setups.',
    coverUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1200&auto=format&fit=crop',
    count: 80,
    accentColor: '#EC4899',
  },
  {
    name: 'Cars',
    description: 'Hypercars, classic vintage autos, drift machines, and modern supercars.',
    coverUrl: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?q=80&w=1200&auto=format&fit=crop',
    count: 65,
    accentColor: '#EF4444',
  },
  {
    name: 'AMOLED',
    description: 'Pure black backdrops tailored specifically for OLED screens to save battery.',
    coverUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1200&auto=format&fit=crop',
    count: 75,
    accentColor: '#6366F1',
  },
  {
    name: 'Abstract',
    description: '3D geometric shapes, fluid color waves, and minimalist light flows.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    count: 90,
    accentColor: '#06B6D4',
  },
  {
    name: 'Minimal',
    description: 'Clean line art, negative space, simple color blocks, and calm aesthetics.',
    coverUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200&auto=format&fit=crop',
    count: 70,
    accentColor: '#64748B',
  },
  {
    name: 'Architecture',
    description: 'Modern skyscrapers, brutalist geometry, structural curves, and urban lines.',
    coverUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop',
    count: 55,
    accentColor: '#14B8A6',
  },
  {
    name: 'Neon',
    description: 'Electric glow, radiant signs, vivid magenta and cyan ambient lighting.',
    coverUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=1200&auto=format&fit=crop',
    count: 60,
    accentColor: '#F43F5E',
  },
  {
    name: 'Animals',
    description: 'Majestic wildlife, macro portraits, underwater creatures, and birds of prey.',
    coverUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef9?q=80&w=1200&auto=format&fit=crop',
    count: 50,
    accentColor: '#84CC16',
  },
  {
    name: 'Cities',
    description: 'Skyline night lights, bustling metropolis streetscapes, and iconic landmarks.',
    coverUrl: 'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78?q=80&w=1200&auto=format&fit=crop',
    count: 70,
    accentColor: '#0284C7',
  },
  {
    name: 'Technology',
    description: 'Futuristic microchips, clean code visuals, server rooms, and sleek hardware.',
    coverUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop',
    count: 45,
    accentColor: '#3B82F6',
  }
];

const ANIME_IMAGE_SEEDS = [
  'https://images.unsplash.com/photo-1578632767115-351597cf2477',
  'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f',
  'https://images.unsplash.com/photo-1563089145-599997674d42',
  'https://images.unsplash.com/photo-1534447677768-be436bb09401',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23',
  'https://images.unsplash.com/photo-1569982175971-d92b01cf8694',
  'https://images.unsplash.com/photo-1514539079130-25950c84af65',
  'https://images.unsplash.com/photo-1509198397868-475647b2a1e5',
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b675',
  'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
  'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
  'https://images.unsplash.com/photo-1542751371-adc38448a05e'
];

const GENERAL_IMAGE_SEEDS = {
  Cyberpunk: [
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
    'https://images.unsplash.com/photo-1514539079130-25950c84af65',
    'https://images.unsplash.com/photo-1542751371-adc38448a05e'
  ],
  Space: [
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa',
    'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86',
    'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa',
    'https://images.unsplash.com/photo-1462331940025-496dfbfc7564'
  ],
  Nature: [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1448375240586-882707db888b',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05'
  ],
  Gaming: [
    'https://images.unsplash.com/photo-1542751371-adc38448a05e',
    'https://images.unsplash.com/photo-1538481199705-c710c4e965fc',
    'https://images.unsplash.com/photo-1511512578047-dfb367046420',
    'https://images.unsplash.com/photo-1542751110-97427bbecf20'
  ],
  Cars: [
    'https://images.unsplash.com/photo-1617814076367-b759c7d7e738',
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537',
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d'
  ],
  AMOLED: [
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5'
  ],
  Abstract: [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab',
    'https://images.unsplash.com/photo-1550684848-fac1c5b4e853',
    'https://images.unsplash.com/photo-1579783902614-a3fb3927b675'
  ],
  Minimal: [
    'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85',
    'https://images.unsplash.com/photo-1513694203232-719a280e022f',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e'
  ],
  Architecture: [
    'https://images.unsplash.com/photo-1513694203232-719a280e022f',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
    'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78'
  ],
  Neon: [
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
    'https://images.unsplash.com/photo-1563089145-599997674d42',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23'
  ],
  Animals: [
    'https://images.unsplash.com/photo-1564349683136-77e08dba1ef9',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5',
    'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6',
    'https://images.unsplash.com/photo-1555169062-013468b47731'
  ],
  Cities: [
    'https://images.unsplash.com/photo-1477959858617-67f30ac4ce78',
    'https://images.unsplash.com/photo-1519501025264-65ba15a82390',
    'https://images.unsplash.com/photo-1514539079130-25950c84af65',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071'
  ],
  Technology: [
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5',
    'https://images.unsplash.com/photo-1550751827-4bd374c3f58b',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1'
  ]
};

// 20 Major Anime Franchises with 50 specific wallpapers each (Total: 1000 downloadable anime wallpapers)
const ANIME_FRANCHISES = [
  {
    name: 'Naruto Shippuden',
    tag: 'Naruto',
    characters: [
      'Naruto Uzumaki Nine Tails Sage Mode',
      'Sasuke Uchiha Perfect Susanoo',
      'Itachi Uchiha Crow Illusion',
      'Kakashi Hatake Double Sharingan',
      'Minato Namikaze Yellow Flash',
      'Pain Planetary Devastation',
      'Madara Uchiha Perfect Form',
      'Jiraiya Toad Sage Realm',
      'Obito Uchiha Kamui Rift',
      'Gaara Sand Shield Defense'
    ]
  },
  {
    name: 'One Piece',
    tag: 'One Piece',
    characters: [
      'Monkey D Luffy Gear Fifth Sun God',
      'Roronoa Zoro Ashura Nine Sword Style',
      'Vinsmoke Sanji Ifrit Jambe Flames',
      'Shanks Conqueror Haki Release',
      'Trafalgar D Water Law Room Realm',
      'Portgas D Ace Fire Fist Flame',
      'Nico Robin Demonio Fleur',
      'Kaido King of Beasts Dragon Form',
      'Whitebeard Edward Newgate Quake Punch',
      'Gol D Roger Pirate King Slash'
    ]
  },
  {
    name: 'Attack on Titan',
    tag: 'Attack on Titan',
    characters: [
      'Eren Yeager Founding Titan Attack',
      'Levi Ackerman Steel Blades Slash',
      'Mikasa Ackerman Red Scarf Flight',
      'Armin Arlert Colossal Titan Explosion',
      'Erwin Smith Charge Wings of Freedom',
      'Reiner Braun Armored Titan Shield',
      'Annie Leonhart Female Titan Crystal',
      'Zeke Yeager Beast Titan Stone Pitch',
      'Hange Zoe Titan Research Flight',
      'Levi vs Beast Titan Shinganshina'
    ]
  },
  {
    name: 'Demon Slayer: Kimetsu no Yaiba',
    tag: 'Demon Slayer',
    characters: [
      'Tanjiro Kamado Hinokami Kagura Fire',
      'Nezuko Kamado Awakened Demon Form',
      'Zenitsu Agatsuma Thunder Breathing First Form',
      'Inosuke Hashibira Beast Breathing Slice',
      'Kyojuro Rengoku Flame Hashira Flame',
      'Giyu Tomioka Water Surface Slash',
      'Shinobu Kocho Butterfly Poison Strike',
      'Tengen Uzui Sound Breathing Symphony',
      'Muichiro Tokito Mist Breathing Domain',
      'Kokushibo Upper Moon One Moon Blades'
    ]
  },
  {
    name: 'Jujutsu Kaisen',
    tag: 'Jujutsu Kaisen',
    characters: [
      'Gojo Satoru Limitless Void Expansion',
      'Ryomen Sukuna Malevolent Shrine Domain',
      'Yuji Itadori Black Flash Strike',
      'Megumi Fushiguro Ten Shadows Mahoraga',
      'Yuta Okkotsu Queen of Curses Rika',
      'Toji Fushiguro Heavenly Restriction',
      'Kento Nanami 7:3 Ratio Strike',
      'Suguru Geto Curse Manipulation Array',
      'Nobara Kugisaki Resonance Straw Doll',
      'Aoi Todo Boogie Woogie Clap'
    ]
  },
  {
    name: 'Dragon Ball Super',
    tag: 'Dragon Ball',
    characters: [
      'Goku Ultra Instinct Silver Aura',
      'Vegeta Ultra Ego God Power',
      'Gohan Beast Red Eyes Power',
      'Broly Legendary Super Saiyan Rage',
      'Future Trunks Sword of Hope',
      'Piccolo Orange Form Awakening',
      'Vegito Blue Final Kamehameha',
      'Gogeta Super Saiyan 4 Stardust',
      'Frieza Golden Emperor Blast',
      'Beerus God of Destruction Hakai'
    ]
  },
  {
    name: 'Bleach: Thousand-Year Blood War',
    tag: 'Bleach',
    characters: [
      'Ichigo Kurosaki True Bankai Getsuga',
      'Sosuke Aizen Kyoka Suigetsu Illusion',
      'Ulquiorra Cifer Segunda Etapa Cero',
      'Zaraki Kenpachi Unlocked Bankai',
      'Byakuya Kuchiki Senbonzakura Kageyoshi',
      'Toshiro Hitsugaya Adult Ice Dragon',
      'Kisuke Urahara Bankai Guanyin',
      'Shunsui Kyoratsu Bankai Shadows',
      'Yhwach Almighty Quincy King',
      'Rukia Kuchiki Hakka no Togame'
    ]
  },
  {
    name: 'My Hero Academia',
    tag: 'My Hero Academia',
    characters: [
      'Deku One For All 100% Full Cowl',
      'Bakugo Katsuki Howitzer Impact Blast',
      'Todoroki Shoto Half-Cold Half-Hot',
      'All Might United States of Smash',
      'Endeavor Hellflame Prominence Burn',
      'Hawks Fierce Wings Flight',
      'Shigaraki Tomura Decay Awakening',
      'Dabi Blue Flame Flashfire',
      'Tokoyami Fumikage Dark Shadow Armor',
      'Mirio Togata Permeation Power'
    ]
  },
  {
    name: 'Chainsaw Man',
    tag: 'Chainsaw Man',
    characters: [
      'Denji Chainsaw Devil Hero of Hell',
      'Makima Control Devil Golden Chains',
      'Power Blood Devil Giant Hammer',
      'Aki Hayakawa Fox Devil Contract',
      'Pochita Original Devil Form',
      'Kishibe Public Safety Master',
      'Reze Bomb Devil Explosion',
      'Quanxi First Devil Hunter',
      'Angel Devil Hall of Spears',
      'Katana Man Dual Blade Dash'
    ]
  },
  {
    name: 'Solo Leveling',
    tag: 'Solo Leveling',
    characters: [
      'Sung Jinwoo Shadow Monarch Throne',
      'Igris Red Knight Commander Sword',
      'Beru Ant King Shadow Guard',
      'Tusk Shadow Sorcerer Magic',
      'Iron Giant Shadow Shield',
      'Double Dungeon Statue Eyes',
      'Sung Jinwoo Dagger Shadow Dash',
      'Cha Hae-In Sword Dance Light',
      'Thomas Andre Goliath Form',
      'Kamish Dragon Shadow Summon'
    ]
  },
  {
    name: 'Spy x Family',
    tag: 'Spy x Family',
    characters: [
      'Anya Forger Starlight Peanut Mission',
      'Loid Forger Twilight Secret Agent',
      'Yor Forger Thorn Princess Blades',
      'Bond Forger Future Vision Canine',
      'Forger Family Elegant Dinner',
      'Eden Academy Starlight Award',
      'Yor Assassin Midnight Shadow',
      'Loid Pistol Silencer Target',
      'Anya Shocked Meme Expression',
      'Franky Informant Gadget Shop'
    ]
  },
  {
    name: 'Studio Ghibli',
    tag: 'Studio Ghibli',
    characters: [
      'Spirited Away Bathhouse Sunset',
      'Howls Moving Castle Sky Walk',
      'Princess Mononoke Forest Spirit Wolf',
      'My Neighbor Totoro Bus Stop Rain',
      'Laputa Castle in the Sky Overlook',
      'Kikis Delivery Service Broom Flight',
      'Porco Rosso Crimson Seaplane',
      'Nausicaa Valley of the Wind',
      'Ponyo Ocean Wave Magic',
      'The Wind Rises Aviation Dream'
    ]
  },
  {
    name: 'Neon Genesis Evangelion',
    tag: 'Evangelion',
    characters: [
      'EVA Unit 01 Purple Awakening',
      'EVA Unit 02 Beast Mode Crimson',
      'Shinji Ikari Third Impact LCL Sea',
      'Rei Ayanami Moon Silhouette',
      'Asuka Langley Soryu Plugsuit',
      'Tokyo-3 GeoFront Sunset Grid',
      'NERV Central Dogma Spear',
      'EVA Unit 00 Prototype Shield',
      'Kaworu Nagisa Angel Halo',
      'Ramiel Geometric Crystal Beam'
    ]
  },
  {
    name: 'Cyberpunk: Edgerunners',
    tag: 'Edgerunners',
    characters: [
      'David Martinez Sandevistan Speed Dash',
      'Lucy Moon Netrunner Cyberspace',
      'Rebecca Akimbo Shotgun Blast',
      'Maine Cyberware Muscle Frame',
      'Dorio Heavy Cyberware Guard',
      'Kiwi Netrunner Mask Hack',
      'Pilar Cyber Tech Hands',
      'Night City Afterlife Bar Sunset',
      'Arasaka Tower Cyber Raid',
      'Cyber Skeleton Overdrive Rampage'
    ]
  },
  {
    name: 'Fullmetal Alchemist: Brotherhood',
    tag: 'Fullmetal Alchemist',
    characters: [
      'Edward Elric Automail Transmutation',
      'Alphonse Elric Armor Fire Seal',
      'Roy Mustang Flame Alchemist Snap',
      'Riza Hawkeye Precision Sniper',
      'King Bradley Wrath Dual Sabers',
      'Greed Ultimate Shield Form',
      'Ling Yao Imperial Dragon Sword',
      'Scar Reconstruction Arm',
      'Father Truth White Gate Void',
      'Maes Hughes Remembrance Flame'
    ]
  },
  {
    name: 'Hunter x Hunter',
    tag: 'Hunter x Hunter',
    characters: [
      'Gon Freecss Adult Form Jajanken',
      'Killua Zoldyck Godspeed Lightning',
      'Kurapika Emperor Time Chains',
      'Hisoka Morrow Bungee Gum Cards',
      'Isaac Netero 100-Type Guanyin Bodhisattva',
      'Meruem Chimera Ant King',
      'Chrollo Lucilfer Bandit Secret',
      'Feitan Pain Packer Rising Sun',
      'Illumi Zoldyck Needle Manipulation',
      'Neferpitou Terpsichora Puppet'
    ]
  },
  {
    name: 'Steins;Gate',
    tag: 'Steins;Gate',
    characters: [
      'Okabe Rintaro Mad Scientist Hououin Kyouma',
      'Makise Kurisu Christina Lab Member 004',
      'Divergence Meter 1.048596 Worldline',
      'Phone Wave Real Time Mail',
      'Mayuri Shiina Tuturu Sunset',
      'Suzuha Amane Time Traveler Bicycle',
      'Akihabara Radio Kaikan Satellite',
      'Future Gadget Laboratory Night',
      'Operation Skuld Time Loop',
      'Worldline Distortion Glitch Art'
    ]
  },
  {
    name: 'Tokyo Ghoul',
    tag: 'Tokyo Ghoul',
    characters: [
      'Kaneki Ken One-Eyed Ghoul Centipede',
      'Touka Kirishima Rabbit Kagune Wings',
      'Anteiku Coffee Shop Midnight Rain',
      'Juuzou Suzuya Jason Scythe',
      'Kisho Arima White Reaper Quinque',
      'Ayato Kirishima Black Rabbit',
      'Uta Mask Maker Studio',
      'Rize Kamishiro Purple Kagune',
      'Shuu Tsukiyama Gourmet Sword',
      'CCG Investigators Squad'
    ]
  },
  {
    name: 'JoJo\'s Bizarre Adventure',
    tag: 'JoJo',
    characters: [
      'Jotaro Kujo Star Platinum Ora Ora',
      'DIO The World Time Stop',
      'Giorno Giovanna Gold Experience Requiem',
      'Josuke Higashikata Crazy Diamond',
      'Joseph Joestar Overdrive Sun Ripple',
      'Bruno Bucciarati Sticky Fingers Zipper',
      'Guido Mista Sex Pistols Bullet',
      'Rohan Kishibe Heavens Door',
      'Yoshikage Kira Killer Queen Bomb',
      'Jolyne Cujo Stone Free String'
    ]
  },
  {
    name: 'Death Note',
    tag: 'Death Note',
    characters: [
      'Light Yagami Kira Writing Notebook',
      'L Lawliet Thinking Chair Sweets',
      'Ryuk Shinigami Red Apple Flight',
      'Misa Amane Shinigami Eyes Gothic',
      'Near SPK Toys Investigation',
      'Mello Chocolate Bar Revenge',
      'Kira Broadcast Red Eye Glow',
      'Death Note Leather Cover Open',
      'Tokyo Police Headquarters Rain',
      'Shinigami Realm Desert Ruins'
    ]
  }
];

const AUTHORS = [
  { name: 'Yuki Arts', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { name: 'Astro Vision Lab', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { name: 'Elena Rostova', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { name: 'Kai Lindqvist', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
  { name: 'Studio Chroma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
  { name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' },
  { name: 'Kenji Takahashi', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { name: 'PixelCraft', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&auto=format&fit=crop&q=80' },
  { name: 'Soren Meyer', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80' },
  { name: 'Neko Visuals', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80' }
];

// Generator function for 1,000 downloadable Anime Wallpapers (50 per franchise)
function generateAnimeWallpapers(): Wallpaper[] {
  const animeWps: Wallpaper[] = [];
  const resolutions: Array<{ tag: '8K' | '4K' | '1440p' | '1080p' | 'Mobile', res: string, size: string }> = [
    { tag: '8K', res: '7680 x 4320', size: '15.4 MB' },
    { tag: '4K', res: '3840 x 2160', size: '7.2 MB' },
    { tag: '1440p', res: '2560 x 1440', size: '4.8 MB' },
    { tag: '1080p', res: '1920 x 1080', size: '3.1 MB' },
    { tag: 'Mobile', res: '1290 x 2796', size: '3.8 MB' }
  ];

  let wpGlobalCounter = 1;

  ANIME_FRANCHISES.forEach((franchise) => {
    for (let itemIdx = 1; itemIdx <= 50; itemIdx++) {
      const characterName = franchise.characters[(itemIdx - 1) % franchise.characters.length];
      const edition = Math.floor((itemIdx - 1) / franchise.characters.length) + 1;
      const title = edition > 1 ? `${characterName} - Art Edition #${edition}` : `${characterName}`;

      const seedUrl = ANIME_IMAGE_SEEDS[(wpGlobalCounter - 1) % ANIME_IMAGE_SEEDS.length];
      const imageSig = (wpGlobalCounter * 53 + itemIdx * 19) % 1000;
      const fullUrl = `${seedUrl}?q=80&w=2560&auto=format&fit=crop&sig=${imageSig}`;
      const thumbUrl = `${seedUrl}?q=80&w=800&auto=format&fit=crop&sig=${imageSig}`;

      const resConfig = resolutions[(wpGlobalCounter - 1) % resolutions.length];
      const isPortrait = resConfig.tag === 'Mobile' || itemIdx % 4 === 0;
      const author = AUTHORS[wpGlobalCounter % AUTHORS.length];

      animeWps.push({
        id: `wp-anime-${wpGlobalCounter}`,
        title,
        description: `High definition ${resConfig.tag} downloadable wallpaper from ${franchise.name}. Features ${title} rendered in crisp Japanese anime styling.`,
        url: fullUrl,
        thumbnailUrl: thumbUrl,
        category: 'Anime',
        resolution: resConfig.res,
        resolutionTag: resConfig.tag,
        size: resConfig.size,
        orientation: isPortrait ? 'portrait' : 'landscape',
        colorHex: ['#0B1220', '#F59E0B', '#D946EF'],
        colorName: 'Orange',
        uploadDate: `2026-07-${(wpGlobalCounter % 28) + 1}`,
        views: 15000 + (wpGlobalCounter * 310) % 45000,
        downloads: 8500 + (wpGlobalCounter * 210) % 32000,
        favorites: 2100 + (wpGlobalCounter * 95) % 11000,
        tags: [
          'Anime',
          franchise.tag,
          franchise.name,
          characterName.split(' ')[0],
          resConfig.tag,
          isPortrait ? 'Mobile' : 'Desktop',
          'HD Download'
        ],
        author,
        isFeatured: wpGlobalCounter % 12 === 0,
        aspectRatio: isPortrait ? '9:16' : '16:9',
      });

      wpGlobalCounter++;
    }
  });

  return animeWps;
}

// Generator function for 500 General Wallpapers across all other categories
function generateGeneralWallpapers(): Wallpaper[] {
  const generalWps: Wallpaper[] = [];
  const categoriesList = Object.keys(GENERAL_IMAGE_SEEDS) as Array<keyof typeof GENERAL_IMAGE_SEEDS>;
  
  const resolutions: Array<{ tag: '8K' | '4K' | '1440p' | '1080p' | 'Mobile', res: string, size: string }> = [
    { tag: '8K', res: '7680 x 4320', size: '16.8 MB' },
    { tag: '4K', res: '3840 x 2160', size: '6.8 MB' },
    { tag: '1440p', res: '2560 x 1440', size: '4.2 MB' },
    { tag: '1080p', res: '1920 x 1080', size: '2.9 MB' },
    { tag: 'Mobile', res: '1290 x 2796', size: '3.5 MB' }
  ];

  const categoryTitleMap: Record<string, string[]> = {
    Cyberpunk: ['Neon Rain Alley', 'Cyber Matrix Horizon', 'Retro Synthwave Highway', 'Future Shinjuku Night', 'Augmented Reality Tower'],
    Space: ['Orion Deep Nebula', 'Supernova Starlight Cloud', 'Cosmic Dust Horizon', 'Andromeda Galaxy Core', 'Titan Moon Eclipse'],
    Nature: ['Cascade Forest Waterfall', 'Alpine Emerald Mountain', 'Golden Horizon Canyon', 'Mystic Pine Mist', 'Ocean Abyssal Wave'],
    Gaming: ['RGB Battlestation Setup', 'Retrowave Grid Sun', 'Cyber Arena League', 'Neon Pixel Fantasy', 'Virtual Reality Node'],
    Cars: ['Dark Matte Hypercar', 'Tokyo Drift Night Machine', 'Classic Vintage Roadster', 'Carbon Fiber Supercar', 'Precision Speed Circuit'],
    AMOLED: ['Pitch Black Silk Curve', 'Minimal Geometric Crystal', 'Pure OLED Prism', 'Deep Obsidian Liquid', 'Subtle Dark Lineage'],
    Abstract: ['Fluorescent Liquid Flow', '3D Prism Polygon', 'Chroma Wave Spectrum', 'Iridescent Glass Sphere', 'Surreal Kinetic Geometry'],
    Minimal: ['Clean Line Horizon', 'Solitary Pine Outline', 'Monochrome Peak', 'Soft Pastel Dawn', 'Negative Space Arc'],
    Architecture: ['Brutalist Concrete Curve', 'Glass Tower Reflection', 'Modernist Spiral Void', 'Metropolis Archway', 'Steel Symmetry'],
    Neon: ['Electric Magenta Tube', 'Cyan Night Glow', 'Fluorescent City Sign', 'Radiant Prism Corridor', 'Vivid Vaporwave Light'],
    Animals: ['Majestic Snow Leopard', 'Bioluminescent Abyss Jellyfish', 'Golden Eagle Horizon', 'Deep Sea Whale Song', 'Wild Timber Wolf'],
    Cities: ['Tokyo Tower Twilight', 'New York Sky Skyline', 'Hong Kong Harbor Lights', 'Paris Midnight Prism', 'Futuristic Shanghai Night'],
    Technology: ['Silicon Microprocessor Core', 'Data Stream Optic Cable', 'Quantum Server Matrix', 'Cyber Security Cipher', 'Nanotech Circuit Board']
  };

  for (let i = 1; i <= 510; i++) {
    const category = categoriesList[(i - 1) % categoriesList.length];
    const titlesForCategory = categoryTitleMap[category] || ['Masterpiece Art'];
    const titleBase = titlesForCategory[(i - 1) % titlesForCategory.length];
    const variation = Math.floor((i - 1) / titlesForCategory.length) + 1;
    const title = variation > 1 ? `${titleBase} #${variation}` : titleBase;

    const seedList = GENERAL_IMAGE_SEEDS[category] || GENERAL_IMAGE_SEEDS.Cyberpunk;
    const seedUrl = seedList[(i - 1) % seedList.length];
    const imageSig = (i * 41 + 100) % 1000;
    const fullUrl = `${seedUrl}?q=80&w=2560&auto=format&fit=crop&sig=${imageSig}`;
    const thumbUrl = `${seedUrl}?q=80&w=800&auto=format&fit=crop&sig=${imageSig}`;

    const resConfig = resolutions[(i - 1) % resolutions.length];
    const isPortrait = resConfig.tag === 'Mobile' || i % 6 === 0;
    const author = AUTHORS[(i + 3) % AUTHORS.length];

    generalWps.push({
      id: `wp-gen-${i}`,
      title,
      description: `Ultra high definition ${resConfig.tag} ${category} wallpaper. Master class background optimized for modern high refresh displays.`,
      url: fullUrl,
      thumbnailUrl: thumbUrl,
      category,
      resolution: resConfig.res,
      resolutionTag: resConfig.tag,
      size: resConfig.size,
      orientation: isPortrait ? 'portrait' : 'landscape',
      colorHex: ['#0B1220', '#38BDF8', '#818CF8'],
      colorName: 'Blue',
      uploadDate: `2026-07-${(i % 28) + 1}`,
      views: 8000 + (i * 310) % 40000,
      downloads: 4500 + (i * 220) % 25000,
      favorites: 1200 + (i * 95) % 9000,
      tags: [category, resConfig.tag, isPortrait ? 'Mobile' : 'Desktop', 'Ultra HD', 'Wallpaper'],
      author,
      isFeatured: i % 20 === 0,
      aspectRatio: isPortrait ? '9:16' : '16:9',
    });
  }

  return generalWps;
}

export const INITIAL_WALLPAPERS: Wallpaper[] = [
  ...generateAnimeWallpapers(),
  ...generateGeneralWallpapers()
];

export const CURATED_COLLECTIONS: Collection[] = [
  {
    id: 'col-1',
    title: 'Anime Masterpieces 1000+',
    description: '1,000 downloadable anime wallpapers from Naruto, One Piece, Attack on Titan, Demon Slayer, Jujutsu Kaisen, Dragon Ball, Solo Leveling, Chainsaw Man & Studio Ghibli.',
    coverUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?q=80&w=1200&auto=format&fit=crop',
    itemCount: 1000,
    wallpaperIds: ['wp-anime-1', 'wp-anime-51', 'wp-anime-101', 'wp-anime-151'],
    isCurated: true,
  },
  {
    id: 'col-2',
    title: '8K Ultra HD Sponsor Masters',
    description: 'Supreme 7680x4320 extreme resolution wallpapers unlocked through 8K sponsor playback.',
    coverUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop',
    itemCount: 300,
    wallpaperIds: ['wp-anime-1', 'wp-gen-1', 'wp-gen-2'],
    isCurated: true,
  },
  {
    id: 'col-3',
    title: 'Cyberpunk Dreams & Neon Alleys',
    description: 'High-octane neon alleys, rain-slicked futuristic cities, and synthwave nightscapes.',
    coverUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?q=80&w=1200&auto=format&fit=crop',
    itemCount: 105,
    wallpaperIds: ['wp-gen-1', 'wp-gen-6'],
    isCurated: true,
  },
  {
    id: 'col-4',
    title: 'OLED Pure Blacks',
    description: 'Deep contrast dark wallpapers engineered to look striking while maximizing battery efficiency.',
    coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop',
    itemCount: 75,
    wallpaperIds: ['wp-gen-4', 'wp-gen-8'],
    isCurated: true,
  },
  {
    id: 'col-5',
    title: 'Minimalist Workspaces',
    description: 'Clean, distraction-free backdrops designed for desktop setups and focused productivity.',
    coverUrl: 'https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?q=80&w=1200&auto=format&fit=crop',
    itemCount: 70,
    wallpaperIds: ['wp-gen-3', 'wp-gen-7'],
    isCurated: true,
  }
];

export const POPULAR_SEARCH_TAGS = [
  'Anime 1000+',
  'Naruto',
  'One Piece',
  'Attack on Titan',
  'Demon Slayer',
  'Jujutsu Kaisen',
  'Gojo 8K',
  'Solo Leveling',
  'Chainsaw Man',
  '8K Ultra HD Ad Unlock',
  'AMOLED Black'
];
