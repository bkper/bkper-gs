/**
 * 
 * This class defines a File uploaded to a [[Book]].
 * 
 * A File can be attached to a [[File]] or used to import data.
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
   * Gets the custom properties stored in this File.
   */  
  public getProperties(): {[key: string]: string} {
    return this.wrapped.properties != null ?  {...this.wrapped.properties} : {};
  }

  /**
   * Gets the custom properties keys stored in this File.
   */  
  public getPropertyKeys(): string[] {
    let properties = this.getProperties();
    let propertyKeys:string[] = []
    if (properties) {
      for (var key in properties) {
        if (Object.prototype.hasOwnProperty.call(properties, key)) {
            propertyKeys.push(key)
        }
      }
    }
    propertyKeys = propertyKeys.sort();
    return propertyKeys;
  }

  /**
   * Set the custom properties of the File
   * 
   * @param properties Object with key/value pair properties
   * 
   * @returns This File, for chainning. 
   */
  public setProperties(properties: {[key: string]: string}): File {
    this.wrapped.properties = {...properties};
    return this;
  }

  /**
   * Gets the property value for given keys. First property found will be retrieved
   * 
   * @param keys The property key
   */
  public getProperty(...keys: string[]): string {
    for (let index = 0; index < keys.length; index++) {
      const key = keys[index];
      let value = this.wrapped.properties != null ?  this.wrapped.properties[key] : null 
      if (value != null && value.trim() != '') {
        return value;
      }
    }
    return null;
  }

  /**
   * Set a custom property in the File.
   * 
   * @param key The property key
   * @param value The property value
   * 
   * @returns This File, for chainning. 
   */
  public setProperty(key: string, value: string): File {
    if (key == null || key.trim() == '') {
      return this;
    }    
    if (this.wrapped.properties == null) {
      this.wrapped.properties = {};
    }
    this.wrapped.properties[key] = value;
    return this;
  }

  /**
   * Delete a custom property
   * 
   * @param key The property key
   * 
   * @returns This File, for chainning. 
   */
  public deleteProperty(key: string): File {
    this.setProperty(key, null);
    return this;
  }  


  //ORIGIN ACCOUNT
  /**
  /**
   * Perform create new File.
   */
  public create(): File {
    this.wrapped = FileService_.createFile(this.book.getId(), this.wrapped);
    return this;
  }

}