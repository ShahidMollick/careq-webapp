import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

type BillItem = {
  id: number;
  description: string;
  amount: number;
};

export function BillSheet() {
  const [billItems, setBillItems] = useState<BillItem[]>([
    { id: 1, description: "Consultation Fees", amount: 500 },
    { id: 2, description: "Mortar L-I", amount: 50 },
    { id: 3, description: "Mortar L-2", amount: 250 },
  ]);

  const handleAddItem = () => {
    const newItem: BillItem = {
      id: billItems.length + 1,
      description: "",
      amount: 0,
    };
    setBillItems([...billItems, newItem]);
  };

  const handleDeleteItem = (id: number) => {
    setBillItems(billItems.filter((item) => item.id !== id));
  };

  const handleUpdateItem = (id: number, field: keyof BillItem, value: string) => {
    setBillItems(
      billItems.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "amount" ? parseFloat(value) || 0 : value,
            }
          : item
      )
    );
  };

  const totalAmount = billItems.reduce((total, item) => total + item.amount, 0);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Generate Bill</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Patient Bill</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          {billItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Input
                placeholder="Item Description"
                value={item.description}
                onChange={(e) =>
                  handleUpdateItem(item.id, "description", e.target.value)
                }
                className="flex-1"
              />
              <Input
                type="number"
                placeholder="Amount"
                value={item.amount}
                onChange={(e) =>
                  handleUpdateItem(item.id, "amount", e.target.value)
                }
                className="w-28"
              />
              <Button
                variant="ghost"
                className="p-2 text-red-500"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2 />
              </Button>
            </div>
          ))}
          <Button variant="ghost" onClick={handleAddItem}>
            Add More Items
          </Button>
          <div className="mt-4 text-lg font-semibold">
            Total: ₹{totalAmount}
          </div>
          <Button variant="default" className="w-full mt-4">
            Print Prescription
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
