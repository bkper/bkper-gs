var Report = {
  /**
  @class
  @classdesc A BalanceReport stores the balances based on an query.
  @param {Array} balanceReportPlain balances wrapped array
  @param {DecimalSeparator} decimalSeparator {@link Book#getDecimalSeparator|decimal separator of book}
  */
  BalanceReport : function(balanceReportPlain, decimalSeparator, datePattern) {
    this.wrapped = balanceReportPlain;
    this.groupBalanceReports = null;
    this.accountBalanceReports = null;
    this.tagBalanceReports = null;

    this.decimalSeparator = decimalSeparator;
    this.datePattern = datePattern;

    if (this.wrapped.groupBalances != null) {
      //Configuring credit on groupBalances
      for (var i = 0; i < this.wrapped.groupBalances.length; i++) {
        var groupBalance = this.wrapped.groupBalances[i];
        groupBalance.credit = false;
        var accountBalances = groupBalance.accountBalances;

        if (accountBalances != null) {
          for (var j = 0; j < accountBalances.length; j++) {
            if (accountBalances[j].credit == true) {
              groupBalance.credit = true;
              break;
            }
          }
        }

      }
    }

    /**
    @returns {BalancesDataTableBuilder}
    */
    Report.BalanceReport.prototype.createDataTable = function() {
      var dataTable = new Array();
      if (this.getAccountBalanceReports() != null) {
        dataTable = dataTable.concat(this.getAccountBalanceReports());
      }
      if (this.getTagBalanceReports() != null) {
        dataTable = dataTable.concat(this.getTagBalanceReports());
      }
      if (this.getGroupBalanceReports() != null) {
        dataTable = dataTable.concat(this.getGroupBalanceReports());
      }

      return new BalancesDataTableBuilder(dataTable, this.getPeriodicity(), this.decimalSeparator, this.datePattern);
    }

    /**
    @returns {string} the balance periodicity.
    */
    Report.BalanceReport.prototype.getPeriodicity = function() {
      return this.wrapped.periodicity;
    }

    /**
    @returns {boolean} Check if {@link Report.BalanceReport|report} has only one group balance.
    */
    Report.BalanceReport.prototype.hasOnlyOneGroupBalance = function() {
      return this.getGroupBalanceReports() != null && this.getGroupBalanceReports().length == 1 && this.wrapped.groupBalances.length;
    }

    /**
    @returns {Array<Report.AccountBalanceReport>} all {@link Report.AccountBalanceReport|account balances} of this query
    */
    Report.BalanceReport.prototype.getAccountBalanceReports = function() {
      if (this.accountBalanceReports == null && this.wrapped.accountBalances != null) {
        this.accountBalanceReports = new Array();
        for (var i = 0; i < this.wrapped.accountBalances.length; i++) {
          var accountBalance = this.wrapped.accountBalances[i];
          var accountBalanceReport = new Report.AccountBalanceReport(accountBalance);
          this.accountBalanceReports.push(accountBalanceReport);
        }
      }
      return this.accountBalanceReports;
    }

    /**
    @returns {Array<Report.TagBalanceReport>} all {@link Report.TagBalanceReport|hashtags balances} of this query
    */
    Report.BalanceReport.prototype.getTagBalanceReports = function() {
      if (this.tagBalanceReports == null && this.wrapped.tagBalances != null) {
        this.tagBalanceReports = new Array();
        for (var i = 0; i < this.wrapped.tagBalances.length; i++) {
          var tagBalance = this.wrapped.tagBalances[i];
          var tagBalanceReport = new Report.TagBalanceReport(tagBalance);
          this.tagBalanceReports.push(tagBalanceReport);
        }
      }
      return this.tagBalanceReports;
    }

    /**
    @returns {Array<Report.GroupBalanceReport>} all {@link Report.GroupBalanceReport|group balances} of this query
    */
    Report.BalanceReport.prototype.getGroupBalanceReports = function() {
      if (this.groupBalanceReports == null && this.wrapped.groupBalances != null) {
        this.groupBalanceReports = new Array();
        for (var i = 0; i < this.wrapped.groupBalances.length; i++) {
          var grouBalances = this.wrapped.groupBalances[i];
          var accGroupBalances = new Report.GroupBalanceReport(grouBalances, this.getPeriodicity());
          this.groupBalanceReports.push(accGroupBalances);
        }
      }
      return this.groupBalanceReports;
    }

    /**
    @returns {Report.GroupBalanceReport} an specific {@link Report.GroupBalanceReport} of this query
  	@param {string} groupName The name of the group filtered on query
    */
    Report.BalanceReport.prototype.getGroupBalanceReport = function(groupName) {
      var groupBalances = this.getGroupBalanceReports();

      if (groupBalances == null) {
        return null;
      }

      for (var i = 0; i < groupBalances.length; i++) {
        if (groupName == groupBalances[i].getName()) {
          return groupBalances[i];
        }
      }
    }

    Report.BalanceReport.prototype.getBalanceReportPlain = function() {
      return this.wrapped;
    }
  },




  //###################### ACCOUNT BALANCE REPORT ######################
  /**
  @class
  A AccountBalanceReport stores {@link Account|accounts} balances.
  */
  AccountBalanceReport : function(balancePlain) {
    this.wrapped = balancePlain;

    /**
    @returns {string} the {@link Account|account} name
    */
    Report.AccountBalanceReport.prototype.getName = function() {
      return this.wrapped.name;
    }

    /**
    @returns {boolean} Check if {@link Account|account} is credit
    */
    Report.AccountBalanceReport.prototype.isCredit = function() {
      return this.wrapped.credit;
    }

    /**
    @param {boolean} [format] If true, balance will be formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    @returns {number} the {@link Account|account} period balance
    */
    Report.AccountBalanceReport.prototype.getPeriodBalance = function(format) {
      var balance = Utils_.round(this.wrapped.periodBalance);
      Logger.log("balance: " + balance);
      balance = Utils_.getRepresentativeValue(balance, this.isCredit());
      Logger.log("representative: " + balance);
      if (format) {
        return Utils_.formatValue_(balance, this.decimalSeparator)
      } else {
        return balance;
      }
    }

    /**
    @param {boolean} [format] If true, balance will be formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    @returns {number} the {@link Account|account} cumulative balance
    */
    Report.AccountBalanceReport.prototype.getCumulativeBalance = function(format) {
      var balance = Utils_.round(this.wrapped.cumulativeBalance);
      balance = Utils_.getRepresentativeValue(balance, this.isCredit());
      if (format) {
        return Utils_.formatValue_(balance, this.decimalSeparator)
      } else {
        return balance;
      }
    }

    /**
    @returns the {@link Account|account} balances
    */
    Report.AccountBalanceReport.prototype.getBalances = function() {
      return this.wrapped.balances;
    }
  },








  //###################### TAG BALANCE REPORT ######################
  /**
  @class
  A TagBalanceReport stores #hashtags balances.
  */
  TagBalanceReport : function(balancePlain) {
    this.wrapped = balancePlain;

    /**
    @returns {string} the #hashtag
    */
    Report.TagBalanceReport.prototype.getName = function() {
      return this.wrapped.name;
    }

    Report.TagBalanceReport.prototype.isCredit = function() {
      return true;
    }


    /**
    @param {boolean} [format] If true, balance will be formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    @returns {number} the #hashtag period balance
    */
    Report.TagBalanceReport.prototype.getPeriodBalance = function(format) {
      var balance = Utils_.round(this.wrapped.periodBalance);
      if (format) {
        return Utils_.formatValue_(balance, this.decimalSeparator)
      } else {
        return balance;
      }
    }

    /**
    @param {boolean} [format] If true, balance will be formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    @returns {number} the #hashtag cumulative balance
    */
    Report.TagBalanceReport.prototype.getCumulativeBalance = function(format) {
      var balance = Utils_.round(this.wrapped.cumulativeBalance);
      if (format) {
        return Utils_.formatValue_(balance, this.decimalSeparator)
      } else {
        return balance;
      }
    }

    /**
    @returns the #hashtag balances
    */
    Report.TagBalanceReport.prototype.getBalances = function() {
      return this.wrapped.balances;
    }
  },







  //###################### GROUP BALANCE REPORT ######################
  /**
  @class
  A GroupBalanceReport stores {@link Group|group} balances.
  */
  GroupBalanceReport : function(groupBalancePlain, periodicity) {

    this.wrapped = groupBalancePlain;

    /**
    @returns {string} the {@link Group|group} name
    */
    Report.GroupBalanceReport.prototype.getName = function() {
      return this.wrapped.name;
    }

    /**
    @returns {boolean} Check if {@link Group|group} has credit {@link Account|accounts}
    */
    Report.GroupBalanceReport.prototype.isCredit = function() {
      return this.wrapped.credit;
    }

    /**
    @param {boolean} [format] If true, balance will be formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    @returns {number} the {@link Group|group} period balance
    */
    Report.GroupBalanceReport.prototype.getPeriodBalance = function(format) {
      var balance = Utils_.round(this.wrapped.periodBalance);
      balance = Utils_.getRepresentativeValue(balance, this.isCredit());
      if (format) {
        return Utils_.formatValue_(balance, this.decimalSeparator)
      } else {
        return balance;
      }
    }

    /**
    @param {boolean} [format] If true, balance will be formatted based on {@link Book#getDecimalSeparator|decimal separator of book}.
    @returns {number} the {@link Group|group} period balance
    */
    Report.GroupBalanceReport.prototype.getCumulativeBalance = function(format) {
      var balance = Utils_.round(this.wrapped.cumulativeBalance);
      balance = Utils_.getRepresentativeValue(balance, this.isCredit());
      if (format) {
        return Utils_.formatValue_(balance, this.decimalSeparator)
      } else {
        return balance;
      }
    }

    /**
    @returns the {@link Group|group} balances
    */
    Report.GroupBalanceReport.prototype.getBalances = function() {
      return this.wrapped.balances;
    }

    this.periodicity = periodicity;
    this.accountBalanceReports = null;

    /**
    @returns {@link BalancesDataTableBuilder}
    */
    Report.GroupBalanceReport.prototype.createDataTable = function() {
      return new BalancesDataTableBuilder(this.getAccountBalanceReports(), this.periodicity, this.decimalSeparator, this.datePattern);
    }

    /**
    @returns {Array<AccountBalanceReport>} all {@link Report.AccountBalanceReport|account balances} of this {@link Group|group}
    */
    Report.GroupBalanceReport.prototype.getAccountBalanceReports = function() {
      var accountBalances = this.wrapped.accountBalances;
      if (this.accountBalanceReports == null && accountBalances != null) {
        this.accountBalanceReports = new Array();
        for (var i = 0; i < accountBalances.length; i++) {
          var accountBalance = accountBalances[i];
          var accBalances = new Report.AccountBalanceReport(accountBalance);
          this.accountBalanceReports.push(accBalances);
        }
      }
      return this.accountBalanceReports;
    }
  },



}