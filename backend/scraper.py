import os
import time
import requests
from database import supabase

# Import categories list
from schemas import CategoryBase

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")

ZANATI = [
    # Grubi građevinski i vanjski radovi
    "Građevinska firma", "Zidar", "Tesar", "Armirač", "Bagerist iskopi", 
    "Betoniranje", "Asfaltiranje", "Krovopokrivač", "Izolater", "Hidroizolacija",
    "Kamenorezac", "Uređenje dvorišta i vrtova", "Bušenje bunara",
    # Fini građevinski i unutrašnji radovi
    "Fasader", "Moler", "Keramičar", "Gipsar Rigips", "Parketar", 
    "Podopolagač", "Staklar", "Stolar", "Montaža namještaja",
    # Instalacije i sistemi
    "Vodoinstalater", "Električar", "Majstor za centralno grijanje", 
    "Instalater toplotnih pumpi", "Servis i ugradnja klima uređaja", 
    "Plinoinstalater", "Ventilacija", "Alarmni sistemi i video nadzor",
    # Obrada metala i proizvodnja
    "Bravar", "Zavarivač", "Limar", "Alu i PVC stolarija",
    # Održavanje kućanstva i servisi
    "Servis bijele tehnike", "Servis kućanskih aparata", "Tapetar",
    "Agencija za čišćenje", "Dimnjačar", "Dubinsko pranje namještaja",
    "Servis računara", "Servis mobitela",
    # Auto-moto zanati
    "Automehaničar", "Autoelektričar", "Autolimar", "Autolakirer", 
    "Vulkanizer", "Šlep služba"
]

GRADOVI = [
    # FEDERACIJA BOSNE I HERCEGOVINE (FBiH)
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

    # REPUBLIKA SRPSKA (RS)
    "Banja Luka", "Prijedor", "Gradiška", "Novi Grad", "Kozarska Dubica", 
    "Prnjavor", "Kotor Varoš", "Laktaši", "Srbac", "Čelinac", "Kostajnica",
    "Doboj", "Derventa", "Teslić", "Modriča", "Brod", "Šamac", "Stanari",
    "Bijeljina", "Zvornik", "Ugljevik", "Lopare", "Bratunac", "Srebrenica", 
    "Vlasenica", "Milići",
    "Istočno Sarajevo", "Pale", "Sokolac", "Rogatica", "Višegrad", "Foča", 
    "Rudo", "Han Pijesak",
    "Trebinje", "Bileća", "Gacko", "Nevesinje", "Ljubinje",

    # BRČKO DISTRIKT (BD)
    "Brčko"
]


def get_place_details(place_id):
    """
    Izvlači proširene detalje o majstoru.
    Dodali smo: geometry (za koordinate), website i url (link za mapu).
    """
    url = f"https://maps.googleapis.com/maps/api/place/details/json"
    params = {
        "place_id": place_id,
        "fields": "formatted_phone_number,formatted_address,geometry,website,url,rating",
        "key": GOOGLE_API_KEY
    }
    try:
        response = requests.get(url, params=params)
        return response.json().get("result", {})
    except Exception as e:
        print(f"  [!] Greška pri detaljima: {e}")
        return {}


def run_scraper(test_mode: bool = False):
    print("Starting background scraping task...")
    
    cities_to_scrape = GRADOVI
    trades_to_scrape = ZANATI
    
    if test_mode:
        print("⚠️ UPOZORENJE: Skripta se pokreće u TEST_MODE (1 grad, 1 zanat).")
        trades_to_scrape = ["Vodoinstalater"]
        cities_to_scrape = ["Sarajevo"]
        
    # Pre-fetch all categories from Supabase to correctly map UUIDs
    try:
        res = supabase.table("categories").select("id, naziv").execute()
        categories_map = {row["naziv"]: row["id"] for row in res.data}
    except Exception as e:
        print(f"❌ Greška pri dohvaćanju kategorija: {e}")
        return

    ukupno_dodato = 0
    
    for grad in cities_to_scrape:
        for zanat in trades_to_scrape:
            # Map category ID
            kategorija_id = categories_map.get(zanat)
            
            # Auto-create the category if it doesn't exist to ensure referential integrity
            if not kategorija_id:
                try:
                    new_cat = supabase.table("categories").insert({"naziv": zanat}).execute()
                    if new_cat.data:
                        kategorija_id = new_cat.data[0]["id"]
                        categories_map[zanat] = kategorija_id
                    else:
                        print(f"Preskačem {zanat} zbog greške sa kreiranjem kategorije.")
                        continue
                except Exception as e:
                    print(f"❌ Greška kreiranja kategorije {zanat}: {e}")
                    continue
            
            upit = f"{zanat} {grad} Bosna i Hercegovina"
            print(f"\n🚀 Tražim: {upit}")
            
            url = "https://maps.googleapis.com/maps/api/place/textsearch/json"
            params = {
                "query": upit,
                "key": GOOGLE_API_KEY,
                "language": "bs"
            }
            
            try:
                response = requests.get(url, params=params)
                rezultati = response.json().get("results", [])
                
                print(f"  Pronađeno {len(rezultati)} potencijalnih rezultata. Obrađujem...")
                
                for mjesto in rezultati:
                    ime = mjesto.get("name")
                    place_id = mjesto.get("place_id")
                    
                    # Izvlačimo broj telefona preko Details API
                    detalji = get_place_details(place_id)
                    telefon = detalji.get("formatted_phone_number", "Nema telefona")
                    
                    # Preskačemo ako nema telefon (neupotrebljivo za klijente)
                    if not telefon or telefon == "Nema telefona":
                        continue
                    
                    # Ekstrakcija koordinata iz 'geometry' objekta
                    location = detalji.get("geometry", {}).get("location", {})
                    lat = location.get("lat")
                    lng = location.get("lng")
                    
                    # Priprema podataka
                    novi_majstor = {
                        "naziv_firme_ili_obrta": ime,
                        "kategorija_id": kategorija_id,
                        "grad": grad,
                        "adresa": detalji.get("formatted_address", mjesto.get("formatted_address")),
                        "telefon": telefon,
                        "prosjecna_ocjena": detalji.get("rating", 0.0),
                        "website": detalji.get("website"),
                        "google_maps_url": detalji.get("url"), # Ovo je direktan link na Google Maps
                        "verified": False,
                        # The lat / lng fields don't exist in tradesmen table based on schemas.py
                        # Let's verify if they exist in Supabase or comment them out for now
                    }
                    
                    # Upis u Supabase
                    try:
                        # Prvo provjeri postoji li već da izbjegnemo duplikate
                        postoji = supabase.table("tradesmen").select("id").eq("naziv_firme_ili_obrta", ime).eq("grad", grad).execute()
                        if postoji.data:
                            print(f"  ⏭️ Preskačem, već postoji: {ime}")
                            continue
                            
                        supabase.table("tradesmen").insert(novi_majstor).execute()
                        print(f"  ✅ Dodat: {ime} | {telefon}")
                        ukupno_dodato += 1
                    except Exception as e:
                        print(f"  ❌ Greška pri upisu u bazu za '{ime}': {e}")
                        
                    # Pauza za API Rate Limiting
                    time.sleep(1)
                    
            except Exception as e:
                print(f"❌ Greška pri pretrazi za '{upit}': {e}")

    print(f"\n🎉 Gotovo! Ukupno dodato {ukupno_dodato} majstora u bazu.")
