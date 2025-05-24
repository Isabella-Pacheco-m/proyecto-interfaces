import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs,
  serverTimestamp 
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../../Firebase/firebase"; // Ajusta la ruta según tu estructura

export default function CommentSection({ productId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, authLoading, error] = useAuthState(auth);


  useEffect(() => {
    loadComments();
  }, [productId]);

  const loadComments = async () => {
    if (!productId) return;

    try {
      setLoading(true);

      const q = query(
        collection(db, "comentarios"),
        where("productId", "==", productId),
        orderBy("createdAt", "desc")
      );

      const querySnapshot = await getDocs(q);
      const commentsData = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log("Comentario encontrado:", data);
        commentsData.push({
          id: doc.id,
          ...data,
          date: data.createdAt?.toDate ? formatDate(data.createdAt.toDate()) : 'Ahora'
        });
      });
      
      console.log("Total comentarios cargados:", commentsData.length);
      setComments(commentsData);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);

      try {
        const q = query(
          collection(db, "comentarios"),
          where("productId", "==", productId)
        );
        const querySnapshot = await getDocs(q);
        const commentsData = [];
        
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          commentsData.push({
            id: doc.id,
            ...data,
            date: data.createdAt?.toDate ? formatDate(data.createdAt.toDate()) : 'Ahora'
          });
        });
        
        commentsData.sort((a, b) => {
          if (!a.createdAt || !b.createdAt) return 0;
          return b.createdAt.toDate() - a.createdAt.toDate();
        });
        
        setComments(commentsData);
      } catch (secondError) {
        console.error("Error secundario al cargar comentarios:", secondError);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const now = new Date();
    const diff = now - date;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days} día${days > 1 ? 's' : ''} atrás`;
    } else if (hours > 0) {
      return `${hours} hora${hours > 1 ? 's' : ''} atrás`;
    } else if (minutes > 0) {
      return `${minutes} minuto${minutes > 1 ? 's' : ''} atrás`;
    } else {
      return 'Justo ahora';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) return;
    
    if (!user) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("Enviando comentario para producto:", productId);
      
      const docRef = await addDoc(collection(db, "comentarios"), {
        productId: productId,
        content: newComment.trim(),
        userId: user.uid,
        userName: user.displayName || user.email || "Usuario Anónimo",
        userEmail: user.email,
        createdAt: serverTimestamp()
      });

      console.log("Comentario guardado con ID:", docRef.id);
      setNewComment("");
      
      // Esperamos un tris antes de recargar para que el serverTimestamp se procese
      setTimeout(async () => {
        await loadComments();
      }, 1000);
      
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      alert("Error al enviar el comentario. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="bg-white rounded-lg p-5">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
          <div className="h-20 bg-gray-200 rounded mb-4"></div>
          <div className="h-16 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-5">
      <h2 className="text-xl font-semibold mb-5">
        Comentarios ({comments.length})
      </h2>

      {/* Formulario */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-5">
          <div className="flex gap-2.5 items-start">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              {user.photoURL ? (
                <img 
                  src={user.photoURL} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-gray-500" />
              )}
            </div>
            <div className="flex-grow">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Escribe un comentario..."
                rows={3}
                className="w-full p-2.5 border border-gray-300 rounded-lg resize-none text-base focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <div className="mt-2.5 text-right">
                <button 
                  type="submit" 
                  disabled={isSubmitting || !newComment.trim()}
                  className={`font-medium py-2 px-4 rounded-md text-white transition-all duration-300 ${
                    isSubmitting || !newComment.trim()
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-md hover:scale-[1.02]"
                  }`}
                >
                  {isSubmitting ? "Enviando..." : "Comentar"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-5 p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-gray-600 mb-2">Inicia sesión para poder comentar</p>
          <button 
            onClick={() => {

              window.location.href = '/login'; 
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-md hover:shadow-md transition-all duration-300"
          >
            Iniciar Sesión
          </button>
        </div>
      )}


      <div className="mt-5">
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay comentarios aún. ¡Sé el primero en comentar!</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-2.5 mb-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                <User size={20} className="text-gray-500" />
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                  <span className="font-semibold text-gray-900">
                    {comment.userName}
                  </span>
                  <span className="text-sm text-gray-500">
                    •
                  </span>
                  <span className="text-sm text-gray-500">
                    {comment.date}
                  </span>
                </div>
                <p className="text-gray-700 break-words">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}