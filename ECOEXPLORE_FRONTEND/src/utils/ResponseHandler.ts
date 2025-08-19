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
      if (responseData.errors && Array.isArray(responseData.errors)) {
        return responseData.errors.join(', ');
      }

      if (responseData.error && typeof responseData.error === 'string') {
        return responseData.error;
      }
      if (responseData.message && typeof responseData.message === 'string') {
        return responseData.message;
      }
    }

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

  if (error && typeof error === 'object' && 'message' in error) {
    const message = (error as { message: string }).message;
    if (message.includes('Network Error') || message.includes('ERR_NETWORK')) {
      return 'Error de conexión. Verifica tu conexión a internet.';
    }
    return message;
  }

  if (typeof error === 'string') {
    return error;
  }

  return defaultMessage;
};

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
  };

  return translations[field] || field.charAt(0).toUpperCase() + field.slice(1);
};

export const isSuccessResponse = (response: unknown): boolean => {
  if (response && typeof response === 'object' && 'success' in response) {
    return Boolean((response as BackendResponse).success);
  }
  return false;
};

export const extractUserData = (response: unknown) => {
  if (response && typeof response === 'object' && 'user' in response) {
    return (response as BackendResponse).user;
  }
  return null;
};

export const extractToken = (response: unknown): string | null => {
  if (response && typeof response === 'object' && 'token' in response) {
    const token = (response as BackendResponse).token;
    return typeof token === 'string' ? token : null;
  }
  return null;
};
