"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertCircle, CheckCircle2, Loader2, Play } from "lucide-react";

export default function ScraperDashboard() {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error' | null, message: string | null }>({ type: null, message: null });
    const [testMode, setTestMode] = useState(true);

    const handleScrape = async () => {
        setLoading(true);
        setStatus({ type: null, message: null });

        try {
            // Point to backend API, using NEXT_PUBLIC_API_URL or localhost directly since it's admin
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(`${apiUrl}/admin/scrape?test_mode=${testMode}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            if (!response.ok) {
                throw new Error("Failed to trigger scraping task");
            }

            const data = await response.json();
            setStatus({
                type: 'success',
                message: `Uspješno! ${data.message} (Test mode: ${data.test_mode})`
            });

        } catch (error: any) {
            console.error("Scraping error:", error);
            setStatus({
                type: 'error',
                message: `Greška: ${error.message || "Nešto nije u redu sa serverom."}`
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-lg border-2 shadow-xl rounded-2xl">
                <CardHeader className="space-y-2 bg-slate-900 text-white rounded-t-xl pb-8 pt-8">
                    <CardTitle className="text-2xl font-bold flex items-center gap-2">
                        <Play className="w-6 h-6 text-blue-400" />
                        Admin Scraper Dashboard
                    </CardTitle>
                    <CardDescription className="text-slate-300 text-base">
                        Pokreni automatsko prikupljanje zanatlija sa Google Maps u bazu podataka.
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-8 space-y-6">
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-sm text-blue-800">
                        <p><strong>Napomena:</strong> Scraping se izvršava u pozadini na serveru. Ne morate držati ovu stranicu otvorenom nakon što ga pokrenete.</p>
                    </div>

                    <div className="flex items-center space-x-2 bg-gray-50 p-4 border rounded-xl">
                        <input
                            type="checkbox"
                            id="test-mode"
                            checked={testMode}
                            onChange={(e) => setTestMode(e.target.checked)}
                            className="w-5 h-5 text-blue-600 rounded"
                        />
                        <label htmlFor="test-mode" className="font-medium text-gray-700 select-none cursor-pointer">
                            Omogući TEST_MODE
                            <span className="block text-xs font-normal text-gray-500">Samo 1 zanat (Vodoinstalater) u 1 gradu (Sarajevo)</span>
                        </label>
                    </div>

                    <Button
                        onClick={handleScrape}
                        disabled={loading}
                        className={`w-full h-14 text-lg font-bold transition-all ${loading ? 'bg-slate-400' : 'bg-green-600 hover:bg-green-700'}`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                                Pokretanje...
                            </>
                        ) : (
                            "POKRENI SCRAPER"
                        )}
                    </Button>

                    {status.type === 'success' && (
                        <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3 text-green-800 animate-in fade-in slide-in-from-bottom-2">
                            <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}

                    {status.type === 'error' && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-800 animate-in fade-in slide-in-from-bottom-2">
                            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                            <p className="text-sm font-medium">{status.message}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
