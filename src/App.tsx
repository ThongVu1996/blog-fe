import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SpaceBackground from './components/layout/SpaceBackground';
import AppRoutes from './routes/AppRoutes';

import './assets/styles/index.css';

const App = () => {
  return (
    <BrowserRouter>
      <SpaceBackground />
      <Navbar />
      <main className="main-container">
        <AppRoutes />
      </main>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
