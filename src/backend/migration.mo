import Map "mo:core/Map";
import Types "types/budget";

module {
  // Old stable state shape (from prior deployment, matching backend.most)
  type OldAppState = {
    budgets : Map.Map<Nat, Types.Budget>;
    expenses : Map.Map<Nat, Types.Expense>;
    recurringTemplates : Map.Map<Nat, Types.RecurringTemplate>;
    notes : Map.Map<Text, Types.Note>;
    userSettings : Map.Map<Types.UserId, Types.UserSettings>;
    var nextBudgetId : Nat;
    var nextExpenseId : Nat;
    var nextRecurringTemplateId : Nat;
    var nextNoteId : Nat;
  };

  type OldActor = {
    state : OldAppState;
  };

  // New stable state shape (current deployment)
  type NewAppState = {
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

  type NewActor = {
    state : NewAppState;
  };

  public func run(old : OldActor) : NewActor {
    {
      state = {
        budgets = old.state.budgets;
        expenses = old.state.expenses;
        recurringTemplates = old.state.recurringTemplates;
        notes = old.state.notes;
        userSettings = old.state.userSettings;
        billPayments = Map.empty<Text, Types.BillPayment>();
        budgetTemplates = Map.empty<Text, Types.BudgetTemplate>();
        var nextBudgetId = old.state.nextBudgetId;
        var nextExpenseId = old.state.nextExpenseId;
        var nextRecurringTemplateId = old.state.nextRecurringTemplateId;
        var nextNoteId = old.state.nextNoteId;
        var nextBillPaymentId = 1;
        var nextBudgetTemplateId = 1;
      };
    };
  };
};
