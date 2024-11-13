var expect = require('chai').expect;

describe('Group', () => {

    describe('#getParentGroupsChain()', () => {
        it('should return the parent groups chain up to the root Group', () => {

            //  ROOT
            //   |__ LEVEL 1
            //   |    |__ LEVEL 2
            //   |        |__ LEVEL 3

            let rootGroup = new Group();
            rootGroup.parent = null;

            let level1Group = new Group();
            level1Group.parent = rootGroup;

            let level2Group = new Group();
            level2Group.parent = level1Group;

            let level3Group = new Group();
            level3Group.parent = level2Group;

            expect(level3Group.getParentGroupsChain()).to.deep.equal([level2Group, level1Group, rootGroup]);
        });
    });

});