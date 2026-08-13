import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

class Database {
  static instance;

  constructor() {
    if (Database.instance) {
      return Database.instance;
    }

    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });

    this.client = new PrismaClient({
      adapter,
    });

    this.connectionPromise = null;

    Database.instance = this;
  }

  async connect() {
    // Someone is already connected/connecting.
    if (this.connectionPromise) {
      return this.connectionPromise;
    }

    this.connectionPromise = this.client.$connect();

    try {
      await this.connectionPromise;
    } catch (error) {
      // Connection failed, so allow another attempt later.
      this.connectionPromise = null;
      throw error;
    }
  }

  async disconnect() {
    // Nothing to disconnect.
    if (!this.connectionPromise) {
      return;
    }

    await this.client.$disconnect();

    this.connectionPromise = null;
  }

  async healthCheck() {
    try {
      await this.client.$queryRaw`SELECT 1`;

      return true;
    } catch (error) {
      return false;
    }
  }

  getClient() {
    return this.client;
  }
}

const database = new Database();

export default database;