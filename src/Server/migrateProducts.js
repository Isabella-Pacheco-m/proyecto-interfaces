import { db } from '../Firebase/firebase.js'; // instancia de fireStore
import { collection, addDoc, getDocs } from 'firebase/firestore';
import initialProducts from '../Data/products.js'; 

// En este apartado se esta migrando  los datos 

async function migrateToFirestore() { // Función para migrar productos a Firestore de una mejor manera 
  try {
    console.log('🚀 Iniciando migración a Firestore...'); // manejo de errores 
    
    const productosRef = collection(db, 'productos'); // creamos una referencia a productos en Firestore
    const snapshot = await getDocs(productosRef); // obtenemos los documentos existentes en la colección productos
    
    if (!snapshot.empty) {
      console.log(`⚠️  Ya hay ${snapshot.size} productos en Firestore.`); // si ya hay productos, mostramos un mensaje
      console.log('¿Deseas continuar? (Esto agregará más productos)');
    }

    let migrados = 0; 
    for (const product of initialProducts) { // Iteramos sobre los productos iniciales
      try {
        const productoData = { // Estructuramos los datos del producto
          name: product.name, 
          description: product.description,
          price: Number(product.price),
          seller: product.seller,
          tags: product.tags || [],
          image_url: product.imageUrl || product.image_url,
          images: product.images || [],
          createdAt: new Date()
        };

        const docRef = await addDoc(productosRef, productoData); // Agregamos el producto a Firestore
        console.log(`✅ Producto "${product.name}" migrado con ID: ${docRef.id}`); // mostramos mensaje de éxito
        migrados++; 
      } catch (error) {
        console.error(`❌ Error migrando "${product.name}":`, error);
      }
    }

    console.log(`🎉 Migración completada: ${migrados} productos migrados`); // fue exitoso
    
  } catch (error) {
    console.error('💥 Error durante la migración:', error);
  }
}

migrateToFirestore(); 