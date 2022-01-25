import { assert, assertEquals, assertExists } from "https://deno.land/std@0.119.0/testing/asserts.ts";
import { FileEntry } from "../src/FileEntry.ts";

Deno.test("Constructor test", async () => {
  // Arrange
  const fileEntry1: FileEntry = await FileEntry.Create("sometext.txt", new TextEncoder().encode("Some text here, yes."));

  // Act

  // Assert
  assertExists(fileEntry1);
});

Deno.test("Get values test", async () => {
  // Arrange
  const filename: string = "notnice.doc";
  const contentForFile: Uint8Array = new TextEncoder().encode("👺 is evil!");
  const fileEntry: FileEntry = await FileEntry.Create(filename, contentForFile);

  // Act

  // Assert
  assertEquals(fileEntry.GetFilename(), filename, "Filenames should be same");
  assertEquals(fileEntry.GetFileContentLengthInBytes(), contentForFile.length, "File contents length should be same");
  assertEquals(fileEntry.GetFileContent(), contentForFile, "File contents should be same");
});