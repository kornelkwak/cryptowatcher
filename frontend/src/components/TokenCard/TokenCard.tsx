import { Typography, IconButton } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { format } from 'date-fns';
import { useAppDispatch } from '../../redux/store';
import { toggleLike } from '../../redux/tokensSlice';
import { likeToken, unlikeToken } from '../../services/api';
import styles from './TokenCard.module.css';

type Props = {
  id: string;
  name: string;
  symbol: string;
  price: number;
  liked: boolean;
  lastUpdated: string;
};

export const TokenCard = ({ id, name, price, liked, lastUpdated }: Props) => {
  const dispatch = useAppDispatch();

  const handleLike = () => {
    dispatch(toggleLike(id));
    liked ? unlikeToken(id) : likeToken(id);
  };

  const formatDate = (date: string) => {
    return format(new Date(date), "MM/dd/yyyy h:mm a");
  };

  return (
    <div className={styles.card}>
      <div className={styles.logoContainer}>
        <img 
          src={`/assets/${name.toLowerCase()}.png`}
          alt={`${name} logo`}
        />
      </div>

      <div className={styles.contentContainer}>
        <Typography
          variant="h5"
          className={styles.tokenName}
        >
          {name}
        </Typography>

        <Typography
          variant="h4"
          className={styles.tokenPrice}
        >
          Current price: ${price.toLocaleString()}
        </Typography>

        <Typography
          variant="body2"
          className={styles.lastCheck}
        >
          Last check: {lastUpdated.toLocaleString()}
        </Typography>
      </div>

      <div className={styles.favoriteButton}>
        <IconButton 
          onClick={handleLike}
          sx={{
            color: liked ? '#ff1744' : 'rgba(255, 255, 255, 0.5)'
          }}
        >
          {liked ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </div>
    </div>
  );
};