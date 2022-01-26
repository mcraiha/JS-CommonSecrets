import { assert, assertEquals, assertExists, assertRejects } from "https://deno.land/std@0.119.0/testing/asserts.ts";
import { KeyDerivationFunctionEntry, KeyDerivationPrf } from "../src/KeyDerivationFunctionEntry.ts";

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