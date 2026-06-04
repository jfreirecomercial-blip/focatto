"use client";

import { useState, useRef, useEffect } from "react";
import { CaretDown, X, MapPin, Tag, CurrencyDollar, Calendar } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import type { ProductFilters as Filters, Condition } from "@/types";

const conditions: { value: Condition; label: string }[] = [
  { value: "novo", label: "Novo" },
  { value: "como_novo", label: "Como Novo" },
  { value: "excelente", label: "Excelente" },
  { value: "bom", label: "Bom" },
  { value: "desgastado", label: "Desgastado" },
  { value: "restauro", label: "Para Restauro" },
];

const states = [
  { value: "AC", label: "AC - Acre" },
  { value: "AL", label: "AL - Alagoas" },
  { value: "AP", label: "AP - Amapá" },
  { value: "AM", label: "AM - Amazonas" },
  { value: "BA", label: "BA - Bahia" },
  { value: "CE", label: "CE - Ceará" },
  { value: "DF", label: "DF - Distrito Federal" },
  { value: "ES", label: "ES - Espírito Santo" },
  { value: "GO", label: "GO - Goiás" },
  { value: "MA", label: "MA - Maranhão" },
  { value: "MT", label: "MT - Mato Grosso" },
  { value: "MS", label: "MS - Mato Grosso do Sul" },
  { value: "MG", label: "MG - Minas Gerais" },
  { value: "PA", label: "PA - Pará" },
  { value: "PB", label: "PB - Paraíba" },
  { value: "PR", label: "PR - Paraná" },
  { value: "PE", label: "PE - Pernambuco" },
  { value: "PI", label: "PI - Piauí" },
  { value: "RJ", label: "RJ - Rio de Janeiro" },
  { value: "RN", label: "RN - Rio Grande do Norte" },
  { value: "RS", label: "RS - Rio Grande do Sul" },
  { value: "RO", label: "RO - Rondônia" },
  { value: "RR", label: "RR - Roraima" },
  { value: "SC", label: "SC - Santa Catarina" },
  { value: "SP", label: "SP - São Paulo" },
  { value: "SE", label: "SE - Sergipe" },
  { value: "TO", label: "TO - Tocantins" }
];

interface ProductFiltersProps {
  filters: Filters;
  onChange: (filters: Filters) => void;
}

export function ProductFilters({ filters, onChange }: ProductFiltersProps) {
  const [activePopover, setActivePopover] = useState<'price' | 'condition' | 'location' | 'sort' | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Inputs local state to avoid triggering updates on every keystroke
  const [tempMinPrice, setTempMinPrice] = useState<string | number>(filters.minPrice || "");
  const [tempMaxPrice, setTempMaxPrice] = useState<string | number>(filters.maxPrice || "");
  const [tempCity, setTempCity] = useState(filters.city || "");

  // Sync temp states when filters change externally
  useEffect(() => {
    setTempMinPrice(filters.minPrice !== undefined ? filters.minPrice : "");
    setTempMaxPrice(filters.maxPrice !== undefined ? filters.maxPrice : "");
    setTempCity(filters.city !== undefined ? filters.city : "");
  }, [filters.minPrice, filters.maxPrice, filters.city]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setActivePopover(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const togglePopover = (popover: 'price' | 'condition' | 'location' | 'sort') => {
    setActivePopover(activePopover === popover ? null : popover);
  };

  const update = (key: keyof Filters, value: any) => {
    onChange({ ...filters, [key]: value || undefined });
  };

  const applyPriceFilters = () => {
    onChange({
      ...filters,
      minPrice: tempMinPrice !== "" ? Number(tempMinPrice) : undefined,
      maxPrice: tempMaxPrice !== "" ? Number(tempMaxPrice) : undefined,
    });
    setActivePopover(null);
  };

  const applyLocationFilters = (stateVal?: string) => {
    onChange({
      ...filters,
      state: stateVal !== undefined ? (stateVal || undefined) : filters.state,
      city: tempCity !== "" ? tempCity : undefined,
    });
    if (stateVal !== undefined) {
      // Don't close immediately if typing city, but close for state selection if no city is typed
      if (!tempCity) setActivePopover(null);
    } else {
      setActivePopover(null);
    }
  };

  const toggleCondition = (cond: Condition) => {
    const currentConditions = filters.condition || [];
    let newConditions: Condition[];
    if (currentConditions.includes(cond)) {
      newConditions = currentConditions.filter((c) => c !== cond);
    } else {
      newConditions = [...currentConditions, cond];
    }
    update("condition", newConditions.length > 0 ? newConditions : undefined);
  };

  const clearFilters = () => {
    setTempMinPrice("");
    setTempMaxPrice("");
    setTempCity("");
    onChange({});
    setActivePopover(null);
  };

  // Determine if a filter is active to style the buttons
  const isPriceActive = filters.minPrice !== undefined || filters.maxPrice !== undefined;
  const isConditionActive = filters.condition && filters.condition.length > 0;
  const isLocationActive = (filters.state && filters.state !== "") || (filters.city && filters.city !== "");
  const isSortActive = filters.sort && filters.sort !== "recentes";

  const hasAnyFilters = Object.keys(filters).some((key) => {
    if (key === "category" || key === "subcategory" || key === "search") return false;
    const val = filters[key as keyof Filters];
    return val !== undefined && val !== "" && !(Array.isArray(val) && !val.length);
  });

  const getPriceLabel = () => {
    if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
      return `R$ ${filters.minPrice} - R$ ${filters.maxPrice}`;
    }
    if (filters.minPrice !== undefined) return `A partir de R$ ${filters.minPrice}`;
    if (filters.maxPrice !== undefined) return `Até R$ ${filters.maxPrice}`;
    return "Preço";
  };

  const getConditionLabel = () => {
    if (!filters.condition || filters.condition.length === 0) return "Condição";
    if (filters.condition.length === 1) {
      return conditions.find((c) => c.value === filters.condition![0])?.label || "Condição";
    }
    return `${filters.condition.length} Condições`;
  };

  const getLocationLabel = () => {
    if (filters.state && filters.city) return `${filters.state} - ${filters.city}`;
    if (filters.state) return filters.state;
    if (filters.city) return filters.city;
    return "Localização";
  };

  const getSortLabel = () => {
    switch (filters.sort) {
      case "preco_asc": return "Menor Preço";
      case "preco_desc": return "Maior Preço";
      case "populares": return "Mais Populares";
      default: return "Mais Recentes";
    }
  };

  return (
    <div className="w-full flex items-center justify-between gap-4 flex-wrap" ref={containerRef}>
      <div className="flex items-center gap-2 flex-wrap">
        
        {/* PREÇO FILTER */}
        <div className="relative">
          <button
            onClick={() => togglePopover('price')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer",
              isPriceActive
                ? "border-accent bg-accent/10 text-white"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-surface-200 hover:text-white"
            )}
          >
            <span>{getPriceLabel()}</span>
            <CaretDown size={12} className={cn("transition-transform", activePopover === 'price' && "rotate-180")} />
          </button>

          {activePopover === 'price' && (
            <div className="absolute left-0 top-full mt-2 w-64 glass-strong rounded-xl shadow-glass border border-white/10 p-4 z-40 animate-scale-in">
              <h4 className="text-xs font-semibold text-surface-300 mb-3">Faixa de Preço (R$)</h4>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div>
                  <label className="text-[10px] text-surface-400 block mb-1">Mínimo</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={tempMinPrice}
                    onChange={(e) => setTempMinPrice(e.target.value)}
                    className="input-field py-1 px-2.5 text-xs rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-surface-400 block mb-1">Máximo</label>
                  <input
                    type="number"
                    placeholder="Sem lim."
                    value={tempMaxPrice}
                    onChange={(e) => setTempMaxPrice(e.target.value)}
                    className="input-field py-1 px-2.5 text-xs rounded-lg"
                  />
                </div>
              </div>
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => { setTempMinPrice(""); setTempMaxPrice(""); }}>
                  Limpar
                </Button>
                <Button size="sm" onClick={applyPriceFilters}>
                  Aplicar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* CONDICÃO FILTER */}
        <div className="relative">
          <button
            onClick={() => togglePopover('condition')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer",
              isConditionActive
                ? "border-accent bg-accent/10 text-white"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-surface-200 hover:text-white"
            )}
          >
            <span>{getConditionLabel()}</span>
            <CaretDown size={12} className={cn("transition-transform", activePopover === 'condition' && "rotate-180")} />
          </button>

          {activePopover === 'condition' && (
            <div className="absolute left-0 top-full mt-2 w-56 glass-strong rounded-xl shadow-glass border border-white/10 p-3 z-40 animate-scale-in">
              <h4 className="text-xs font-semibold text-surface-300 mb-2 px-1">Estado de Conservação</h4>
              <div className="space-y-1.5 mb-2 max-h-48 overflow-y-auto scrollbar-thin">
                {conditions.map((c) => {
                  const isChecked = filters.condition?.includes(c.value) || false;
                  return (
                    <label
                      key={c.value}
                      className="flex items-center gap-2 px-2 py-1 rounded hover:bg-white/5 cursor-pointer text-xs transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleCondition(c.value)}
                        className="rounded border-white/15 bg-white/5 accent-accent w-3.5 h-3.5"
                      />
                      <span className="text-surface-200">{c.label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* LOCALIZACÃO FILTER */}
        <div className="relative">
          <button
            onClick={() => togglePopover('location')}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer",
              isLocationActive
                ? "border-accent bg-accent/10 text-white"
                : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-surface-200 hover:text-white"
            )}
          >
            <MapPin size={12} />
            <span>{getLocationLabel()}</span>
            <CaretDown size={12} className={cn("transition-transform", activePopover === 'location' && "rotate-180")} />
          </button>

          {activePopover === 'location' && (
            <div className="absolute left-0 top-full mt-2 w-64 glass-strong rounded-xl shadow-glass border border-white/10 p-4 z-40 animate-scale-in">
              <h4 className="text-xs font-semibold text-surface-300 mb-3">Localização</h4>
              
              <div className="space-y-3 mb-3">
                <div>
                  <label className="text-[10px] text-surface-400 block mb-1">Estado</label>
                  <select
                    value={filters.state || ""}
                    onChange={(e) => applyLocationFilters(e.target.value)}
                    className="input-field py-1 px-2.5 text-xs rounded-lg w-full bg-background"
                  >
                    <option value="">Todos os Estados</option>
                    {states.map((st) => (
                      <option key={st.value} value={st.value}>{st.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-surface-400 block mb-1">Cidade</label>
                  <input
                    type="text"
                    placeholder="Ex: São Paulo"
                    value={tempCity}
                    onChange={(e) => setTempCity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && applyLocationFilters()}
                    className="input-field py-1 px-2.5 text-xs rounded-lg w-full"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button size="sm" variant="ghost" onClick={() => { setTempCity(""); applyLocationFilters(""); }}>
                  Limpar
                </Button>
                <Button size="sm" onClick={() => applyLocationFilters()}>
                  Aplicar
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* CLEAR FILTERS BUTTON */}
        {hasAnyFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-red-400 hover:text-red-300 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all cursor-pointer"
          >
            <X size={12} />
            <span>Limpar Filtros</span>
          </button>
        )}
      </div>

      {/* SORT CONTROLS */}
      <div className="relative">
        <button
          onClick={() => togglePopover('sort')}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer",
            isSortActive
              ? "border-accent bg-accent/10 text-white"
              : "border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-surface-200 hover:text-white"
          )}
        >
          <span>Ordenar: {getSortLabel()}</span>
          <CaretDown size={12} className={cn("transition-transform", activePopover === 'sort' && "rotate-180")} />
        </button>

        {activePopover === 'sort' && (
          <div className="absolute right-0 top-full mt-2 w-48 glass-strong rounded-xl shadow-glass border border-white/10 p-1.5 z-40 animate-scale-in">
            <div className="space-y-0.5">
              {[
                { value: "recentes", label: "Mais Recentes" },
                { value: "preco_asc", label: "Menor Preço" },
                { value: "preco_desc", label: "Maior Preço" },
                { value: "populares", label: "Mais Populares" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { update("sort", opt.value); setActivePopover(null); }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-xs rounded-lg transition-colors cursor-pointer block",
                    (filters.sort || "recentes") === opt.value
                      ? "bg-accent/15 text-accent font-semibold"
                      : "hover:bg-white/5 text-surface-200"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
