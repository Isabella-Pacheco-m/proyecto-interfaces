import { useProducts } from "../../Contexts/ProductContext";
import ProductCard from "../../Components/ProductCard/ProductCard.jsx";

export default function FavoritesPage() {
  const { allProducts, favoriteIds } = useProducts();
  const favoriteProducts = allProducts.filter((p) => favoriteIds.includes(p.id));

  return (
    <main>
      <div className="bg-blue-500 text-white py-5 text-center mb-5">
        <h1 className="text-2xl font-bold m-0">Tus favoritos</h1>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {favoriteProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 p-5">
            {favoriteProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold mb-2">No tienes favoritos</h2>
            <p className="text-gray-600 mb-6">Explora productos y marca los que te gusten como favoritos</p>
            <a
              href="/"
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2 rounded-md inline-block hover:shadow-md transition-all"
            >
              Explorar productos
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
