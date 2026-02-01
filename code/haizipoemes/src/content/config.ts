import { defineCollection, z } from 'astro:content';

// 诗歌集合
const poemsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    type: z.enum(['short', 'long', 'sun', 'essay']).optional(),
    year: z.string().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number().optional(),
  }),
});

// 时间轴集合
const timelineCollection = defineCollection({
  type: 'content',
  schema: z.object({
    year: z.number(),
    title: z.string(),
    images: z.array(z.string()).optional(),
    order: z.number().optional(),
  }),
});

export const collections = {
  poems: poemsCollection,
  timeline: timelineCollection,
};
