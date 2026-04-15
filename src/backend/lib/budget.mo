import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Types "../types/budget";

module {
  public type State = {
    budgets : Map.Map<Nat, Types.Budget>;
    expenses : Map.Map<Nat, Types.Expense>;
    recurringTemplates : Map.Map<Nat, Types.RecurringTemplate>;
    var nextBudgetId : Nat;
    var nextExpenseId : Nat;
    var nextRecurringTemplateId : Nat;
  };

  public func newState() : State {
    {
      budgets = Map.empty<Nat, Types.Budget>();
      expenses = Map.empty<Nat, Types.Expense>();
      recurringTemplates = Map.empty<Nat, Types.RecurringTemplate>();
      var nextBudgetId = 1;
      var nextExpenseId = 1;
      var nextRecurringTemplateId = 1;
    };
  };

  // ---- Budget CRUD ----

  public func createBudget(
    state : State,
    caller : Types.UserId,
    input : Types.BudgetInput,
  ) : Types.Budget {
    let id = state.nextBudgetId;
    state.nextBudgetId += 1;
    let budget : Types.Budget = {
      id;
      owner = caller;
      name = input.name;
      limitCents = input.limitCents;
      color = input.color;
      category = input.category;
      year = input.year;
      month = input.month;
      createdAt = Time.now();
    };
    state.budgets.add(id, budget);
    budget;
  };

  public func listBudgets(
    state : State,
    caller : Types.UserId,
    year : Nat,
    month : Nat,
  ) : [Types.Budget] {
    let results = List.empty<Types.Budget>();
    for ((_, budget) in state.budgets.entries()) {
      if (
        Principal.equal(budget.owner, caller) and
        budget.year == year and
        budget.month == month
      ) {
        results.add(budget);
      };
    };
    results.toArray();
  };

  public func getBudget(
    state : State,
    caller : Types.UserId,
    id : Nat,
  ) : ?Types.Budget {
    switch (state.budgets.get(id)) {
      case (?budget) {
        if (Principal.equal(budget.owner, caller)) { ?budget } else { null };
      };
      case null { null };
    };
  };

  public func updateBudget(
    state : State,
    caller : Types.UserId,
    id : Nat,
    input : Types.BudgetInput,
  ) : ?Types.Budget {
    switch (state.budgets.get(id)) {
      case (?existing) {
        if (not Principal.equal(existing.owner, caller)) { return null };
        let updated : Types.Budget = {
          existing with
          name = input.name;
          limitCents = input.limitCents;
          color = input.color;
          category = input.category;
          year = input.year;
          month = input.month;
        };
        state.budgets.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteBudget(
    state : State,
    caller : Types.UserId,
    id : Nat,
  ) : Bool {
    switch (state.budgets.get(id)) {
      case (?budget) {
        if (not Principal.equal(budget.owner, caller)) { return false };
        state.budgets.remove(id);
        // Also remove all expenses belonging to this budget
        let toRemove = List.empty<Nat>();
        for ((expId, exp) in state.expenses.entries()) {
          if (exp.budgetId == id) { toRemove.add(expId) };
        };
        for (expId in toRemove.values()) {
          state.expenses.remove(expId);
        };
        // Also remove recurring templates for this budget
        let templatesToRemove = List.empty<Nat>();
        for ((tId, t) in state.recurringTemplates.entries()) {
          if (t.budgetId == id) { templatesToRemove.add(tId) };
        };
        for (tId in templatesToRemove.values()) {
          state.recurringTemplates.remove(tId);
        };
        true;
      };
      case null { false };
    };
  };

  // ---- Expense CRUD ----

  public func createExpense(
    state : State,
    caller : Types.UserId,
    input : Types.ExpenseInput,
  ) : Types.Expense {
    // Verify the budget belongs to the caller
    switch (state.budgets.get(input.budgetId)) {
      case null { return { id = 0; budgetId = 0; owner = caller; date = ""; amountCents = 0; notes = null; createdAt = 0; recurringTemplateId = null } };
      case (?budget) {
        if (not Principal.equal(budget.owner, caller)) {
          return { id = 0; budgetId = 0; owner = caller; date = ""; amountCents = 0; notes = null; createdAt = 0; recurringTemplateId = null };
        };
      };
    };
    let id = state.nextExpenseId;
    state.nextExpenseId += 1;
    let expense : Types.Expense = {
      id;
      budgetId = input.budgetId;
      owner = caller;
      date = input.date;
      amountCents = input.amountCents;
      notes = input.notes;
      createdAt = Time.now();
      recurringTemplateId = null;
    };
    state.expenses.add(id, expense);
    expense;
  };

  public func listExpenses(
    state : State,
    caller : Types.UserId,
    budgetId : Nat,
  ) : [Types.Expense] {
    let results = List.empty<Types.Expense>();
    for ((_, expense) in state.expenses.entries()) {
      if (
        Principal.equal(expense.owner, caller) and
        expense.budgetId == budgetId
      ) {
        results.add(expense);
      };
    };
    results.toArray();
  };

  public func getExpense(
    state : State,
    caller : Types.UserId,
    id : Nat,
  ) : ?Types.Expense {
    switch (state.expenses.get(id)) {
      case (?expense) {
        if (Principal.equal(expense.owner, caller)) { ?expense } else { null };
      };
      case null { null };
    };
  };

  public func updateExpense(
    state : State,
    caller : Types.UserId,
    id : Nat,
    input : Types.ExpenseInput,
  ) : ?Types.Expense {
    switch (state.expenses.get(id)) {
      case (?existing) {
        if (not Principal.equal(existing.owner, caller)) { return null };
        // Verify new budgetId belongs to caller if changed
        if (existing.budgetId != input.budgetId) {
          switch (state.budgets.get(input.budgetId)) {
            case null { return null };
            case (?budget) {
              if (not Principal.equal(budget.owner, caller)) { return null };
            };
          };
        };
        let updated : Types.Expense = {
          existing with
          budgetId = input.budgetId;
          date = input.date;
          amountCents = input.amountCents;
          notes = input.notes;
        };
        state.expenses.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteExpense(
    state : State,
    caller : Types.UserId,
    id : Nat,
  ) : Bool {
    switch (state.expenses.get(id)) {
      case (?expense) {
        if (not Principal.equal(expense.owner, caller)) { return false };
        state.expenses.remove(id);
        true;
      };
      case null { false };
    };
  };

  // ---- Summary / Queries ----

  public func getMonthlySummary(
    state : State,
    caller : Types.UserId,
    year : Nat,
    month : Nat,
  ) : Types.MonthlySummary {
    let callerBudgets = listBudgets(state, caller, year, month);
    let summaries = List.empty<Types.BudgetSummary>();
    var totalBudgetCents : Nat = 0;
    var totalSpentCents : Nat = 0;

    for (budget in callerBudgets.values()) {
      let expenses = listExpenses(state, caller, budget.id);
      var spent : Nat = 0;
      for (exp in expenses.values()) {
        spent += exp.amountCents;
      };
      let remaining : Int = budget.limitCents.toInt() - spent.toInt();
      summaries.add({
        budget;
        totalSpentCents = spent;
        remainingCents = remaining;
      });
      totalBudgetCents += budget.limitCents;
      totalSpentCents += spent;
    };

    {
      year;
      month;
      totalBudgetCents;
      totalSpentCents;
      budgets = summaries.toArray();
    };
  };

  // ---- Recurring Template CRUD ----

  public func createRecurringTemplate(
    state : State,
    caller : Types.UserId,
    input : Types.RecurringTemplateInput,
  ) : Types.RecurringTemplate {
    let id = state.nextRecurringTemplateId;
    state.nextRecurringTemplateId += 1;
    let template : Types.RecurringTemplate = {
      id;
      owner = caller;
      budgetId = input.budgetId;
      name = input.name;
      amountCents = input.amountCents;
      dayOfMonth = input.dayOfMonth;
      notes = input.notes;
      createdAt = Time.now();
    };
    state.recurringTemplates.add(id, template);
    template;
  };

  public func listRecurringTemplates(
    state : State,
    caller : Types.UserId,
    budgetId : Nat,
  ) : [Types.RecurringTemplate] {
    let results = List.empty<Types.RecurringTemplate>();
    for ((_, t) in state.recurringTemplates.entries()) {
      if (Principal.equal(t.owner, caller) and t.budgetId == budgetId) {
        results.add(t);
      };
    };
    results.toArray();
  };

  public func getRecurringTemplate(
    state : State,
    caller : Types.UserId,
    id : Nat,
  ) : ?Types.RecurringTemplate {
    switch (state.recurringTemplates.get(id)) {
      case (?t) {
        if (Principal.equal(t.owner, caller)) { ?t } else { null };
      };
      case null { null };
    };
  };

  public func updateRecurringTemplate(
    state : State,
    caller : Types.UserId,
    id : Nat,
    input : Types.RecurringTemplateInput,
  ) : ?Types.RecurringTemplate {
    switch (state.recurringTemplates.get(id)) {
      case (?existing) {
        if (not Principal.equal(existing.owner, caller)) { return null };
        let updated : Types.RecurringTemplate = {
          existing with
          budgetId = input.budgetId;
          name = input.name;
          amountCents = input.amountCents;
          dayOfMonth = input.dayOfMonth;
          notes = input.notes;
        };
        state.recurringTemplates.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteRecurringTemplate(
    state : State,
    caller : Types.UserId,
    id : Nat,
  ) : Bool {
    switch (state.recurringTemplates.get(id)) {
      case (?t) {
        if (not Principal.equal(t.owner, caller)) { return false };
        state.recurringTemplates.remove(id);
        true;
      };
      case null { false };
    };
  };

  // Apply all recurring templates for the caller for the given month,
  // creating expenses for templates not yet instantiated this month.
  // Returns the list of newly created expenses.
  public func applyRecurringTemplates(
    state : State,
    caller : Types.UserId,
    year : Nat,
    month : Nat,
  ) : [Types.Expense] {
    // Collect all templates owned by caller
    let callerTemplates = List.empty<Types.RecurringTemplate>();
    for ((_, t) in state.recurringTemplates.entries()) {
      if (Principal.equal(t.owner, caller)) {
        callerTemplates.add(t);
      };
    };

    // Build prefix string for the month to match expense dates "YYYY-MM-"
    let yearText = year.toText();
    let monthText = if (month < 10) { "0" # month.toText() } else { month.toText() };
    let monthPrefix = yearText # "-" # monthText # "-";

    // For each template, check if an expense for it already exists this month
    let created = List.empty<Types.Expense>();
    for (template in callerTemplates.values()) {
      // Check if expense with this templateId already exists this month
      let alreadyExists = state.expenses.any(func(_id, exp) {
        switch (exp.recurringTemplateId) {
          case (?tid) {
            tid == template.id and
            Principal.equal(exp.owner, caller) and
            exp.date.startsWith(#text monthPrefix)
          };
          case null { false };
        };
      });

      if (not alreadyExists) {
        // Clamp day to valid range for the month
        let maxDay = daysInMonth(year, month);
        let day = if (template.dayOfMonth > maxDay) { maxDay } else { template.dayOfMonth };
        let dayText = if (day < 10) { "0" # day.toText() } else { day.toText() };
        let date = yearText # "-" # monthText # "-" # dayText;

        let id = state.nextExpenseId;
        state.nextExpenseId += 1;
        let expense : Types.Expense = {
          id;
          budgetId = template.budgetId;
          owner = caller;
          date;
          amountCents = template.amountCents;
          notes = template.notes;
          createdAt = Time.now();
          recurringTemplateId = ?template.id;
        };
        state.expenses.add(id, expense);
        created.add(expense);
      };
    };
    created.toArray();
  };

  // Helper: number of days in a given month (handles leap years)
  func daysInMonth(year : Nat, month : Nat) : Nat {
    switch (month) {
      case 1 { 31 };
      case 2 {
        // Leap year: divisible by 4, except centuries unless also divisible by 400
        if (year % 400 == 0) { 29 }
        else if (year % 100 == 0) { 28 }
        else if (year % 4 == 0) { 29 }
        else { 28 };
      };
      case 3 { 31 };
      case 4 { 30 };
      case 5 { 31 };
      case 6 { 30 };
      case 7 { 31 };
      case 8 { 31 };
      case 9 { 30 };
      case 10 { 31 };
      case 11 { 30 };
      case 12 { 31 };
      case _ { 31 };
    };
  };

  // Helper: compute (year, month) offset by `offset` months back from (year, month)
  func monthOffset(year : Nat, month : Nat, offset : Nat) : (Nat, Nat) {
    // Convert to total months from epoch, subtract offset, convert back
    let total : Int = year.toInt() * 12 + (month.toInt() - 1) - offset.toInt();
    let y : Nat = (total / 12).toNat();
    let m : Nat = (total % 12).toNat() + 1;
    (y, m);
  };

  // ---- Trend / Chart Queries ----

  // Returns total spending per month for the past `months` calendar months (most recent last).
  public func getMonthlyTrend(
    state : State,
    caller : Types.UserId,
    months : Nat,
    currentYear : Nat,
    currentMonth : Nat,
  ) : [Types.MonthlyTrendPoint] {
    if (months == 0) { return [] };
    // Build list of (year, month) pairs sorted oldest-first
    let points = List.empty<Types.MonthlyTrendPoint>();
    var i : Nat = months - 1;
    // We iterate from oldest (months-1 ago) to newest (0 ago)
    label trendLoop while (true) {
      let (y, m) = monthOffset(currentYear, currentMonth, i);
      // Sum all expenses in this month across all caller budgets
      var total : Nat = 0;
      for ((_, exp) in state.expenses.entries()) {
        if (Principal.equal(exp.owner, caller)) {
          // Check if expense date falls in this year/month
          let monthText = if (m < 10) { "0" # m.toText() } else { m.toText() };
          let prefix = y.toText() # "-" # monthText # "-";
          if (exp.date.startsWith(#text prefix)) {
            total += exp.amountCents;
          };
        };
      };
      points.add({ year = y; month = m; totalSpentCents = total });
      if (i == 0) { break trendLoop };
      i -= 1;
    };
    points.toArray();
  };

  // Returns per-budget spending vs limit per month for the past `months` calendar months.
  public func getCategoryTrend(
    state : State,
    caller : Types.UserId,
    budgetId : Nat,
    months : Nat,
    currentYear : Nat,
    currentMonth : Nat,
  ) : [Types.CategoryTrendPoint] {
    if (months == 0) { return [] };
    // Verify the budget belongs to the caller
    let budgetName = switch (state.budgets.get(budgetId)) {
      case (?b) {
        if (not Principal.equal(b.owner, caller)) { return [] };
        b.name;
      };
      case null { return [] };
    };

    let points = List.empty<Types.CategoryTrendPoint>();
    var i : Nat = months - 1;
    label categoryLoop while (true) {
      let (y, m) = monthOffset(currentYear, currentMonth, i);
      // Find the budget entry for this specific year/month (budgets are month-scoped)
      let limitCents : Nat = switch (
        state.budgets.entries().find(func((_, b)) {
          b.id == budgetId and b.year == y and b.month == m and Principal.equal(b.owner, caller)
        })
      ) {
        case (?(_, b)) { b.limitCents };
        case null {
          // Use the original budget's limit as fallback
          switch (state.budgets.get(budgetId)) {
            case (?b) { b.limitCents };
            case null { 0 };
          };
        };
      };

      // Sum expenses for this budget in this month
      var spent : Nat = 0;
      for ((_, exp) in state.expenses.entries()) {
        if (exp.budgetId == budgetId and Principal.equal(exp.owner, caller)) {
          let monthText = if (m < 10) { "0" # m.toText() } else { m.toText() };
          let prefix = y.toText() # "-" # monthText # "-";
          if (exp.date.startsWith(#text prefix)) {
            spent += exp.amountCents;
          };
        };
      };

      points.add({
        year = y;
        month = m;
        budgetId;
        budgetName;
        spentCents = spent;
        limitCents;
      });
      if (i == 0) { break categoryLoop };
      i -= 1;
    };
    points.toArray();
  };
};
