import Sidebar  from "./app-siderbar"
 
export default function settingLayout({ children }: { children: React.ReactNode }) {
  return (
    
      
        <div className="h-full w-full flex  flex-row">
            <Sidebar />
 {children}
        </div>
       
      
   
  )
}