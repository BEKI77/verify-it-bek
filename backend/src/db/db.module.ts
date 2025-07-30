import { Module } from '@nestjs/common';
import { Pool } from 'pg';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema/schema';
import { ConfigService } from '@nestjs/config';

export const DB = Symbol('drizzle-connection');

@Module({
  providers: [
    {
      provide: DB,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        // console.log(databaseUrl);
        const pool = new Pool({
          connectionString: databaseUrl,
          ssl: false,
        });
        return drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;
      },
    },
  ],
  exports: [DB],
})
export class DbModule {}