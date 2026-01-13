import Redis from 'ioredis';

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
});

// Default TTL in seconds
const DEFAULT_TTL = 3600;

export async function get<T>(key: string): Promise<T | null> {
    const data = await redis.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
}

export async function set<T>(key: string, value: T, ttl: number = DEFAULT_TTL): Promise<void> {
    await redis.set(key, JSON.stringify(value), 'EX', ttl);
}

export async function del(key: string): Promise<void> {
    await redis.del(key);
}

export async function exists(key: string): Promise<boolean> {
    const result = await redis.exists(key);
    return result === 1;
}

export async function clear(pattern: string = '*'): Promise<void> {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
        await redis.del(...keys);
    }
}

// Cache decorator helper
export function cached(ttl: number = DEFAULT_TTL) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function (...args: any[]) {
            const key = `${propertyKey}:${JSON.stringify(args)}`;
            const cached = await get(key);
            if (cached) return cached;

            const result = await originalMethod.apply(this, args);
            await set(key, result, ttl);
            return result;
        };
        return descriptor;
    };
}

export default redis;
