var expect = require('chai').expect;

describe('AccountsDataTableBuilder', () => {
    // Helper to create a mock Group with depth, name, parent, and children
    function createMockGroup(
        id: string,
        name: string,
        depth: number,
        hasParent: boolean = false,
        hasChildren: boolean = false
    ): Group {
        const group = new Group();
        (group as any).payload = { id, name, normalizedName: name.toLowerCase() };
        group.depth = depth;

        // Mock parent - will be set properly via setParentGroup helper
        (group as any).parent = hasParent ? ({} as Group) : null;

        // Mock hasChildren
        group.hasChildren = () => hasChildren;

        // Mock getRoot - returns self by default, can be overridden
        group.getRoot = () => group;

        return group;
    }

    // Helper to set up parent-child relationships between groups
    function setParentGroup(child: Group, parent: Group): void {
        (child as any).parent = parent;
        child.getRoot = () => parent.getRoot();
    }

    // Helper to create a mock Account with groups
    function createMockAccount(
        id: string,
        name: string,
        type: AccountType,
        groups: Group[]
    ): Account {
        const account = new Account();
        (account as any).payload = {
            id,
            name,
            normalizedName: name.toLowerCase(),
            type,
            groups: groups.map(g => ({ id: g.getId(), name: g.getName() })),
        };

        // Mock the book to return the groups
        const groupMap: { [key: string]: Group } = {};
        groups.forEach(g => {
            groupMap[g.getId()] = g;
            groupMap[g.getName()] = g;
        });

        (account as any).book = {
            getGroup: (idOrName: string) => groupMap[idOrName] || null,
        };

        return account;
    }

    describe('#build() with groups - sequential columns with hierarchy-path ordering', () => {
        it('should not add group columns when groups option is disabled', () => {
            const groups = [createMockGroup('g1', 'Expenses', 0)];
            const accounts = [createMockAccount('a1', 'Account A', AccountType.ASSET, groups)];

            const table = new AccountsDataTableBuilder(accounts).groups(false).build();

            expect(table[0]).to.deep.equal(['Name', 'Type']);
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET]);
        });

        it('should add sequential group columns based on max groups per account', () => {
            // Account A has 3 groups, Account B has 1 group
            // Should create 3 Group columns (max)
            const g1 = createMockGroup('g1', 'Alpha', 0);
            const g2 = createMockGroup('g2', 'Beta', 0);
            const g3 = createMockGroup('g3', 'Gamma', 0);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [g1, g2, g3]),
                createMockAccount('a2', 'Account B', AccountType.ASSET, [g1]),
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            // 3 Group columns (max groups on any account)
            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group']);

            // Account A: all 3 groups (free groups, sorted alphabetically)
            expect(table[1]).to.deep.equal([
                'Account A',
                AccountType.ASSET,
                'Alpha',
                'Beta',
                'Gamma',
            ]);

            // Account B: 1 group, padded with nulls by convertInMatrix
            expect(table[2]).to.deep.equal(['Account B', AccountType.ASSET, 'Alpha', null, null]);
        });

        it('should order hierarchy chain groups before free groups', () => {
            // Hierarchy: Costs -> Admin -> Payroll
            const costs = createMockGroup('g1', 'Costs', 0, false, true);
            const admin = createMockGroup('g2', 'Admin', 1, true, true);
            const payroll = createMockGroup('g3', 'Payroll', 2, true, false);

            // Set up hierarchy
            setParentGroup(admin, costs);
            setParentGroup(payroll, admin);

            // Free group (no parent, no children)
            const billing = createMockGroup('g4', 'Billing', 0, false, false);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [
                    billing,
                    payroll,
                    costs,
                    admin,
                ]),
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            // Hierarchy path first (Costs, Admin, Payroll), then free groups (Billing)
            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group', 'Group']);
            expect(table[1]).to.deep.equal([
                'Account A',
                AccountType.ASSET,
                'Costs',
                'Admin',
                'Payroll',
                'Billing',
            ]);
        });

        it('should sort multiple hierarchy chains alphabetically by root name', () => {
            // Hierarchy A: Costs -> Operating
            const costs = createMockGroup('g1', 'Costs', 0, false, true);
            const operating = createMockGroup('g2', 'Operating', 1, true, false);
            setParentGroup(operating, costs);

            // Hierarchy B: Revenue -> Sales
            const revenue = createMockGroup('g3', 'Revenue', 0, false, true);
            const sales = createMockGroup('g4', 'Sales', 1, true, false);
            setParentGroup(sales, revenue);

            const accounts = [
                // Groups in random order
                createMockAccount('a1', 'Account A', AccountType.ASSET, [
                    sales,
                    operating,
                    revenue,
                    costs,
                ]),
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            // Chains sorted by root name: Costs chain first, then Revenue chain
            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group', 'Group']);
            expect(table[1]).to.deep.equal([
                'Account A',
                AccountType.ASSET,
                'Costs',
                'Operating',
                'Revenue',
                'Sales',
            ]);
        });

        it('should handle accounts with no groups', () => {
            const expenses = createMockGroup('g1', 'Expenses', 0);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [expenses]),
                createMockAccount('a2', 'Account B', AccountType.ASSET, []),
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group']);
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET, 'Expenses']);
            expect(table[2]).to.deep.equal(['Account B', AccountType.ASSET, null]);
        });

        it('should return no group columns when no accounts have groups', () => {
            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, []),
                createMockAccount('a2', 'Account B', AccountType.ASSET, []),
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            expect(table[0]).to.deep.equal(['Name', 'Type']);
            expect(table[1]).to.deep.equal(['Account A', AccountType.ASSET]);
            expect(table[2]).to.deep.equal(['Account B', AccountType.ASSET]);
        });

        it('should sort free groups alphabetically', () => {
            // All free groups (no hierarchy)
            const zebra = createMockGroup('g1', 'Zebra', 0);
            const alpha = createMockGroup('g2', 'Alpha', 0);
            const middle = createMockGroup('g3', 'Middle', 0);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [zebra, alpha, middle]),
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group']);
            expect(table[1]).to.deep.equal([
                'Account A',
                AccountType.ASSET,
                'Alpha',
                'Middle',
                'Zebra',
            ]);
        });

        it('should handle partial hierarchy membership', () => {
            // Full hierarchy: Expenses -> Operating -> Payroll
            const expenses = createMockGroup('g1', 'Expenses', 0, false, true);
            const operating = createMockGroup('g2', 'Operating', 1, true, true);
            const payroll = createMockGroup('g3', 'Payroll', 2, true, false);
            setParentGroup(operating, expenses);
            setParentGroup(payroll, operating);

            const accounts = [
                // Account A: only has root and grandchild, not middle
                createMockAccount('a1', 'Account A', AccountType.ASSET, [expenses, payroll]),
                // Account B: full hierarchy
                createMockAccount('a2', 'Account B', AccountType.ASSET, [
                    expenses,
                    operating,
                    payroll,
                ]),
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group']);

            // Account A: Expenses (d0), Payroll (d2) - sorted by depth within same hierarchy
            expect(table[1]).to.deep.equal([
                'Account A',
                AccountType.ASSET,
                'Expenses',
                'Payroll',
                null,
            ]);

            // Account B: Expenses, Operating, Payroll
            expect(table[2]).to.deep.equal([
                'Account B',
                AccountType.ASSET,
                'Expenses',
                'Operating',
                'Payroll',
            ]);
        });

        it('should handle mix of hierarchies and free groups across accounts', () => {
            // Hierarchy: Assets -> Current
            const assets = createMockGroup('g1', 'Assets', 0, false, true);
            const current = createMockGroup('g2', 'Current', 1, true, false);
            setParentGroup(current, assets);

            // Free groups
            const taxable = createMockGroup('g3', 'Taxable', 0);
            const priority = createMockGroup('g4', 'Priority', 0);

            const accounts = [
                createMockAccount('a1', 'Account A', AccountType.ASSET, [taxable, assets, current]),
                createMockAccount('a2', 'Account B', AccountType.ASSET, [priority, taxable]),
            ];

            const table = new AccountsDataTableBuilder(accounts).groups(true).build();

            expect(table[0]).to.deep.equal(['Name', 'Type', 'Group', 'Group', 'Group']);

            // Account A: hierarchy first (Assets, Current), then free (Taxable)
            expect(table[1]).to.deep.equal([
                'Account A',
                AccountType.ASSET,
                'Assets',
                'Current',
                'Taxable',
            ]);

            // Account B: only free groups, sorted alphabetically (Priority, Taxable)
            expect(table[2]).to.deep.equal([
                'Account B',
                AccountType.ASSET,
                'Priority',
                'Taxable',
                null,
            ]);
        });
    });
});
