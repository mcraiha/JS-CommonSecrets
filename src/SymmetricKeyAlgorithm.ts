import { BitConverter } from "./BitConverter.ts";
import { ChecksumHelper } from "./ChecksumHelper.ts";

export enum SymmetricEncryptionAlgorithm
{
  AES_CTR = 0,
  ChaCha20
}

export class SymmetricKeyAlgorithm
{
  /** Symmetric Encryption Algorithm as string */
  public algorithm: string;

  /** Key size in bits */
  public keySizeInBits: number;

  public settingsAES_CTR: SettingsAES_CTR | null = null;

  public settingsChaCha20: SettingsChaCha20 | null = null;

  public static allowed_AES_CTR_KeyLengths: number[] = [ 16, 24, 32 ];

  /**
   * Default constructor for Symmetric key algorithm
   * @param algorithm Algorithm to use
   * @param keySizeInBits Key size in bits, e.g. 256
   * @param settings Settings for chosen algorithm
   */
  constructor(algorithm: SymmetricEncryptionAlgorithm, keySizeInBits: number, settings: SettingsAES_CTR | SettingsChaCha20)
  {
    this.algorithm = algorithm.toString();

    if (algorithm === SymmetricEncryptionAlgorithm.AES_CTR)
    {
      if (!SymmetricKeyAlgorithm.allowed_AES_CTR_KeyLengths.includes(keySizeInBits / 8))
      {
        throw Error(`${keySizeInBits} is not valid AES-CTR key size!`);
      }

      this.settingsAES_CTR = <SettingsAES_CTR>settings!;
    }
    else if (algorithm === SymmetricEncryptionAlgorithm.ChaCha20)
    {
      if (256 != keySizeInBits)
      {
        throw Error(`${keySizeInBits} is not valid ChaCha20 key size!`);
      }

      this.settingsChaCha20 = <SettingsChaCha20>settings!;
    }
    else
    {
      throw Error(`${algorithm} constructor not implemented yet!`);
    }

    this.keySizeInBits = keySizeInBits;
  }

  /**
   * Encrypt given bytes with given key. Returns new array with encrypted bytes
   * @param bytesToEncrypt Byte array to encrypt
   * @param key Key
   * @returns Encrypted bytes in new array
   */
  public async EncryptBytes(bytesToEncrypt: Uint8Array, key: Uint8Array): Promise<Uint8Array>
  {
    let returnArray: Uint8Array = new Uint8Array(bytesToEncrypt.length);

    if (this.algorithm === SymmetricEncryptionAlgorithm.AES_CTR.toString())
    {
      const cryptoKey = await crypto.subtle.importKey(
        "raw",
        key,
        "AES-CTR",
        false,
        ["encrypt", "decrypt"]
      );

      const encryptedArray = await crypto.subtle.encrypt(
        {
          name: "AES-CTR",
          counter: this.settingsAES_CTR!.initialCounter,
          length: this.settingsAES_CTR!.initialCounter.length * 8
        },
        cryptoKey,
        bytesToEncrypt);

      returnArray = new Uint8Array(encryptedArray);
    }
    else if (this.algorithm === SymmetricEncryptionAlgorithm.ChaCha20.toString())
    {
      
    }
    else
    {
      throw Error("Not implemented!");
    }

    return returnArray;
  }

  /**
   * Decrypt given bytes with given key. Returns new array with decrypted bytes. Same result as EncryptBytes
   * @param bytesToDecrypt Byte array to decrypt
   * @param key Key
   * @returns Decrypted bytes in new array
   */
  public async DecryptBytes(bytesToDecrypt: Uint8Array, key: Uint8Array): Promise<Uint8Array>
  {
    return await this.EncryptBytes(bytesToDecrypt, key);
  }

  /**
   * Get settings as byte array
   * @returns Byte array
   */
  public GetSettingsAsBytes(): Uint8Array
  {
    if (this.algorithm === SymmetricEncryptionAlgorithm.AES_CTR.toString())
    {
      return ChecksumHelper.JoinByteArrays(new Array(new TextEncoder().encode(this.algorithm), BitConverter.Get4BytesFromInt(this.keySizeInBits), this.settingsAES_CTR!.GetSettingsAsBytes()));
    }
    else if (this.algorithm === SymmetricEncryptionAlgorithm.ChaCha20.toString())
    {

    }

    throw Error("Not Implemented");
  }

  /**
   * Generate new SymmetricKeyAlgorithm, you should use this instead of constructor
   * @param symmetricEncryptionAlgorithm Wanted Symmetric encryption algorithm
   * @returns SymmetricKeyAlgorithm
   */
  public static GenerateNew(symmetricEncryptionAlgorithm: SymmetricEncryptionAlgorithm): SymmetricKeyAlgorithm
  {
    return new SymmetricKeyAlgorithm(symmetricEncryptionAlgorithm, 256, (symmetricEncryptionAlgorithm === SymmetricEncryptionAlgorithm.AES_CTR ) ? SettingsAES_CTR.CreateWithCryptographicRandomNumbers() : SettingsChaCha20.CreateWithCryptographicRandomNumbers() );
  }
}

export class SettingsAES_CTR
{
  /** Initial counter as byte array */
  public initialCounter: Uint8Array;

  /**
   * Default constructor for SettingsAES_CTR
   * @param initialCounter Byte array of initial counter
   */
  constructor(initialCounter: Uint8Array)
  {
    if (initialCounter == null)
    {
      throw Error("Initial counter cannot be null!");
    }
    else if (initialCounter.length != 16)
    {
      throw Error("Initial counter only allows length of 16 bytes!");
    }

    this.initialCounter = initialCounter;
  }

  /**
   * Get Settings as bytes
   * @returns Byte array
   */
  public GetSettingsAsBytes(): Uint8Array
  {
    return this.initialCounter;
  }

  /**
   * Create With Cryptographic Random Numbers
   */
  public static CreateWithCryptographicRandomNumbers(): SettingsAES_CTR
  {
    const initialCounter: Uint8Array = new Uint8Array(16);
    crypto.getRandomValues(initialCounter);
    return new SettingsAES_CTR(initialCounter);
  }
}

export class SettingsChaCha20
{
  /** Nonce byte array */
  public nonce: Uint8Array;

  /** Counter */
  public counter: number;

  /**
   * Default constructor for SettingsChaCha20
   * @param nonce Nonce as byte array
   * @param counter Counter
   */
  constructor(nonce: Uint8Array, counter: number)
  {
    if (nonce == null)
    {
      throw Error("Nonce cannot be null!");
    }
    else if (nonce.length != 12)
    {
      throw Error("Nonce only allows length of 12 bytes!");
    }

    this.nonce = nonce;
    this.counter = counter;
  }

  /**
   * Increase nonce
   */
  public IncreaseNonce(): void
  {
    let index: number = 0;
		let done: boolean = false;
    while (!done && index < this.nonce.length)
    {
      if (this.nonce[index] < 255)
      {
        this.nonce[index]++;
        done = true;
      }
      else
      {
        this.nonce[index] = 0;
      }
      index++;
    }
  }

  /**
   * Get settings as byte array
   */
  public GetSettingsAsBytes(): Uint8Array
  {
    return ChecksumHelper.JoinByteArrays(new Array(this.nonce, BitConverter.Get4BytesFromUInt(this.counter)));
  }

  /**
   * Create SettingsChaCha20 with Cryptographic random numbers, you should use this instead of constructor
   * @returns SettingsChaCha20
   */
  public static CreateWithCryptographicRandomNumbers(): SettingsChaCha20
  {
    const nonce: Uint8Array = new Uint8Array(8);
    const uintBytes: Uint8Array = new Uint8Array(4);

    crypto.getRandomValues(nonce);
    crypto.getRandomValues(uintBytes);

    return new SettingsChaCha20(new Uint8Array([...nonce, ...new Uint8Array(4)]), new DataView(uintBytes.buffer).getUint32(0, true)); 
  }
}