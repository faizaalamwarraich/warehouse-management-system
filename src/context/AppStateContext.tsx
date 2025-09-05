import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { AppState, Assignment, ID, Product, Salesman, StockTransaction } from '../types/models';
import { KEYS, storage } from '../storage/local';
import { seedState } from '../data/seed';

type AppStateContextType = {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  addProduct: (p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Product;
  updateProduct: (id: ID, patch: Partial<Product>) => void;
  deleteProduct: (id: ID) => void;
  addSalesman: (s: Omit<Salesman, 'id' | 'createdAt'>) => Salesman;
  updateSalesman: (id: ID, patch: Partial<Salesman>) => void;
  deleteSalesman: (id: ID) => void;
  recordTransaction: (t: Omit<StockTransaction, 'id' | 'createdAt'>) => StockTransaction;
  createAssignment: (a: Omit<Assignment, 'id' | 'createdAt'>, user?: string) => Assignment;
};

const AppStateContext = createContext<AppStateContextType | undefined>(undefined);

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

export const AppStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(() => {
    const existing = storage.get<AppState | null>(KEYS.appState, null);
    if (existing) return existing;
    storage.set(KEYS.appState, seedState);
    return seedState;
  });

  useEffect(() => {
    storage.set(KEYS.appState, state);
  }, [state]);

  const addProduct = useCallback((p: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProd: Product = {
      ...p,
      id: uid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setState(s => ({ ...s, products: [newProd, ...s.products] }));
    return newProd;
  }, []);

  const updateProduct = useCallback((id: ID, patch: Partial<Product>) => {
    setState(s => ({
      ...s,
      products: s.products.map(p => (p.id === id ? { ...p, ...patch, updatedAt: new Date().toISOString() } : p)),
    }));
  }, []);

  const deleteProduct = useCallback((id: ID) => {
    setState(s => ({ ...s, products: s.products.filter(p => p.id !== id) }));
  }, []);

  const addSalesman = useCallback((sman: Omit<Salesman, 'id' | 'createdAt'>) => {
    const sm: Salesman = { ...sman, id: uid(), createdAt: new Date().toISOString() };
    setState(s => ({ ...s, salesmen: [sm, ...s.salesmen] }));
    return sm;
  }, []);

  const updateSalesman = useCallback((id: ID, patch: Partial<Salesman>) => {
    setState(s => ({
      ...s,
      salesmen: s.salesmen.map(sm => (sm.id === id ? { ...sm, ...patch } : sm)),
    }));
  }, []);

  const deleteSalesman = useCallback((id: ID) => {
    setState(s => ({ ...s, salesmen: s.salesmen.filter(sm => sm.id !== id) }));
  }, []);

  const recordTransaction = useCallback((t: Omit<StockTransaction, 'id' | 'createdAt'>) => {
    const tx: StockTransaction = { ...t, id: uid(), createdAt: new Date().toISOString() };
    setState(s => ({ ...s, transactions: [tx, ...s.transactions] }));
    return tx;
  }, []);

  const createAssignment = useCallback((a: Omit<Assignment, 'id' | 'createdAt'>, user?: string) => {

    const newAssignment: Assignment = { ...a, id: uid(), createdAt: new Date().toISOString() };
    setState(s => {

      for (const item of a.items) {
        const prod = s.products.find(p => p.id === item.productId);
        if (!prod) throw new Error('Product not found');
        if (item.qty < 0) throw new Error('Quantity must be positive');
        if (prod.stock < item.qty) throw new Error(`Not enough stock for ${prod.name}`);
      }

      const updatedProducts: Product[] = s.products.map(p => {
        const it = a.items.find(i => i.productId === p.id);
        if (!it) return p;
        return { ...p, stock: p.stock - it.qty, updatedAt: new Date().toISOString() };
      });
      const newTxs: StockTransaction[] = a.items.map(it => ({
        id: uid(),
        productId: it.productId,
        delta: -Math.abs(it.qty),
        reason: 'assignment',
        refId: newAssignment.id,
        user,
        createdAt: new Date().toISOString(),
      }));
      return {
        ...s,
        products: updatedProducts,
        assignments: [newAssignment, ...s.assignments],
        transactions: [...newTxs, ...s.transactions],
      };
    });
    return newAssignment;
  }, []);

  const value = useMemo(
    () => ({
      state,
      setState,
      addProduct,
      updateProduct,
      deleteProduct,
      addSalesman,
      updateSalesman,
      deleteSalesman,
      recordTransaction,
      createAssignment,
    }),
    [state, addProduct, updateProduct, deleteProduct, addSalesman, updateSalesman, deleteSalesman, recordTransaction, createAssignment]
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
};

export const useAppState = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used within AppStateProvider');
  return ctx;
};
