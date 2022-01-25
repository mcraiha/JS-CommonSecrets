import { BitConverter } from "./BitConverter.ts";
import { ChecksumHelper } from "./ChecksumHelper.ts";

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

  private constructor(creationTime: number)
  {
    this.creationTime = creationTime;
  }

  public static async Create(newNoteTitle: string = "", newNoteText: string = "", creationTime: number = Math.floor(Date.now() / 1000)): Promise<Note>
  {
    const returnValue: Note = new Note(creationTime);
    await returnValue.UpdateNote(newNoteTitle, newNoteText, creationTime);
    return returnValue;
  }
  
  public async UpdateNote(updatedNoteTitle: string, updatedNoteText: string, modificationTime: number = Math.floor(Date.now() / 1000)): Promise<void>
  {
    this.noteTitle = new TextEncoder().encode(updatedNoteTitle);
    this.noteText = new TextEncoder().encode(updatedNoteText);
    this.modificationTime = modificationTime;
    this.CalculateAndUpdateChecksum();
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

  public async CheckIfChecksumMatchesContent(): Promise<boolean>
  {
    return this.checksum === await this.CalculateHexChecksum();
  }

  private async CalculateHexChecksum(): Promise<string>
  {
    return await ChecksumHelper.CalculateHexChecksum(new Array(this.noteTitle, this.noteText, BitConverter.GetBytes(this.creationTime), BitConverter.GetBytes(this.modificationTime)));
  }

  private async CalculateAndUpdateChecksum(): Promise<void>
  {
    this.checksum = await this.CalculateHexChecksum();
  }
}