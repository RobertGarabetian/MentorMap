'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'
import { createClient as createBrowserClient } from '@/utils/supabase/client'
export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/home', 'layout')
  redirect('/home')
}



export async function signup(formData: FormData) {
  const supabase = await createClient();

  // Extract and validate your form inputs
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  // Sign up the user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
  if (authError) {
    console.log(authError);
    throw authError;
  }
  
  // Extract the user ID from the auth data
  const userId = authData.user?.id;
  if (!userId) {
    throw new Error('User sign up did not return a user ID');
  }
  
  // Prepare profile data using the returned user ID
  const profileData = {
    user_id: userId,
    community_college: formData.get('communityCollege') as string,
    college_major: formData.get('major') as string,
    username: formData.get('username') as string,
  };

  // Insert the profile data into your 'profiles' table
  const { error: profileError } = await supabase.from('profiles').insert(profileData);
  if (profileError) {
    console.log(profileError);
    throw profileError;
  }
  
  // Optionally, revalidate or redirect as needed
  revalidatePath('/home', 'layout');
  redirect('/home');
}

export async function signOut() {
  const supabase = await createBrowserClient();

  const { error } = await supabase.auth.signOut();
  if (error) {
    console.log(error);
    throw error
  } 
  revalidatePath('/', 'layout');
  redirect('/');
}