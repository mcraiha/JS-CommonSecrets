
export class Note
{
  /** Note title as byte array */
  public noteTitle: Uint8Array = new Uint8Array(0);

  public static readonly noteTitleKey: string = "noteTitle";


  /** Note text as byte array */
  public noteText: Uint8Array = new Uint8Array(0);

  public static readonly noteTextKey: string = "noteText";


  /** Creation time of note, in Unix seconds since epoch */
  public creationTime: number = Math.floor(Date.now() / 1000);

  public static readonly creationTimeKey: string = "creationTime";


  /** Last modification time of note, in Unix seconds since epoch */
  public modificationTime: number = Math.floor(Date.now() / 1000);

  public static readonly modificationTimeKey: string = "modificationTime";

  /** Calculated checksum of note */
  public checksum: string = "";

  constructor(newNoteTitle: string = "", newNoteText: string = "", creationTime: number = Math.floor(Date.now() / 1000))
  {
    this.creationTime = creationTime;
    this.UpdateNote(newNoteTitle, newNoteText, creationTime);
  }
  
  public UpdateNote(updatedNoteTitle: string, updatedNoteText: string, modificationTime: number = Math.floor(Date.now() / 1000)): void
  {
    this.noteTitle = new TextEncoder().encode(updatedNoteTitle);
    this.noteText = new TextEncoder().encode(updatedNoteText);
    this.modificationTime = modificationTime;
  }

  public GetNoteTitle(): string
  {
    return new TextDecoder("utf-8").decode(this.noteTitle);
  }

  public GetNoteText(): string
  {
    return new TextDecoder("utf-8").decode(this.noteText);
  }

  public GetChecksumAsHex(): string
  {
    return this.checksum;
  }

  private CalculateAndUpdateChecksum(): void
  {

  }
}