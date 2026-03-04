"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SearchResultsContent() {
    const searchParams = useSearchParams();
    const kategorija = searchParams.get("kategorija") || "većini kategorija";
    const grad = searchParams.get("grad") || "vašoj blizini";

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Rezultati pretrage za: <span className="text-blue-600">{kategorija}</span> u <span className="text-blue-600">{grad}</span>
            </h1>

            <div className="bg-white p-8 rounded-2xl shadow-sm border text-center">
                <p className="text-gray-500">
                    Ovdje će se prikazati lista majstora iz baze.
                </p>
            </div>
        </div>
    );
}

export default function PretragaPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gray-50/50 py-12">
            <div className="container mx-auto px-4 max-w-5xl">
                <Suspense fallback={
                    <div className="animate-pulse space-y-6">
                        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-32 bg-gray-200 rounded w-full"></div>
                    </div>
                }>
                    <SearchResultsContent />
                </Suspense>
            </div>
        </div>
    );
}
