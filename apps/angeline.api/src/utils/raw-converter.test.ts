import { RawConverterUtil } from './raw-converter.util';

// Tests unitaires pour l'utilitaire de conversion RAW
describe('RawConverterUtil', () => {
  describe('isRawFile', () => {
    it('should detect ARW files as RAW', () => {
      expect(RawConverterUtil.isRawFile('test.arw')).toBe(true);
      expect(RawConverterUtil.isRawFile('test.ARW')).toBe(true);
      expect(RawConverterUtil.isRawFile('IMG_1234.arw')).toBe(true);
    });

    it('should detect other RAW formats', () => {
      expect(RawConverterUtil.isRawFile('test.cr2')).toBe(true);
      expect(RawConverterUtil.isRawFile('test.nef')).toBe(true);
      expect(RawConverterUtil.isRawFile('test.orf')).toBe(true);
      expect(RawConverterUtil.isRawFile('test.dng')).toBe(true);
      expect(RawConverterUtil.isRawFile('test.rw2')).toBe(true);
      expect(RawConverterUtil.isRawFile('test.raw')).toBe(true);
    });

    it('should not detect regular image files as RAW', () => {
      expect(RawConverterUtil.isRawFile('test.jpg')).toBe(false);
      expect(RawConverterUtil.isRawFile('test.jpeg')).toBe(false);
      expect(RawConverterUtil.isRawFile('test.png')).toBe(false);
      expect(RawConverterUtil.isRawFile('test.gif')).toBe(false);
      expect(RawConverterUtil.isRawFile('test.bmp')).toBe(false);
      expect(RawConverterUtil.isRawFile('test.webp')).toBe(false);
    });

    it('should handle files without extensions', () => {
      expect(RawConverterUtil.isRawFile('test')).toBe(false);
      expect(RawConverterUtil.isRawFile('')).toBe(false);
    });
  });

  describe('generateOutputFileName', () => {
    it('should convert RAW file names to JPEG', () => {
      expect(RawConverterUtil.generateOutputFileName('photo.arw')).toBe(
        'photo.jpg',
      );
      expect(RawConverterUtil.generateOutputFileName('IMG_1234.CR2')).toBe(
        'IMG_1234.jpg',
      );
      expect(RawConverterUtil.generateOutputFileName('DSC_5678.nef')).toBe(
        'DSC_5678.jpg',
      );
    });

    it('should keep regular image file names unchanged', () => {
      expect(RawConverterUtil.generateOutputFileName('photo.jpg')).toBe(
        'photo.jpg',
      );
      expect(RawConverterUtil.generateOutputFileName('image.png')).toBe(
        'image.png',
      );
      expect(RawConverterUtil.generateOutputFileName('pic.webp')).toBe(
        'pic.webp',
      );
    });

    it('should handle complex file names', () => {
      expect(
        RawConverterUtil.generateOutputFileName('My Photo - 2023.arw'),
      ).toBe('My Photo - 2023.jpg');
      expect(
        RawConverterUtil.generateOutputFileName('holiday_pic_001.CR2'),
      ).toBe('holiday_pic_001.jpg');
    });
  });
});

// Test d'intégration manuel (à commenter/décommenter selon besoin)
/*
describe('RawConverterUtil Integration Tests', () => {
  const testTempDir = path.join(__dirname, '../../test-temp');

  beforeAll(() => {
    if (!fs.existsSync(testTempDir)) {
      fs.mkdirSync(testTempDir, { recursive: true });
    }
  });

  afterAll(() => {
    if (fs.existsSync(testTempDir)) {
      fs.rmSync(testTempDir, { recursive: true, force: true });
    }
  });

  it('should process a mock file correctly', async () => {
    // Test avec un fichier mock (non RAW)
    const mockFile = {
      buffer: Buffer.from('mock image data'),
      originalname: 'test.jpg'
    };

    const result = await RawConverterUtil.processImageFile(mockFile, testTempDir);
    expect(result).toBeInstanceOf(Buffer);
    expect(result).toEqual(mockFile.buffer);
  });
});
*/
