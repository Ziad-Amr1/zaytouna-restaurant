import { Toaster } from "sonner";
import useTheme from "@/hooks/useTheme";

function AppToaster() {
  const { theme } = useTheme();
  return <Toaster className="app-sonner" position="bottom-right" theme={theme} closeButton />;
}

export default AppToaster;