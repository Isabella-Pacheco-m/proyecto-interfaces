import React, { useEffect, useState } from 'react';
import { db } from '../../Firebase/firebase'; 
import { collection, getDocs } from 'firebase/firestore';
import { useProducts } from '../../Contexts/ProductContext';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const { allProducts } = useProducts();

  useEffect(() => {
    const fetchOrders = async () => {
      const snapshot = await getDocs(collection(db, 'pedidos'));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };

    fetchOrders();
  }, []);

  const getProductName = (id) => {
    const product = allProducts.find(p => p.id === id);
    return product?.name || 'Producto desconocido';
  };

  return (
    <main>
      <div className="bg-blue-500 text-white py-5 text-center mb-5">
        <h1 className="text-2xl font-bold m-0">Tus pedidos</h1>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Tus pedidos</h1>

        {orders.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold mb-2">No tienes pedidos activos</h2>
            <p className="text-gray-600">Cuando contactes a un vendedor y confirmes una compra, aparecerá aquí</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="p-4 border rounded shadow-sm">
                <h3 className="text-lg font-semibold">{getProductName(order.productId)}</h3>
                <p><strong>Nombre:</strong> {order.name}</p>
                <p><strong>Ubicación:</strong> {order.location}</p>
                <p><strong>Teléfono:</strong> {order.phone}</p>
                {order.message && <p><strong>Mensaje:</strong> {order.message}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
