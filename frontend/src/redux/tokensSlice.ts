import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Token = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  liked: boolean;
  amount: number;
  comment: string;
};

const initialState: Token[] = [];

const tokensSlice = createSlice({
  name: 'tokens',
  initialState,
  reducers: {
    setTokens: (_, action: PayloadAction<Token[]>) => action.payload,
    toggleLike: (state, action: PayloadAction<string>) => {
      const token = state.find(t => t.id === action.payload);
      if (token) token.liked = !token.liked;
    },
    setAmount: (state, action: PayloadAction<{ id: string; amount: number }>) => {
      const token = state.find(t => t.id === action.payload.id);
      if (token) token.amount = action.payload.amount;
    },
    setComment: (state, action: PayloadAction<{ id: string; comment: string }>) => {
      const token = state.find(t => t.id === action.payload.id);
      if (token) token.comment = action.payload.comment;
    },
  },
});

export const { setTokens, toggleLike, setAmount, setComment } = tokensSlice.actions;
export default tokensSlice.reducer;
