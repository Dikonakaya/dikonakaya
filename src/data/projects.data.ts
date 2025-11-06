export type ProjectImage = {
  src: string;
  title?: string;
  description?: string;
};

export type Project = {
  name: string;
  subtitle?: string;
  thumbnail: string;
  year?: number;
  description?: string;
  tags?: string[];
  images?: ProjectImage[];
  viewUrl?: string;
  getUrl?: string;
};

export const projectsData: Project[] = [
  {
    name: "Project Alpha",
    subtitle: "Early prototyping & research",
    thumbnail: "https://i.imgur.com/NLuGcjE.jpeg",
    year: 2025,
    description: "A short description of Project Alpha. This is placeholder content.",
    tags: ["prototype", "research"],
    images: [
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 1" },
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 2" },
    ],
    viewUrl: "https://example.com/view/project-alpha",
    getUrl: "https://example.com/get/project-alpha",
  },
  {
    name: "Project Beta",
    subtitle: "Design and polish",
    thumbnail: "https://i.imgur.com/Hh3RF7n.jpeg",
    year: 2024,
    description: "Placeholder project showcasing design iterations and polish.",
    tags: ["design", "ui"],
    images: [
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 1" },
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 2" },
    ],
    viewUrl: "https://example.com/view/project-beta",
    getUrl: "https://example.com/get/project-beta",
  },
  {
    name: "Project Gamma",
    subtitle: "Production-ready builds",
    thumbnail: "https://i.imgur.com/CehvaEy.jpeg",
    year: 2023,
    description: "Placeholder content for a finished project sample.",
    tags: ["production", "release"],
    images: [
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 1" },
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 2" },
    ],
    viewUrl: "https://example.com/view/project-gamma-1",
    getUrl: "https://example.com/get/project-gamma-1",
  },
  {
    name: "Project Gamma",
    subtitle: "Production-ready builds",
    thumbnail: "https://i.imgur.com/0n08T6j.jpeg",
    year: 2023,
    description: "Placeholder content for a finished project sample.",
    tags: ["production", "release"],
    images: [
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 1" },
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 2" },
    ],
    viewUrl: "https://example.com/view/project-gamma-2",
    getUrl: "https://example.com/get/project-gamma-2",
  },
  {
    name: "Project Gamma",
    subtitle: "Production-ready builds",
    thumbnail: "https://i.imgur.com/V2Bt3bk.jpeg",
    year: 2023,
    description: "Placeholder content for a finished project sample.",
    tags: ["production", "release"],
    images: [
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 1" },
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 2" },
    ],
    viewUrl: "https://example.com/view/project-gamma-3",
    getUrl: "https://example.com/get/project-gamma-3",
  },
  {
    name: "Project Gamma",
    subtitle: "Production-ready builds",
    thumbnail: "https://i.imgur.com/sfhfqnu.jpeg",
    year: 2023,
    description: "Placeholder content for a finished project sample.",
    tags: ["production", "release"],
    images: [
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 1" },
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 2" },
    ],
    viewUrl: "https://example.com/view/project-gamma-4",
    getUrl: "https://example.com/get/project-gamma-4",
  },
  {
    name: "Project Gamma",
    subtitle: "Production-ready builds",
    thumbnail: "https://i.imgur.com/pdYh59a.jpeg",
    year: 2023,
    description: "Placeholder content for a finished project sample.",
    tags: ["production", "release"],
    images: [
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 1" },
      { src: "https://i.imgur.com/NLuGcjE.jpeg", title: "Alpha 2" },
    ],
    viewUrl: "https://example.com/view/project-gamma-5",
    getUrl: "https://example.com/get/project-gamma-5",
  },
];
