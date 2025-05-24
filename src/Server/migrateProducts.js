import { db } from '../Firebase/firebase.js';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import initialProducts from '../Data/products.js'; 

async function migrateToFirestore() {
  try {
    console.log('🚀 Iniciando migración a Firestore...');
    
    const productosRef = collection(db, 'productos');
    const snapshot = await getDocs(productosRef);
    
    if (!snapshot.empty) {
      console.log(`⚠️  Ya hay ${snapshot.size} productos en Firestore.`);
      console.log('¿Deseas continuar? (Esto agregará más productos)');
    }

    let migrados = 0;
    for (const product of initialProducts) {
      try {
        const productoData = {
          name: product.name,
          description: product.description,
          price: Number(product.price),
          seller: product.seller,
          tags: product.tags || [],
          image_url: product.imageUrl || product.image_url,
          images: product.images || [],
          createdAt: new Date()
        };

        const docRef = await addDoc(productosRef, productoData);
        console.log(`✅ Producto "${product.name}" migrado con ID: ${docRef.id}`);
        migrados++;
      } catch (error) {
        console.error(`❌ Error migrando "${product.name}":`, error);
      }
    }

    console.log(`🎉 Migración completada: ${migrados} productos migrados`);
    
  } catch (error) {
    console.error('💥 Error durante la migración:', error);
  }
}

migrateToFirestore();