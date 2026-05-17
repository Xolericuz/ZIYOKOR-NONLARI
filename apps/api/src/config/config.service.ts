export class ConfigService {
  get port(): number {
    return Number(process.env.PORT) || 4000;
  }

  get databaseUrl(): string {
    return process.env.DATABASE_URL || 'postgresql://zn_user:zn_password_2026@localhost:5432/ziyokor_noni';
  }

  get redisUrl(): string {
    return process.env.REDIS_URL || 'redis://:zn_redis_2026@localhost:6379';
  }

  get jwtSecret(): string {
    return process.env.JWT_SECRET || 'zn_jwt_super_secret_2026';
  }

  get jwtExpiresIn(): string {
    return process.env.JWT_EXPIRES_IN || '7d';
  }

  get rateLimit(): number {
    return 100;
  }

  get rateLimitWindowMs(): number {
    return 60000;
  }
}
