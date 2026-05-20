"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { Product, Category } from "@/lib/types";
import { createClient } from "@/lib/supabase-client";

interface StoreContextType {
  products: Product[];
  categories: Category[];
  featuredProducts: Product[];
  offerProducts: Product[];
  loading: boolean;
  searchProducts: (query: string) => Promise<Product[]>;
  getProduct: (id: string) => Promise<Product | null>;
  getProductsByCategory: (categoryId: string) => Promise<Product[]>;
  refreshProducts: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    const supabase = createClient();
    const [prodRes, catRes] = await Promise.all([
      supabase.from("products").select("*, category:categories(*)").order("created_at", { ascending: false }),
      supabase.from("categories").select("*").order("name", { ascending: true }),
    ]);
    if (prodRes.data) setProducts(prodRes.data as unknown as Product[]);
    if (catRes.data) setCategories(catRes.data as Category[]);
    setLoading(false);
  }

  const featuredProducts = products.filter((p) => p.is_featured && p.is_available);
  const offerProducts = products.filter((p) => p.is_offer && p.is_available);

  const searchProducts = async (query: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .eq("is_available", true)
      .order("created_at", { ascending: false });
    return (data || []) as unknown as Product[];
  };

  const getProduct = async (id: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("id", id)
      .single();
    return data as unknown as Product | null;
  };

  const getProductsByCategory = async (categoryId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .eq("category_id", categoryId)
      .eq("is_available", true)
      .order("created_at", { ascending: false });
    return (data || []) as unknown as Product[];
  };

  const refreshProducts = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("products")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false });
    if (data) setProducts(data as unknown as Product[]);
  };

  const refreshCategories = async () => {
    const supabase = createClient();
    const { data } = await supabase.from("categories").select("*").order("name", { ascending: true });
    if (data) setCategories(data as Category[]);
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        featuredProducts,
        offerProducts,
        loading,
        searchProducts,
        getProduct,
        getProductsByCategory,
        refreshProducts,
        refreshCategories,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
