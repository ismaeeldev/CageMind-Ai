import { PrismaClient } from '../generated/prisma';
import { neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Required for Neon Serverless Driver in Node.js environments (Next.js SSR/Serverless Functions)
neonConfig.webSocketConstructor = ws;

// Create a connection pool to prevent connection exhaustion in serverless environments
const connectionString = process.env.DATABASE_URL!;
const useNeonAdapter = process.env.USE_NEON_ADAPTER !== 'false';
const adapter = useNeonAdapter ? new PrismaNeon({ connectionString }) : undefined;

// Global Prisma singleton to prevent multiple instances during hot-reloads in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  (adapter ? new PrismaClient({ adapter }) : new PrismaClient());

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
