import BudgetLib "../lib/budget";
import Types "../types/budget";

mixin (state : BudgetLib.State) {

  // ---- Budget endpoints ----

  public shared ({ caller }) func createBudget(input : Types.BudgetInput) : async Types.Budget {
    BudgetLib.createBudget(state, caller, input);
  };

  public shared query ({ caller }) func listBudgets(year : Nat, month : Nat) : async [Types.Budget] {
    BudgetLib.listBudgets(state, caller, year, month);
  };

  public shared query ({ caller }) func getBudget(id : Nat) : async ?Types.Budget {
    BudgetLib.getBudget(state, caller, id);
  };

  public shared ({ caller }) func updateBudget(id : Nat, input : Types.BudgetInput) : async ?Types.Budget {
    BudgetLib.updateBudget(state, caller, id, input);
  };

  public shared ({ caller }) func deleteBudget(id : Nat) : async Bool {
    BudgetLib.deleteBudget(state, caller, id);
  };

  // ---- Expense endpoints ----

  public shared ({ caller }) func createExpense(input : Types.ExpenseInput) : async Types.Expense {
    BudgetLib.createExpense(state, caller, input);
  };

  public shared query ({ caller }) func listExpenses(budgetId : Nat) : async [Types.Expense] {
    BudgetLib.listExpenses(state, caller, budgetId);
  };

  public shared query ({ caller }) func getExpense(id : Nat) : async ?Types.Expense {
    BudgetLib.getExpense(state, caller, id);
  };

  public shared ({ caller }) func updateExpense(id : Nat, input : Types.ExpenseInput) : async ?Types.Expense {
    BudgetLib.updateExpense(state, caller, id, input);
  };

  public shared ({ caller }) func deleteExpense(id : Nat) : async Bool {
    BudgetLib.deleteExpense(state, caller, id);
  };

  // ---- Summary endpoint ----

  public shared query ({ caller }) func getMonthlySummary(year : Nat, month : Nat) : async Types.MonthlySummary {
    BudgetLib.getMonthlySummary(state, caller, year, month);
  };

  // ---- Recurring Template endpoints ----

  public shared ({ caller }) func createRecurringTemplate(input : Types.RecurringTemplateInput) : async Types.RecurringTemplate {
    BudgetLib.createRecurringTemplate(state, caller, input);
  };

  public shared query ({ caller }) func listRecurringTemplates(budgetId : Nat) : async [Types.RecurringTemplate] {
    BudgetLib.listRecurringTemplates(state, caller, budgetId);
  };

  public shared query ({ caller }) func getRecurringTemplate(id : Nat) : async ?Types.RecurringTemplate {
    BudgetLib.getRecurringTemplate(state, caller, id);
  };

  public shared ({ caller }) func updateRecurringTemplate(id : Nat, input : Types.RecurringTemplateInput) : async ?Types.RecurringTemplate {
    BudgetLib.updateRecurringTemplate(state, caller, id, input);
  };

  public shared ({ caller }) func deleteRecurringTemplate(id : Nat) : async Bool {
    BudgetLib.deleteRecurringTemplate(state, caller, id);
  };

  // Called on app load to auto-instantiate recurring templates for the given month.
  // Safe to call multiple times — skips templates already instantiated.
  public shared ({ caller }) func applyRecurringTemplates(year : Nat, month : Nat) : async [Types.Expense] {
    BudgetLib.applyRecurringTemplates(state, caller, year, month);
  };

  // ---- Trend / Chart endpoints ----

  // Returns total spending per month for the past `months` calendar months.
  public shared query ({ caller }) func getMonthlyTrend(months : Nat, currentYear : Nat, currentMonth : Nat) : async [Types.MonthlyTrendPoint] {
    BudgetLib.getMonthlyTrend(state, caller, months, currentYear, currentMonth);
  };

  // Returns per-budget spending vs limit per month for the past `months` calendar months.
  public shared query ({ caller }) func getCategoryTrend(budgetId : Nat, months : Nat, currentYear : Nat, currentMonth : Nat) : async [Types.CategoryTrendPoint] {
    BudgetLib.getCategoryTrend(state, caller, budgetId, months, currentYear, currentMonth);
  };

  // ---- Notes endpoints ----

  public shared ({ caller }) func createNote(title : Text, content : Text) : async Types.Note {
    BudgetLib.createNote(state, caller, title, content);
  };

  public shared query ({ caller }) func listNotes() : async [Types.Note] {
    BudgetLib.listNotes(state, caller);
  };

  public shared ({ caller }) func updateNote(id : Text, title : Text, content : Text) : async ?Types.Note {
    BudgetLib.updateNote(state, caller, id, title, content);
  };

  public shared ({ caller }) func deleteNote(id : Text) : async Bool {
    BudgetLib.deleteNote(state, caller, id);
  };

  // ---- Extra Chart endpoints ----

  // Returns daily spending totals for the given month for the caller.
  public shared query ({ caller }) func getDailySpending(year : Nat, month : Nat) : async [Types.DailySpendingPoint] {
    BudgetLib.getDailySpending(state, caller, year, month);
  };

  // Returns total spending per budget/category for the given month for the caller.
  public shared query ({ caller }) func getCategoryBreakdown(year : Nat, month : Nat) : async [Types.CategoryBreakdownPoint] {
    BudgetLib.getCategoryBreakdown(state, caller, year, month);
  };

  // ---- Search / Custom Range endpoints ----

  // Full search: filter by date range and optionally by query text, budget/category, and amount range.
  public shared query ({ caller }) func searchExpenses(
    startDate : Text,
    endDate : Text,
    queryText : ?Text,
    categoryId : ?Nat,
    minAmountCents : ?Nat,
    maxAmountCents : ?Nat,
  ) : async [Types.Expense] {
    BudgetLib.searchExpenses(state, caller, startDate, endDate, queryText, categoryId, minAmountCents, maxAmountCents);
  };

  // Simple range query: all expenses between startDate and endDate, no filters.
  public shared query ({ caller }) func getExpensesInRange(startDate : Text, endDate : Text) : async [Types.Expense] {
    BudgetLib.getExpensesInRange(state, caller, startDate, endDate);
  };

  // Category breakdown aggregated for a custom date range.
  public shared query ({ caller }) func getCategoryBreakdownForRange(startDate : Text, endDate : Text) : async [Types.CategoryBreakdownPoint] {
    BudgetLib.getCategoryBreakdownForRange(state, caller, startDate, endDate);
  };

  // ---- User Settings endpoints ----

  public shared query ({ caller }) func getUserSettings() : async Types.UserSettings {
    BudgetLib.getUserSettings(state, caller);
  };

  public shared ({ caller }) func updateUserSettings(settings : Types.UserSettings) : async Types.UserSettings {
    BudgetLib.updateUserSettings(state, caller, settings);
  };
};
