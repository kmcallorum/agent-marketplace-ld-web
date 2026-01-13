import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Agent } from '@/types';

interface AgentsState {
  featured: Agent[];
  trending: Agent[];
  recent: Agent[];
  starredSlugs: Set<string>;
}

const initialState: AgentsState = {
  featured: [],
  trending: [],
  recent: [],
  starredSlugs: new Set(),
};

const agentsSlice = createSlice({
  name: 'agents',
  initialState,
  reducers: {
    setFeaturedAgents: (state, action: PayloadAction<Agent[]>) => {
      state.featured = action.payload;
    },
    setTrendingAgents: (state, action: PayloadAction<Agent[]>) => {
      state.trending = action.payload;
    },
    setRecentAgents: (state, action: PayloadAction<Agent[]>) => {
      state.recent = action.payload;
    },
    addStarredAgent: (state, action: PayloadAction<string>) => {
      state.starredSlugs = new Set([...state.starredSlugs, action.payload]);
    },
    removeStarredAgent: (state, action: PayloadAction<string>) => {
      const newSet = new Set(state.starredSlugs);
      newSet.delete(action.payload);
      state.starredSlugs = newSet;
    },
    setStarredAgents: (state, action: PayloadAction<string[]>) => {
      state.starredSlugs = new Set(action.payload);
    },
  },
});

export const {
  setFeaturedAgents,
  setTrendingAgents,
  setRecentAgents,
  addStarredAgent,
  removeStarredAgent,
  setStarredAgents,
} = agentsSlice.actions;

export default agentsSlice.reducer;
