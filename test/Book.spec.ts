var expect = require('chai').expect;

describe('Book', () => {

    // Helper to create a mock Group
    function createMockGroup(id: string, name: string): Group {
        const group = new Group();
        (group as any).payload = { id, name, normalizedName: name.toLowerCase() };
        return group;
    }

    // Helper to create a mock Account
    function createMockAccount(id: string, name: string, type: AccountType, groups: Group[]): Account {
        const account = new Account();
        (account as any).payload = {
            id,
            name,
            normalizedName: name.toLowerCase(),
            type,
            groups: groups.map(g => ({ id: g.getId(), name: g.getName() }))
        };
        return account;
    }

    // Helper to create a mock Book with groups and accounts
    function createMockBook(groups: Group[], accounts: Account[], accountsLoaded: boolean): Book {
        const book = new Book('test-book-id');

        // Setup group maps
        const idGroupMap: { [key: string]: Group } = {};
        const nameGroupMap: { [key: string]: Group } = {};
        for (const group of groups) {
            group.book = book;
            idGroupMap[group.getId()] = group;
            nameGroupMap[group.getNormalizedName()] = group;
        }
        (book as any).idGroupMap = idGroupMap;
        (book as any).nameGroupMap = nameGroupMap;
        (book as any).groups = groups;

        // Setup accounts if loaded
        if (accountsLoaded) {
            const idAccountMap: { [key: string]: Account } = {};
            const nameAccountMap: { [key: string]: Account } = {};
            for (const account of accounts) {
                account.book = book;
                idAccountMap[account.getId()] = account;
                nameAccountMap[account.getNormalizedName()] = account;

                // Add account to its groups
                if (account.payload.groups) {
                    for (const groupPayload of account.payload.groups) {
                        const group = idGroupMap[groupPayload.id];
                        if (group) {
                            group.addAccount(account);
                        }
                    }
                }
            }
            (book as any).idAccountMap = idAccountMap;
            (book as any).nameAccountMap = nameAccountMap;
            (book as any).accounts = accounts;
        } else {
            (book as any).idAccountMap = null;
            (book as any).nameAccountMap = null;
            (book as any).accounts = null;
        }

        // Prevent actual API calls
        (book as any).payload = { id: 'test-book-id', name: 'Test Book' };

        return book;
    }

    describe('#getAccounts()', () => {

        it('should return all accounts when no group filter is provided and accounts are loaded', () => {
            const group1 = createMockGroup('g1', 'Revenue');
            const group2 = createMockGroup('g2', 'Expenses');

            const account1 = createMockAccount('a1', 'Sales', AccountType.INCOMING, [group1]);
            const account2 = createMockAccount('a2', 'Rent', AccountType.OUTGOING, [group2]);
            const account3 = createMockAccount('a3', 'Utilities', AccountType.OUTGOING, [group2]);

            const book = createMockBook([group1, group2], [account1, account2, account3], true);

            const accounts = book.getAccounts();

            expect(accounts).to.have.length(3);
            expect(accounts.map(a => a.getName())).to.include.members(['Sales', 'Rent', 'Utilities']);
        });

        it('should return filtered accounts when group name is provided', () => {
            const group1 = createMockGroup('g1', 'Revenue');
            const group2 = createMockGroup('g2', 'Expenses');

            const account1 = createMockAccount('a1', 'Sales', AccountType.INCOMING, [group1]);
            const account2 = createMockAccount('a2', 'Rent', AccountType.OUTGOING, [group2]);
            const account3 = createMockAccount('a3', 'Utilities', AccountType.OUTGOING, [group2]);

            const book = createMockBook([group1, group2], [account1, account2, account3], true);

            const accounts = book.getAccounts('Expenses');

            expect(accounts).to.have.length(2);
            expect(accounts.map(a => a.getName())).to.include.members(['Rent', 'Utilities']);
        });

        it('should return filtered accounts when group id is provided', () => {
            const group1 = createMockGroup('g1', 'Revenue');
            const group2 = createMockGroup('g2', 'Expenses');

            const account1 = createMockAccount('a1', 'Sales', AccountType.INCOMING, [group1]);
            const account2 = createMockAccount('a2', 'Rent', AccountType.OUTGOING, [group2]);

            const book = createMockBook([group1, group2], [account1, account2], true);

            const accounts = book.getAccounts('g1');

            expect(accounts).to.have.length(1);
            expect(accounts[0].getName()).to.equal('Sales');
        });

        it('should return empty array when group does not exist', () => {
            const group1 = createMockGroup('g1', 'Revenue');
            const account1 = createMockAccount('a1', 'Sales', AccountType.INCOMING, [group1]);

            const book = createMockBook([group1], [account1], true);

            const accounts = book.getAccounts('NonExistent');

            expect(accounts).to.be.an('array').that.is.empty;
        });

        it('should return empty array when group has no accounts', () => {
            const group1 = createMockGroup('g1', 'Revenue');
            const group2 = createMockGroup('g2', 'Empty Group');
            const account1 = createMockAccount('a1', 'Sales', AccountType.INCOMING, [group1]);

            const book = createMockBook([group1, group2], [account1], true);

            const accounts = book.getAccounts('Empty Group');

            expect(accounts).to.be.an('array').that.is.empty;
        });

    });

    describe('#createAccountsDataTable()', () => {

        it('should create data table with all accounts when no group filter is provided', () => {
            const group1 = createMockGroup('g1', 'Revenue');
            const account1 = createMockAccount('a1', 'Sales', AccountType.INCOMING, [group1]);
            const account2 = createMockAccount('a2', 'Services', AccountType.INCOMING, [group1]);

            const book = createMockBook([group1], [account1, account2], true);

            const dataTable = book.createAccountsDataTable().build();

            // Header + 2 accounts
            expect(dataTable).to.have.length(3);
            expect(dataTable[0]).to.deep.equal(['Name', 'Type']);
        });

        it('should create data table with filtered accounts when group is provided', () => {
            const group1 = createMockGroup('g1', 'Revenue');
            const group2 = createMockGroup('g2', 'Expenses');

            const account1 = createMockAccount('a1', 'Sales', AccountType.INCOMING, [group1]);
            const account2 = createMockAccount('a2', 'Rent', AccountType.OUTGOING, [group2]);
            const account3 = createMockAccount('a3', 'Utilities', AccountType.OUTGOING, [group2]);

            const book = createMockBook([group1, group2], [account1, account2, account3], true);

            const dataTable = book.createAccountsDataTable('Revenue').build();

            // Header + 1 account
            expect(dataTable).to.have.length(2);
            expect(dataTable[1][0]).to.equal('Sales');
        });

        it('should create empty data table (header only) when group has no accounts', () => {
            const group1 = createMockGroup('g1', 'Revenue');
            const group2 = createMockGroup('g2', 'Empty');
            const account1 = createMockAccount('a1', 'Sales', AccountType.INCOMING, [group1]);

            const book = createMockBook([group1, group2], [account1], true);

            const dataTable = book.createAccountsDataTable('Empty').build();

            // Header only
            expect(dataTable).to.have.length(1);
            expect(dataTable[0]).to.deep.equal(['Name', 'Type']);
        });

    });

});
