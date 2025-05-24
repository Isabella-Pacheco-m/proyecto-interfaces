import React, { createContext, useState, useContext, useEffect } from "react";
import PropTypes from 'prop-types';
import { db } from '../Firebase/firebase'; 
import { 
  collection, 
  getDocs, 
  doc, 
  getDoc, 
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';

export const ProductContext = createContext();

export const useProducts = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [filters, setFilters] = useState({
    searchTerm: "",
    tags: [],
    priceRange: { min: 0, max: Infinity }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [favoriteIds, setFavoriteIds] = useState([]);

  const toggleFavorite = (productId) => {
    setFavoriteIds((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId) => favoriteIds.includes(productId);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const productosRef = collection(db, 'productos');
      const snapshot = await getDocs(productosRef);
      
      const productos = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        productos.push({
          id: doc.id,
          ...data,
          imageUrl: data.imageUrl || data.image_url || 'https://via.placeholder.com/400x300?text=Producto',
          image_url: data.image_url || data.imageUrl || 'https://via.placeholder.com/400x300?text=Producto'
        });
      });

      setAllProducts(productos);
      console.log("✅ Productos cargados:", productos.length);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('No se pudieron cargar los productos.');
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    const productoEncontrado = allProducts.find((p) => p.id === id);
    if (productoEncontrado) {
      setSelectedProduct(productoEncontrado);
      return productoEncontrado;
    }

    setLoading(true);
    setError(null);
    try {
      const docRef = doc(db, 'productos', id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const producto = {
          id: docSnap.id,
          ...data,
          imageUrl: data.imageUrl || data.image_url,
          image_url: data.image_url || data.imageUrl
        };
        setSelectedProduct(producto);
        return producto;
      } else {
        throw new Error('Producto no encontrado');
      }
    } catch (err) {
      console.error('Error al obtener producto:', err);
      setError('No se pudo obtener el producto.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData) => {
    setLoading(true);
    setError(null);
    try {
      const productoConFecha = {
        ...productData,
        price: Number(productData.price),
        createdAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'productos'), productoConFecha);
      
      const nuevoProducto = {
        id: docRef.id,
        ...productoConFecha,
        createdAt: new Date()
      };

      setAllProducts((prev) => [...prev, nuevoProducto]);
      console.log("✅ Producto agregado:", nuevoProducto);
      return nuevoProducto;
    } catch (err) {
      console.error('Error al agregar producto:', err);
      setError('No se pudo agregar el producto.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let resultado = [...allProducts];

    if (filters.searchTerm) {
      const termino = filters.searchTerm.toLowerCase();
      resultado = resultado.filter(({ name, description = '' }) =>
        name.toLowerCase().includes(termino) ||
        description.toLowerCase().includes(termino)
      );
    }

    if (filters.tags.length > 0) {
      resultado = resultado.filter(({ tags = [] }) =>
        filters.tags.every((tag) => tags.includes(tag))
      );
    }

    const { min, max } = filters.priceRange;
    resultado = resultado.filter(({ price }) => {
      const precio = parseFloat(price);
      if (isNaN(precio)) return false;
      return precio >= min && precio <= max;
    });

    setFilteredProducts(resultado);
  }, [allProducts, filters]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const contextValue = {
    products: filteredProducts,
    allProducts,
    selectedProduct,
    loading,
    error,
    fetchProducts,
    getProductById,
    addProduct,
    updateFilters,
    filters,
    toggleFavorite,
    isFavorite,
    favoriteIds
  };

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};

ProductProvider.propTypes = {
  children: PropTypes.node.isRequired
};