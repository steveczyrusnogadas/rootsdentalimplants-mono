import { Input } from "@repo/ui/components/input";
import { SearchIcon } from "lucide-react";

type AdminTableSearchProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function AdminTableSearch({ value, onChange, placeholder }: AdminTableSearchProps) {
  return (
    <div className="relative w-full">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="pl-6"
      />
    </div>
  );
}
