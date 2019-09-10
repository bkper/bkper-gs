function doGet(e: any) {
  return Authorizer_.processGetRequest(e);
}

function storeTokenData(code: string, redirectUri: string): void {
  Authorizer_.storeTokenData(code, redirectUri);
}

function createAuthorizationURL(redirectUri: string, state: string): string {
  return Authorizer_.createAuthorizationURL(redirectUri, state);
}

function getAuthorizedCloseWindow(): GoogleAppsScript.HTML.HtmlOutput {
  return Authorizer_.getAuthorizedCloseWindow();
}

/**
 * Check if the user is already althorized with OAuth2 to the bkper API
 * 
 * @public
 */
function isUserAuthorized(): boolean {
  return Authorizer_.isUserAuthorized();
}

/**
 * Gets the authorization screen html template for the user to authorize the API
 * 
 * @param continueUrl The url to continue the action after authorization
 * @param continueText The link text to show the user the action after authorization
 * 
 * @public
 */
function getAuthorizationHtml(continueUrl?: string, continueText?: string) {
  return Authorizer_.createAuthorizeTemplate(continueUrl, continueText);
}

/**
 * Gets the [[Book]] with the specified bookId from url param.
 *
 * This is the main Entry Point to start interacting with BkperApp
 *
 * Example:
 *
 * ```javascript
 * var book = BkperApp.getBook("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
 * book.record("#fuel for my Land Rover 126.50 28/01/2013");
 * ```
 *
 * @param id The universal book id - The same bookId param of URL you access at app.bkper.com
 * 
 * @public
 */
function getBook(id: string): Book {
  return new Book(id);
}

/**
 * Gets all [[Books]] the user has access.
 * 
 * @public
 */
function getBooks(): Book[] {
  return BookService_.listBooks().map(bookV2 => { return new Book(bookV2.id, bookV2) });
}



function normalizeName(name: string): string {
  return Normalizer_.normalizeText(name, "_");
}


//DEPRECATED METHODS

/**
 * @deprecated
 */
function getUserDetails(): bkper.UserDetailsV2Payload {
  return UserService_.getUserDetails();
}

/**
 * @deprecated
 */
function openById(bookId: string): Book {
  return new Book(bookId);
}

/**
 * @deprecated
 */
function listBooks(): bkper.BookV2Payload[] {
  return BookService_.listBooks();
}

/**
 * @deprecated
 */
function openLedgerById(ledgerId: string): Book {
  return openById(ledgerId);
}

/**
 * @deprecated
 */
function listLedgers(): bkper.BookV2Payload[] {
  return listBooks();
}


