/**
* @private
*/
function doGet(e: any) {
  return Authorizer_.processGetRequest(e);
}

function storeTokenData(code: string, redirectUri: string): void {
  Authorizer_.storeTokenData(code, redirectUri);
}

function createAuthorizationURL(redirectUri: string, state: string) {
  return Authorizer_.createAuthorizationURL(redirectUri, state);
}

function getAuthorizedCloseWindow() {
  return Authorizer_.getAuthorizedCloseWindow();
}

/**
* Returns the {@link Book} with the specified ID.
* 
* @example
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


function getUserDetails(): Bkper.UserDetailsV2Payload {
  return UserService_.getUserDetails();
}


/**
* Gets the books of the user.
* @return All books the user has access
*/
function listBooks(): Bkper.BookV2Payload[]  {
  return BookService_.listBooks();
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
* @param {string} [continueUrl] The url to continue the action after authorization
* @param {string} [continueText] The link text to show the user the action after authorization
*/
function getAuthorizationHtml(continueUrl: string, continueText: string) {
  return Authorizer_.createAuthorizeTemplate(continueUrl, continueText);
}

function normalizeName(name: string) {
  //@ts-ignore
  return BkperUtils.normalizeText(name, "_");
}


//DEPRECATED METHODS

/**
 * @Deprecated Use {@link openById}
 */
function openLedgerById(ledgerId: string) {
	  return openById(ledgerId);
}

/**
@Deprecated Use {@link listBooks}
*/
function listLedgers(): Bkper.BookV2Payload[] {
  return listBooks();
}

//TYPE DEFINITIONS

  /**
  A variable represents a moment on time. Useful to keep queries and expressions updated on time.
  <br/>
  Go to <a href='https://app.bkper.com' target='_blank'>bkper.com</a> and open report wizard: <img src='../../img/wizard.png'/> to learn more about variables.
  <br/>
  The sintax is ($y|$m|$d)(-|+)(1-999). See more bellow.

  @typedef Variables
  @property {string} $d - The current day. Example: $d-15 (fifthteen days ago) / $d+1 (one day ahead)
  @property {string} $m - The current month. Example: $m-1 (one month ago) / $m+2 (two months ahead)
  @property {string} $y - The current year. Example: $y-1 (one year ago) / $y+1 (one year ahead)
  */
