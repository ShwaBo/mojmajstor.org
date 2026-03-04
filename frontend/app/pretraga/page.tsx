"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Star, Wrench } from "lucide-react";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const initKategorija = searchParams.get("kategorija") || "";
    const initGrad = searchParams.get("grad") || "";

    const [kategorija, setKategorija] = useState(initKategorija);
    const [grad, setGrad] = useState(initGrad);
    const [tip, setTip] = useState("svi");

    const dummyResults = [
        { name: "Adnan M.", category: "Vodoinstalater", rating: 4.8, city: "Sarajevo, Centar" },
        { name: "ElektroTim d.o.o.", category: "Električar", rating: 5.0, city: "Tuzla" },
        { name: "Samir K.", category: "Keramičar", rating: 4.5, city: "Zenica" },
    ];

    return (
        <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className="w-full md:w-1/4 space-y-6 bg-white p-6 rounded-2xl shadow-sm border h-fit sticky top-24">
                <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Napredna pretraga</h3>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Kategorija usluge</label>
                            <Select value={kategorija} onValueChange={setKategorija}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Sve kategorije" />
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

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Grad</label>
                            <Input
                                value={grad}
                                onChange={(e) => setGrad(e.target.value)}
                                placeholder="Unesite grad"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Tip izvođača</label>
                            <Select value={tip} onValueChange={setTip}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Svi izvođači" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="svi">Svi izvođači</SelectItem>
                                    <SelectItem value="pojedinac">Samo pojedinci</SelectItem>
                                    <SelectItem value="firma">Samo firme</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4">
                            Primijeni filtere
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Results Area */}
            <main className="w-full md:w-3/4 space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-gray-600">
                        Pronađeno <span className="font-bold text-gray-900">{dummyResults.length}</span> rezultata
                        {kategorija && <span> za <span className="font-bold capitalize">{kategorija}</span></span>}
                        {grad && <span> u <span className="font-bold capitalize">{grad}</span></span>}
                    </p>
                </div>

                <div className="space-y-4">
                    {dummyResults.map((result, idx) => (
                        <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardContent className="p-0">
                                <div className="flex flex-col sm:flex-row p-6 gap-6 items-center sm:items-start">
                                    {/* Avatar Placeholder */}
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-inner">
                                        <span className="text-2xl font-bold text-gray-400">{result.name.charAt(0)}</span>
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 text-center sm:text-left space-y-2">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-900">{result.name}</h2>
                                                <div className="flex items-center justify-center sm:justify-start text-blue-600 font-medium mt-1">
                                                    <Wrench className="w-4 h-4 mr-1" />
                                                    {result.category}
                                                </div>
                                            </div>
                                            <div className="mt-2 sm:mt-0 flex items-center justify-center bg-yellow-50 px-3 py-1 rounded-full text-yellow-700 border border-yellow-200">
                                                <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
                                                <span className="font-bold">{result.rating.toFixed(1)}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center sm:justify-start text-gray-500 text-sm">
                                            <MapPin className="w-4 h-4 mr-1" />
                                            {result.city}
                                        </div>
                                    </div>

                                    {/* Action */}
                                    <div className="sm:self-center w-full sm:w-auto mt-4 sm:mt-0">
                                        <Button className="w-full sm:w-auto">Kontaktiraj</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}

export default function PretragaPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-6xl">
                <Suspense fallback={
                    <div className="animate-pulse flex gap-8">
                        <div className="w-1/4 h-96 bg-white rounded-2xl shadow-sm border"></div>
                        <div className="w-3/4 space-y-4">
                            <div className="h-16 bg-white rounded-xl shadow-sm border"></div>
                            <div className="h-32 bg-white rounded-2xl shadow-sm border"></div>
                            <div className="h-32 bg-white rounded-2xl shadow-sm border"></div>
                        </div>
                    </div>
                }>
                    <SearchResultsContent />
                </Suspense>
            </div>
        </div>
    );
}
