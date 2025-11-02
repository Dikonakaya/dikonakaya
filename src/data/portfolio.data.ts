// src/data/portfolio.data.ts
export type PortfolioImage = {
  src: string;
  title?: string;
  description?: string;
  slug?: string;
  tags?: string[];
  location?: string;
  date?: string;
  camera?: string;
  lens?: string;
  iso?: string | number;
  aperture?: string;
  shutter?: string;
  focalLength?: string;
};

export type PortfolioSet = {
  setTitle: string;
  year: number;
  description: string;
  tags: string[];
  images: PortfolioImage[];
};

export const portfolioData: PortfolioSet[] = [
  {
    setTitle: "Mini Cooper",
    year: 2025,
    description: "A set of clean shots of the Mini Cooper.",
    tags: ["car", "mini cooper", "automotive", "photoshoot"],
    images: [
      {
        src: "https://i.imgur.com/NLuGcjE.jpeg",
        title: "Mini Cooper Shot 1",
        description: "Front angle of Mini Cooper.",
        tags: ["car", "mini cooper"],
        date: "2025",
      },
    ],
  },

  {
    setTitle: "Tofu60 V1",
    year: 2025,
    description: "A set of simple shots of the Tofu60 V1 keyboard.",
    tags: ["keyboard", "tofu60", "mechanical keyboard", "custom keyboard"],
    images: [
      { src: "https://i.imgur.com/Hh3RF7n.jpeg", title: "Tofu60 V1", description: "Top view of Tofu60.", tags: ["tofu60"], date: "2025" },
      { src: "https://i.imgur.com/CehvaEy.jpeg", title: "Tofu60 V1", description: "Side profile of Tofu60.", tags: ["tofu60"], date: "2025" },
      { src: "https://i.imgur.com/0n08T6j.jpeg", title: "Tofu60 V1", description: "Angle shot of Tofu60.", tags: ["tofu60"], date: "2025" },
      { src: "https://i.imgur.com/sfhfqnu.jpeg", title: "Tofu60 V1", description: "Detail shot of keycaps.", tags: ["keycaps"], date: "2025" },
      { src: "https://i.imgur.com/V2Bt3bk.jpeg", title: "Tofu60 V1", description: "Desk setup with Tofu60.", tags: ["desk setup"], date: "2025" },
    ],
  },

  {
    setTitle: "RK87",
    year: 2025,
    description: "A set of photos showcasing the RK87 keyboard.",
    tags: ["keyboard", "rk87", "mechanical keyboard"],
    images: [
      { src: "https://i.imgur.com/y8fxrgJ.jpeg", title: "Ninomae Inanis Keyboard", description: "Top view of RK87.", tags: ["rk87"], date: "2025" },
      { src: "https://i.imgur.com/71edzIZ.jpeg", title: "Ninomae Inanis Keyboard", description: "Side angle of RK87.", tags: ["rk87"], date: "2025" },
      { src: "https://i.imgur.com/pkwbtWW.jpeg", title: "Ninomae Inanis Keyboard", description: "Close-up of RK87 caps.", tags: ["keycaps"], date: "2025" },
      { src: "https://i.imgur.com/dh4F5Dk.jpeg", title: "Ninomae Inanis Keyboard", description: "RK87 on desk.", tags: ["desk setup"], date: "2025" },
      { src: "https://i.imgur.com/pdYh59a.jpeg", title: "Ninomae Inanis Keyboard", description: "Angle corner shot of RK87.", tags: ["rk87"], date: "2025" },
    ],
  },

  {
    setTitle: "Jris65",
    year: 2025,
    description: "A collection of clean shots of the Jris65 keyboard.",
    tags: ["keyboard", "jris65", "mechanical keyboard", "custom keyboard"],
    images: [
      { src: "https://i.imgur.com/mRbxWae.jpeg", title: "Jris65 Shot 1", description: "Top angle of Jris65.", tags: ["jris65"], date: "2025" },
      { src: "https://i.imgur.com/Dj39gt9.jpeg", title: "Jris65 Shot 2", description: "Side profile of Jris65.", tags: ["jris65"], date: "2025" },
      { src: "https://i.imgur.com/Lsx3xpq.jpeg", title: "Jris65 Shot 3", description: "Close-up of keycaps.", tags: ["keycaps"], date: "2025" },
      { src: "https://i.imgur.com/27S6hV4.jpeg", title: "Jris65 Shot 4", description: "Jris65 on desk setup.", tags: ["desk setup"], date: "2025" },
      { src: "https://i.imgur.com/dxt23tx.jpeg", title: "Jris65 Shot 5", description: "Angle shot of keyboard.", tags: ["jris65"], date: "2025" },
      { src: "https://i.imgur.com/PqiFjAc.jpeg", title: "Jris65 Shot 6", description: "Macro detail shot.", tags: ["macro"], date: "2025" },
      { src: "https://i.imgur.com/9SUBbRR.jpeg", title: "Jris65 Shot 7", description: "Keyboard with accessories.", tags: ["accessories"], date: "2025" },
    ],
  },

  {
    setTitle: "Keyboard Collection",
    year: 2025,
    description: "A set showcasing multiple keyboards.",
    tags: ["keyboard", "collection", "mechanical keyboard"],
    images: [
      { src: "https://i.imgur.com/N36QEHo.jpeg", title: "Collection Shot 1", description: "Multiple boards on desk.", tags: ["collection"], date: "2025" },
      { src: "https://i.imgur.com/NBx5bFC.jpeg", title: "Collection Shot 2", description: "Boards stacked together.", tags: ["collection"], date: "2025" },
      { src: "https://i.imgur.com/C5f7rCq.jpeg", title: "Collection Shot 3", description: "Angle shot of boards.", tags: ["collection"], date: "2025" },
      { src: "https://i.imgur.com/Wq8smet.jpeg", title: "Collection Shot 4", description: "Keyboards arranged aesthetically.", tags: ["collection"], date: "2025" },
      { src: "https://i.imgur.com/MscI6oi.jpeg", title: "Collection Shot 5", description: "Clean desk layout.", tags: ["desk setup"], date: "2025" },
      { src: "https://i.imgur.com/FLY4xbF.jpeg", title: "Collection Shot 6", description: "Top overview shot.", tags: ["collection"], date: "2025" },
    ],
  },
];
