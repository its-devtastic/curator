export interface MediaItem {
  id: number;
  name: string;
  mime: string;
  size: number;
  width: number;
  height: number;
  updatedAt: string;
  createdAt: string;
  url: string;
  folderPath: string;
  ext: string;
  alternativeText: string | null;
  caption: string | null;
  formats: {
    large: {
      url: string;
    };
    medium: {
      url: string;
    };
    small: {
      url: string;
    };
    thumbnail: {
      url: string;
    };
  };
}
