var expect = require('chai').expect;

describe('AccountsDataTableBuilder', () => {

    // Helper to create a mock Group with depth and name
    function createMockGroup(id: string, name: string, depth: number): Group {
        const group = new Group();
        (group as any).payload = { id, name, normalizedName: name.toLowerCase() };
        group.depth = depth;
        return group;
    }

    // Helper to create a mock Account with groups
    function createMockAccount(id: string, name: string, type: AccountType, groups: Group[]): Account {
        const account = new Account();
        (account as any).payload = {
            id,
            name,
            normalizedName: name.toLowerCase(),
            type,
            groups: groups.map(g => ({ id: g.getId(), name: g.getName() }))
        };

        // Mock the book to return the groups
        const groupMap: { [key: string]: Group } = {};
        groups.forEach(g => {
            groupMap[g.getId()] = g;
            groupMap[g.getName()] = g;
        });

        (account as any).book = {
            getGroup: (idOrName: string) => groupMap[idOrName] || null
        };

        return account;
    }

    describe('#build() with groups', () => {

        it('should not add group columns when groups option is disabled', () => {
            const groups = [createMockGroup('g1', 'Expenses', 0)];
            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, groups)
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(false).build();

            expect(table[0]).to.deep.equal(['Name', 'Type']);
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET]);
        });

        it('should add one column per unique group, ordered by depth then alphabetically', () => {
            // Groups at different depths
            const expenses = createMockGroup('g1', 'Expenses', 0);
            const revenue = createMockGroup('g2', 'Revenue', 0);
            const marketing = createMockGroup('g3', 'Marketing', 1);
            const operating = createMockGroup('g4', 'Operating', 1);
            const payroll = createMockGroup('g5', 'Payroll', 2);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [expenses, operating, payroll]),
                createMockAccount('a2', 'Account B', AccountType.ASSET, [expenses, marketing]),
                createMockAccount('a3', 'Account C', AccountType.ASSET, [revenue])
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            // Header: Name, Type, then 5 Group columns (sorted: Expenses, Revenue, Marketing, Operating, Payroll)
            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group', 'Group', 'Group']);

            // Account A: in Expenses, Operating, Payroll
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET, 'Expenses', '', '', 'Operating', 'Payroll']);

            // Account B: in Expenses, Marketing
            expect(table[2]).to.deep.equal(['Account B', AccountType.ASSET, 'Expenses', '', 'Marketing', '', '']);

            // Account C: in Revenue only
            expect(table[3]).to.deep.equal(['Account C', AccountType.ASSET, '', 'Revenue', '', '', '']);
        });

        it('should place the same group in the same column across all accounts', () => {
            const taxable = createMockGroup('g1', 'Taxable', 0);
            const expenses = createMockGroup('g2', 'Expenses', 0);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [taxable]),
                createMockAccount('a2', 'Account B', AccountType.ASSET, [expenses, taxable])
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            // Sorted alphabetically: Expenses, Taxable
            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group']);

            // Account A: only Taxable (column index 1)
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET, '', 'Taxable']);

            // Account B: Expenses and Taxable
            expect(table[2]).to.deep.equal(['Account B', AccountType.ASSET, 'Expenses', 'Taxable']);
        });

        it('should handle accounts with no groups', () => {
            const expenses = createMockGroup('g1', 'Expenses', 0);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [expenses]),
                createMockAccount('a2', 'Account B', AccountType.ASSET, [])
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group']);
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET, 'Expenses']);
            expect(table[2]).to.deep.equal(['Account B', AccountType.ASSET, '']);
        });

        it('should return no group columns when no accounts have groups', () => {
            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, []),
                createMockAccount('a2', 'Account B', AccountType.ASSET, [])
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            expect(table[0]).to.deep.equal(['Name', 'Type']);
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET]);
            expect(table[2]).to.deep.equal(['Account B', AccountType.ASSET]);
        });

        it('should handle free groups (depth 0) mixed with hierarchical groups', () => {
            // Free groups (no hierarchy)
            const priority = createMockGroup('g1', 'Priority', 0);
            const archived = createMockGroup('g2', 'Archived', 0);
            // Hierarchical groups
            const expenses = createMockGroup('g3', 'Expenses', 0);
            const operating = createMockGroup('g4', 'Operating', 1);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [priority, expenses, operating]),
                createMockAccount('a2', 'Account B', AccountType.ASSET, [archived, priority])
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            // Depth 0 (alphabetically): Archived, Expenses, Priority
            // Depth 1: Operating
            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group', 'Group']);

            // Account A: Expenses, Priority, Operating
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET, '', 'Expenses', 'Priority', 'Operating']);

            // Account B: Archived, Priority
            expect(table[2]).to.deep.equal(['Account B', AccountType.ASSET, 'Archived', '', 'Priority', '']);
        });

        it('should handle gap in depth levels', () => {
            const root = createMockGroup('g1', 'Root', 0);
            const child = createMockGroup('g2', 'Child', 1);
            const grandchild = createMockGroup('g3', 'Grandchild', 2);

            const accounts = [
                // Account A has Root and Grandchild but no Child
                createMockAccount('a1', 'Account A', AccountType.ASSET, [root, grandchild]),
                // Account B has full hierarchy
                createMockAccount('a2', 'Account B', AccountType.ASSET, [root, child, grandchild])
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group']);

            // Account A: Root, (empty for Child), Grandchild
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET, 'Root', '', 'Grandchild']);

            // Account B: Root, Child, Grandchild
            expect(table[2]).to.deep.equal(['Account B', AccountType.ASSET, 'Root', 'Child', 'Grandchild']);
        });

        it('should handle multiple hierarchies', () => {
            // Hierarchy A
            const expenses = createMockGroup('g1', 'Expenses', 0);
            const operating = createMockGroup('g2', 'Operating', 1);
            // Hierarchy B
            const taxable = createMockGroup('g3', 'Taxable', 0);
            const federal = createMockGroup('g4', 'Federal', 1);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [expenses, operating, taxable, federal])
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            // Depth 0: Expenses, Taxable
            // Depth 1: Federal, Operating
            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group', 'Group']);
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET, 'Expenses', 'Taxable', 'Federal', 'Operating']);
        });

    });

});
