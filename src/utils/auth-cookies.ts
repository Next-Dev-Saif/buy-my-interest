// src/utils/auth-cookies.ts

/**
 * Sets the auth-token cookie via the server-side API route.
 * This ensures the cookie is set with HttpOnly for security.
 */
export const setAuthCookie = async (token?: string, profileCompleted?: boolean, email?: string, userRole?: string) => {
  try {
    const response = await fetch('/api/auth/cookie', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, profileCompleted, email, userRole }),
    });

    if (!response.ok) {
      throw new Error('Failed to set auth cookie');
    }
    return true;
  } catch (error) {
    console.error('Error setting auth cookie:', error);
    return false;
  }
};

/**
 * Removes the auth-token cookie via the server-side API route.
 */
export const removeAuthCookie = async () => {
  try {
    const response = await fetch('/api/auth/cookie', {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to remove auth cookie');
    }
    return true;
  } catch (error) {
    console.error('Error removing auth cookie:', error);
    return false;
  }
};
