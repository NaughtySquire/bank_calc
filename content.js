const state = {perscent: "perscent", targetAmount: "targetAmount", term: "term"};
var currentState = state.targetAmount;

const formItems = {
    baseAmount: createFormItem( "baseAmount"),
    replenishmentAmount: createFormItem("Ежемесячное пополнение вклада", "replenishmentAmount"),
    targetAmount: createFormItem("Целевая сумма", "targetAmount"),
    term: createFormItem("Срок(Месяцы)", "term"),
    perscent: createFormItem("Процентная ставка", "perscent"),
}

const switcherItems = {
    perscent: createSwitcherItem( "perscent"),
    targetAmount: createSwitcherItem("Прибыль", "targetAmount"),
    term: createSwitcherItem("Срок", "term"),
}
