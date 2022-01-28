import { assert, assertEquals, assertNotEquals, assertExists, assertRejects } from "https://deno.land/std@0.122.0/testing/asserts.ts";
import { KeyDerivationFunctionEntry, KeyDerivationPrf } from "../src/KeyDerivationFunctionEntry.ts";
import { SymmetricEncryptionAlgorithm, SymmetricKeyAlgorithm, SettingsAES_CTR, SettingsChaCha20 } from "../src/SymmetricKeyAlgorithm.ts";
import { CalculateEntropy } from "./ComparisonHelper.ts";

Deno.test("AES_CTR test", async () => {
  // Arrange
  const key: Uint8Array = new Uint8Array([0x2b, 0x7e, 0x15, 0x16, 0x28, 0xae, 0xd2, 0xa6, 0xab, 0xf7, 0x15, 0x88, 0x09, 0xcf, 0x4f, 0x3c]);
  const initialCounter: Uint8Array = new Uint8Array([0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff]);

  const settingsAES_CTR: SettingsAES_CTR = new SettingsAES_CTR(initialCounter);

  const skaAES_CTR: SymmetricKeyAlgorithm = new SymmetricKeyAlgorithm(SymmetricEncryptionAlgorithm.AES_CTR, 128, settingsAES_CTR);

  const content: Uint8Array = new Uint8Array([0x6b, 0xc1, 0xbe, 0xe2, 0x2e, 0x40, 0x9f, 0x96, 0xe9, 0x3d, 0x7e, 0x11, 0x73, 0x93, 0x17, 0x2a]);
  const expected: Uint8Array = new Uint8Array([0x87, 0x4d, 0x61, 0x91, 0xb6, 0x20, 0xe3, 0x26, 0x1b, 0xef, 0x68, 0x64, 0x99, 0x0d, 0xb6, 0xce]);

  // Act
  const output1 = await skaAES_CTR.EncryptBytes(content, key);
  const output2 = await skaAES_CTR.DecryptBytes(content, key);

  // Assert
  assertEquals<Uint8Array>(output1, expected);
  assertEquals<Uint8Array>(output2, expected);
});

Deno.test("Generate new test", async () => {
  // Arrange
  const keyAES: Uint8Array = new Uint8Array([0x2b, 0x7e, 0x12, 0x16, 0x28, 0xae, 0xd2, 0xa6, 0xab, 0x17, 0x15, 0x88, 0x09, 0xcf, 0x43, 0x3c]);
  
  const content: Uint8Array = new Uint8Array([0x6b, 0xc1, 0xbe, 0xe2, 0x2e, 0x40, 0x9f, 0x96, 0xe9, 0x3d, 0x7e, 0x11, 0x73, 0x93, 0x17, 0x2a]);

  const skaAES: SymmetricKeyAlgorithm = SymmetricKeyAlgorithm.GenerateNew(SymmetricEncryptionAlgorithm.AES_CTR);

  // Act
  const outputAES: Uint8Array = await skaAES.EncryptBytes(content, keyAES);
  const decryptedAES: Uint8Array = await skaAES.DecryptBytes(outputAES, keyAES);


  // Assert
  assertExists(skaAES);
  assertExists(skaAES.settingsAES_CTR);
  assertEquals(skaAES.settingsChaCha20, null);
  assertNotEquals(content, outputAES);
  assertEquals<Uint8Array>(content, decryptedAES);
});

Deno.test("SymmetricKeyAlgorithm get as bytes test", async () => {
  // Arrange
  const initialCounter1: Uint8Array = new Uint8Array([0xf0, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff]);
  const initialCounter2: Uint8Array = new Uint8Array([0xf1, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xfb, 0xfc, 0xfd, 0xfe, 0xff]);
  
  const settingsAES_CTR1: SettingsAES_CTR = new SettingsAES_CTR(initialCounter1);
  const settingsAES_CTR2: SettingsAES_CTR = new SettingsAES_CTR(initialCounter2);

  const skaAES_CTR1: SymmetricKeyAlgorithm = new SymmetricKeyAlgorithm(SymmetricEncryptionAlgorithm.AES_CTR, 128, settingsAES_CTR1);
  const skaAES_CTR2: SymmetricKeyAlgorithm = new SymmetricKeyAlgorithm(SymmetricEncryptionAlgorithm.AES_CTR, 128, settingsAES_CTR1);
  const skaAES_CTR3: SymmetricKeyAlgorithm = new SymmetricKeyAlgorithm(SymmetricEncryptionAlgorithm.AES_CTR, 256, settingsAES_CTR1);
  const skaAES_CTR4: SymmetricKeyAlgorithm = new SymmetricKeyAlgorithm(SymmetricEncryptionAlgorithm.AES_CTR, 128, settingsAES_CTR2);

  // Act
  const skaAES_CTR1bytes: Uint8Array = skaAES_CTR1.GetSettingsAsBytes();
  const skaAES_CTR2bytes: Uint8Array = skaAES_CTR2.GetSettingsAsBytes();
  const skaAES_CTR3bytes: Uint8Array = skaAES_CTR3.GetSettingsAsBytes();
  const skaAES_CTR4bytes: Uint8Array = skaAES_CTR4.GetSettingsAsBytes();

  // Assert
  assertExists(skaAES_CTR1bytes);
  assertExists(skaAES_CTR2bytes);
  assertExists(skaAES_CTR3bytes);
  assertExists(skaAES_CTR4bytes);

  assertEquals<Uint8Array>(skaAES_CTR1bytes, skaAES_CTR2bytes);
  assertNotEquals(skaAES_CTR1bytes, skaAES_CTR3bytes);
  assertNotEquals(skaAES_CTR1bytes, skaAES_CTR4bytes);
});