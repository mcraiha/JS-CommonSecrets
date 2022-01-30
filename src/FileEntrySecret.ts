import { BitConverter } from "./BitConverter.ts";
import { ChecksumHelper } from "./ChecksumHelper.ts";
import { FileEntry } from "./FileEntry.ts";
import { SymmetricKeyAlgorithm } from "./SymmetricKeyAlgorithm.ts"

/**
 * FileEntrySecret stores one encrypted file
 */
export class FileEntrySecret
{
  /** Key identifier bytes (this is plaintext information), in normal case it is better to use GetKeyIdentifier() */
  public keyIdentifier: Uint8Array;

  /** AUDALF data as byte array (this is secret/encrypted information) */
  public audalfData: Uint8Array;

  /** Symmetric Key Algorithm for this FileEntrySecret (this is plaintext information) */
  public algorithm: SymmetricKeyAlgorithm;

  /** Checksum of the data (this is plaintext information) */
  public checksum: string = "";

  private constructor()
  {
      
  }

  //#region Common getters

  /**
   * Get filename
   * @param derivedPassword Derived password
   * @returns {string} Filename
   */
  public GetFilename(derivedPassword: Uint8Array): string
  {

  }

  /**
   * Get key identifier
   * @returns {string} Key identifier as string
   */
  public GetKeyIdentifier(): string
  {
    return new TextDecoder().decode(this.keyIdentifier);
  }

  //#endregion


  //#region Common setters

  /**
   * Set filename
   * @param newFilename New filename
   * @param derivedPassword Derived password
   * @returns True if set was success; False otherwise
   */
  public SetFilename(newFilename: string, derivedPassword: Uint8Array): boolean
  {
    return this.GenericSet(FileEntry.filenameKey, newFilename, DateTimeOffset.UtcNow, derivedPassword);
  }

  

  //#endregion


  //#region Checksum

  //#endregion
}