import { useApiStatus as useApiStatusContext } from "../providers/ApiStatusProvider";

export function useApiHealth() {
  const { isApiOnline, checkNow } = useApiStatusContext();
  return { isApiOnline, checkNow };
}
