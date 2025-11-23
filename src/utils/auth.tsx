import { projectId, publicAnonKey } from './supabase/info';
import { supabase } from './supabase/client';

// Polyfill for crypto.randomUUID in environments that don't support it
const generateUUID = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID generation
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  nameNepali?: string;
  roles: string[];
  currentRole: string;
  verified: boolean;
  location?: string;
  createdAt: string;
}

export class AuthService {
  static async signup(identifier: string, otp: string, name: string, nameNepali: string): Promise<{ user: AuthUser; message: string }> {
    try {
      // For demo purposes, validate OTP (accept any 6-digit OTP)
      if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        throw new Error('Invalid OTP format');
      }
      
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      const phone = isEmail ? identifier.replace(/@.*$/, '').replace(/[^0-9]/g, '') : identifier;
      
      console.log('AuthService signup:', { identifier, isEmail, phone });

      // Check if user already exists
      const existingUsers = JSON.parse(localStorage.getItem('kisanconnect:users') || '[]');
      const existingUser = existingUsers.find((u: any) => 
        u.phone === phone || u.phone === identifier || u.email === identifier
      );
      
      if (existingUser) {
        // User exists, return existing user instead of error
        return {
          user: existingUser,
          message: 'User already exists'
        };
      }

      // Create user profile
      const profile: AuthUser = {
        id: generateUUID(),
        phone: isEmail ? phone : identifier,
        name: name || 'User',
        nameNepali: nameNepali || 'प्रयोगकर्ता',
        roles: [],
        currentRole: 'consumer',
        verified: true,
        createdAt: new Date().toISOString()
      };

      // Store email if it's an email-based signup
      if (isEmail) {
        (profile as any).email = identifier;
      }

      // Save user to localStorage (demo mode)
      existingUsers.push(profile);
      localStorage.setItem('kisanconnect:users', JSON.stringify(existingUsers));

      // Try to create user with Supabase Auth for real authentication
      try {
        const email = isEmail ? identifier : `${phone.replace(/[^0-9]/g, '')}@kisanconnect.demo`;
        const password = 'temp-password-' + Math.random().toString(36).substr(2, 9);
        
        // Add timeout to prevent hanging
        const signupPromise = supabase.auth.signUp({
          email: email,
          password: password,
          options: {
            data: {
              name: name || 'User',
              nameNepali: nameNepali || 'प्रयोगकर्ता',
              phone: isEmail ? phone : identifier,
              email: isEmail ? identifier : undefined,
              display_name: name || 'User'
            }
          }
        });

        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Signup timeout')), 5000)
        );

        const { data, error } = await Promise.race([signupPromise, timeoutPromise]) as any;

        if (!error && data?.user) {
          profile.id = data.user.id;
          
          // Update user in localStorage with real Supabase ID
          const updatedUsers = existingUsers.map((u: any) => u.phone === phone ? profile : u);
          localStorage.setItem('kisanconnect:users', JSON.stringify(updatedUsers));
          
          // Store password for demo login
          localStorage.setItem(`kisanconnect:auth:${identifier}`, JSON.stringify({ password }));
          
          // Auto sign in the user
          await supabase.auth.signInWithPassword({
            email: email,
            password: password
          }).catch(e => console.warn('Auto signin failed:', e));
        }
      } catch (supabaseError) {
        console.warn('Supabase auth failed, continuing with demo mode:', supabaseError);
      }

      return { 
        user: profile,
        message: 'User created successfully'
      };
    } catch (error: any) {
      console.error('Error in signup:', error);
      throw new Error(error.message || 'Signup failed');
    }
  }

  static async login(identifier: string, otp: string): Promise<{ user: AuthUser; sessionToken: string; message: string }> {
    try {
      // For demo purposes, validate OTP (accept any 6-digit OTP)
      if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
        throw new Error('Invalid OTP format');
      }
      
      // Determine if identifier is email or phone
      const isEmail = identifier.includes('@');
      const phone = isEmail ? identifier.replace(/@.*$/, '').replace(/[^0-9]/g, '') : identifier;
      
      console.log('AuthService login:', { identifier, isEmail, phone });

      // Check if user exists in localStorage (demo mode)
      const existingUsers = JSON.parse(localStorage.getItem('kisanconnect:users') || '[]');
      const existingUser = existingUsers.find((u: any) => 
        u.phone === phone || u.phone === identifier || u.email === identifier
      );
      
      if (!existingUser) {
        throw new Error('User not found');
      }

      // Try Supabase authentication if available
      try {
        const email = isEmail ? identifier : `${phone.replace(/[^0-9]/g, '')}@kisanconnect.demo`;
        const userAuth = JSON.parse(localStorage.getItem(`kisanconnect:auth:${identifier}`) || '{}');
        
        if (userAuth.password) {
          // Add timeout to prevent hanging
          const loginPromise = supabase.auth.signInWithPassword({
            email: email,
            password: userAuth.password
          });

          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Login timeout')), 5000)
          );

          const { data, error } = await Promise.race([loginPromise, timeoutPromise]) as any;

          if (!error && data?.session) {
            return {
              user: existingUser,
              sessionToken: data.session.access_token,
              message: 'Login successful'
            };
          }
        }
      } catch (supabaseError) {
        console.warn('Supabase login failed, using demo mode:', supabaseError);
      }

      // Fallback to demo mode
      return {
        user: existingUser,
        sessionToken: 'demo-token-' + Date.now(),
        message: 'Demo login successful'
      };
    } catch (error: any) {
      console.error('Error in login:', error);
      throw new Error(error.message || 'Login failed');
    }
  }

  static async signInWithEmail(email: string, password: string = 'temp-password') {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;
    return data;
  }

  static async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  static async updateUserRoles(accessToken: string, roles: string[]): Promise<AuthUser> {
    try {
      const { data: { user }, error: getUserError } = await supabase.auth.getUser(accessToken);
      
      if (getUserError || !user) {
        throw new Error('Invalid token or user not found');
      }

      // Update user metadata with new roles
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          roles: roles,
          currentRole: roles[0] || 'consumer'
        }
      });

      if (error) {
        throw new Error('Failed to update roles');
      }

      const profile: AuthUser = {
        id: user.id,
        phone: user.user_metadata?.phone || user.phone || '',
        name: user.user_metadata?.name || 'User',
        nameNepali: user.user_metadata?.nameNepali || 'प्रयोगकर्ता',
        roles: roles,
        currentRole: roles[0] || 'consumer',
        verified: user.email_confirmed_at !== null || user.phone_confirmed_at !== null,
        location: user.user_metadata?.location || '',
        createdAt: user.created_at
      };

      return profile;
    } catch (error) {
      console.error('Error updating user roles:', error);
      throw error;
    }
  }

  static async switchRole(accessToken: string, role: string): Promise<AuthUser> {
    try {
      const { data: { user }, error: getUserError } = await supabase.auth.getUser(accessToken);
      
      if (getUserError || !user) {
        throw new Error('Invalid token or user not found');
      }

      const currentRoles = user.user_metadata?.roles || ['consumer'];
      
      if (!currentRoles.includes(role)) {
        throw new Error('Role not available for user');
      }

      // Update user metadata with new current role
      const { data, error } = await supabase.auth.updateUser({
        data: {
          ...user.user_metadata,
          currentRole: role
        }
      });

      if (error) {
        throw new Error('Failed to switch role');
      }

      const profile: AuthUser = {
        id: user.id,
        phone: user.user_metadata?.phone || user.phone || '',
        name: user.user_metadata?.name || 'User',
        nameNepali: user.user_metadata?.nameNepali || 'प्रयोगकर्ता',
        roles: currentRoles,
        currentRole: role,
        verified: user.email_confirmed_at !== null || user.phone_confirmed_at !== null,
        location: user.user_metadata?.location || '',
        createdAt: user.created_at
      };

      return profile;
    } catch (error) {
      console.error('Error switching role:', error);
      throw error;
    }
  }

  static async getUserProfile(accessToken: string): Promise<AuthUser> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      
      if (error || !user) {
        throw new Error('Invalid token or user not found');
      }

      const profile: AuthUser = {
        id: user.id,
        phone: user.user_metadata?.phone || user.phone || '',
        name: user.user_metadata?.name || 'User',
        nameNepali: user.user_metadata?.nameNepali || 'प्रयोगकर्ता',
        roles: user.user_metadata?.roles || ['consumer'],
        currentRole: user.user_metadata?.currentRole || 'consumer',
        verified: user.email_confirmed_at !== null || user.phone_confirmed_at !== null,
        location: user.user_metadata?.location || '',
        createdAt: user.created_at
      };

      return profile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }

  static async seedInitialData(): Promise<void> {
    try {
      // For demo purposes, we'll initialize some local data
      // In production, you would seed data to your database
      
      const categories = [
        { id: 'vegetables', name: 'Vegetables', nameNepali: 'तरकारी', icon: '🥕' },
        { id: 'fruits', name: 'Fruits', nameNepali: 'फलफूल', icon: '🍎' },
        { id: 'grains', name: 'Grains', nameNepali: 'अनाज', icon: '🌾' },
        { id: 'dairy', name: 'Dairy', nameNepali: 'दुग्ध उत्पादन', icon: '🥛' },
        { id: 'spices', name: 'Spices', nameNepali: 'मसला', icon: '🌶️' }
      ];

      // Store in localStorage for demo
      localStorage.setItem('kisanconnect:categories', JSON.stringify(categories));
      
      console.log('Demo data initialized');
    } catch (error) {
      console.warn('Failed to seed demo data:', error);
    }
  }
}