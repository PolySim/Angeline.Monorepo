export interface ChunkUploadDto {
  chunkIndex: number | string;
  totalChunks: number | string;
  fileHash: string;
  fileName: string;
  category: string;
  fileSize: number | string;
}

export interface ChunkStatusDto {
  fileHash: string;
  uploadedChunks: number[];
  totalChunks: number;
  isComplete: boolean;
}

export interface InitiateUploadDto {
  fileName: string;
  fileSize: number;
  fileHash: string;
  category: string;
  chunkSize?: number;
}

export interface CompleteUploadDto {
  fileHash: string;
  category: string;
}
