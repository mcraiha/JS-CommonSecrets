
export class BitConverter
{
    public static GetBytes(datetimeInSeconds: number): Uint8Array
    {
        const returnValue: Uint8Array = new Uint8Array(8);
        const bigInted: bigint = BigInt(datetimeInSeconds);
        new DataView(returnValue.buffer).setBigUint64(0, bigInted, true);
        return returnValue;
    }
}