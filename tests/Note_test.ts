import { assert, assertEquals, assertExists } from "https://deno.land/std@0.119.0/testing/asserts.ts";
import { Note } from "../src/Note.ts";

Deno.test("Constructor test", async () => {
    // Arrange
    const note1: Note = await Note.Create();
	const note2: Note = await Note.Create("Some topic here", "Some text here, yes.");

    // Act
    
    // Assert
    assertExists(note1);
    assertExists(note2);
});

Deno.test("Get values test", async () => {
    // Arrange
    const title: string = "My shopping list";
	const text: string = "Cheese, cucumber, mayo, lettuce, tomato ...";
    const note: Note = await Note.Create(title, text);

    // Act
    
    // Assert
    assertEquals(note.GetNoteTitle(), title, "Note titles should be same");
    assertEquals(note.GetNoteText(), text, "Note texts should be same");
});