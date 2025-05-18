import React, { useState } from 'react';
import {
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  IconButton,
  Box,
  Grid,
  Button,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setTokenAmount, unlikeToken } from '../services/api';
import { setAmount, setComment, toggleLike } from '../redux/tokensSlice';

type TokenFormData = {
  amount: number;
  comment: string;
};

const FavouritesPage: React.FC = () => {
  const tokens = useAppSelector(state => state.tokens.filter(t => t.liked));
  const totalValue = tokens.reduce((sum, t) => sum + t.amount * t.price, 0);
  const dispatch = useAppDispatch();
  
  // Store form data for each token
  const [formData, setFormData] = useState<Record<string, TokenFormData>>(() =>
    tokens.reduce((acc, token) => ({
      ...acc,
      [token.id]: { amount: token.amount, comment: token.comment || '' }
    }), {})
  );

  const handleUnlike = async (id: string) => {
    try {
      await unlikeToken(id);
      dispatch(toggleLike(id));
    } catch (error) {
      console.error('Failed to unlike token:', error);
    }
  };

  const handleSubmit = async (id: string) => {
    try {
      const data = formData[id];
      await setTokenAmount(id, data.amount, data.comment);
      dispatch(setAmount({ id, amount: data.amount }));
      dispatch(setComment({ id, comment: data.comment }));
    } catch (error) {
      console.error('Failed to update token:', error);
    }
  };

  const handleFormChange = (id: string, field: keyof TokenFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: field === 'amount' ? Number(value) || 0 : value
      }
    }));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom mt={4}>
        My cryptocurrencies
      </Typography>

      <Grid container spacing={2}>
        {tokens.map(token => (
          <Grid>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6">
                      {token.name} ({token.symbol})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Current price: ${token.price.toLocaleString()}
                    </Typography>
                     <Typography>
                    Value in USD: ${(token.amount * token.price).toFixed(2)}
                  </Typography>
                  </Box>

                  <IconButton onClick={() => handleUnlike(token.id)}>
                    <Favorite color="error" />
                  </IconButton>
                </Box>

                <Box mt={2}>
                   <label>Amount</label>
                  <TextField
                    type="number"
                    value={formData[token.id]?.amount || 0}
                    onChange={e => handleFormChange(token.id, 'amount', e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <label>Comment</label>
                  <TextField
                    multiline
                    rows={2}
                    value={formData[token.id]?.comment || ''}
                    onChange={e => handleFormChange(token.id, 'comment', e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </Box>

                <Box mt={2}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                    onClick={() => handleSubmit(token.id)}
                  >
                    Submit
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default FavouritesPage;
