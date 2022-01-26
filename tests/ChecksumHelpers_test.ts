import { assert, assertEquals, assertNotEquals, assertExists, assertArrayIncludes } from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { ChecksumHelper } from "../src/ChecksumHelper.ts";

// CalculateHexChecksumTest()
Deno.test("Calculate Hex Checksum Test", async () => {
  // Arrange
  const byteArray1: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const byteArray2: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const byteArray3: Uint8Array = new Uint8Array([]);

  const expectedHex: string = "66840DDA154E8A113C31DD0AD32F7F3A366A80E8136979D8F5A101D3D29D6F72";

  // Act
  const hex1: string = await ChecksumHelper.CalculateHexChecksum(new Array<Uint8Array>(byteArray1));
  const hex2: string = await ChecksumHelper.CalculateHexChecksum(new Array<Uint8Array>(byteArray2));
  const hex3: string = await ChecksumHelper.CalculateHexChecksum(new Array<Uint8Array>(byteArray3));
  const hex4: string = await ChecksumHelper.CalculateHexChecksum(new Array<Uint8Array>(byteArray1, byteArray2));

  // Assert
  assertExists(hex1);
  assertExists(hex2);
  assertExists(hex3);
  assertExists(hex4);

  assertEquals(hex1.length, 32 * 2, "Every byte should convert to two Hex chars");

  assertEquals<string>(hex1, expectedHex);
  assertEquals<string>(hex1, hex2);

  assertNotEquals<string>(hex2, hex3);
  assertNotEquals<string>(hex2, hex4);
});

// JoinByteArraysTest
Deno.test("Join Byte Arrays Test", () => {
  // Arrange
  const byteArray1: Uint8Array = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const byteArray2: Uint8Array = new Uint8Array([123, 255, 13, 3, 33]);
  const byteArray3: Uint8Array = new Uint8Array([]);
  const byteArray4: Uint8Array = new Uint8Array([100, 100, 100, 100]);

  // Act
  const joined1: Uint8Array = ChecksumHelper.JoinByteArrays(new Array<Uint8Array>(byteArray1, byteArray2));
  
  // Assert
  assertExists(joined1);
  assertEquals(byteArray1.length + byteArray2.length, joined1.length);
  assertArrayIncludes(Array.from(joined1), Array.from(byteArray1));
  assertArrayIncludes(Array.from(joined1), Array.from(byteArray2));
  assertNotEquals<Uint8Array>(joined1, byteArray4);
});