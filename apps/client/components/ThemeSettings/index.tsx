import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { useSidebar } from "@/shadcn/ui/sidebar";
import { Monitor, Moon, Sun } from "lucide-react";

export default function ThemeSettings() {
  const { theme, setTheme } = useTheme();
  const { state } = useSidebar();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div>
      <main className="relative">
        <div className="flex justify-center">
          <Select onValueChange={setTheme} value={theme}>
            <SelectTrigger className={`${state === "expanded" ? "w-[280px]" : "hidden"}`}>
              {state === "expanded" ? (
                <SelectValue placeholder="Select a theme" />
              ) : (
                <Moon className="size-4" />
              )}
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="light">
                  <span className="flex items-center gap-2">
                    <Sun className="size-4" /> Light
                  </span>
                </SelectItem>
                <SelectItem value="dark">
                  <span className="flex items-center gap-2">
                    <Moon className="size-4" /> Dark
                  </span>
                </SelectItem>
                <SelectItem value="system">
                  <span className="flex items-center gap-2">
                    <Monitor className="size-4" /> System
                  </span>
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </main>
    </div>
  );
}
