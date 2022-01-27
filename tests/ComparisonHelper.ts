
export class ComparisonHelper
{

}

export class CalculateEntropy
{
  public static ShannonEntropy(byteArray: Uint8Array): number
  {
    const dictionary: Map<number, number> = new Map<number, number>();

    byteArray.forEach((element) => { dictionary.set(element, (dictionary.get(element) ?? 1) + 1) });

    let result: number = 0.0;
    const length: number = byteArray.length;

    dictionary.forEach((value) => {
        const frequency: number = value / length; 
        result -= frequency * (Math.log(frequency) / Math.log(2));
    });

    return result;
  }
}