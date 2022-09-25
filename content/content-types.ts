export interface MediaType {
  name?: string;
  file: string;
  width: number;
  height: number;
  maxHeight?: number;
}

export interface PhotographType extends MediaType {
  type: 'Photograph';
}

export interface MultiPartPhotographType {
  type: 'MultiPartPhotograph';
  parts: MediaType[];
  variant: 'vertical' | 'horizontal';
}

export type WorkType = PhotographType | MultiPartPhotographType;

export interface GalleryType {
  name: string;
  slug: string;
  showPagination: boolean;
  isComissioned: boolean;
  work: WorkType[];
}

export interface SiteDataType {
  title: string;
  description: string;
  keywords: string;
  url: string;
  email: string;
  work: PhotographType[];
  galleries: GalleryType[];
}

export interface JournalEntryType {
  title: string;
  work: PhotographType[];
}
