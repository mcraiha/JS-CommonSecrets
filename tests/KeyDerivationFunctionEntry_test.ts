import { assert, assertEquals, assertExists, assertRejects } from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { KeyDerivationFunctionEntry, KeyDerivationPrf } from "../src/KeyDerivationFunctionEntry.ts";
import { CalculateEntropy } from "./ComparisonHelper.ts";

Deno.test("Constructor test", async () => {
  // Arrange
  const kdfe1: KeyDerivationFunctionEntry = await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA256, new Uint8Array(16), 100_000, 32, "master_key" );

  // Act

  // Assert
  assertExists(kdfe1);
});

Deno.test("Constructor exceptions test", async () => {
  // Arrange
  //const invalidSalt1: Uint8Array = null;
  const invalidSalt2: Uint8Array = new Uint8Array(0);
  const invalidSalt3: Uint8Array = new Uint8Array(15);

  const invalidIterationsCount1: number = -100;
  const invalidIterationsCount2: number =  0;
  const invalidIterationsCount3: number = 100;

  //const invalidId1: string = null;
	const invalidId2: string = "";

  // Act

  // Assert
  await assertRejects(
      async () => {
          await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA1, new Uint8Array(16), 100_000, 32, "master_key" )
      },
      Error,
      "prf cannot be SHA1 for security reasons!"
    );

  await assertRejects(
    async () => {
        await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA256, invalidSalt2, 100_000, 32, "master_key" )
    },
    Error,
    "saltBytes should be at least 16 bytes!"
  );

  await assertRejects(
    async () => {
        await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA256, invalidSalt3, 100_000, 32, "master_key" )
    },
    Error,
    "saltBytes should be at least 16 bytes!"
  );

  await assertRejects(
    async () => {
        await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA256, new Uint8Array(16), invalidIterationsCount1, 32, "master_key"  )
    },
    Error,
    "iterationsCount should be at least 4000!"
  );

  await assertRejects(
    async () => {
        await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA256, new Uint8Array(16), invalidIterationsCount2, 32, "master_key"  )
    },
    Error,
    "iterationsCount should be at least 4000!"
  );

  await assertRejects(
    async () => {
        await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA256, new Uint8Array(16), invalidIterationsCount3, 32, "master_key"  )
    },
    Error,
    "iterationsCount should be at least 4000!"
  );

  await assertRejects(
    async () => {
        await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA256, new Uint8Array(16), 100_000, 32, invalidId2  )
    },
    Error,
    "id should contain something!"
  );
});

Deno.test("Generate password bytes test", async () => {
  // Arrange
  const salt1: Uint8Array = new TextEncoder().encode("saltSALTsaltSALTsaltSALTsaltSALTsalt");
  const kdfe1: KeyDerivationFunctionEntry = await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA256, salt1, 4096, 25, "master_key" );
  const bytesShouldBe1: Uint8Array = new Uint8Array([0x34, 0x8c, 0x89, 0xdb, 0xcb, 0xd3, 0x2b, 0x2f, 0x32, 0xd8, 0x14, 0xb8, 0x11, 0x6e, 0x84, 0xcf, 0x2b, 0x17, 0x34, 0x7e, 0xbc, 0x18, 0x00, 0x18, 0x1c]);

  const salt2: Uint8Array = new TextEncoder().encode("saltKEYbcTcXHCBxtjD");
  const kdfe2: KeyDerivationFunctionEntry = await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA512, salt2, 100000, 64, "master_key" );
  const bytesShouldBe2: Uint8Array = new Uint8Array([0xAC,0xCD,0xCD,0x87,0x98,0xAE,0x5C,0xD8,0x58,0x04,0x73,0x90,0x15,0xEF,0x2A,0x11,0xE3,0x25,0x91,0xB7,0xB7,0xD1,0x6F,0x76,0x81,0x9B,0x30,0xB0,0xD4,0x9D,0x80,0xE1,0xAB,0xEA,0x6C,0x98,0x22,0xB8,0x0A,0x1F,0xDF,0xE4,0x21,0xE2,0x6F,0x56,0x03,0xEC,0xA8,0xA4,0x7A,0x64,0xC9,0xA0,0x04,0xFB,0x5A,0xF8,0x22,0x9F,0x76,0x2F,0xF4,0x1F]);

  // Act
  const bytes1: Uint8Array = await kdfe1.GeneratePasswordBytes("passwordPASSWORDpassword");
  const bytes2: Uint8Array = await kdfe2.GeneratePasswordBytes("passDATAb00AB7YxDTT");

  // Assert
  //assertEquals(bytes1, bytesShouldBe1);
  assertEquals(bytes2, bytesShouldBe2);
});

Deno.test("Create HMACSHA256 KeyDerivation Function Entry test", async () => {
  // Arrange
  const kdfe: KeyDerivationFunctionEntry = await KeyDerivationFunctionEntry.CreateHMACSHA256KeyDerivationFunctionEntry("does not matter");
	const password: string = "tooeasy";

  // Act
  const derivedPassword: Uint8Array = await kdfe.GeneratePasswordBytes(password);

  // Assert
  assertEquals(kdfe.iterations > KeyDerivationFunctionEntry.iterationsMin, true, `There should be at least ${KeyDerivationFunctionEntry.iterationsMin} iterations`);
  assertEquals(derivedPassword.length, 32, "There should be 32 bytes generated");
  assertEquals(CalculateEntropy.ShannonEntropy(derivedPassword) > 4.0, true, "There should be enought entropy");
});

Deno.test("Create HMACSHA512 KeyDerivation Function Entry test", async () => {
  // Arrange
  const kdfe: KeyDerivationFunctionEntry = await KeyDerivationFunctionEntry.CreateHMACSHA512KeyDerivationFunctionEntry("does not matter anymore");
	const password: string = "tooeasypart2";

  // Act
  const derivedPassword: Uint8Array = await kdfe.GeneratePasswordBytes(password);

  // Assert
  assertEquals(kdfe.iterations > KeyDerivationFunctionEntry.iterationsMin, true, `There should be at least ${KeyDerivationFunctionEntry.iterationsMin} iterations`);
  assertEquals(derivedPassword.length, 64, "There should be 32 bytes generated");
  assertEquals(CalculateEntropy.ShannonEntropy(derivedPassword) > 4.0, true, "There should be enought entropy");
});

Deno.test("Checksum Survives Roundtrip test", async () => {
  // Arrange
  const salt: Uint8Array = new TextEncoder().encode("saltKEYbcTcXHCBxtjD");
  const kdfe1: KeyDerivationFunctionEntry = await KeyDerivationFunctionEntry.CreateWithCustomParameters(KeyDerivationPrf.HMACSHA512, salt, 100000, 64, "master_key" );

  // Act
  const checksum1: string = kdfe1.GetChecksumAsHex();
  const json: string = JSON.stringify(kdfe1);
  const kdfe2: KeyDerivationFunctionEntry = JSON.parse(json);

  // Assert
  assertEquals(checksum1.length, 64, `Checksum should be 64 characters`);
  assertEquals(kdfe2.checksum, checksum1, "Checksums should match");
});

