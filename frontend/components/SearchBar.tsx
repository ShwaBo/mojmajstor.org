"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export default function SearchBar() {
    const router = useRouter();
    const [kategorija, setKategorija] = useState("");
    const [grad, setGrad] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();

        const params = new URLSearchParams();
        if (kategorija) params.append("kategorija", kategorija);
        if (grad) params.append("grad", grad);

        router.push(`/pretraga?${params.toString()}`);
    };

    return (
        <form
            onSubmit={handleSearch}
            className="w-full max-w-3xl bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-100 mt-8 relative z-10"
        >
            <div className="flex flex-col md:flex-row gap-4">

                {/* Category Select */}
                <div className="flex-1 text-left">
                    <Select value={kategorija} onValueChange={setKategorija}>
                        <SelectTrigger className="h-14 text-base">
                            <SelectValue placeholder="Šta vam je potrebno?" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="vodoinstalater">Vodoinstalater</SelectItem>
                            <SelectItem value="elektricar">Električar</SelectItem>
                            <SelectItem value="keramicar">Keramičar</SelectItem>
                            <SelectItem value="ciscenje">Čišćenje</SelectItem>
                            <SelectItem value="fasade">Fasade</SelectItem>
                            <SelectItem value="automehanicar">Automehaničar</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* City Input */}
                <div className="flex-1">
                    <Input
                        className="h-14 text-base"
                        placeholder="Unesite grad, npr. Sarajevo"
                        value={grad}
                        onChange={(e) => setGrad(e.target.value)}
                    />
                </div>

                {/* Search Button */}
                <Button type="submit" className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700">
                    Traži majstora
                </Button>

            </div>
        </form>
    );
}
