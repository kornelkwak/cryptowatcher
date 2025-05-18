import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { AttachMoney, Favorite } from '@mui/icons-material';

export const Sidebar = () => {
  const navigate = useNavigate();

  return (
      <Box
        sx={{
          width: 240,
          backgroundColor: '#2A2A2A',
          height: '100vh',
          color: 'white',
        }}
      >
        <List>
          <ListItem onClick={() => navigate('/')}>
            <ListItemIcon>
              <AttachMoney sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Pick favourites" />
          </ListItem>
          <ListItem onClick={() => navigate('/favourites')}>
            <ListItemIcon>
              <Favorite sx={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="My cryptocurrencies" />
          </ListItem>
        </List>
      </Box>
  );
}
