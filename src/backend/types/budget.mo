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

  // ---- Notes ----
  public type Note = {
    id : Text;
    userId : Principal;
    title : Text;
    content : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  // ---- User Settings ----
  public type UserSettings = {
    alertThresholdPercent : Nat; // 50–100; default 80
  };

  // ---- Bill Payments ----
  public type BillPayment = {
    id : Text;
    owner : UserId;
    recurringTemplateId : Text;
    year : Nat;
    month : Nat;
    dueDay : Nat;
    paidDate : ?Timestamp;
    paidAmountCents : ?Nat;
    notes : ?Text;
  };

  public type BillPaymentInput = {
    recurringTemplateId : Text;
    year : Nat;
    month : Nat;
    dueDay : Nat;
    paidDate : ?Timestamp;
    paidAmountCents : ?Nat;
    notes : ?Text;
  };

  // ---- Budget Templates ----
  public type BudgetTemplateCategory = {
    name : Text;
    limitCents : Nat;
    color : Text;
    category : Text;
  };

  public type BudgetTemplate = {
    id : Text;
    owner : UserId;
    name : Text;
    createdAt : Timestamp;
    categories : [BudgetTemplateCategory];
  };

  public type BudgetTemplateInput = {
    name : Text;
    categories : [BudgetTemplateCategory];
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

  // Per-budget spending for a given month (category breakdown)
  public type CategoryBreakdownPoint = {
    budgetId : Text;
    name : Text;
    amountCents : Int;
    color : Text;
  };

  // Daily spending totals for a given month
  public type DailySpendingPoint = {
    day : Nat;
    amountCents : Int;
  };
};
