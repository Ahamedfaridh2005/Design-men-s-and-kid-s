import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

export interface Discount {
  id: string;
  code: string;
  discount_value: number;
  discount_type: 'Percent' | 'Fixed';
  uses: number;
  status: 'ACTIVE' | 'INACTIVE';
  created_at: string;
}

export function useDiscounts() {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchDiscounts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('discounts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDiscounts(data || []);
    } catch (error: any) {
      console.error('Error fetching discounts:', error.message);
      toast({
        title: "Error",
        description: "Failed to fetch discounts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addDiscount = async (discount: Omit<Discount, 'id' | 'created_at' | 'uses'>) => {
    try {
      const { data, error } = await supabase
        .from('discounts')
        .insert([discount])
        .select();

      if (error) throw error;
      
      setDiscounts(prev => [data[0], ...prev]);
      toast({
        title: "Success",
        description: "Discount code added successfully.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to add discount code.",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteDiscount = async (id: string) => {
    try {
      const { error } = await supabase
        .from('discounts')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setDiscounts(prev => prev.filter(d => d.id !== id));
      toast({
        title: "Success",
        description: "Discount code deleted.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete discount code.",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateDiscount = async (id: string, updates: Partial<Omit<Discount, 'id' | 'created_at' | 'uses'>>) => {
    try {
      const { data, error } = await supabase
        .from('discounts')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      
      setDiscounts(prev => prev.map(d => d.id === id ? data[0] : d));
      toast({
        title: "Success",
        description: "Discount code updated successfully.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update discount code.",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, []);

  return {
    discounts,
    loading,
    addDiscount,
    updateDiscount,
    deleteDiscount,
    refresh: fetchDiscounts
  };
}
