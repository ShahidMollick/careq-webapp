"use client";

import * as React from "react";
import { Check, ChevronsUpDown, Hospital } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false);
  const [clinics, setClinics] = React.useState<{ id: string; name: string }[]>(
    []
  );
  const [selectedClinic, setSelectedClinic] = React.useState<{
    id: string;
    name: string;
  } | null>(null);

  // ✅ Fetch unique clinics from stored doctor schedules
  React.useEffect(() => {
    const storedDoctorData = localStorage.getItem("doctorData");
    if (storedDoctorData) {
      const doctor = JSON.parse(storedDoctorData);
      const schedules = doctor.schedules || [];

      // Extract unique clinics
      const uniqueClinicsMap = new Map();
    schedules.forEach((schedule: { id: string; clinicName: string }) => {
        if (!uniqueClinicsMap.has(schedule.clinicName)) {
          uniqueClinicsMap.set(schedule.clinicName, {
            id: schedule.id,
            name: schedule.clinicName,
          });
        }
      });

      const uniqueClinics = Array.from(uniqueClinicsMap.values());
      setClinics(uniqueClinics);
      if (uniqueClinics.length > 0) {
        setSelectedClinic(uniqueClinics[0]); // Set default selection
      }
    }
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] justify-between flex-row flex-nowrap"
        >
          <div className="flex items-center flex-row gap-2">
            <Hospital className="text-gray-500"></Hospital>
            {selectedClinic ? selectedClinic.name : "Select Clinic"}
          </div>

          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput placeholder="Search clinics..." />
          <CommandList>
            <CommandEmpty>No clinic found.</CommandEmpty>
            <CommandGroup>
              {clinics.map((clinic) => (
                <CommandItem
                  key={clinic.id}
                  value={clinic.id}
                  onSelect={() => {
                    setSelectedClinic(clinic);
                    setOpen(false);
                  }}
                >
                  {clinic.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedClinic?.id === clinic.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
