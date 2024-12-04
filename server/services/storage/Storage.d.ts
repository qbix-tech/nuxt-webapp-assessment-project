export type FileStorageProvider = "S3";
export type FileStorageProviderOptions = {
  public?: boolean;
};

export type FileUploadOptions = {
  key: string;
  file: Buffer | Blob | string;
};

export interface FileStorageService {
  upload(options: FileUploadOptions): Promise<string>;
  delete(key: string): Promise<void>;
  getSignedUrlForRead(key: string, expiresIn?: number): Promise<string>;
  getPublicUrl(key: string): string;
}
