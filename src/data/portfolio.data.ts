export type PortfolioImage = {
  src: string;
  title?: string;
  description?: string;
  tags?: string[];
  location?: string;
  date?: string;
  camera?: string;
  lens?: string;
};

export type PortfolioSet = {
  setTitle: string;
  year?: number;
  description?: string;
  tags?: string[];
  images: PortfolioImage[];
};

export const portfolioData: PortfolioSet[] = [
  {
    setTitle: "Mini Cooper",
    year: 2025,
    description: "A set of clean shots of the Mini Cooper.",
    tags: ["car", "mini cooper", "automotive", "photoshoot"],
    images: [
      { src: "https://i.imgur.com/NLuGcjE.jpeg" }
    ],
  },

  {
    setTitle: "Tofu60 V1",
    year: 2025,
    description: "A set of simple shots of the Tofu60 V1 keyboard.",
    tags: ["keyboard", "tofu60", "mechanical keyboard", "custom keyboard"],
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
    description: "A set of photos showcasing the RK87 keyboard.",
    tags: ["keyboard", "rk87", "mechanical keyboard"],
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
    description: "A collection of clean shots of the Jris65 keyboard.",
    tags: ["keyboard", "jris65", "mechanical keyboard", "custom keyboard"],
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
    setTitle: "Keyboard Collection",
    year: 2025,
    description: "A set showcasing multiple keyboards.",
    tags: ["keyboard", "collection", "mechanical keyboard"],
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
    setTitle: "Minecraft Skins & Armor",
    year: 2024,
    description: "A set showcasing multiple keyboards.",
    tags: ["keyboard", "collection", "mechanical keyboard"],
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
    description: "A set showcasing multiple keyboards.",
    tags: ["keyboard", "collection", "mechanical keyboard"],
    images: [
      { src: "https://i.imgur.com/7vfaCJf.png" },
      { src: "https://i.imgur.com/WzPHETX.png" },
      { src: "https://i.imgur.com/o1GzXd1.gif" },
    ],
  },

  {
    setTitle: "Pixel Art Portraits",
    year: 2024,
    description: "A set showcasing multiple keyboards.",
    tags: ["keyboard", "collection", "mechanical keyboard"],
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
    description: "A set showcasing multiple keyboards.",
    tags: ["keyboard", "collection", "mechanical keyboard"],
    images: [
      { src: "https://i.imgur.com/YNh6LlF.png" },
      { src: "https://i.imgur.com/bWFLdto.png" },
      { src: "https://i.imgur.com/juGWtv6.png" },
      { src: "https://i.imgur.com/Y5WEJi0.png" },
      { src: "https://i.imgur.com/T9UWPPk.png" },
    ],
  },

  {
    setTitle: "GUI",
    year: 2024,
    description: "A set showcasing multiple keyboards.",
    tags: ["keyboard", "collection", "mechanical keyboard"],
    images: [
      { src: "https://i.imgur.com/dROfED0.png" },
      { src: "https://i.imgur.com/mfOZBcG.png" },
      { src: "https://i.imgur.com/ZCYI4Wa.png" },
      { src: "https://i.imgur.com/k83URwz.png" },
      { src: "https://i.imgur.com/EVmkTsu.png" },
      { src: "https://i.imgur.com/hoiSaHl.png" },
      { src: "https://i.imgur.com/cDvVjIl.png" },
    ],
  },

  {
    setTitle: "Pixel Art Banners",
    year: 2024,
    description: "A set showcasing multiple keyboards.",
    tags: ["keyboard", "collection", "mechanical keyboard"],
    images: [
      { src: "https://i.imgur.com/0L2mzLV.png" },
      { src: "https://i.imgur.com/z6OExwz.png" },
    ],
  },

  {
    setTitle: "More GUI",
    year: 2024,
    description: "A set showcasing multiple keyboards.",
    tags: ["keyboard", "collection", "mechanical keyboard"],
    images: [
      { src: "https://i.imgur.com/GVuwWWs.png" },
    ],
  },
];
