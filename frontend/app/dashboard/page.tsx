"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";

export default function DashboardPage() {
    const { user, isLoaded } = useUser();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 md:p-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                    Dobrodošli u Majstor Dashboard
                </h1>
                <p className="text-gray-500 mt-2">
                    Upravljajte svojim profilom i uslugama.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Profile Card Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Moj Profil</CardTitle>
                        <CardDescription>Ažurirajte svoje kontakt podatke i opis.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md border text-sm text-gray-500 flex items-center justify-center h-24">
                                Trenutni status profila (Uskoro)
                            </div>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button className="w-full">Uredi profil</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                    <DialogHeader>
                                        <DialogTitle>Uredi profil</DialogTitle>
                                        <DialogDescription>
                                            Ovdje možete ažurirati svoje javne podatke.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="name" className="text-right">
                                                Ime / Firma
                                            </Label>
                                            <Input id="name" placeholder="npr. Adnan M." className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="city" className="text-right">
                                                Grad
                                            </Label>
                                            <Input id="city" placeholder="npr. Sarajevo" className="col-span-3" />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <Button type="submit">Spremi promjene</Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    </CardContent>
                </Card>

                {/* Pricing/Services Card Placeholder */}
                <Card>
                    <CardHeader>
                        <CardTitle>Moj Cjenovnik</CardTitle>
                        <CardDescription>Upravljajte uslugama i cijenama koje nudite.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 rounded-md border text-sm text-gray-500 flex items-center justify-center h-24">
                                Trenutne usluge (Uskoro)
                            </div>
                            <Button className="w-full" onClick={() => console.log("Otvaram panel za upravljanje uslugama...")}>
                                Upravljaj uslugama
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
