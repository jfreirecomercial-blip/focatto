import { useState, useEffect } from "react";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import { db } from "./firebase";
import Map from "./Map";
import { 
  MapPin, 
  Wrench, 
  Tag, 
  Star, 
  Circle, 
  Compass 
} from "@phosphor-icons/react";

interface ItemLocation {
  id: string;
  title: string;
  city: string;
  state: string;
  price?: number;
  type: "produto" | "luthier";
  rating?: number;
  specialties?: string[];
  photo?: string;
}

const mockProducts: ItemLocation[] = [
  { id: "p1", title: "Gibson Les Paul Custom 1978", city: "São Paulo", state: "SP", price: 29000, type: "produto" },
  { id: "p2", title: "Fender Stratocaster American Standard", city: "Curitiba", state: "PR", price: 12500, type: "produto" },
  { id: "p3", title: "Violão Taylor 214ce Deluxe", city: "Belo Horizonte", state: "MG", price: 9800, type: "produto" },
];

const mockLuthiers: ItemLocation[] = [
  { id: "l1", title: "Guthier Luteria", city: "São Paulo", state: "SP", type: "luthier", rating: 4.9, specialties: ["Regulagem", "Pintura"] },
  { id: "l2", title: "D'Alegria Custom Guitars", city: "Rio de Janeiro", state: "RJ", type: "luthier", rating: 5.0, specialties: ["Construção", "Restauro"] },
  { id: "l3", title: "Luthieria do Sul", city: "Porto Alegre", state: "RS", type: "luthier", rating: 4.8, specialties: ["Trastes", "Eletrônica"] },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<"produtos" | "luthiers">("produtos");
  const [items, setItems] = useState<ItemLocation[]>([]);
  const [selectedItem, setSelectedItem] = useState<ItemLocation | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch data from Firestore with fallback to mocks
  useEffect(() => {
    async function fetchData() {
      if (!db) {
        setItems(activeTab === "produtos" ? mockProducts : mockLuthiers);
        setSelectedItem((activeTab === "produtos" ? mockProducts[0] : mockLuthiers[0]) || null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        if (activeTab === "produtos") {
          const q = query(collection(db, "products"), where("status", "==", "active"), limit(10));
          const querySnapshot = await getDocs(q);
          const productsList: ItemLocation[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            productsList.push({
              id: doc.id,
              title: data.title || "Sem título",
              city: data.city || "São Paulo",
              state: data.state || "SP",
              price: data.price,
              type: "produto",
            });
          });

          const finalProducts = productsList.length > 0 ? productsList : mockProducts;
          setItems(finalProducts);
          setSelectedItem(finalProducts[0] || null);
        } else {
          const q = query(collection(db, "luthiers"), limit(10));
          const querySnapshot = await getDocs(q);
          const luthiersList: ItemLocation[] = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            luthiersList.push({
              id: doc.id,
              title: data.name || "Sem nome",
              city: data.city || "São Paulo",
              state: data.state || "SP",
              type: "luthier",
              rating: data.averageRating || 5.0,
              specialties: data.specialties || [],
              photo: data.photo,
            });
          });

          const finalLuthiers = luthiersList.length > 0 ? luthiersList : mockLuthiers;
          setItems(finalLuthiers);
          setSelectedItem(finalLuthiers[0] || null);
        }
      } catch (err) {
        console.error("Error loading data from Firestore:", err);
        setItems(activeTab === "produtos" ? mockProducts : mockLuthiers);
        setSelectedItem((activeTab === "produtos" ? mockProducts[0] : mockLuthiers[0]) || null);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-surface-950 text-surface-50 font-sans noise-overlay">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-64 bg-accent/10 blur-[120px] rounded-full pointer-events-none" />

      {/* Header */}
      <header className="border-b border-surface-800 bg-surface-900/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-gold-500 flex items-center justify-center shadow-md">
              <Compass size={24} weight="bold" className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-heading m-0 flex items-center gap-2">
                Focatto
              </h1>
              <p className="text-[11px] text-surface-400 mt-0.5">
                Marketplace de Instrumentos Musicais
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Dashboard */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Explorer & Listing */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            
            {/* Tabs */}
            <div className="glass rounded-xl p-1.5 border border-surface-800 flex gap-2">
              <button
                onClick={() => setActiveTab("produtos")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "produtos" 
                    ? "bg-gradient-to-br from-accent to-gold-500 text-white shadow-md font-bold" 
                    : "text-surface-300 hover:text-white hover:bg-surface-800"
                }`}
              >
                <Tag size={16} />
                Instrumentos & Acessórios
              </button>
              <button
                onClick={() => setActiveTab("luthiers")}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold rounded-lg transition-all ${
                  activeTab === "luthiers" 
                    ? "bg-gradient-to-br from-accent to-gold-500 text-white shadow-md font-bold" 
                    : "text-surface-300 hover:text-white hover:bg-surface-800"
                }`}
              >
                <Wrench size={16} />
                Luthiers Especializados
              </button>
            </div>

            {/* List */}
            <div className="glass rounded-2xl p-5 border border-surface-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-wider text-surface-400">
                  Resultados ({items.length})
                </h3>
                {loading && (
                  <Circle size={14} className="animate-spin text-accent" />
                )}
              </div>

              <div className="flex flex-col gap-3 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                {loading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="shimmer h-[76px] rounded-xl border border-surface-800" />
                  ))
                ) : items.length > 0 ? (
                  items.map((item) => {
                    const isSelected = selectedItem?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        onClick={() => setSelectedItem(item)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? "bg-accent/5 border-accent shadow-glass"
                            : "bg-surface-900/40 border-surface-800 hover:border-surface-700"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-sm font-bold truncate text-white">{item.title}</h4>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-surface-400">
                            <span className="flex items-center gap-1 font-medium">
                              <MapPin size={12} className="text-surface-500" />
                              {item.city}, {item.state}
                            </span>
                            {item.type === "luthier" && item.rating && (
                              <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
                                <Star size={12} weight="fill" />
                                {item.rating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          {item.type === "luthier" && item.specialties && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.specialties.map((s, idx) => (
                                <span key={idx} className="text-[10px] bg-gold-950/30 text-gold-400 border border-gold-900/30 px-1.5 py-0.5 rounded">
                                  {s}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {item.type === "produto" && item.price !== undefined && (
                          <div className="text-right flex-shrink-0">
                            <span className="text-sm font-bold gradient-text">
                              R$ {item.price.toLocaleString("pt-BR")}
                            </span>
                          </div>
                        )}
                        
                        {isSelected && (
                          <span className="flex-shrink-0 h-2 w-2 rounded-full bg-accent animate-pulse" />
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-surface-400 text-center py-6">Nenhum resultado cadastrado.</p>
                )}
              </div>
            </div>

          </div>

          {/* Right Panel: Leaflet Map */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="glass rounded-2xl p-5 border border-surface-800 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold flex items-center gap-2">
                    <MapPin size={18} className="text-accent" />
                    Mapa de Localização
                  </h2>
                  <p className="text-xs text-surface-400 mt-0.5">
                    Visualização dinâmica com Leaflet
                  </p>
                </div>
                {selectedItem && (
                  <span className="text-xs font-mono bg-accent/10 text-accent px-2 py-0.5 rounded-md">
                    {selectedItem.city}, {selectedItem.state}
                  </span>
                )}
              </div>

              {selectedItem ? (
                <Map
                  city={selectedItem.city}
                  state={selectedItem.state}
                  popupText={
                    selectedItem.type === "produto" 
                      ? `${selectedItem.title} - R$ ${selectedItem.price?.toLocaleString("pt-BR")}`
                      : `${selectedItem.title} - Luthier (${selectedItem.rating?.toFixed(1)} ★)`
                  }
                  zoom={12}
                  className="h-[450px] w-full rounded-xl overflow-hidden shadow-glass border border-surface-700/50"
                />
              ) : (
                <div className="h-[450px] w-full rounded-xl bg-surface-900 flex items-center justify-center border border-surface-800">
                  <p className="text-sm text-surface-400">Nenhum item selecionado</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-surface-900 mt-16 py-6 text-center text-xs text-surface-500">
        <p>&copy; {new Date().getFullYear()} Focatto. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}
