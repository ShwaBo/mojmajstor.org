"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ObjaviPosaoPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <Card className="shadow-lg border-0">
                    <CardHeader className="text-center space-y-2">
                        <CardTitle className="text-3xl font-bold text-gray-900">Objavi posao (Besplatno)</CardTitle>
                        <CardDescription className="text-lg">
                            Opišite šta vam je potrebno i primite ponude od provjerenih majstora.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="bg-blue-50 text-blue-800 p-6 rounded-xl border border-blue-100 text-center">
                            <p className="font-medium">Forma za objavu posla stiže uskoro!</p>
                            <p className="text-sm mt-2 opacity-80">
                                Ovdje će korisnici moći unijeti detalje o poslu, lokaciju, slike i željeni rok.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <Button disabled className="w-full md:w-auto px-8">Naredni korak</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
