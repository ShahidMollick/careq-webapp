"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

const clinics = [
  {
    value: "bcroy",
    label: "BC Roy Hospital",
  },
  {
    value: "abhospital",
    label: "AB Hospital",
  },
]

export function ComboboxDemo() {
  const [open, setOpen] = React.useState(false)
  // Set default value to the first clinic's value
  const [value, setValue] = React.useState(clinics[0].value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between flex-row flex-nowrap"
        >
          {clinics.find((clinic) => clinic.value === value)?.label}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search clinics..." />
          <CommandList>
            <CommandEmpty>No clinic found.</CommandEmpty>
            <CommandGroup>
              {clinics.map((clinic) => (
                <CommandItem
                  key={clinic.value}
                  value={clinic.value}
                  onSelect={(currentValue) => {
                    // Update value only if a different clinic is selected
                    if (currentValue !== value) {
                      setValue(currentValue)
                      setOpen(false)
                    }
                  }}
                >
                  {clinic.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === clinic.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}