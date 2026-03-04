"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Wrench, Zap, Grip, Sparkles, PaintBucket, CarFront, CheckCircle, Pencil, Send, UserCheck } from "lucide-react";

export default function Home() {
  const router = useRouter();

  const categories = [
    { name: "Vodoinstalater", icon: Wrench, color: "text-blue-500", bg: "bg-blue-50" },
    { name: "Električar", icon: Zap, color: "text-yellow-500", bg: "bg-yellow-50" },
    { name: "Keramičar", icon: Grip, color: "text-orange-500", bg: "bg-orange-50" },
    { name: "Čišćenje", icon: Sparkles, color: "text-green-500", bg: "bg-green-50" },
    { name: "Fasade", icon: PaintBucket, color: "text-red-500", bg: "bg-red-50" },
    { name: "Automehaničar", icon: CarFront, color: "text-gray-600", bg: "bg-gray-100" },
  ];

  const steps = [
    { title: "Registracija", text: "Prijavite se brzo i besplatno", icon: CheckCircle },
    { title: "Unesi detalje", text: "Opišite šta vam je potrebno", icon: Pencil },
    { title: "Objavi posao", text: "Pošaljite zahtjev majstorima", icon: Send },
    { title: "Izaberi majstora", text: "Prihvatite najbolju ponudu", icon: UserCheck },
  ];

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 shadow-sm border-b overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-blue-50/50 -z-10" />
        <div className="container mx-auto max-w-5xl text-center space-y-8">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-tight">
            Pronađi majstora ili <br className="hidden md:block" />
            <span className="text-blue-600">objavi posao besplatno</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Najveća mreža pouzdanih stručnjaka u Bosni i Hercegovini. Riješite svaki problem brzo i povoljno.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Button
              size="lg"
              className="h-16 px-10 text-lg bg-blue-600 hover:bg-blue-700 shadow-md"
              onClick={() => router.push('/pretraga')}
            >
              Pronađi majstora
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-16 px-10 text-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 bg-white"
              onClick={() => router.push('/objavi-posao')}
            >
              Objavi posao (Besplatno)
            </Button>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Popularne kategorije</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <div
                  key={idx}
                  onClick={() => router.push(`/pretraga?kategorija=${cat.name.toLowerCase()}`)}
                  className="group cursor-pointer flex flex-col items-center p-6 border rounded-2xl hover:shadow-lg transition-all hover:border-blue-200 bg-white"
                >
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${cat.bg} group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-8 h-8 ${cat.color}`} />
                  </div>
                  <h3 className="font-semibold text-gray-800 text-center">{cat.name}</h3>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 px-4 bg-gray-50 border-t">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-16 text-gray-900">Kako funkcioniše?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="flex flex-col items-center">
                  <div className="w-20 h-20 bg-white rounded-full shadow-md flex items-center justify-center mb-6 relative border-4 border-blue-50">
                    <Icon className="w-8 h-8 text-blue-600" />
                    <span className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold border-2 border-white">
                      {idx + 1}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600">{step.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
