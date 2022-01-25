
export class ChecksumHelper
{
  public static async CalculateHexChecksum(arrays: Array<Uint8Array>): Promise<string>
  {
    const joinedArray: Uint8Array = this.JoinByteArrays(arrays);
    const hashBuffer = await crypto.subtle.digest('SHA-256', joinedArray);
    return this.ByteArrayChecksumToHexString(new Uint8Array(hashBuffer));
  }

  public static JoinByteArrays(arrays: Array<Uint8Array>): Uint8Array
  {
    let totalLength: number = 0;
    arrays.forEach(element => totalLength += element.length);

    const returnArray: Uint8Array = new Uint8Array(totalLength);
    let offset: number = 0;
    for (let i = 0; i < arrays.length; i++)
    {
      returnArray.set(arrays[i], offset);
      offset += arrays[i].length;
    }
    
    return returnArray;
  }

  private static ByteArrayChecksumToHexString(byteArray: Uint8Array): string
  {
    return Array.from(byteArray, i => i.toString(16).padStart(2, "0")).join("");
  }
}