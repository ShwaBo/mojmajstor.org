"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { fetchData } from "@/lib/api";
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

    const [tradesmen, setTradesmen] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTradesmen = async () => {
            try {
                setLoading(true);
                // We fetch all from the cloud backend. The fallback in api.ts ensures it points to Railway.
                const data = await fetchData("/tradesmen/");
                setTradesmen(data);
                setError(null);
            } catch (err) {
                console.error("Error fetching tradesmen", err);
                setError("Nažalost, nismo uspjeli učitati majstore. Pokušajte ponovo.");
            } finally {
                setLoading(false);
            }
        };

        loadTradesmen();
    }, []);

    const filteredResults = tradesmen.filter(r => {
        const matchCategory = !kategorija || (r.category?.naziv && r.category.naziv.toLowerCase().includes(kategorija.toLowerCase()));
        const matchCity = !grad || r.grad.toLowerCase().includes(grad.toLowerCase());
        return matchCategory && matchCity;
    });

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

                        <Button className="w-full bg-blue-600 hover:bg-blue-700 mt-4" onClick={() => {
                            const params = new URLSearchParams();
                            if (kategorija) params.append("kategorija", kategorija);
                            if (grad) params.append("grad", grad);

                            // To correctly update the URL without refreshing, we'd normally use router.push
                            // We need to import useRouter from next/navigation at the top of the component.
                            // I will do an inline update of window history for simplicity, 
                            // but let's actually just let the state drive the UI for now, and update the URL silently.
                            window.history.replaceState(null, '', `?${params.toString()}`);
                        }}>
                            Primijeni filtere
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Results Area */}
            <main className="w-full md:w-3/4 space-y-6">
                <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border">
                    <p className="text-gray-600">
                        {loading ? (
                            <span>Učitavanje rezultata...</span>
                        ) : (
                            <>
                                Pronađeno <span className="font-bold text-gray-900">{filteredResults.length}</span> rezultata
                                {kategorija && <span> za <span className="font-bold capitalize">{kategorija}</span></span>}
                                {grad && <span> u <span className="font-bold capitalize">{grad}</span></span>}
                            </>
                        )}
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
                        {error}
                    </div>
                )}

                <div className="space-y-4">
                    {loading ? (
                        <div className="animate-pulse space-y-4">
                            {[1, 2, 3].map((skeleton) => (
                                <div key={skeleton} className="h-32 bg-white rounded-2xl shadow-sm border"></div>
                            ))}
                        </div>
                    ) : filteredResults.length === 0 ? (
                        <Card className="p-8 text-center bg-gray-50 border-dashed">
                            <CardContent className="space-y-3">
                                <h3 className="text-xl font-medium text-gray-900">Nema rezultata</h3>
                                <p className="text-gray-500">Nismo pronašli majstore koji odgovaraju vašim kriterijima.</p>
                                <Button variant="outline" onClick={() => { setKategorija(""); setGrad(""); }}>Očisti filtere</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredResults.map((result, idx) => (
                            <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row p-6 gap-6 items-center sm:items-start">
                                        {/* Avatar Placeholder */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-inner overflow-hidden">
                                            {result.category?.ikona_url ? (
                                                <img src={result.category.ikona_url} alt="Ikona" className="w-full h-full object-cover" />
                                            ) : (
                                                <span className="text-2xl font-bold text-gray-400">
                                                    {result.naziv_firme_ili_obrta.charAt(0)}
                                                </span>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 text-center sm:text-left space-y-2">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                                <div>
                                                    <h2 className="text-xl font-bold text-gray-900">{result.naziv_firme_ili_obrta}</h2>
                                                    <div className="flex items-center justify-center sm:justify-start text-blue-600 font-medium mt-1">
                                                        <Wrench className="w-4 h-4 mr-1" />
                                                        {result.category?.naziv || "Ostalo"}
                                                    </div>
                                                </div>
                                                <div className="mt-2 sm:mt-0 flex items-center justify-center bg-yellow-50 px-3 py-1 rounded-full text-yellow-700 border border-yellow-200">
                                                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500 mr-1" />
                                                    <span className="font-bold">{result.prosjecna_ocjena || "0.0"}</span>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-center sm:justify-start text-gray-500 text-sm">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {result.grad}
                                            </div>

                                            {result.opis && (
                                                <p className="text-sm text-gray-600 mt-2 line-clamp-2 text-left">
                                                    {result.opis}
                                                </p>
                                            )}
                                        </div>

                                        {/* Action */}
                                        <div className="sm:self-center w-full sm:w-auto mt-4 sm:mt-0">
                                            <Button className="w-full sm:w-auto">Kontaktiraj</Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
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
