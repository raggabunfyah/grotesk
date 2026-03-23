interface ProjectUrl {
  text: string;
  url: string;
}

export interface Project {
  title: string;
  date: string;
  subtext: string;
  image?: string;
  gallery?: string[];
  videoUrl?: string;
  url?: string;
  urls?: ProjectUrl[];
}
