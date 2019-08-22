/**
 * @ignore
 */
function doGet(e: any) {
  return Authorizer_.processGetRequest(e);
}

/**
 * @ignore
 */
function storeTokenData(code: string, redirectUri: string): void {
  Authorizer_.storeTokenData(code, redirectUri);
}

/**
 * @ignore
 */
function createAuthorizationURL(redirectUri: string, state: string): string {
  return Authorizer_.createAuthorizationURL(redirectUri, state);
}

/**
 * @ignore
 */
function getAuthorizedCloseWindow(): GoogleAppsScript.HTML.HtmlOutput {
  return Authorizer_.getAuthorizedCloseWindow();
}

/**
 * Check if the user is already althorized with OAuth2 to the bkper API
 * @returns True if the user is already authorized, false otherwise
 */
function isUserAuthorized(): boolean {
  return Authorizer_.isUserAuthorized();
}

/**
 * Gets the authorization screen html template for the user to authorize the API
 * 
 * @param continueUrl The url to continue the action after authorization
 * @param continueText The link text to show the user the action after authorization
 */
function getAuthorizationHtml(continueUrl?: string, continueText?: string) {
  return Authorizer_.createAuthorizeTemplate(continueUrl, continueText);
}

/**
 * Returns the [[Book]] with the specified ID. 
 * 
 * This is the main Entry Point to start interacting with the Book
 * 
 * Example:
 * 
 * ```
 * var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
 * book.record("#fuel for my Land Rover 126.50 28/01/2013");
 * ```
 * 
 * @param bookId The universal book id - The same bookId param of URL you access at app.bkper.com
 * 
 */
function openById(bookId: string): Book  {
  return new Book(bookId);
}

/**
 * @ignore
 */
function getUserDetails(): Bkper.UserDetailsV2Payload {
  return UserService_.getUserDetails();
}

/**
 * Gets the books of the user.
 * @ignore
 */
function listBooks(): Bkper.BookV2Payload[]  {
  return BookService_.listBooks();
}

/**
 * @ignore
 */
function normalizeName(name: string): string {
  //@ts-ignore
  return BkperUtils.normalizeText(name, "_");
}


//DEPRECATED METHODS
/**
 * @ignore
 */
function openLedgerById(ledgerId: string): Book {
	  return openById(ledgerId);
}

/**
 * @ignore
 */
function listLedgers(): Bkper.BookV2Payload[] {
  return listBooks();
}

