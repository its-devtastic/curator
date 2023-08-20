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
  folder: MediaFolder | null;
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

export interface MediaFolder {
  id: number;
  children: { count: 0 };
  createdAt: string;
  files: { count: 0 };
  name: string;
  path: string;
  pathId: number;
  updatedAt: string;
  parent: MediaFolder | null;
}

export interface MediaFolderStructure {
  id: number;
  name: string;
  children: MediaFolderStructure[];
}
