import BudgetLib "lib/budget";
import BudgetMixin "mixins/budget-api";
import Migration "migration";

(with migration = Migration.run)
actor {
  let state = BudgetLib.newState();
  include BudgetMixin(state);
};
