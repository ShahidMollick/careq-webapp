"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { selectFacilityRole } from "@/app/redux/userRolesSlice";
import { RootState } from "@/app/redux/store"; // Ensure you have the correct path

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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
  const dispatch = useDispatch();
  
  // Get facilities & selected values from Redux
  const facilities = useSelector((state: RootState) => state.userRoles.roles);
  const selectedFacility = useSelector((state: RootState) => state.userRoles.selectedFacility);
  const selectedRole = useSelector((state: RootState) => state.userRoles.selectedRole);

  const [open, setOpen] = React.useState(false);

  // Set default facility if not already selected
  React.useEffect(() => {
    if (!selectedFacility && facilities.length > 0) {
      const defaultFacility = facilities[0].facility;
      const defaultRole = facilities[0].role.name;

      dispatch(selectFacilityRole({ facility: defaultFacility, role: defaultRole }));
    }
  }, [facilities, selectedFacility, dispatch]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between flex-row flex-nowrap"
        >
          {selectedFacility ? selectedFacility.name : "Select Clinic"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search clinics..." />
          <CommandList>
            <CommandEmpty>No clinic found.</CommandEmpty>
            <CommandGroup>
              {facilities.map(({ facility, role }) => (
                <CommandItem
                  key={facility.id}
                  value={facility.id}
                  onSelect={() => {
                    dispatch(selectFacilityRole({ facility, role: role.name }));
                    setOpen(false);
                  }}
                >
                  {facility.name}
                  <Check
                    className={cn(
                      "ml-auto",
                      selectedFacility?.id === facility.id ? "opacity-100" : "opacity-0"
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
