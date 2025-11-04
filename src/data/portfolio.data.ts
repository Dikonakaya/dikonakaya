export type PortfolioImage = {
  src: string;
  title?: string;
  description?: string;
  other?: string;
  tags?: string[];
  date?: string;
};

export type PortfolioSet = {
  setTitle: string;
  year?: number;
  description?: string;
  other?: string;
  tags?: string[];
  images: PortfolioImage[];
};

export const portfolioData: PortfolioSet[] = [
  {
    setTitle: "Mini Cooper",
    year: 2025,
    description: "A shot of a Mini Cooper on the streets of Sampaloc, Manila",
    other: "Camera: Sony ZV E10 • Lens: 7Artisans 27mm f2.8",
    tags: ["Street Photography", "Car Photography"],
    images: [
      { src: "https://i.imgur.com/NLuGcjE.jpeg" }
    ],
  },

  {
    setTitle: "Tofu60 V1",
    year: 2025,
    description: "A collection of shots showcasing the Tofu60 V1 keyboard",
    other: "Camera: Sony ZV E10 • Lens: Meike 33mm f1.4",
    tags: ["Custom keyboard", "Product Photography"],
    images: [
      { src: "https://i.imgur.com/Hh3RF7n.jpeg" },
      { src: "https://i.imgur.com/CehvaEy.jpeg" },
      { src: "https://i.imgur.com/0n08T6j.jpeg" },
      { src: "https://i.imgur.com/sfhfqnu.jpeg" },
      { src: "https://i.imgur.com/V2Bt3bk.jpeg" },
    ],
  },

  {
    setTitle: "RK87",
    year: 2025,
    description: "A collection of shots showcasing a Ninomae Inanis themed keyboard",
    other: "Camera: Sony ZV E10 • Lens: Viltrox 27mm f1.2 Pro",
    tags: ["Custom keyboard", "Product Photography"],
    images: [
      { src: "https://i.imgur.com/y8fxrgJ.jpeg" },
      { src: "https://i.imgur.com/71edzIZ.jpeg" },
      { src: "https://i.imgur.com/pkwbtWW.jpeg" },
      { src: "https://i.imgur.com/dh4F5Dk.jpeg" },
      { src: "https://i.imgur.com/pdYh59a.jpeg" },
    ],
  },

  {
    setTitle: "Jris65",
    year: 2025,
    description: "A collection of shots showcasing the Jris65 keyboard with WS Aka Hairo Keycaps",
    other: "Camera: Sony ZV E10 • Lens: Viltrox 56mm f1.7 Air",
    tags: ["Custom keyboard", "Product Photography"],
    images: [
      { src: "https://i.imgur.com/mRbxWae.jpeg" },
      { src: "https://i.imgur.com/Dj39gt9.jpeg" },
      { src: "https://i.imgur.com/Lsx3xpq.jpeg" },
      { src: "https://i.imgur.com/27S6hV4.jpeg" },
      { src: "https://i.imgur.com/dxt23tx.jpeg" },
      { src: "https://i.imgur.com/PqiFjAc.jpeg" },
      { src: "https://i.imgur.com/9SUBbRR.jpeg" },
    ],
  },

  {
    setTitle: "2025 Keyboard Collection",
    year: 2025,
    description: "A collection of shots my entire keyboard collection as of early 2025",
    other: "Camera: Sony ZV E10 • Lens: Meike 33mm f1.4",
    tags: ["Custom keyboard", "Product Photography"],
    images: [
      { src: "https://i.imgur.com/N36QEHo.jpeg" },
      { src: "https://i.imgur.com/NBx5bFC.jpeg" },
      { src: "https://i.imgur.com/C5f7rCq.jpeg" },
      { src: "https://i.imgur.com/Wq8smet.jpeg" },
      { src: "https://i.imgur.com/MscI6oi.jpeg" },
      { src: "https://i.imgur.com/FLY4xbF.jpeg" },
    ],
  },

  {
    setTitle: "Minecraft Armor",
    year: 2024,
    description: "3D render of some Minecraft pixel art armor sets that I've made",
    tags: ["Minecraft", "Pixel Art"],
    images: [
      { src: "https://i.imgur.com/9lo873B.gif" },
      { src: "https://i.imgur.com/d9gzrxv.gif" },
      { src: "https://i.imgur.com/TSFNHNj.gif" },
      { src: "https://i.imgur.com/eO4n0yF.gif" },
    ],
  },

  {
    setTitle: "Pixel Art Characters",
    year: 2024,
    description: "A showcase of some pixel art characters I've created",
    tags: ["Pixel Art"],
    images: [
      { src: "https://i.imgur.com/7vfaCJf.png" },
      { src: "https://i.imgur.com/RRwhQYM.png" },
      { src: "https://i.imgur.com/o1GzXd1.gif" },
    ],
  },

  {
    setTitle: "Pixel Art Portraits",
    year: 2024,
    description: "Portraits of different themed subjects",
    tags: ["Minecraft", "Pixel Art"],
    images: [
      { src: "https://i.imgur.com/cbpMLui.png" },
      { src: "https://i.imgur.com/Iyqy0hN.png" },
      { src: "https://i.imgur.com/Hhsqh9m.png" },
      { src: "https://i.imgur.com/N9aXQsf.png" },
      { src: "https://i.imgur.com/lk7EqPA.png" },
      { src: "https://i.imgur.com/yeKOol4.png" },
      { src: "https://i.imgur.com/A8eqoy9.png" },
    ],
  },

  {
    setTitle: "Chest Portraits",
    year: 2024,
    description: "Pixel art portraits of various Minecraft chests",
    tags: ["Minecraft", "Pixel Art"],
    images: [
      { src: "https://i.imgur.com/YNh6LlF.png" },
      { src: "https://i.imgur.com/bWFLdto.png" },
      { src: "https://i.imgur.com/juGWtv6.png" },
      { src: "https://i.imgur.com/Y5WEJi0.png" },
      { src: "https://i.imgur.com/T9UWPPk.png" },
    ],
  },

  {
    setTitle: "Minecraft GUI",
    year: 2024,
    description: "Pixel art of various GUI designed for custom Minecraft servers resource packs",
    tags: ["Minecraft", "Pixel Art"],
    images: [
      { src: "https://i.imgur.com/dROfED0.png" },
      { src: "https://i.imgur.com/mfOZBcG.png" },
      { src: "https://i.imgur.com/ZCYI4Wa.png" },
      { src: "https://i.imgur.com/EVmkTsu.png" },
      { src: "https://i.imgur.com/hoiSaHl.png" },
      { src: "https://i.imgur.com/cDvVjIl.png" },
      { src: "https://i.imgur.com/k83URwz.png" },
      { src: "https://i.imgur.com/GVuwWWs.png" },
    ],
  },

  {
    setTitle: "Pixel Art Banners",
    year: 2024,
    description: "Pixel art banners, some designed for Minecraft server advertising",
    tags: ["Minecraft", "Pixel Art"],
    images: [
      { src: "https://i.imgur.com/z6OExwz.png" },
      { src: "https://i.imgur.com/0L2mzLV.png" },
    ],
  },
];
