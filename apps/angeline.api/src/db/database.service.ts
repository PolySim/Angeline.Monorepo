import { Injectable, OnModuleInit } from '@nestjs/common';
import * as fs from 'fs';
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
      // Vérifier si la base de données existe déjà
      const dbPath = config.database_path;
      const dbExists = fs.existsSync(dbPath);

      if (!dbExists) {
        console.log('Initialisation de la base de données...');
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
