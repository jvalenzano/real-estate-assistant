import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '@/config/env';
import { User, TokenPayload, LoginResponse, UserSession } from '@/types';

// Mock user database (in real app, this would be Supabase)
const DEMO_USERS: User[] = [
  {
    id: 'user-demo-001',
    email: 'agent@demo.com',
    role: 'agent',
    firstName: 'Demo',
    lastName: 'Agent',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  },
  {
    id: 'user-demo-002',
    email: 'broker@demo.com',
    role: 'broker',
    firstName: 'Demo',
    lastName: 'Broker',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z'
  }
];

// Mock password storage (in real app, this would be hashed in database)
const DEMO_PASSWORDS: Record<string, string> = {
  'agent@demo.com': bcrypt.hashSync('demo123', 10),
  'broker@demo.com': bcrypt.hashSync('demo123', 10)
};

// In-memory session storage (in real app, this would be Redis or database)
const activeSessions: Map<string, UserSession> = new Map();

export class AuthService {
  /**
   * Authenticate user with email and password
   */
  static async login(email: string, password: string): Promise<LoginResponse> {
    // Find user by email
    const user = DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const hashedPassword = DEMO_PASSWORDS[email.toLowerCase()];
    if (!hashedPassword || !bcrypt.compareSync(password, hashedPassword)) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = this.generateToken(user);

    // Create session
    const session = this.createSession(user.id, token);
    activeSessions.set(token, session);

    return {
      token,
      user,
      expiresIn: '24h'
    };
  }

  /**
   * Generate JWT token
   */
  static generateToken(user: User): string {
    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: '24h',
      issuer: 'realeagent-api',
      audience: 'realeagent-app'
    });
  }

  /**
   * Verify JWT token
   */
  static verifyToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, config.jwt.secret, {
        issuer: 'realeagent-api',
        audience: 'realeagent-app'
      }) as TokenPayload;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  /**
   * Get user by ID
   */
  static getUserById(userId: string): User | null {
    return DEMO_USERS.find(u => u.id === userId) || null;
  }

  /**
   * Get user by email
   */
  static getUserByEmail(email: string): User | null {
    return DEMO_USERS.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  /**
   * Create user session
   */
  static createSession(userId: string, token: string): UserSession {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours

    return {
      id: `session-${Date.now()}`,
      userId,
      token,
      expiresAt: expiresAt.toISOString(),
      createdAt: now.toISOString(),
      lastAccessedAt: now.toISOString()
    };
  }

  /**
   * Get active session by token
   */
  static getSession(token: string): UserSession | null {
    return activeSessions.get(token) || null;
  }

  /**
   * Update session last accessed time
   */
  static updateSessionAccess(token: string): void {
    const session = activeSessions.get(token);
    if (session) {
      session.lastAccessedAt = new Date().toISOString();
      activeSessions.set(token, session);
    }
  }

  /**
   * Logout user (remove session)
   */
  static logout(token: string): boolean {
    return activeSessions.delete(token);
  }

  /**
   * Reset demo data (for demo purposes)
   */
  static resetDemoData(): void {
    // Clear all sessions
    activeSessions.clear();
    
    // Reset user data to defaults
    DEMO_USERS[0].updatedAt = new Date().toISOString();
    DEMO_USERS[1].updatedAt = new Date().toISOString();
    
    console.log('🔄 Demo data reset completed');
  }

  /**
   * Get all active sessions count (for health checks)
   */
  static getActiveSessionsCount(): number {
    return activeSessions.size;
  }

  /**
   * Clean expired sessions
   */
  static cleanExpiredSessions(): number {
    const now = new Date();
    let cleanedCount = 0;

    for (const [token, session] of activeSessions.entries()) {
      if (new Date(session.expiresAt) < now) {
        activeSessions.delete(token);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      console.log(`🧹 Cleaned ${cleanedCount} expired sessions`);
    }

    return cleanedCount;
  }
}