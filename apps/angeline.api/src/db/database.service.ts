import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'src/config/config';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    await this.initializeDatabase();
  }

  private async initializeDatabase() {
    try {
      const dbPath = config.database_path;
      const dbExists = fs.existsSync(dbPath);

      if (!dbExists) {
        console.log('Initialisation de la base de données...');
      }

      const schemaPath = path.join(__dirname, 'init_db.sql');
      const schema = fs.readFileSync(schemaPath, 'utf8');
      const statements = schema
        .split(';')
        .map((statement) => statement.trim())
        .filter(Boolean);

      for (const statement of statements) {
        await this.dataSource.query(statement);
      }
    } catch (error) {
      console.error(
        "Erreur lors de l'initialisation de la base de données:",
        error,
      );
      throw error;
    }
  }
}
