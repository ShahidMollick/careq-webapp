
import Sidebar from "./app-siderbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/toaster";


export default function SettingLayout({ children }: { children: React.ReactNode }) {
  return (
     
      <div className="h-fit w-full px-6 py-8 flex flex-row">
        <Sidebar /> {/* Sidebar will update the context */}
        
        {children}
      </div>
    
  );
}
