

  class BalancesReport implements GoogleAppsScript.Bkper.BalancesReport {

    private wrapped: bkper.BalancesV2Payload;

    private book: Book;
    private groupBalancesContainers: GroupBalancesContainer[];
    private accountBalancesContainers: AccountBalancesContainer[];
    private tagBalancesContainers: TagBalancesContainer[];


    constructor(book: Book, balancesReportPlain: bkper.BalancesV2Payload) {
      this.book = book;
      this.wrapped = balancesReportPlain;
      this.groupBalancesContainers = null;
      this.accountBalancesContainers = null;
      this.tagBalancesContainers = null;
    }

    public getBook(): Book {
      return this.book;
    }

    public createDataTable(): BalancesDataTableBuilder {
      return new BalancesDataTableBuilder(this.book, this.getBalancesContainers(), this.getPeriodicity());
    }


    public getBalancesContainers(): GoogleAppsScript.Bkper.BalancesContainer[] {
      var containers = new Array<GoogleAppsScript.Bkper.BalancesContainer>();
      if (this.getAccountBalancesContainers() != null) {
        containers = containers.concat(this.getAccountBalancesContainers());
      }
      if (this.getTagBalancesContainers() != null) {
        containers = containers.concat(this.getTagBalancesContainers());
      }
      if (this.getGroupBalancesContainers() != null) {
        containers = containers.concat(this.getGroupBalancesContainers());
      }
      return containers;
    }


    public getPeriodicity(): Periodicity {
      return this.wrapped.periodicity;
    }

    public hasOnlyOneGroup(): boolean {
      return this.getGroupBalancesContainers() != null && this.getGroupBalancesContainers().length == 1;
    }

    private getAccountBalancesContainers(): AccountBalancesContainer[] {
      if (this.accountBalancesContainers == null && this.wrapped.accountBalances != null) {
        this.accountBalancesContainers = [];
        for (var i = 0; i < this.wrapped.accountBalances.length; i++) {
          var accountBalance = this.wrapped.accountBalances[i];
          var accountBalancesReport = new AccountBalancesContainer(this, accountBalance);
          this.accountBalancesContainers.push(accountBalancesReport);
        }
      }
      return this.accountBalancesContainers;
    }

    private getTagBalancesContainers(): TagBalancesContainer[] {
      if (this.tagBalancesContainers == null && this.wrapped.tagBalances != null) {
        this.tagBalancesContainers = [];
        for (var i = 0; i < this.wrapped.tagBalances.length; i++) {
          var tagBalance = this.wrapped.tagBalances[i];
          var tagBalancesContainer = new TagBalancesContainer(this, tagBalance);
          this.tagBalancesContainers.push(tagBalancesContainer);
        }
      }
      return this.tagBalancesContainers;
    }


    private getGroupBalancesContainers(): GroupBalancesContainer[] {
      if (this.groupBalancesContainers == null && this.wrapped.groupBalances != null) {
        this.groupBalancesContainers = [];
        for (var i = 0; i < this.wrapped.groupBalances.length; i++) {
          var grouBalances = this.wrapped.groupBalances[i];
          var accGroupBalances = new GroupBalancesContainer(this, grouBalances, this.getPeriodicity());
          this.groupBalancesContainers.push(accGroupBalances);
        }
      }
      return this.groupBalancesContainers;
    }

    public getBalancesContainer(groupName: string): GoogleAppsScript.Bkper.BalancesContainer {
      var groupBalances = this.getBalancesContainers();
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