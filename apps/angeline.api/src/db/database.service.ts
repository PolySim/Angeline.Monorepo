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
      // Vérifier si la base de données existe déjà
      const dbPath = config.database_path;
      const dbExists = fs.existsSync(dbPath);

      if (!dbExists) {
        console.log('Initialisation de la base de données...');

        // Lire le fichier SQL d'initialisation
        const sqlPath = path.join(
          __dirname,
          '..',
          '..',
          'src',
          'db',
          'init_db.sql',
        );
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // Exécuter les requêtes SQL
        const queries = sqlContent.split(';').filter((query) => query.trim());

        for (const query of queries) {
          if (query.trim()) {
            await this.dataSource.query(query);
          }
        }

        console.log('Base de données initialisée avec succès');
      } else {
        console.log('Base de données déjà existante');
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
