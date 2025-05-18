
import { AppBar, Box, Typography } from '@mui/material';
import { useAppSelector } from '../../redux/store';

export const Navbar = () => {
  const tokens = useAppSelector(state => state.tokens);
  const portfolioValue = tokens
    .filter(t => t.liked)
    .reduce((sum, token) => sum + token.amount * token.price, 0);

  return (
    <AppBar 
      position="static" 
      sx={{ 
          backgroundColor: '#1E1E1E',
          boxShadow: 'none',
          borderBottom: '1px solid #333'
        }}
        >
      <Box 
        display="flex" 
        justifyContent="space-between" 
        alignItems="center" 
        px={3} 
        py={2}
        >
        <Typography 
          variant="h5" 
          component="h1" 
          sx={{ 
              fontFamily: 'monospace',
              fontWeight: 'bold'
            }}
            >
          CryptoWatcher
        </Typography>
        
        <Typography 
          variant="subtitle1" 
          sx={{ 
              color: '#A0A0A0'
            }}
            >
          My wallet USD value: ${portfolioValue.toLocaleString()}
        </Typography>
      </Box>
    </AppBar>
  );
};