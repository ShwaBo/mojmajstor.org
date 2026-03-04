import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-4 bg-gray-50/50">
      <main className="max-w-4xl w-full flex flex-col items-center text-center gap-8 py-16">

        {/* Hero Text */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
            Pronađi pouzdanog <span className="text-blue-600">majstora</span> u svojoj blizini
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Brzo i lako do najboljih stručnjaka za sve vrste popravki.
          </p>
        </div>

        {/* Search UI Module */}
        <div className="w-full max-w-3xl bg-white p-4 md:p-6 rounded-2xl shadow-xl border border-gray-100 mt-8">
          <div className="flex flex-col md:flex-row gap-4">

            {/* Category Select */}
            <div className="flex-1">
              <Select>
                <SelectTrigger className="h-14 text-base">
                  <SelectValue placeholder="Šta vam je potrebno?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vodoinstalater">Vodoinstalater</SelectItem>
                  <SelectItem value="elektricar">Električar</SelectItem>
                  <SelectItem value="keramicar">Keramičar</SelectItem>
                  <SelectItem value="automehanicar">Automehaničar</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City Input */}
            <div className="flex-1">
              <Input
                className="h-14 text-base"
                placeholder="Unesite grad, npr. Sarajevo"
              />
            </div>

            {/* Search Button */}
            <Button className="h-14 px-8 text-base bg-blue-600 hover:bg-blue-700">
              Traži majstora
            </Button>

          </div>
        </div>

      </main>
    </div>
  );
}
