module {
  public type UserId = Principal;
  public type Timestamp = Int; // nanoseconds from Time.now()

  public type MonthKey = {
    year : Nat;
    month : Nat; // 1–12
  };
};
