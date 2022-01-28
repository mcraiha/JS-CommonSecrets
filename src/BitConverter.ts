
export class BitConverter
{
  public static Get8Bytes(datetimeInSeconds: number): Uint8Array
  {
    const returnValue: Uint8Array = new Uint8Array(8);
    const bigInted: bigint = BigInt(datetimeInSeconds);
    new DataView(returnValue.buffer).setBigUint64(0, bigInted, true);
    return returnValue;
  }

  /**
   * Get 4 bytes from UInt value
   * @param uint 32 bit uint value
   * @returns Four bytes
   */
  public static Get4BytesFromUInt(uint: number): Uint8Array
  {
    const returnValue: Uint8Array = new Uint8Array(4);
    new DataView(returnValue.buffer).setUint32(0, uint, true);
    return returnValue;
  }

  /**
   * Get 4 bytes from Int value
   * @param int 32 bit int value
   * @returns Four bytes
   */
  public static Get4BytesFromInt(int: number): Uint8Array
  {
    const returnValue: Uint8Array = new Uint8Array(4);
    new DataView(returnValue.buffer).setInt32(0, int, true);
    return returnValue;
  }
}