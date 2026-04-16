import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Types "../types/budget";

module {
  public type State = {
    budgets : Map.Map<Nat, Types.Budget>;
    expenses : Map.Map<Nat, Types.Expense>;
    recurringTemplates : Map.Map<Nat, Types.RecurringTemplate>;
    notes : Map.Map<Text, Types.Note>;
    userSettings : Map.Map<Types.UserId, Types.UserSettings>;
    billPayments : Map.Map<Text, Types.BillPayment>;
    budgetTemplates : Map.Map<Text, Types.BudgetTemplate>;
    var nextBudgetId : Nat;
    var nextExpenseId : Nat;
    var nextRecurringTemplateId : Nat;
    var nextNoteId : Nat;
    var nextBillPaymentId : Nat;
    var nextBudgetTemplateId : Nat;
  };

  public func newState() : State {
    {
      budgets = Map.empty<Nat, Types.Budget>();
      expenses = Map.empty<Nat, Types.Expense>();
      recurringTemplates = Map.empty<Nat, Types.RecurringTemplate>();
      notes = Map.empty<Text, Types.Note>();
      userSettings = Map.empty<Types.UserId, Types.UserSettings>();
      billPayments = Map.empty<Text, Types.BillPayment>();
      budgetTemplates = Map.empty<Text, Types.BudgetTemplate>();
      var nextBudgetId = 1;
      var nextExpenseId = 1;
      var nextRecurringTemplateId = 1;
      var nextNoteId = 1;
      var nextBillPaymentId = 1;
      var nextBudgetTemplateId = 1;
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
    let id = state.nextExpenseId;
    state.nextExpenseId += 1;
    let expense : Types.Expense = {
      id;
      budgetId = input.budgetId;
      owner = caller;
      date = input.date;
      amountCents = input.amountCents;
      notes = input.notes;
      receiptUrl = input.receiptUrl;
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
        let updated : Types.Expense = {
          existing with
          budgetId = input.budgetId;
          date = input.date;
          amountCents = input.amountCents;
          notes = input.notes;
          receiptUrl = input.receiptUrl;
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
          receiptUrl = null;
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

  // ---- Notes CRUD ----

  public func createNote(
    state : State,
    caller : Types.UserId,
    title : Text,
    content : Text,
  ) : Types.Note {
    let id = caller.toText() # "-" # state.nextNoteId.toText();
    state.nextNoteId += 1;
    let now = Time.now();
    let note : Types.Note = {
      id;
      userId = caller;
      title;
      content;
      createdAt = now;
      updatedAt = now;
    };
    state.notes.add(id, note);
    note;
  };

  public func listNotes(
    state : State,
    caller : Types.UserId,
  ) : [Types.Note] {
    let results = List.empty<Types.Note>();
    for ((_, note) in state.notes.entries()) {
      if (Principal.equal(note.userId, caller)) {
        results.add(note);
      };
    };
    results.toArray();
  };

  public func updateNote(
    state : State,
    caller : Types.UserId,
    id : Text,
    title : Text,
    content : Text,
  ) : ?Types.Note {
    switch (state.notes.get(id)) {
      case (?existing) {
        if (not Principal.equal(existing.userId, caller)) { return null };
        let updated : Types.Note = {
          existing with
          title;
          content;
          updatedAt = Time.now();
        };
        state.notes.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteNote(
    state : State,
    caller : Types.UserId,
    id : Text,
  ) : Bool {
    switch (state.notes.get(id)) {
      case (?note) {
        if (not Principal.equal(note.userId, caller)) { return false };
        state.notes.remove(id);
        true;
      };
      case null { false };
    };
  };

  // ---- Daily Spending Query ----

  // Returns total spending per day for the given month for the caller.
  public func getDailySpending(
    state : State,
    caller : Types.UserId,
    year : Nat,
    month : Nat,
  ) : [Types.DailySpendingPoint] {
    let monthText = if (month < 10) { "0" # month.toText() } else { month.toText() };
    let prefix = year.toText() # "-" # monthText # "-";
    // Accumulate per-day totals using a Map keyed by day number
    let dayTotals = Map.empty<Nat, Int>();
    for ((_, exp) in state.expenses.entries()) {
      if (Principal.equal(exp.owner, caller) and exp.date.startsWith(#text prefix)) {
        // Extract day from date string "YYYY-MM-DD"
        let parts = exp.date.split(#char '-');
        let partsArr = parts.toArray();
        if (partsArr.size() == 3) {
          switch (Nat.fromText(partsArr[2])) {
            case (?day) {
              let current : Int = switch (dayTotals.get(day)) {
                case (?v) { v };
                case null { 0 };
              };
              dayTotals.add(day, current + exp.amountCents.toInt());
            };
            case null {};
          };
        };
      };
    };
    let results = List.empty<Types.DailySpendingPoint>();
    for ((day, amountCents) in dayTotals.entries()) {
      results.add({ day; amountCents });
    };
    results.toArray();
  };

  // ---- Category Breakdown Query ----

  // Returns total spending per budget/category for the given month for the caller.
  public func getCategoryBreakdown(
    state : State,
    caller : Types.UserId,
    year : Nat,
    month : Nat,
  ) : [Types.CategoryBreakdownPoint] {
    let monthText = if (month < 10) { "0" # month.toText() } else { month.toText() };
    let prefix = year.toText() # "-" # monthText # "-";

    // Get all caller budgets for this month
    let callerBudgets = listBudgets(state, caller, year, month);

    let results = List.empty<Types.CategoryBreakdownPoint>();
    for (budget in callerBudgets.values()) {
      var spent : Int = 0;
      for ((_, exp) in state.expenses.entries()) {
        if (
          Principal.equal(exp.owner, caller) and
          exp.budgetId == budget.id and
          exp.date.startsWith(#text prefix)
        ) {
          spent += exp.amountCents.toInt();
        };
      };
      results.add({
        budgetId = budget.id.toText();
        name = budget.name;
        amountCents = spent;
        color = budget.color;
      });
    };
    results.toArray();
  };

  // ---- Search / Custom Range Queries ----

  // Returns all expenses in the given ISO date range [startDate, endDate] for the caller,
  // with optional filters: text query (notes or budget name), categoryId (matches budget.category),
  // minAmountCents, maxAmountCents.
  public func searchExpenses(
    state : State,
    caller : Types.UserId,
    startDate : Text,
    endDate : Text,
    queryText : ?Text,
    categoryId : ?Nat,
    minAmountCents : ?Nat,
    maxAmountCents : ?Nat,
  ) : [Types.Expense] {
    let results = List.empty<Types.Expense>();
    let lowerQuery = switch (queryText) {
      case (?q) { ?(q.toLower()) };
      case null { null };
    };

    for ((_, exp) in state.expenses.entries()) {
      if (not Principal.equal(exp.owner, caller)) {}
      else if (exp.date < startDate or exp.date > endDate) {}
      else {
        // Amount range filters
        let passesMin = switch (minAmountCents) {
          case (?min) { exp.amountCents >= min };
          case null { true };
        };
        let passesMax = switch (maxAmountCents) {
          case (?max) { exp.amountCents <= max };
          case null { true };
        };

        if (passesMin and passesMax) {
          // Category filter: look up the budget and match its category field as a Nat if possible
          let passesCat = switch (categoryId) {
            case (?catId) {
              switch (state.budgets.get(exp.budgetId)) {
                case (?budget) {
                  // Compare budget.id (the category identifier linking budgets) — requirement says
                  // "categoryId maps to a Budget which has category field". We interpret categoryId
                  // as the budget ID (budgetId == categoryId).
                  exp.budgetId == catId;
                };
                case null { false };
              };
            };
            case null { true };
          };

          if (passesCat) {
            // Text query filter: check notes and budget name
            let passesQuery = switch (lowerQuery) {
              case (?lq) {
                // Check notes
                let notesMatch = switch (exp.notes) {
                  case (?n) { n.toLower().contains(#text lq) };
                  case null { false };
                };
                // Check budget name
                let nameMatch = switch (state.budgets.get(exp.budgetId)) {
                  case (?budget) { budget.name.toLower().contains(#text lq) };
                  case null { false };
                };
                notesMatch or nameMatch;
              };
              case null { true };
            };

            if (passesQuery) {
              results.add(exp);
            };
          };
        };
      };
    };
    results.toArray();
  };

  // Returns all expenses in the given ISO date range [startDate, endDate] for the caller (no additional filters).
  public func getExpensesInRange(
    state : State,
    caller : Types.UserId,
    startDate : Text,
    endDate : Text,
  ) : [Types.Expense] {
    let results = List.empty<Types.Expense>();
    for ((_, exp) in state.expenses.entries()) {
      if (
        Principal.equal(exp.owner, caller) and
        exp.date >= startDate and
        exp.date <= endDate
      ) {
        results.add(exp);
      };
    };
    results.toArray();
  };

  // Returns aggregated spending per budget/category for the given date range for the caller.
  public func getCategoryBreakdownForRange(
    state : State,
    caller : Types.UserId,
    startDate : Text,
    endDate : Text,
  ) : [Types.CategoryBreakdownPoint] {
    // Accumulate per-budget spending in a Map keyed by budgetId
    let budgetTotals = Map.empty<Nat, Int>();

    for ((_, exp) in state.expenses.entries()) {
      if (
        Principal.equal(exp.owner, caller) and
        exp.date >= startDate and
        exp.date <= endDate
      ) {
        let current : Int = switch (budgetTotals.get(exp.budgetId)) {
          case (?v) { v };
          case null { 0 };
        };
        budgetTotals.add(exp.budgetId, current + exp.amountCents.toInt());
      };
    };

    // Build result points with budget metadata
    let results = List.empty<Types.CategoryBreakdownPoint>();
    for ((budgetId, amountCents) in budgetTotals.entries()) {
      switch (state.budgets.get(budgetId)) {
        case (?budget) {
          if (Principal.equal(budget.owner, caller)) {
            results.add({
              budgetId = budgetId.toText();
              name = budget.name;
              amountCents;
              color = budget.color;
            });
          };
        };
        case null {};
      };
    };
    results.toArray();
  };

  // ---- User Settings ----

  let defaultSettings : Types.UserSettings = { alertThresholdPercent = 80 };

  public func getUserSettings(
    state : State,
    caller : Types.UserId,
  ) : Types.UserSettings {
    switch (state.userSettings.get(caller)) {
      case (?s) { s };
      case null { defaultSettings };
    };
  };

  public func updateUserSettings(
    state : State,
    caller : Types.UserId,
    settings : Types.UserSettings,
  ) : Types.UserSettings {
    let clamped : Types.UserSettings = {
      alertThresholdPercent = if (settings.alertThresholdPercent < 50) { 50 }
        else if (settings.alertThresholdPercent > 100) { 100 }
        else { settings.alertThresholdPercent };
    };
    state.userSettings.add(caller, clamped);
    clamped;
  };

  // ---- Bill Payment CRUD ----

  public func createBillPayment(
    state : State,
    caller : Types.UserId,
    input : Types.BillPaymentInput,
  ) : Types.BillPayment {
    let id = caller.toText() # "-bp-" # state.nextBillPaymentId.toText();
    state.nextBillPaymentId += 1;
    let payment : Types.BillPayment = {
      id;
      owner = caller;
      recurringTemplateId = input.recurringTemplateId;
      year = input.year;
      month = input.month;
      dueDay = input.dueDay;
      paidDate = input.paidDate;
      paidAmountCents = input.paidAmountCents;
      notes = input.notes;
    };
    state.billPayments.add(id, payment);
    payment;
  };

  public func getBillPayment(
    state : State,
    caller : Types.UserId,
    id : Text,
  ) : ?Types.BillPayment {
    switch (state.billPayments.get(id)) {
      case (?payment) {
        if (Principal.equal(payment.owner, caller)) { ?payment } else { null };
      };
      case null { null };
    };
  };

  public func listBillPayments(
    state : State,
    caller : Types.UserId,
    year : Nat,
    month : Nat,
  ) : [Types.BillPayment] {
    let results = List.empty<Types.BillPayment>();
    for ((_, payment) in state.billPayments.entries()) {
      if (
        Principal.equal(payment.owner, caller) and
        payment.year == year and
        payment.month == month
      ) {
        results.add(payment);
      };
    };
    // Sort by dueDay ascending
    results.sortInPlace(func(a, b) { Nat.compare(a.dueDay, b.dueDay) });
    results.toArray();
  };

  public func updateBillPayment(
    state : State,
    caller : Types.UserId,
    id : Text,
    input : Types.BillPaymentInput,
  ) : ?Types.BillPayment {
    switch (state.billPayments.get(id)) {
      case (?existing) {
        if (not Principal.equal(existing.owner, caller)) { return null };
        let updated : Types.BillPayment = {
          existing with
          recurringTemplateId = input.recurringTemplateId;
          year = input.year;
          month = input.month;
          dueDay = input.dueDay;
          paidDate = input.paidDate;
          paidAmountCents = input.paidAmountCents;
          notes = input.notes;
        };
        state.billPayments.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteBillPayment(
    state : State,
    caller : Types.UserId,
    id : Text,
  ) : Bool {
    switch (state.billPayments.get(id)) {
      case (?payment) {
        if (not Principal.equal(payment.owner, caller)) { return false };
        state.billPayments.remove(id);
        true;
      };
      case null { false };
    };
  };

  // ---- Budget Template CRUD ----

  public func createBudgetTemplate(
    state : State,
    caller : Types.UserId,
    input : Types.BudgetTemplateInput,
  ) : Types.BudgetTemplate {
    let id = caller.toText() # "-bt-" # state.nextBudgetTemplateId.toText();
    state.nextBudgetTemplateId += 1;
    let template : Types.BudgetTemplate = {
      id;
      owner = caller;
      name = input.name;
      createdAt = Time.now();
      categories = input.categories;
    };
    state.budgetTemplates.add(id, template);
    template;
  };

  public func listBudgetTemplates(
    state : State,
    caller : Types.UserId,
  ) : [Types.BudgetTemplate] {
    let results = List.empty<Types.BudgetTemplate>();
    for ((_, template) in state.budgetTemplates.entries()) {
      if (Principal.equal(template.owner, caller)) {
        results.add(template);
      };
    };
    // Sort by createdAt descending (newest first)
    results.sortInPlace(func(a, b) { Int.compare(b.createdAt, a.createdAt) });
    results.toArray();
  };

  public func getBudgetTemplate(
    state : State,
    caller : Types.UserId,
    id : Text,
  ) : ?Types.BudgetTemplate {
    switch (state.budgetTemplates.get(id)) {
      case (?template) {
        if (Principal.equal(template.owner, caller)) { ?template } else { null };
      };
      case null { null };
    };
  };

  public func updateBudgetTemplate(
    state : State,
    caller : Types.UserId,
    id : Text,
    input : Types.BudgetTemplateInput,
  ) : ?Types.BudgetTemplate {
    switch (state.budgetTemplates.get(id)) {
      case (?existing) {
        if (not Principal.equal(existing.owner, caller)) { return null };
        let updated : Types.BudgetTemplate = {
          existing with
          name = input.name;
          categories = input.categories;
        };
        state.budgetTemplates.add(id, updated);
        ?updated;
      };
      case null { null };
    };
  };

  public func deleteBudgetTemplate(
    state : State,
    caller : Types.UserId,
    id : Text,
  ) : Bool {
    switch (state.budgetTemplates.get(id)) {
      case (?template) {
        if (not Principal.equal(template.owner, caller)) { return false };
        state.budgetTemplates.remove(id);
        true;
      };
      case null { false };
    };
  };

  // Creates Budget records for each category in the template for the given year/month.
  // Returns the list of newly created budgets.
  public func applyBudgetTemplate(
    state : State,
    caller : Types.UserId,
    templateId : Text,
    year : Nat,
    month : Nat,
  ) : [Types.Budget] {
    let template = switch (state.budgetTemplates.get(templateId)) {
      case (?t) {
        if (not Principal.equal(t.owner, caller)) {
          return [];
        };
        t;
      };
      case null { return [] };
    };
    let created = List.empty<Types.Budget>();
    for (cat in template.categories.values()) {
      let input : Types.BudgetInput = {
        name = cat.name;
        limitCents = cat.limitCents;
        color = cat.color;
        category = cat.category;
        year;
        month;
      };
      let budget = createBudget(state, caller, input);
      created.add(budget);
    };
    created.toArray();
  };

};
