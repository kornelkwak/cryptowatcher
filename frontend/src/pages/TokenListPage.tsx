import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setTokens } from '../redux/tokensSlice';
import { fetchTokens } from '../services/api';
import { TokenCard } from '../components/TokenCard/TokenCard';
import { Box, Typography, Container } from '@mui/material';


const TokenListPage = () => {
  const dispatch = useAppDispatch();
  const tokens = useAppSelector(state => state.tokens);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokens()
      .then(res => {
        dispatch(setTokens(res.data));
        setError(null);
      })
      .catch(err => {
        setError(err.message);
      });
  }, [dispatch]);

  if (error) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom mt={4}>
          My cryptocurrencies
        </Typography>
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom mt={4}>
        My cryptocurrencies
      </Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2
      }}>
        {tokens.map(token => (
          <TokenCard lastUpdated={''} key={token.id} {...token} />
        ))}
      </Box>
    </Container>
  );
};

export default TokenListPage;