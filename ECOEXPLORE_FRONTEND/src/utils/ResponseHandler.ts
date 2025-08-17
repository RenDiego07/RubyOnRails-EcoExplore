interface BackendResponse {
  message?: string;
  error?: string;
  errors?: Record<string, string[]> | string[];
  success?: boolean;
  user?: Record<string, unknown>;
  token?: string;
}

interface ErrorResponse {
  response?: {
    data?: BackendResponse;
    status?: number;
  };
  message?: string;
}

/**
 * Extrae el mensaje de éxito de una respuesta del backend
 */
export const getSuccessMessage = (
  response: unknown,
  defaultMessage: string = 'Operación exitosa'
): string => {
  if (response && typeof response === 'object' && 'message' in response) {
    const message = (response as BackendResponse).message;
    if (typeof message === 'string' && message.trim()) {
      return message;
    }
  }
  return defaultMessage;
};

/**
 * Extrae el mensaje de error de una respuesta del backend
 * Maneja diferentes estructuras de error que puede devolver Rails:
 * - Errores de validación (422): { errors: { field: ["message1", "message2"] } }
 * - Errores de servidor (500): { error: "message" }
 * - Errores de autenticación (401): { message: "Unauthorized" }
 */
export const getErrorMessage = (
  error: unknown,
  defaultMessage: string = 'Ha ocurrido un error inesperado'
): string => {
  console.log('🔍 getErrorMessage - error recibido:', error);

  // Si es un error de axios con response
  if (error && typeof error === 'object' && 'response' in error) {
    const axiosError = error as ErrorResponse;
    const responseData = axiosError.response?.data;
    const status = axiosError.response?.status;

    console.log('🔍 getErrorMessage - responseData:', responseData);
    console.log('🔍 getErrorMessage - status:', status);

    if (responseData) {
      // Caso 1: Errores de validación (similar a Spring Boot)
      // Rails devuelve: { errors: { email: ["ya está en uso"], password: ["es muy corta"] } }
      if (responseData.errors && typeof responseData.errors === 'object') {
        const errors = responseData.errors as Record<string, string[]>;
        const errorMessages = Object.entries(errors)
          .map(([field, messages]) => {
            const fieldName = translateFieldName(field);
            const message = Array.isArray(messages) ? messages[0] : messages;
            return `${fieldName}: ${message}`;
          })
          .join(', ');
        if (errorMessages) {
          return errorMessages;
        }
      }

      // Caso 2: Errores de validación como array simple
      // Rails puede devolver: { errors: ["Email ya está en uso"] }
      if (responseData.errors && Array.isArray(responseData.errors)) {
        return responseData.errors.join(', ');
      }

      // Caso 3: Error simple con campo 'error'
      // Rails devuelve: { error: "Usuario no encontrado" }
      if (responseData.error && typeof responseData.error === 'string') {
        return responseData.error;
      }

      // Caso 4: Mensaje en campo 'message'
      // Rails devuelve: { message: "No autorizado" }
      if (responseData.message && typeof responseData.message === 'string') {
        return responseData.message;
      }
    }

    // Caso 5: Errores HTTP específicos sin data
    switch (status) {
      case 401:
        return 'No autorizado. Por favor, inicia sesión nuevamente.';
      case 403:
        return 'No tienes permisos para realizar esta acción.';
      case 404:
        return 'El recurso solicitado no fue encontrado.';
      case 422:
        return 'Los datos enviados no son válidos.';
      case 500:
        return 'Error interno del servidor. Intenta nuevamente más tarde.';
      case 503:
        return 'Servicio no disponible. Intenta nuevamente más tarde.';
      default:
        if (status && status >= 400) {
          return `Error del servidor (${status}). Intenta nuevamente.`;
        }
    }
  }

  // Caso 6: Error de red o conexión
  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message;
    if (message.includes('Network Error') || message.includes('ERR_NETWORK')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    return message;
  }

  // Caso 7: Error como string simple
  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
};

/**
 * Traduce nombres de campos del inglés al español para errores de validación
 */
const translateFieldName = (field: string): string => {
  const translations: Record<string, string> = {
    email: 'Email',
    password: 'Contraseña',
    password_confirmation: 'Confirmación de contraseña',
    name: 'Nombre',
    first_name: 'Primer nombre',
    last_name: 'Apellido',
    phone_number: 'Teléfono',
    identification: 'Identificación',
    gender: 'Sexo',
    birth_date: 'Fecha de nacimiento',
    // Agrega más traducciones según necesites
  };

  return translations[field] || field.charAt(0).toUpperCase() + field.slice(1);
};

/**
 * Verifica si una respuesta indica éxito
 */
export const isSuccessResponse = (response: unknown): boolean => {
  if (response && typeof response === 'object' && 'success' in response) {
    return Boolean((response as BackendResponse).success);
  }
  return false;
};

/**
 * Extrae datos de usuario de una respuesta exitosa
 */
export const extractUserData = (response: unknown) => {
  if (response && typeof response === 'object' && 'user' in response) {
    return (response as BackendResponse).user;
  }
  return null;
};

/**
 * Extrae token de una respuesta exitosa
 */
export const extractToken = (response: unknown): string | null => {
  if (response && typeof response === 'object' && 'token' in response) {
    const token = (response as BackendResponse).token;
    return typeof token === 'string' ? token : null;
  }
  return null;
};
