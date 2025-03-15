import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import apiClient from "./apiClient";

interface DecodedToken {
  id: string;
  email: string;
  specialization: string;
  iat: number;
  exp: number;
}

/**
 * Check if the user has a valid session
 */
export const checkSession = (): boolean => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return false;
    
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    console.error("Session validation error:", error);
    return false;
  }
};

/**
 * Get user data from the decoded token
 */
export const getUserFromToken = (): Partial<DecodedToken> | null => {
  try {
    const token = Cookies.get("accessToken");
    if (!token) return null;
    
    const decoded = jwtDecode<DecodedToken>(token);
    return {
      id: decoded.id,
      email: decoded.email,
      specialization: decoded.specialization
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

/**
 * Logout the user completely
 * - Clears tokens and cached data
 * - Optionally invalidates the token on the server
 * - Redirects to login page
 */
export const logout = async (notifyServer = true): Promise<void> => {
  try {
    // First, get the token before removing it (we might need it for server notification)
    const token = Cookies.get("accessToken");
    
    // 1. Clear client-side auth data
    Cookies.remove("accessToken");
    localStorage.removeItem("doctorData");
    
    // 2. Optionally notify server to invalidate the token (best practice for security)
    if (notifyServer && token) {
      try {
        await apiClient.post("/auth/logout", {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log("✅ Server notified of logout");
      } catch (error) {
        // Even if server logout fails, continue with client-side logout
        console.error("Server logout notification failed:", error);
      }
    }
    
    console.log("✅ Logout successful");
    
    // 3. Redirect to login page
    // Note: In a utility function, we can't use router.push directly,
    // instead we use window.location for navigation
    window.location.href = "/";
    
  } catch (error) {
    console.error("Logout error:", error);
    // Ensure redirect happens even if there was an error
    window.location.href = "/";
  }
};
