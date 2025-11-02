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
];
