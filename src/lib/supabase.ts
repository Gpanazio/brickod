import { createClient } from '@supabase/supabase-js';
import type { CallSheet, Template } from '@shared/schema';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase: any = null;

// Inicializa cliente Supabase apenas se as variáveis estiverem configuradas
if (supabaseUrl && supabaseKey) {
  try {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Cliente Supabase inicializado');
  } catch (error) {
    console.error('❌ Erro ao inicializar Supabase:', error);
  }
}

export { supabase };

// Funções para Call Sheets
export async function getCallSheets(): Promise<CallSheet[]> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('call_sheets')
    .select('*')
    .order('updated_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function createCallSheet(callSheet: Omit<CallSheet, 'id' | 'createdAt' | 'updatedAt'>): Promise<CallSheet> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('call_sheets')
    .insert([{
      ...callSheet,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteCallSheet(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { error } = await supabase
    .from('call_sheets')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}

// Funções para Templates
export async function getTemplates(): Promise<Template[]> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('updated_at', { ascending: false });
    
  if (error) throw error;
  return data || [];
}

export async function createTemplate(template: Omit<Template, 'id' | 'createdAt' | 'updatedAt'>): Promise<Template> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { data, error } = await supabase
    .from('templates')
    .insert([{
      ...template,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }])
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

export async function deleteTemplate(id: string): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase não configurado');
  }
  
  const { error } = await supabase
    .from('templates')
    .delete()
    .eq('id', id);
    
  if (error) throw error;
}