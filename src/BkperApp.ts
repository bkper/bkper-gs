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


function isUserAuthorized(): boolean {
  return Authorizer_.isUserAuthorized();
}


function getAuthorizationHtml(continueUrl?: string, continueText?: string) {
  return Authorizer_.createAuthorizeTemplate(continueUrl, continueText);
}

function openById(bookId: string): Book  {
  return new Book(bookId);
}

/**
 * @ignore
 */
function getUserDetails(): bkper.UserDetailsV2Payload {
  return UserService_.getUserDetails();
}


function listBooks(): bkper.BookV2Payload[]  {
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
function listLedgers(): bkper.BookV2Payload[] {
  return listBooks();
}

