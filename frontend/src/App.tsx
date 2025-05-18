import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import TokenListPage  from './pages/TokenListPage';
import FavouritesPage  from './pages/FavouritesPage';
import { Layout } from './components/Layout/Layout';

function App() {
  return (
    <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<TokenListPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
      </Routes>
    </Layout>
    </Router>
  );
}

export default App;
