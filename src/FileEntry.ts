import { BitConverter } from "./BitConverter.ts";
import { ChecksumHelper } from "./ChecksumHelper.ts";

export class FileEntry
{
  /** Filename as byte array */
  public filename: Uint8Array = new Uint8Array(0);

  public static readonly filenameKey: string = "filename";


  /** File content as byte array */
  public fileContent: Uint8Array = new Uint8Array(0);

  public static readonly fileContentKe: string = "fileContent";


  /** Creation time of file entry, in Unix seconds since epoch */
  public creationTime: number = Math.floor(Date.now() / 1000);

  public static readonly creationTimeKey: string = "creationTime";


  /** Last modification time of file entry, in Unix seconds since epoch */
  public modificationTime: number = Math.floor(Date.now() / 1000);

  public static readonly modificationTimeKey: string = "modificationTime";

  /** Calculated checksum of file entry */
  public checksum: string = "";

  private constructor(creationTime: number)
  {
    this.creationTime = creationTime;
  }

  public static async Create(newFilename: string, newFileContent: Uint8Array, creationTime: number = Math.floor(Date.now() / 1000)): Promise<FileEntry>
  {
    const returnValue: FileEntry = new FileEntry(creationTime);
    await returnValue.UpdateFileEntry(newFilename, newFileContent, creationTime);
    return returnValue;
  }

  public async UpdateFileEntry(updatedFilename: string, updatedFileContent: Uint8Array, modificationTime: number = Math.floor(Date.now() / 1000)): Promise<void>
  {
    this.filename = new TextEncoder().encode(updatedFilename);
    this.fileContent = updatedFileContent;
    this.modificationTime = modificationTime;
    this.CalculateAndUpdateChecksum();
  }

  public GetFilename(): string
  {
    return new TextDecoder("utf-8").decode(this.filename);
  }

  public GetFileContent(): Uint8Array
  {
    return this.fileContent;
  }

  public GetFileContentLengthInBytes(): number
  {
    return this.fileContent.length;
  }

  public GetChecksumAsHex(): string
  {
    return this.checksum;
  }

  public async CheckIfChecksumMatchesContent(): Promise<boolean>
  {
    return this.checksum === await this.CalculateHexChecksum();
  }

  private async CalculateHexChecksum(): Promise<string>
  {
    return await ChecksumHelper.CalculateHexChecksum(new Array(this.filename, this.fileContent, BitConverter.GetBytes(this.creationTime), BitConverter.GetBytes(this.modificationTime)));
  }

  private async CalculateAndUpdateChecksum(): Promise<void>
  {
    this.checksum = await this.CalculateHexChecksum();
  }
}