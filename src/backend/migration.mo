import Map "mo:core/Map";
import Types "./types/budget";

module {
  // ---- Old types (from previous deployment, Expense without receiptUrl) ----
  type OldExpense = {
    id : Nat;
    budgetId : Nat;
    owner : Types.UserId;
    date : Text;
    amountCents : Nat;
    notes : ?Text;
    createdAt : Types.Timestamp;
    recurringTemplateId : ?Nat;
  };

  type OldStateRecord = {
    budgets : Map.Map<Nat, Types.Budget>;
    expenses : Map.Map<Nat, OldExpense>;
    recurringTemplates : Map.Map<Nat, Types.RecurringTemplate>;
    var nextBudgetId : Nat;
    var nextExpenseId : Nat;
    var nextRecurringTemplateId : Nat;
  };

  type NewStateRecord = {
    budgets : Map.Map<Nat, Types.Budget>;
    expenses : Map.Map<Nat, Types.Expense>;
    recurringTemplates : Map.Map<Nat, Types.RecurringTemplate>;
    var nextBudgetId : Nat;
    var nextExpenseId : Nat;
    var nextRecurringTemplateId : Nat;
  };

  type OldActor = { state : OldStateRecord };
  type NewActor = { state : NewStateRecord };

  public func run(old : OldActor) : NewActor {
    let expenses = old.state.expenses.map<Nat, OldExpense, Types.Expense>(
      func(_id, e) {
        { e with receiptUrl = null : ?Text }
      }
    );
    let newState : NewStateRecord = {
      budgets = old.state.budgets;
      expenses;
      recurringTemplates = old.state.recurringTemplates;
      var nextBudgetId = old.state.nextBudgetId;
      var nextExpenseId = old.state.nextExpenseId;
      var nextRecurringTemplateId = old.state.nextRecurringTemplateId;
    };
    { state = newState };
  };
};
