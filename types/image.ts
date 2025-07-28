export interface IImage {
    id: string;
    title: string;
    publicId: string;
    transformationType: string;
    width: number | null;
    height: number | null;
    config: any;
    secureURL: string;
    transformationURL: string | null;
    aspectRatio?: string;
    prompt?: string;
    color?: string;
    createdAt: Date;
    updatedAt: Date;
    author?: {
      id: string;
      firstName?: string;
      lastName?: string;
      email?: string;
    } | null;
  }
  