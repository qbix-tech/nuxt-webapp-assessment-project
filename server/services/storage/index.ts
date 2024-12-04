import type {
  FileStorageProvider,
  FileStorageProviderOptions,
  FileStorageService,
} from "./Storage";
import { S3FileStorage } from "./S3StorageService";

export function useFileStorage(
  provider: FileStorageProvider,
  options: FileStorageProviderOptions = {},
): FileStorageService {
  switch (provider) {
    case "S3":
      return new S3FileStorage(options.public ? "public" : "private");
    default:
      throw new Error(`Unsupported file storage provider: ${provider}`);
  }
}
