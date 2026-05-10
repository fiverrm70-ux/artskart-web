import { Route, Routes } from 'react-router-dom';

import AdminLayout from './layouts/AdminLayout/AdminLayout';
import CategoriesPage from './pages/Categories/CategoriesPage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import ProductGalleryPage from './pages/ProductGallery/ProductGalleryPage';
import ProductsPage from './pages/Products/ProductsPage';

function App() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/gallery" element={<ProductGalleryPage />} />
      </Route>
    </Routes>
  );
}

export default App;
