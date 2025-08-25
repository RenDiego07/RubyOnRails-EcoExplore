import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export class FirebaseService {
  /**
   * Sube una imagen a Firebase Storage
   * @param file - Archivo de imagen a subir
   * @param folder - Carpeta donde guardar (opcional, por defecto 'sightings')
   * @returns Promise con la URL de descarga
   */
  static async uploadImage(file: File, folder: string = 'sightings'): Promise<string> {
    try {
      console.log('🔄 Iniciando subida de imagen...', file.name);

      // Generar nombre único para el archivo
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2);
      const fileName = `${timestamp}_${randomString}_${file.name}`;

      // Crear referencia al archivo en Storage
      const storageRef = ref(storage, `${folder}/${fileName}`);

      console.log('📁 Referencia creada:', storageRef.toString());

      // Subir archivo con metadatos adicionales
      const metadata = {
        contentType: file.type,
        cacheControl: 'public,max-age=3600',
        customMetadata: {
          uploadedAt: new Date().toISOString(),
          originalName: file.name,
        },
      };

      const snapshot = await uploadBytes(storageRef, file, metadata);
      console.log('✅ Archivo subido:', snapshot.ref.fullPath);

      // Obtener URL de descarga
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('✅ URL obtenida:', downloadURL);

      return downloadURL;
    } catch (error: unknown) {
      console.error('❌ Error detallado al subir imagen:', error);

      // Manejar errores específicos de CORS
      if (
        error instanceof Error &&
        (error.message?.includes('CORS') || error.message?.includes('Cross-Origin'))
      ) {
        throw new Error('Error de configuración CORS. Por favor contacta al administrador.');
      }

      // Manejar otros errores comunes de Firebase
      const firebaseError = error as { code?: string; message?: string };

      if (firebaseError.code === 'storage/unauthorized') {
        throw new Error('No tienes permisos para subir archivos.');
      }

      if (firebaseError.code === 'storage/quota-exceeded') {
        throw new Error('Se ha excedido el límite de almacenamiento.');
      }

      const errorMessage =
        firebaseError.message || (error instanceof Error ? error.message : 'Error desconocido');
      throw new Error(`Error al subir la imagen: ${errorMessage}`);
    }
  }

  /**
   * Elimina una imagen de Firebase Storage
   * @param imageUrl - URL de la imagen a eliminar
   */
  static async deleteImage(imageUrl: string): Promise<void> {
    try {
      // Extraer la ruta del archivo desde la URL
      const url = new URL(imageUrl);
      const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0]);

      // Crear referencia y eliminar
      const imageRef = ref(storage, path);
      await deleteObject(imageRef);

      console.log('✅ Imagen eliminada exitosamente');
    } catch (error) {
      console.error('❌ Error al eliminar imagen:', error);
      throw new Error('Error al eliminar la imagen.');
    }
  }

  /**
   * Valida que el archivo sea una imagen válida
   * @param file - Archivo a validar
   * @returns true si es válido, false si no
   */
  static validateImageFile(file: File): { isValid: boolean; error?: string } {
    // Validar tipo de archivo
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: 'Tipo de archivo no válido. Solo se permiten: JPEG, JPG, PNG, WEBP',
      };
    }

    // Validar tamaño (máximo 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: 'El archivo es demasiado grande. Tamaño máximo: 5MB',
      };
    }

    return { isValid: true };
  }

  /**
   * Redimensiona una imagen antes de subirla (opcional)
   * @param file - Archivo de imagen
   * @param maxWidth - Ancho máximo
   * @param maxHeight - Alto máximo
   * @param quality - Calidad de compresión (0-1)
   * @returns Promise con el archivo redimensionado
   */
  static async resizeImage(
    file: File,
    maxWidth: number = 1200,
    maxHeight: number = 800,
    quality: number = 0.8
  ): Promise<File> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;
      const img = new Image();

      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img;

        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir a Blob y luego a File
        canvas.toBlob(
          (blob) => {
            const resizedFile = new File([blob!], file.name, {
              type: file.type,
              lastModified: Date.now(),
            });
            resolve(resizedFile);
          },
          file.type,
          quality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }
}

export { storage };
export default FirebaseService;
