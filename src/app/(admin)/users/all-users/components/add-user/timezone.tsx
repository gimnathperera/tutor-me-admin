import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

export default function TimeZoneSelect({ setValue, defaultValue }: any) {
  const [timezones, setTimezones] = useState<string[]>([]);

  useEffect(() => {
    const fetchTimezones = async () => {
      try {
        const res = await fetch("/timezones.json");
        const data = await res.json();
        setTimezones(data);
      } catch (err) {
        console.error("Failed to load timezones", err);
      }
    };
    fetchTimezones();
  }, []);

  return (
    <Select
      onValueChange={(val) => setValue("timeZone", val)}
      defaultValue={defaultValue}
    >
      <SelectTrigger id="timeZone">
        <SelectValue placeholder="Select Time Zone" />
      </SelectTrigger>
      <SelectContent>
        {timezones.map((tz) => (
          <SelectItem key={tz} value={tz}>
            {tz}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
