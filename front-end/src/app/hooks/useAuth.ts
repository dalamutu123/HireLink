import { useAuth as useAuthContextContext } from "../providers/AuthProvider";

export function useAuth() {
  const context = useAuthContextContext();
  return context;
}
