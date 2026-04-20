import { Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Videos from './pages/Videos';
import Doctors from './pages/Doctors';
import Game from './pages/Game';
import Pricing from './pages/Pricing';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/videos" element={<Videos />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Layout>
  );
}

export default App;