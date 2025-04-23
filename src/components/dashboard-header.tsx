import {SidebarTrigger} from "@/components/ui/sidebar";
import {ModeToggle} from "@/components/mode-toggle";

export default function DashboardHeader() {
    return (
        <header className="flex h-12 shrink-0 items-center gap-2 mb-3 border-b">
            <div className="flex flex-1 items-center gap-2 px-3">
                <SidebarTrigger/>
            </div>
            <div className="ml-auto px-3">
                <ModeToggle/>
            </div>
        </header>
    )
}
