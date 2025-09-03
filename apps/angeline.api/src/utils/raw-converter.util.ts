/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { execa } from 'execa';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as sharp from 'sharp';

export class RawConverterUtil {
  /**
   * Vérifie si un fichier est un fichier RAW basé sur son extension
   */
  static isRawFile(fileName: string): boolean {
    const ext = path.extname(fileName).toLowerCase();
    const rawExtensions = [
      '.arw',
      '.raw',
      '.cr2',
      '.nef',
      '.orf',
      '.dng',
      '.rw2',
    ];
    return rawExtensions.includes(ext);
  }

  /**
   * Convertit un fichier RAW en JPEG en utilisant dcraw (si disponible) ou ImageMagick
   */
  static async convertRawToJpeg(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    try {
      // Essayer d'abord avec dcraw
      await this.convertWithDcraw(inputPath, outputPath);
    } catch (dcrawError) {
      console.warn(
        'dcraw non disponible, tentative avec ImageMagick:',
        dcrawError,
      );
      try {
        // Fallback sur ImageMagick/magick
        await this.convertWithImageMagick(inputPath, outputPath);
      } catch (magickError) {
        console.warn(
          'ImageMagick non disponible, tentative avec sips (macOS):',
          magickError,
        );
        try {
          // Fallback sur sips (macOS uniquement)
          await this.convertWithSips(inputPath, outputPath);
        } catch (sipsError) {
          throw new Error(
            `Impossible de convertir le fichier RAW. Aucun convertisseur disponible. Erreurs: dcraw: ${dcrawError.message}, ImageMagick: ${magickError.message}, sips: ${sipsError.message}`,
          );
        }
      }
    }
  }

  /**
   * Conversion avec dcraw
   */
  private static async convertWithDcraw(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    const tempDir = path.dirname(outputPath);
    const tempBaseName = path.basename(inputPath, path.extname(inputPath));
    const tempPpmPath = path.join(tempDir, `${tempBaseName}.ppm`);

    try {
      // dcraw génère un fichier .ppm par défaut
      await execa('dcraw', ['-c', '-w', inputPath], {
        stdout: fs.createWriteStream(tempPpmPath),
      });

      // Convertir le PPM en JPEG avec Sharp
      await sharp(tempPpmPath).jpeg({ quality: 95 }).toFile(outputPath);

      // Nettoyer le fichier temporaire
      if (fs.existsSync(tempPpmPath)) {
        fs.unlinkSync(tempPpmPath);
      }
    } catch (error) {
      // Nettoyer en cas d'erreur
      if (fs.existsSync(tempPpmPath)) {
        fs.unlinkSync(tempPpmPath);
      }
      throw error;
    }
  }

  /**
   * Conversion avec ImageMagick
   */
  private static async convertWithImageMagick(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    await execa('magick', [inputPath, '-quality', '95', outputPath]);
  }

  /**
   * Conversion avec sips (macOS uniquement)
   */
  private static async convertWithSips(
    inputPath: string,
    outputPath: string,
  ): Promise<void> {
    await execa('sips', [
      '-s',
      'format',
      'jpeg',
      inputPath,
      '--out',
      outputPath,
    ]);
  }

  /**
   * Traite un fichier image (RAW ou standard) et retourne le buffer du fichier résultant
   */
  static async processImageFile(
    file: { buffer: Buffer; originalname?: string },
    tempDir: string,
  ): Promise<Buffer> {
    const fileName = file.originalname || 'unknown';

    if (this.isRawFile(fileName)) {
      // Traiter un fichier RAW
      const tempInputPath = path.join(
        tempDir,
        `temp_${Date.now()}_${fileName}`,
      );
      const tempOutputPath = path.join(tempDir, `converted_${Date.now()}.jpg`);

      try {
        // Écrire le buffer du fichier sur le disque temporairement
        fs.writeFileSync(tempInputPath, file.buffer);

        // Convertir en JPEG
        await this.convertRawToJpeg(tempInputPath, tempOutputPath);

        // Lire le fichier converti
        const convertedBuffer = fs.readFileSync(tempOutputPath);

        // Nettoyer les fichiers temporaires
        if (fs.existsSync(tempInputPath)) {
          fs.unlinkSync(tempInputPath);
        }
        if (fs.existsSync(tempOutputPath)) {
          fs.unlinkSync(tempOutputPath);
        }

        return convertedBuffer;
      } catch (error) {
        // Nettoyer en cas d'erreur
        if (fs.existsSync(tempInputPath)) {
          fs.unlinkSync(tempInputPath);
        }
        if (fs.existsSync(tempOutputPath)) {
          fs.unlinkSync(tempOutputPath);
        }
        throw error;
      }
    } else {
      // Fichier image standard
      return file.buffer;
    }
  }

  /**
   * Génère un nom de fichier de sortie approprié pour un fichier RAW converti
   */
  static generateOutputFileName(originalFileName: string): string {
    if (this.isRawFile(originalFileName)) {
      const baseName = path.basename(
        originalFileName,
        path.extname(originalFileName),
      );
      return `${baseName}.jpg`;
    }
    return originalFileName;
  }
}
