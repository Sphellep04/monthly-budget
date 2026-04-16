import BudgetLib "lib/budget";
import BudgetMixin "mixins/budget-api";



actor {
  let state = BudgetLib.newState();
  include BudgetMixin(state);
};
