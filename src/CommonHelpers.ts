
/**
 * Common helper class, e.g. to check that derived password contains something
 */
export class Helpers
{
  /**
   * Generic null and empty check for derived password
   * @param derivedPassword Derived password
   * @returns Tuple that contains valid info + possible error
   */
  public static CheckDerivedPassword(derivedPassword: Uint8Array): [boolean, Error | null]
  {
    if (derivedPassword == null)
    {
      return [false, Error("derivedPassword cannot be null!")];
    }
    else if (derivedPassword.length < 1)
    {
      return [false, Error("derivedPassword does not contain data!")];
    }

    // Success point
    return [true, null];
  }

  /**
   * Check validity of audalf data
   * @param audalfBytes audalf bytes
   */
  public static CheckAUDALFbytes(audalfBytes: Uint8Array): [boolean, Error | null]
  {
    if (audalfBytes == null)
			{
				return [false, Error("audalfBytes is null")];
			}
			else if (audalfBytes.length < 1)
			{
				return [false, Error("audalfBytes does not contain data!")];
			}
			/*else if (!AUDALF_Deserialize.IsAUDALF(audalfBytes))
			{
				return (valid: false, exception: new ArgumentException($"Not valid AUDALF content!"));
			}*/

      // Success point
			return [true, null];
  }
}