
import { ScheduledTrip } from '../types';

const STORAGE_KEYS = {
  TRIPS: 'nexusflow_scheduled_trips',
  USER: 'nexusflow_current_user', // Currently logged in session
  USERS_DB: 'nexusflow_users_database', // Registry of all accounts
  HISTORY: 'nexusflow_route_history'
};

export interface UserAccount {
  name: string;
  email: string;
  password?: string;
}

export const storageService = {
  // User Registry (The "Database")
  getUsers: (): UserAccount[] => {
    const data = localStorage.getItem(STORAGE_KEYS.USERS_DB);
    return data ? JSON.parse(data) : [];
  },

  registerUser: (user: UserAccount): { success: boolean; message: string } => {
    const users = storageService.getUsers();
    if (users.find(u => u.email === user.email)) {
      return { success: false, message: 'An account with this email already exists.' };
    }
    users.push(user);
    localStorage.setItem(STORAGE_KEYS.USERS_DB, JSON.stringify(users));
    return { success: true, message: 'Account created successfully.' };
  },

  authenticateUser: (email: string, pass: string): UserAccount | null => {
    const users = storageService.getUsers();
    const found = users.find(u => u.email === email && u.password === pass);
    if (found) {
      const { password, ...sessionUser } = found; // Don't store password in session
      return sessionUser;
    }
    return null;
  },

  // Scheduled Trips
  saveTrip: (trip: ScheduledTrip) => {
    const trips = storageService.getTrips();
    trips.unshift(trip);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
  },

  getTrips: (): ScheduledTrip[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TRIPS);
    return data ? JSON.parse(data) : [];
  },

  deleteTrip: (id: string) => {
    const trips = storageService.getTrips();
    const filtered = trips.filter(t => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(filtered));
  },

  // Current Session Management
  saveUser: (user: { name: string; email: string } | null) => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  },

  getUser: (): { name: string; email: string } | null => {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  }
};