import { BitConverter } from "./BitConverter.ts";
import { ChecksumHelper } from "./ChecksumHelper.ts";

/**
 * KDF (Key Derivation Function) Algorithm
 */
export enum KDFAlgorithm
{
  /**
   * Password-Based Key Derivation Function 2
   */
  PBKDF2 = 0,
}

/**
 * Key Derivation pseudorandom function
 */
export enum KeyDerivationPrf
{
  /**
   * Hash-based Message Authentication Code (HMAC) using the SHA1 hash function (deprecated)
   */
  HMACSHA1 = 0,
  /**
   * Hash-based Message Authentication Code (HMAC) using the SHA256 hash function
   */
  HMACSHA256 = 1,
  /**
   * Hash-based Message Authentication Code (HMAC) using the SHA512 hash function
   */
  HMACSHA512 = 2,
}

export class KeyDerivationFunctionEntry
{
  /** Minimun salt length in bytes */
  public static readonly saltMinLengthInBytes: number = 16;

  /** Minimum amount of iterations */
  public static readonly iterationsMin: number = 4000;

  /** Suggested amount of iterations */
  public static readonly suggestedMinIterationsCount: number = 100_000;

  /** Algorithm can only be "PBKDF2" */
  public algorithm: string;
  
  /** Pseudo-random function can be either "HMAC-SHA256" or "HMAC-SHA512". It is casted to enum. */
  public pseudorandomFunction: string;

  /** Salt bytes */
  public salt: Uint8Array;

  /** How many iterations should be done */
  public iterations: number;

  /** How many bytes should be returned */
  public derivedKeyLengthInBytes : number;

  /** Key identifier, e.g. "primary" as UTF-8 byte array */
  public keyIdentifier: Uint8Array;

  /** Calculated checksum of Key Derivation Function Entry */
  public checksum: string = "";

  /**
   * Private constructor since async is needed for checksum calculations
   * @param prf KeyDerivationPrf
   * @param saltBytes Salt bytes
   * @param iterationsCount Iterations count
   * @param howManyBytesAreWanted How many bytes are wanted
   * @param id {string} String ID for the KeyDerivationFunctionEntry
   */
  private constructor(prf: KeyDerivationPrf, saltBytes: Uint8Array, iterationsCount: number, howManyBytesAreWanted: number, id: string)
  {
    // Block SHA-1
    if (prf === KeyDerivationPrf.HMACSHA1)
    {
      throw Error("prf cannot be SHA1 for security reasons!");
    }

    // Check salt bytes
    if (saltBytes == null)
    {
      throw Error("saltBytes cannot be null!");
    }
    else if (saltBytes.length < KeyDerivationFunctionEntry.saltMinLengthInBytes)
    {
      throw Error(`saltBytes should be at least ${KeyDerivationFunctionEntry.saltMinLengthInBytes} bytes!`);
    }

    // Check iterations count
    if (iterationsCount < KeyDerivationFunctionEntry.iterationsMin)
    {
      throw Error(`iterationsCount should be at least ${KeyDerivationFunctionEntry.iterationsMin}!`);
    }

    // Check ID
    if (!id || id.length === 0)
    {
      throw Error("id should contain something!");
    }

    // Success point
    this.algorithm = KDFAlgorithm.PBKDF2.toString();
    this.pseudorandomFunction = prf.toString();
    this.salt = saltBytes;
    this.iterations = iterationsCount;
    this.derivedKeyLengthInBytes = howManyBytesAreWanted;
    this.keyIdentifier = new TextEncoder().encode(id);
  }

  /**
   * Generate password bytes
   * @param regularPassword {string} Password string
   * @returns {Uint8Array} Derivated password as bytes
   */
  public async GeneratePasswordBytes(regularPassword: string): Promise<Uint8Array>
  {
    const pseudorandomFunctionString: keyof typeof KeyDerivationPrf = this.pseudorandomFunction as keyof typeof KeyDerivationPrf;
    const prf = KeyDerivationPrf[pseudorandomFunctionString];

    if (prf === KeyDerivationPrf.HMACSHA1)
    {
      throw Error("prf cannot be SHA1 for security reasons!");
    }

    const useSHA256: boolean = prf === KeyDerivationPrf.HMACSHA256;

    const pwKey = await crypto.subtle.importKey('raw', new TextEncoder().encode(regularPassword), 'PBKDF2', false, ['deriveBits']);
    const params = { name: 'PBKDF2', hash: useSHA256 ? 'SHA-256' : 'SHA-512', salt: this.salt, iterations: this.iterations };
    const keyBuffer = await crypto.subtle.deriveBits(params, pwKey, this.derivedKeyLengthInBytes * 8);
    return new Uint8Array(keyBuffer);
  }

  /**
   * Get key identifier
   * @returns {string} Key identifier 
   */
  public GetKeyIdentifier(): string
  {
    return new TextDecoder().decode(this.keyIdentifier);
  }

  //#region Checksum

  /**
   * Get checksum as hex string
   * @returns Checksum as hex string
   */
  public GetChecksumAsHex(): string
  {
    return this.checksum;
  }

  private async CalculateHexChecksum(): Promise<string>
  {
    return await ChecksumHelper.CalculateHexChecksum(new Array(new TextEncoder().encode(this.algorithm), new TextEncoder().encode(this.pseudorandomFunction), this.salt, BitConverter.Get4BytesFromInt(this.iterations), BitConverter.Get4BytesFromInt(this.derivedKeyLengthInBytes), this.keyIdentifier));
  }

  private async CalculateAndUpdateChecksum(): Promise<void>
  {
    this.checksum = await this.CalculateHexChecksum();
  }

  //#endregion

  /**
   * Creates with custom parameters. Please use CreateHMACSHA256KeyDerivationFunctionEntry or CreateHMACSHA512KeyDerivationFunctionEntry instead!
   * @param prf 
   * @param saltBytes 
   * @param iterationsCount 
   * @param howManyBytesAreWanted 
   * @param id 
   * @returns KeyDerivationFunctionEntry
   */
  public static async CreateWithCustomParameters(prf: KeyDerivationPrf, saltBytes: Uint8Array, iterationsCount: number, howManyBytesAreWanted: number, id: string): Promise<KeyDerivationFunctionEntry>
  {
    const returnValue: KeyDerivationFunctionEntry = new KeyDerivationFunctionEntry(prf, saltBytes, iterationsCount, howManyBytesAreWanted, id);
    await returnValue.CalculateAndUpdateChecksum();
    return returnValue;
  }

  /**
   * Creates a HMACSHA256 based KeyDerivationFunctionEntry
   * @param id {string} String ID for the KeyDerivationFunctionEntry
   * @returns KeyDerivationFunctionEntry
   */
  public static async CreateHMACSHA256KeyDerivationFunctionEntry(id: string): Promise<KeyDerivationFunctionEntry>
  {
    let iterationsToDo: number = this.suggestedMinIterationsCount;
    const salt: Uint8Array = new Uint8Array(this.saltMinLengthInBytes);
    crypto.getRandomValues(salt);

    const fourBytes: Uint8Array = new Uint8Array(4);
    crypto.getRandomValues(fourBytes);
    iterationsToDo += (new DataView(fourBytes.buffer).getInt32(0, true)) % 4096;

    const neededBytes = 32;
    const returnValue: KeyDerivationFunctionEntry = new KeyDerivationFunctionEntry(KeyDerivationPrf.HMACSHA256, salt, iterationsToDo, neededBytes, id);
    await returnValue.CalculateAndUpdateChecksum();
    return returnValue;
  }

  /**
   * Creates a HMACSHA512 based KeyDerivationFunctionEntry
   * @param id {string} String ID for the KeyDerivationFunctionEntry
   * @returns KeyDerivationFunctionEntry
   */
  public static async CreateHMACSHA512KeyDerivationFunctionEntry(id: string): Promise<KeyDerivationFunctionEntry>
  {
    let iterationsToDo: number = this.suggestedMinIterationsCount;
    const salt: Uint8Array = new Uint8Array(this.saltMinLengthInBytes);
    crypto.getRandomValues(salt);

    const fourBytes: Uint8Array = new Uint8Array(4);
    crypto.getRandomValues(fourBytes);
    iterationsToDo += (new DataView(fourBytes.buffer).getInt32(0, true)) % 4096;

    const neededBytes = 64;
    const returnValue: KeyDerivationFunctionEntry = new KeyDerivationFunctionEntry(KeyDerivationPrf.HMACSHA512, salt, iterationsToDo, neededBytes, id);
    await returnValue.CalculateAndUpdateChecksum();
    return returnValue;
  }
}