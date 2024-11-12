"use client";

import { Settings,  Search, AudioLines, Layers } from "lucide-react";
import Link from "d:/voiceover-studio/frontend/node_modules/next/link";
import Image from "d:/voiceover-studio/frontend/node_modules/next/image";
import { Input } from "./ui/input";

const mainRoutes = [
    {
        label: "Studio",
        icon: AudioLines,
        href: "/studio",
        color: "text-black"
    },
    {
        label: "API Key",
        icon: Layers,
        href: "/api_key",
        color: "text-black"
    },
    {
        label: "Voiceover Studio",
        icon: AudioLines,
        href: "/voiceover",
        color: "text-black"
    }
];

const supportRoute = {
    label: "Support",
    icon: Settings,
    href: "/support",
    color: "text-black"
};


const Sidebar = () => {

    return (
        <div className="flex flex-col h-full bg-[#ffffff] text-black">
            {/* Top section with logo */}
            <div className="px-3 py-4">
                <Link href="/dashboard" className="flex items-center pl-3 mb-6">
                    <div className="relative w-8 h-8 mr-4">
                        <Image
                            fill
                            alt="Logo"
                            src="/logo1.jpg"
                        />
                    </div>
                    <div>
                        <h1 className="text-2xl font-sans">
                            smallest.ai
                        </h1>
                    </div>  
                </Link>
            </div>

            {/* Search Bar */}
            <div className="px-6 mb-6">
                <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Input 
                        placeholder="Search" 
                        className="pl-8 bg-transparent border border-gray-200 focus:border-gray-300 focus-visible:ring-0 text-sm"
                    />
                </div>
            </div>
        </div>
    );
}

export default Sidebar;