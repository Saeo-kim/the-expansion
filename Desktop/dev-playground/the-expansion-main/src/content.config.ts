
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const encyclopedia = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/encyclopedia',
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    slug: z.string(),
    status: z.string(),
  }),
});

export const collections = {
  encyclopedia,
};
