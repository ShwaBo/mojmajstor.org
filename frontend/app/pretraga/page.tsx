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

const GRADOVI = [
    // FEDERACIJA BOSNE I HERCEGOVINE (FBiH)
    "Sarajevo", "Ilidža", "Vogošća", "Hadžići", "Ilijaš", "Trnovo FBiH",
    "Tuzla", "Živinice", "Gračanica", "Lukavac", "Srebrenik", "Gradačac",
    "Kalesija", "Banovići", "Kladanj", "Sapna", "Teočak", "Doboj Istok",
    "Zenica", "Kakanj", "Visoko", "Tešanj", "Zavidovići", "Žepče",
    "Maglaj", "Breza", "Olovo", "Vareš", "Usora", "Doboj Jug",
    "Travnik", "Bugojno", "Jajce", "Vitez", "Novi Travnik", "Kiseljak",
    "Donji Vakuf", "Gornji Vakuf-Uskoplje", "Busovača", "Fojnica",
    "Bihać", "Cazin", "Velika Kladuša", "Sanski Most", "Bosanska Krupa",
    "Ključ", "Bužim", "Bosanski Petrovac",
    "Mostar", "Konjic", "Čapljina", "Jablanica", "Stolac", "Prozor-Rama",
    "Čitluk", "Neum",
    "Široki Brijeg", "Ljubuški", "Posušje", "Grude",
    "Livno", "Tomislavgrad", "Kupres", "Glamoč", "Drvar",
    "Orašje", "Odžak", "Domaljevac-Šamac",
    "Goražde", "Prača", "Ustikolina",

    // REPUBLIKA SRPSKA (RS)
    "Banja Luka", "Prijedor", "Gradiška", "Novi Grad", "Kozarska Dubica",
    "Prnjavor", "Kotor Varoš", "Laktaši", "Srbac", "Čelinac", "Kostajnica",
    "Doboj", "Derventa", "Teslić", "Modriča", "Brod", "Šamac", "Stanari",
    "Bijeljina", "Zvornik", "Ugljevik", "Lopare", "Bratunac", "Srebrenica",
    "Vlasenica", "Milići",
    "Istočno Sarajevo", "Pale", "Sokolac", "Rogatica", "Višegrad", "Foča",
    "Rudo", "Han Pijesak",
    "Trebinje", "Bileća", "Gacko", "Nevesinje", "Ljubinje",

    // BRČKO DISTRIKT (BD)
    "Brčko"
].sort((a, b) => a.localeCompare(b, 'hr'));

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const initKategorija = searchParams.get("kategorija") || "sve";
    const initGrad = searchParams.get("grad") || "svi";

    const [kategorija, setKategorija] = useState(initKategorija);
    const [grad, setGrad] = useState(initGrad);
    const [tip, setTip] = useState("svi");

    const [tradesmen, setTradesmen] = useState<any[]>([]);
    const [categoriesList, setCategoriesList] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTradesmen = async () => {
            try {
                setLoading(true);
                // In a production setup, we'd map "kategorija" slug to a UUID here
                // For now, if the user picks a city, we pass it. If there were a categorija mapping, we'd add it too.
                const params = new URLSearchParams();
                if (initGrad && initGrad !== "svi") params.append("grad", initGrad);
                // Categorija mapping would go here if supported by the FastAPI directly via slug 

                const [data, cats] = await Promise.all([
                    fetchData(`/tradesmen/?${params.toString()}`),
                    fetchData('/categories/')
                ]);

                setTradesmen(data);
                setCategoriesList(cats);
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

    // We apply local filtering on top of DB filtering for categories (as backend only accepts UUIDs for categories right now)
    const filteredResults = tradesmen.filter(r => {
        // Our categories now use UUIDs or string match depending on legacy logic. 
        // We match by name if the user selected a category ID since the ID selects standard dropdown values.
        if (kategorija && kategorija !== "sve") {
            return r.kategorija_id === kategorija || r.category_id?.id === kategorija;
        }
        return true;
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
                                    <SelectItem value="sve">Sve kategorije</SelectItem>
                                    {categoriesList.map(cat => (
                                        <SelectItem key={cat.id} value={cat.id}>{cat.naziv}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Grad</label>
                            <Select value={grad} onValueChange={setGrad}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Svi gradovi" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="svi">Svi gradovi</SelectItem>
                                    {GRADOVI.map(g => (
                                        <SelectItem key={g} value={g}>{g}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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
                            if (kategorija && kategorija !== "sve") params.append("kategorija", kategorija);
                            if (grad && grad !== "svi") params.append("grad", grad);

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
                                {kategorija && kategorija !== "sve" && <span> za <span className="font-bold capitalize">{categoriesList.find(c => c.id === kategorija)?.naziv}</span></span>}
                                {grad && grad !== "svi" && <span> u <span className="font-bold capitalize">{grad}</span></span>}
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
                                <Button variant="outline" onClick={() => { setKategorija("sve"); setGrad("svi"); }}>Očisti filtere</Button>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredResults.map((result, idx) => (
                            <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                                <CardContent className="p-0">
                                    <div className="flex flex-col sm:flex-row p-6 gap-6 items-center sm:items-start">
                                        {/* Avatar Placeholder */}
                                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-200 shadow-inner overflow-hidden">
                                            {result.category_id?.ikona_url ? (
                                                <img src={result.category_id.ikona_url} alt="Ikona" className="w-full h-full object-cover" />
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
                                                        {result.category_id?.naziv || "Ostalo"}
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
