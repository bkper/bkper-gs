/**
 * 
 * This class defines a File uploaded to a [[Book]].
 * 
 * A File can be attached to a [[Transaction]] or used to import data.
 * 
 * @public
 */
class File {

  wrapped: bkper.File;

  book: Book;

  blob: GoogleAppsScript.Base.Blob;

  /**
   * Gets the File id
   */
  public getId(): string {
    return this.wrapped.id;
  }

  /**
   * Gets the File name
   */
  public getName(): string {
    return this.wrapped.name;
  }

  /**
   * 
   * Sets the name of the File.
   * 
   * @returns This File, for chainning.
   */    
  public setName(name: string): File {
    this.wrapped.name = name;
    return this;
  }  

  /**
   * Gets the File content type
   */
  public getContentType(): string {
    return this.wrapped.contentType;
  }

  /**
   * 
   * Sets the File content type.
   * 
   * @returns This File, for chainning.
   */    
  public setContentType(contentType: string): File {
    this.wrapped.contentType = contentType;
    return this;
  }    

  /**
   * Gets the file content Base64 encoded
   */
  public getContent(): string {
    if (this.getId() != null && (this.wrapped == null || this.wrapped.content == null)) {
      this.wrapped = FileService_.getFile(this.book.getId(), this.getId());
    }
    return this.wrapped.content;
  }

  /**
   * 
   * Sets the File content Base64 encoded.
   * 
   * @returns This File, for chainning.
   */    
  public setContent(content: string): File {
    this.wrapped.content = content;
    return this;
  } 


  /**
   * Gets the Blob from this file
   */
  public getBlob(): GoogleAppsScript.Base.Blob {
    if (this.blob == null) {
      let data = Utilities.base64Decode(this.getContent());
      this.blob = Utilities.newBlob(data, this.getContentType(), this.getName());
    }
    return this.blob;
  }

  /**
   * Sets the File properties from a Blob
   * 
   * @returns This File, for chainning.
   */  
  public setBlob(blob: GoogleAppsScript.Base.Blob): File {
    this.blob = blob;
    this.setName(blob.getName());
    this.setContentType(blob.getContentType())
    this.setContent(Utilities.base64Encode(blob.getBytes()))
    return this;
  }  


  /**
   * Gets the file serving url for accessing via browser
   */
  public getUrl(): string {
    return this.wrapped.url;
  }

  /**
   * Gets the file size in bytes
   */  
  public getSize(): number {
    return this.wrapped.size;
  }


  /**
   * Perform create new File.
   */
  public create(): File {
    this.wrapped = FileService_.createFile(this.book.getId(), this.wrapped);
    return this;
  }

}