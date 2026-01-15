import { z } from 'zod';

export const agentCreateSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters').max(100),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000),
  category: z.string().min(1, 'Category is required'),
  version: z.string().regex(/^\d+\.\d+\.\d+$/, 'Version must be in format X.Y.Z'),
});

export const agentPublishSchema = agentCreateSchema.extend({
  codeFile: z.instanceof(File, { message: 'Code file is required' }),
});

export const reviewCreateSchema = z.object({
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).optional(),
  category: z.string().optional(),
  min_rating: z.number().min(1).max(5).optional(),
  sort: z.enum(['relevance', 'downloads', 'stars', 'rating', 'created_at']).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

export type AgentCreateInput = z.infer<typeof agentCreateSchema>;
export type AgentPublishInput = z.infer<typeof agentPublishSchema>;
export type ReviewCreateInput = z.infer<typeof reviewCreateSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
