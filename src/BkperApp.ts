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

function createAuthorizationURL(redirectUri: string, state: string) {
  return Authorizer_.createAuthorizationURL(redirectUri, state);
}

/**
 * @ignore
 */
function getAuthorizedCloseWindow() {
  return Authorizer_.getAuthorizedCloseWindow();
}

/**
* Check if the user is already althorized with OAuth2 to the bkper API
* @returns {boolean} true if the user is already authorized, false otherwise
*/
function isUserAuthorized(): boolean {
  return Authorizer_.isUserAuthorized();
}

/**
* Gets the authorization screen html template for the user to authorize the API
* 
* @param [continueUrl] The url to continue the action after authorization
* @param [continueText] The link text to show the user the action after authorization
*/
function getAuthorizationHtml(continueUrl?: string, continueText?: string) {
  return Authorizer_.createAuthorizeTemplate(continueUrl, continueText);
}

/**
* Returns the {@link Book} with the specified ID.
* 
* Example:
* 
* ```
* var book = BkperApp.openById("agtzfmJrcGVyLWhyZHITCxIGTGVkZ2VyGICAgIDggqALDA");
* book.record("#fuel for my Land Rover 126.50 28/01/2013");
* ```
* 
* @param {string} bookId - The universal book id - The same bookId param of URL you access at bkper.com
* 
* @returns {Book}
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
function normalizeName(name: string) {
  //@ts-ignore
  return BkperUtils.normalizeText(name, "_");
}


//DEPRECATED METHODS
/**
 * @ignore
 */
function openLedgerById(ledgerId: string) {
	  return openById(ledgerId);
}

/**
* @ignore
*/
function listLedgers(): Bkper.BookV2Payload[] {
  return listBooks();
}

