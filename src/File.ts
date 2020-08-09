/**
 * 
 * This class defines a File uploaded to a [[Book]].
 * 
 * A file can be attached to a [[Transaction]] or used to import data.
 * 
 * @public
 */
class File {

  wrapped: bkper.File;

  /**
   * Gets the file id
   */
  public getId(): string {
    return this.wrapped.id;
  }

  /**
   * Gets the file name
   */
  public getName(): string {
    return this.wrapped.name;
  }

  /**
   * Gets the file content type
   */
  public getContentType(): string {
    return this.wrapped.contentType;
  }

  /**
   * Gets the file serving url for accessing via browser
   */
  public getUrl(): string {
    return this.wrapped.url;
  }

}