import { createClient } from './client';

function getClient() {
  const supabase = getClient();
  if (!supabase) throw new Error('Supabase not configured');
  return supabase;
}

export async function getListings() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(name, email, phone)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getListing(id) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(name, email, phone)')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

export async function createListing(listing) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('listings')
    .insert(listing)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateListing(id, updates) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('listings')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteListing(id) {
  const supabase = getClient();
  const { error } = await supabase
    .from('listings')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function getUserListings(userId) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function submitContactMessage(message) {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .insert(message)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getContactMessages() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function markMessageRead(id) {
  const supabase = getClient();
  const { error } = await supabase
    .from('contact_messages')
    .update({ is_read: true })
    .eq('id', id);
  if (error) throw error;
  return true;
}

export async function getServices() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name');
  if (error) throw error;
  return data;
}

export async function getTestimonials() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_visible', true)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllUsers() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function getAllListings() {
  const supabase = getClient();
  const { data, error } = await supabase
    .from('listings')
    .select('*, profiles(name)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}
