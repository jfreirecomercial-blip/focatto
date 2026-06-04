"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getProducts,
  getProductById,
  listenProduct,
  listenProducts,
  searchProducts,
  getProductsBySeller as fetchSellerProducts,
} from "@/lib/db";
import type { Product, ProductFilters } from "@/types";

export function useProducts(filters?: ProductFilters) {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Listen to all active products in the selected category/subcategory
    const unsub = listenProducts(
      { category: filters?.category, subcategory: filters?.subcategory },
      (data) => {
        setAllProducts(data);
        setLoading(false);
      }
    );
    return unsub;
  }, [filters?.category, filters?.subcategory]);

  useEffect(() => {
    let result = [...allProducts];

    // Filter by search term
    if (filters?.search) {
      const term = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(term) ||
          p.brand.toLowerCase().includes(term) ||
          p.model.toLowerCase().includes(term) ||
          p.description?.toLowerCase().includes(term)
      );
    }

    // Filter by condition
    if (filters?.condition && filters.condition.length > 0) {
      result = result.filter((p) => filters.condition?.includes(p.condition));
    }

    // Filter by price range
    if (filters?.minPrice !== undefined && filters.minPrice !== null) {
      const min = Number(filters.minPrice);
      if (!isNaN(min)) {
        result = result.filter((p) => p.price >= min);
      }
    }
    if (filters?.maxPrice !== undefined && filters.maxPrice !== null) {
      const max = Number(filters.maxPrice);
      if (!isNaN(max)) {
        result = result.filter((p) => p.price <= max);
      }
    }

    // Filter by state
    if (filters?.state && filters.state !== "") {
      result = result.filter(
        (p) => p.state?.toLowerCase() === filters.state?.toLowerCase()
      );
    }

    // Filter by city
    if (filters?.city && filters.city !== "") {
      const cityTerm = filters.city.toLowerCase();
      result = result.filter(
        (p) => p.city?.toLowerCase().includes(cityTerm)
      );
    }

    // Filter by listing type
    if (filters?.listingType) {
      result = result.filter((p) => p.listingType === filters.listingType);
    }

    // Sort results
    if (filters?.sort) {
      if (filters.sort === "preco_asc") {
        result.sort((a, b) => a.price - b.price);
      } else if (filters.sort === "preco_desc") {
        result.sort((a, b) => b.price - a.price);
      } else if (filters.sort === "populares") {
        result.sort((a, b) => (b.favoritesCount || 0) - (a.favoritesCount || 0));
      } else {
        // default: recentes
        result.sort((a, b) => b.createdAt - a.createdAt);
      }
    } else {
      result.sort((a, b) => b.createdAt - a.createdAt);
    }

    setProducts(result);
  }, [allProducts, JSON.stringify(filters)]);

  return { products, loading };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) { setLoading(false); return; }
    setLoading(true);
    const unsub = listenProduct(id, (data) => {
      setProduct(data);
      setLoading(false);
    });
    return unsub;
  }, [id]);

  return { product, loading };
}

export function useProductSearch() {
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (term: string) => {
    if (!term.trim()) { setResults([]); return; }
    setLoading(true);
    const data = await searchProducts(term);
    setResults(data);
    setLoading(false);
  }, []);

  return { results, loading, search };
}

export function useProductsBySeller(sellerId: string | undefined) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!sellerId) { setLoading(false); return; }
    fetchSellerProducts(sellerId)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [sellerId]);

  return { products, loading };
}
