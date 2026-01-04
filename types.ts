
export enum AppView {
  INTRO = 'INTRO',
  DASHBOARD = 'DASHBOARD',
  AUTH = 'AUTH',
  ROUTES = 'ROUTES',
  CONNECT = 'CONNECT',
  PROFILE = 'PROFILE',
  PLAN_AHEAD = 'PLAN_AHEAD',
}

export enum TransportMode {
  BUS = 'BUS',
  METRO = 'METRO',
  AUTO = 'AUTO',
  CAB = 'CAB',
  WALKING = 'WALKING',
}

export enum RoutePreference {
  FAST = 'FAST',
  COST_EFFICIENT = 'COST_EFFICIENT',
  COMFORTABLE = 'COMFORTABLE',
}

export interface RouteSegment {
  mode: TransportMode;
  instruction: string;
  distance?: string;
  duration: string;
}

export interface RouteOption {
  id: string;
  mode: TransportMode; // Primary/Starting mode
  segments: RouteSegment[];
  duration: string;
  cost: string;
  comfortLevel: 'High' | 'Medium' | 'Low';
  summary: string;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  destination: string;
  scheduledTime?: string;
}

export interface ScheduledTrip {
  id: string;
  destination: string;
  date: string;
  time: string;
  groupSize: number;
  status: string;
  timestamp: number;
}

export interface MatchGroup {
  id: string;
  mode: TransportMode;
  users: UserProfile[];
  maxUsers: number;
  status: 'FORMING' | 'FULL' | 'VERIFIED';
}
