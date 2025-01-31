// hooks/useAuth.js
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useAuth = () => {
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/");
    }
  }, [router]);
};

export default useAuth;
