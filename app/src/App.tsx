import type { ReactElement } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import AppLayout from './components/AppLayout';
import Login from './pages/Login';
import Portada from './pages/marketplace/Portada';
import Catalogo from './pages/marketplace/Catalogo';
import Carrito from './pages/marketplace/Carrito';
import Confirmar from './pages/marketplace/Confirmar';

// Guardia: sin sesión vuelve al login recordando a dónde iba.
function Protegida({ children }: { children: ReactElement }) {
  const { usuario } = useAuth();
  const loc = useLocation();
  if (!usuario) return <Navigate to="/login" replace state={{ desde: loc.pathname + loc.search }} />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/marketplace" element={<Protegida><AppLayout /></Protegida>}>
        <Route index element={<Portada />} />
        <Route path="catalogo" element={<Catalogo />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="confirmar" element={<Confirmar />} />
      </Route>
      <Route path="*" element={<Navigate to="/marketplace" replace />} />
    </Routes>
  );
}
