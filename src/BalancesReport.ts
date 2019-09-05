

  class BalancesReport implements GoogleAppsScript.Bkper.BalancesReport {

    private wrapped: bkper.BalancesV2Payload;

    private book: Book;
    private groupBalancesContainers: GroupBalancesContainer[];
    private accountBalancesContainers: AccountBalancesContainer[];
    private tagBalancesContainers: TagBalancesContainer[];


    constructor(book: Book, balanceReportPlain: bkper.BalancesV2Payload) {
      this.book = book;
      this.wrapped = balanceReportPlain;
      this.groupBalancesContainers = null;
      this.accountBalancesContainers = null;
      this.tagBalancesContainers = null;
    }

    public createDataTable(): BalancesDataTableBuilder {
      var dataTable = new Array();
      if (this.getAccountBalancesContainers() != null) {
        dataTable = dataTable.concat(this.getAccountBalancesContainers());
      }
      if (this.getTagBalancesContainers() != null) {
        dataTable = dataTable.concat(this.getTagBalancesContainers());
      }
      if (this.getGroupBalancesContainers() != null) {
        dataTable = dataTable.concat(this.getGroupBalancesContainers());
      }

      return new BalancesDataTableBuilder(this.book, dataTable, this.getPeriodicity());
    }


    public getPeriodicity(): Periodicity {
      return this.wrapped.periodicity;
    }

    public hasOnlyOneGroup(): boolean {
      return this.getGroupBalancesContainers() != null && this.getGroupBalancesContainers().length == 1;
    }

    public getAccountBalancesContainers(): AccountBalancesContainer[] {
      if (this.accountBalancesContainers == null && this.wrapped.accountBalances != null) {
        this.accountBalancesContainers = [];
        for (var i = 0; i < this.wrapped.accountBalances.length; i++) {
          var accountBalance = this.wrapped.accountBalances[i];
          var accountBalanceReport = new AccountBalancesContainer(this.book, accountBalance);
          this.accountBalancesContainers.push(accountBalanceReport);
        }
      }
      return this.accountBalancesContainers;
    }

    public getTagBalancesContainers(): TagBalancesContainer[] {
      if (this.tagBalancesContainers == null && this.wrapped.tagBalances != null) {
        this.tagBalancesContainers = [];
        for (var i = 0; i < this.wrapped.tagBalances.length; i++) {
          var tagBalance = this.wrapped.tagBalances[i];
          var tagBalanceReport = new TagBalancesContainer(this.book, tagBalance);
          this.tagBalancesContainers.push(tagBalanceReport);
        }
      }
      return this.tagBalancesContainers;
    }


    public getGroupBalancesContainers(): GroupBalancesContainer[] {
      if (this.groupBalancesContainers == null && this.wrapped.groupBalances != null) {
        this.groupBalancesContainers = [];
        for (var i = 0; i < this.wrapped.groupBalances.length; i++) {
          var grouBalances = this.wrapped.groupBalances[i];
          var accGroupBalances = new GroupBalancesContainer(this.book, grouBalances, this.getPeriodicity());
          this.groupBalancesContainers.push(accGroupBalances);
        }
      }
      return this.groupBalancesContainers;
    }

    public getGroupBalancesContainer(groupName: string): GroupBalancesContainer {
      var groupBalances = this.getGroupBalancesContainers();
      if (groupBalances == null) {
        return null;
      }

      for (var i = 0; i < groupBalances.length; i++) {
        if (groupName == groupBalances[i].getName()) {
          return groupBalances[i];
        }
      }
    }

  }