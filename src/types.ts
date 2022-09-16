export type MDXFrontMatter = {
  title: string;
  subTitle?: string | null;
  description?: string | null;
  date?: string | null;
  category?: string | null;
  tags?: string[] | null;
  draft?: boolean | null;
  slug: string;
  readingTime?: number;
  lastModified?: string | null;
  thumbnail?: string | null;
};
