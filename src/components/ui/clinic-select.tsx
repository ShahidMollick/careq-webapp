"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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

  // Sample clinics (Replace this with backend data later)
  const sampleClinics = [
    { id: "1", name: "Heart Care Clinic", role: "Cardiologist" },
    { id: "2", name: "Downtown Medical Center", role: "General Practitioner" },
    { id: "3", name: "Sunrise Dental", role: "Dentist" },
    { id: "4", name: "Neuro Clinic", role: "Neurologist" },
  ];

  // Default selected clinic
  const [selectedClinic, setSelectedClinic] = React.useState(sampleClinics[0]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between flex-row flex-nowrap"
        >
          {selectedClinic ? selectedClinic.name : "Select Clinic"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search clinics..." />
          <CommandList>
            <CommandEmpty>No clinic found.</CommandEmpty>
            <CommandGroup>
              {sampleClinics.map((clinic) => (
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
                      selectedClinic?.id === clinic.id ? "opacity-100" : "opacity-0"
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
