"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";

export default function ObjaviPosaoPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Dummy submit timeout
        setTimeout(() => {
            setLoading(false);
            alert("Hvala! Vaš oglas za posao je uspješno objavljen.");
            router.push("/dashboard");
        }, 1000);
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 max-w-2xl">
                <Card className="shadow-lg border-0">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-3xl font-bold text-gray-900">Objavi posao (Besplatno)</CardTitle>
                        <CardDescription className="text-lg">
                            Opišite šta vam je potrebno i primite ponude od provjerenih majstora.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Naslov posla</label>
                                <Input required placeholder="npr. Hitno potrebna zamjena slavine u kupatilu" />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Kategorija</label>
                                    <Select required>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Odaberi kategoriju" />
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
                                    <Input required placeholder="npr. Sarajevo" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Opis posla</label>
                                <Textarea
                                    required
                                    className="min-h-[120px]"
                                    placeholder="Opišite detaljnije šta je potrebno uraditi, da li imate materijal, očekivani rok i slično..."
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-end bg-gray-50 px-6 py-4 rounded-b-xl border-t mt-4">
                            <Button type="button" variant="ghost" className="mr-4" onClick={() => router.back()}>
                                Odustani
                            </Button>
                            <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto px-8">
                                {loading ? "Objavljivanje..." : "Objavi posao"}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </div>
    );
}
