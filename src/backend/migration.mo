import Map "mo:core/Map";
import Types "./types/budget";
import BudgetLib "./lib/budget";

module {
  // Old types from previous deployment (backend.most)
  type OldExpense = {
    id : Nat;
    budgetId : Nat;
    owner : Principal;
    date : Text;
    amountCents : Nat;
    notes : ?Text;
    createdAt : Int;
  };

  type OldState = {
    budgets : Map.Map<Nat, Types.Budget>;
    expenses : Map.Map<Nat, OldExpense>;
    var nextBudgetId : Nat;
    var nextExpenseId : Nat;
  };

  type OldActor = {
    state : OldState;
  };

  type NewActor = {
    state : BudgetLib.State;
  };

  public func run(old : OldActor) : NewActor {
    // Add recurringTemplateId = null to every existing expense
    let newExpenses = old.state.expenses.map<Nat, OldExpense, Types.Expense>(
      func(_id, e) {
        { e with recurringTemplateId = null };
      }
    );
    let newState : BudgetLib.State = {
      budgets = old.state.budgets;
      expenses = newExpenses;
      recurringTemplates = Map.empty<Nat, Types.RecurringTemplate>();
      var nextBudgetId = old.state.nextBudgetId;
      var nextExpenseId = old.state.nextExpenseId;
      var nextRecurringTemplateId = 1;
    };
    { state = newState };
  };
};
