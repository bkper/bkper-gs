var expect = require('chai').expect;

describe('TransactionService_.getTransactionsByIds()', () => {
    const globalScope = globalThis as unknown as {
        HttpRequestApp?: Bkper.HttpRequestApp;
    };
    let originalHttpRequestApp: Bkper.HttpRequestApp | undefined;

    beforeEach(() => {
        originalHttpRequestApp = globalScope.HttpRequestApp;
        setOAuthTokenProvider({ getOAuthToken: () => 'oauth-token' });
        setApiKey('api-key');
        setAgentId('test-agent');
    });

    afterEach(() => {
        globalScope.HttpRequestApp = originalHttpRequestApp;
    });

    it('should load transactions from the load endpoint', () => {
        let requestedUrl: string | undefined;
        const response = {
            getResponseCode: () => 200,
            getContentText: () => '{"items":[{"id":"tx-1"}]}'
        } as unknown as GoogleAppsScript.URL_Fetch.HTTPResponse;
        const request: Bkper.HttpRequest = {
            addParam: () => request,
            fetch: () => response,
            getContentType: () => 'application/json',
            getUrl: () => requestedUrl || '',
            setContentType: () => request,
            setEscaping: () => request,
            setFollowRedirects: () => request,
            setHeader: () => request,
            setMethod: () => request,
            setMuteHttpExceptions: () => request,
            setPayload: () => request,
            setValidateHttpsCertificates: () => request
        };
        globalScope.HttpRequestApp = {
            newRequest: (url: string) => {
                requestedUrl = url;
                return request;
            }
        };

        const transactions = TransactionService_.getTransactionsByIds('book-1', ['tx-1']);

        expect(requestedUrl).to.equal(
            'https://api.bkper.app/v5/books/book-1/transactions/load'
        );
        expect(transactions).to.deep.equal([{ id: 'tx-1' }]);
    });
});
