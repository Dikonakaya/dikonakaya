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
    name: "Hero of the Village",
    subtitle: "16x Minecraft Texture Pack",
    thumbnail: "https://i.imgur.com/F5yAqs7.png",
    year: 2022,
    description: "An RPG themed texture pack designed for the latest version of Minecraft",
    tags: ["Minecraft", "16x", "Texture Pack", "Pixel Art"],
    getUrl: "https://www.planetminecraft.com/texture-pack/hero-of-the-village-5650302/",
  },
];
