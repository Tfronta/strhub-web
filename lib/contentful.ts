// lib/contentful.ts
import 'server-only';
import { createClient, type EntryCollection } from 'contentful';

const SPACE = process.env.CONTENTFUL_SPACE_ID!;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
export const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_CDA_TOKEN!;
const CPA = process.env.CONTENTFUL_CPA_TOKEN; // opcional

export function getContentfulClient(options?: { preview?: boolean }) {
  const preview = !!options?.preview;
  return createClient({
    space: SPACE,
    accessToken: preview ? (CPA || CONTENTFUL_ACCESS_TOKEN) : CONTENTFUL_ACCESS_TOKEN,
    environment: ENVIRONMENT,
    host: preview ? 'preview.contentful.com' : 'cdn.contentful.com',
  });
}

// Helpers para resolver includes (authors y su photo)
type CFLink = { sys: { type: 'Link'; linkType: 'Entry' | 'Asset'; id: string } };

export type Author = {
  name: string;
  photo?: { url: string; title: string };
};

export function buildIncludesMaps(includes?: EntryCollection<unknown>['includes']) {
  const entries = new Map<string, any>();
  const assets = new Map<string, any>();
  includes?.Entry?.forEach((e: any) => entries.set(e.sys.id, e));
  includes?.Asset?.forEach((a: any) => assets.set(a.sys.id, a));
  return { entries, assets };
}

export function resolveAuthor(link: CFLink, maps: { entries: Map<string, any>, assets: Map<string, any> }): Author | null {
  if (!link?.sys?.id) return null;
  const e = maps.entries.get(link.sys.id);
  if (!e) return null;

  const author: Author = { name: e.fields?.name };
  const photoLink = e.fields?.photo as CFLink | undefined;
  if (photoLink?.sys?.id) {
    const asset = maps.assets.get(photoLink.sys.id);
    const url = asset?.fields?.file?.url;
    if (url) {
      author.photo = {
        url: url.startsWith('http') ? url : `https:${url}`,
        title: asset.fields?.title,
      };
    }
  }
  return author;
}
