import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

// Páginas
import HomePage from "./Pages/Homepage/homepage.jsx";
import HelpPage from "./Pages/Help/help.jsx";
import OrdersPage from "./Pages/Orders/orders.jsx";
import SellPage from "./Pages/Sell/sell.jsx";
import FavoritesPage from "./Pages/Favorites/favorites.jsx";
import ProductPage from "./Pages/Product/product.jsx";
import LoginPage from "./Pages/Auth/LoginPage.jsx";
import RegisterPage from "./Pages/Auth/RegisterPage.jsx";

// Componentes comunes
import Header from "./Components/Header/Header.jsx";
import Footer from "./Components/Footer/footer.jsx";

// Rutas protegidas
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute.jsx";

// Contexto
import { ProductProvider } from "./Contexts/ProductContext";
import { AuthProvider } from "./Contexts/authContext";

function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/ayuda" element={<HelpPage />} />
            <Route path="/pedidos" element={
              <ProtectedRoute>
                <OrdersPage />
              </ProtectedRoute>
            } />
            <Route path="/vender" element={
              <ProtectedRoute>
                <SellPage />
              </ProtectedRoute>
            } />
            <Route path="/favoritos" element={
              <ProtectedRoute>
                <FavoritesPage />
              </ProtectedRoute>
            } />
            <Route path="/producto/:id" element={
              <ProtectedRoute>
                <ProductPage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/home" element={<HomePage />} />
          </Routes>
          <Footer />
        </Router>
      </ProductProvider>
    </AuthProvider>
  );
}

export default App;