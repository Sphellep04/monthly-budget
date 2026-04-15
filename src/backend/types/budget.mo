import Common "common";

module {
  public type UserId = Common.UserId;
  public type Timestamp = Common.Timestamp;
  public type MonthKey = Common.MonthKey;

  // ---- Budget ----
  public type Budget = {
    id : Nat;
    owner : UserId;
    name : Text;
    limitCents : Nat;    // monthly spending limit stored as cents
    color : Text;        // hex color or named label
    category : Text;     // category label
    year : Nat;
    month : Nat;         // 1–12
    createdAt : Timestamp;
  };

  public type BudgetInput = {
    name : Text;
    limitCents : Nat;
    color : Text;
    category : Text;
    year : Nat;
    month : Nat;
  };

  // ---- Expense ----
  public type Expense = {
    id : Nat;
    budgetId : Nat;
    owner : UserId;
    date : Text;         // ISO date string e.g. "2024-03-15"
    amountCents : Nat;   // stored as cents
    notes : ?Text;
    receiptUrl : ?Text;  // optional object-storage URL for attached receipt
    createdAt : Timestamp;
    recurringTemplateId : ?Nat; // set when auto-generated from a template
  };

  // Used for both createExpense and updateExpense
  public type ExpenseInput = {
    budgetId : Nat;
    date : Text;
    amountCents : Nat;
    notes : ?Text;
    receiptUrl : ?Text;  // optional receipt attachment URL
  };

  // ---- Monthly summary ----
  public type BudgetSummary = {
    budget : Budget;
    totalSpentCents : Nat;
    remainingCents : Int; // can be negative (over budget)
  };

  public type MonthlySummary = {
    year : Nat;
    month : Nat;
    totalBudgetCents : Nat;
    totalSpentCents : Nat;
    budgets : [BudgetSummary];
  };

  // ---- Recurring Expense Templates ----
  public type RecurringTemplate = {
    id : Nat;
    owner : UserId;
    budgetId : Nat;
    name : Text;
    amountCents : Nat;
    dayOfMonth : Nat;    // 1–31; clamped to last day if month is shorter
    notes : ?Text;
    createdAt : Timestamp;
  };

  public type RecurringTemplateInput = {
    budgetId : Nat;
    name : Text;
    amountCents : Nat;
    dayOfMonth : Nat;
    notes : ?Text;
  };

  // ---- Chart / Trend types ----

  // Total spending across all budgets for a given month
  public type MonthlyTrendPoint = {
    year : Nat;
    month : Nat;
    totalSpentCents : Nat;
  };

  // Per-budget spending vs limit for a given month
  public type CategoryTrendPoint = {
    year : Nat;
    month : Nat;
    budgetId : Nat;
    budgetName : Text;
    spentCents : Nat;
    limitCents : Nat;
  };
};
