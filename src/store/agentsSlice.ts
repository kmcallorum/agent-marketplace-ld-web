import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Agent } from '@/types';

interface AgentsState {
  featured: Agent[];
  trending: Agent[];
  recent: Agent[];
  starredSlugs: string[];
}

const initialState: AgentsState = {
  featured: [],
  trending: [],
  recent: [],
  starredSlugs: [],
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
      if (!state.starredSlugs.includes(action.payload)) {
        state.starredSlugs.push(action.payload);
      }
    },
    removeStarredAgent: (state, action: PayloadAction<string>) => {
      state.starredSlugs = state.starredSlugs.filter(slug => slug !== action.payload);
    },
    setStarredAgents: (state, action: PayloadAction<string[]>) => {
      state.starredSlugs = action.payload;
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
