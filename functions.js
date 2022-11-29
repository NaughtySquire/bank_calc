function setupContent() {
    setupForm(formItems.targetAmount)
    setupSwitcher(switcherItems.targetAmount);
    const result = document.getElementById("result");
    const calcualtor = document.getElementById("calculator");
    calcualtor.addEventListener("click", function () {
        document.getElementById("result").innerHTML = calculate();
    });
}

function calculate() {
    const baseAmount = parseFloat(document.getElementById("input_baseAmount").value);
    const replenishmentAmount = parseFloat(document.getElementById("input_replenishmentAmount").value);
    var term = parseFloat(document.getElementById("input_term").value);
    var perscent = parseFloat(document.getElementById("input_perscent").value);
    var targetAmount = parseFloat(document.getElementById("input_targetAmount").value);
    var message = "";
    if (isNaN(baseAmount) || isNaN(replenishmentAmount)) {
        return 'Не заполнены поля "Начальная сумма" или "Ежемесячное пополнение вклада"'
    }
    switch (currentState) {
        case state.perscent:
            if (isNaN(term) || isNaN(targetAmount) ) {
                return 'Не заполнены поля "Срок(Месяцы)" или "Целевая сумма"'
            }
            perscent = parseFloat(calcPerscent(baseAmount, replenishmentAmount, targetAmount, term));
            message = "<p>Для накопления " + targetAmount + "Р с учетом ежемесячного пополнения = " + replenishmentAmount + "Р" 
                        + " необходимо вложить сумму " + baseAmount + "Р сроком на " + term + " месясев <br><b>под процент " + perscent + "% годовых.</b></p>";
            break;
        case state.targetAmount:
            if (isNaN(perscent) || isNaN(term) ) {
                return 'Не заполнены поля "Срок(Месяцы)" или "Процентная ставка"'
            }
            const profit = parseFloat(calcProfit(baseAmount, replenishmentAmount, term, perscent));
            const replenishmentAmountSum = replenishmentAmount * term
            const finalAmount = parseFloat(profit + baseAmount + replenishmentAmountSum);
            message = "Итого: " + finalAmount.toFixed(2) + "<br><br>" +
                        "Прибыль: " + profit.toFixed(2) + "<br><br>" + 
                        "Всего вложено дополнительно: " + replenishmentAmountSum;
            break;

        case state.term:
            if (isNaN(targetAmount) || isNaN(perscent)) {
                return 'Не заполнены поля "Целевая сумма" или "Процентная ставка"'
            }
            term = parseFloat(calcTerm(baseAmount, replenishmentAmount, targetAmount, perscent));
            message = "<p>Для накопления " + targetAmount + "Р c учетом ежемесячного пополнения = " + replenishmentAmount + "Р" 
                    + " необходимо вложить сумму " + baseAmount + "Р под процент " + perscent + "% годовых <br><b>сроком на " + term + " месяцев.</b></p>";
            break;
    
        default:
            break;
    }
    return message
}

function createSwitcherItem(switcherItemText, formItemId) {
    const switcherItem = document.createElement("button");
    switcherItem.className = "switcher-item";
    switcherItem.innerHTML = switcherItemText;
    switcherItem.addEventListener("click", function() {
        updateSwitcher(this);
        updateForm(formItems[formItemId]);
        updateFormState(formItemId)
    });
    return switcherItem
}

function setupSwitcher(switcherItem) {
    const switcher = document.getElementsByClassName("switcher")[0];
    for (const key in switcherItems) {
        if (Object.hasOwnProperty.call(switcherItems, key)) {
            const element = switcherItems[key];
            switcher.appendChild(element);
        }
    }
    switcherItem.style.backgroundColor = "rgba(100, 100, 200, 0.4)";
}

function updateSwitcher(switcherItem) {
    const switchers = document.getElementsByClassName("switcher-item");
    for (let index = 0; index < switchers.length; index++) {
        const element = switchers[index];
        element.style.backgroundColor = "ghostwhite";
    }
    switcherItem.style.backgroundColor = "rgba(100, 100, 200, 0.4)";
}

function createFormItem(label_text, id) {
    const block = document.createElement("div");
    block.className =  "form_item";
    block.id = "block_" + id
    const label = document.createElement("label");
    label.id = "label_" + id;
    label.innerHTML = label_text;
    const input = document.createElement("input");
    input.type = "number";
    input.id = "input_" + id;
    input.value = 0;
    block.appendChild(label);
    block.appendChild(input);
    return block
}

function updateForm(formItem) {
    for (const key in formItems) {
        if (Object.hasOwnProperty.call(formItems, key)) {
            const element = formItems[key];
            element.style.display = 'flex';
        }
    }
    formItem.style.display = 'none';
}

function setupForm(formItem) {
    const form = document.getElementsByClassName("form")[0];
    for (const key in formItems) {
        if (Object.hasOwnProperty.call(formItems, key)) {
            const element = formItems[key];
            form.appendChild(element);
        }
    }
    formItem.style.display = 'none';
}

function updateFormState(formItemId) {
    currentState = formItemId;
}

function calcPerscent(baseAmount, replenishmentAmount = 0, targetAmount, term) {
    var perscent = 0
    var finalAmount = baseAmount
    while (finalAmount < targetAmount) {
        finalAmount = baseAmount;
        perscent += 1
        const multiplier = 1 + perscent / 100 / 12;
        for (let index = 0; index < term; index++) {
            finalAmount = finalAmount * multiplier + replenishmentAmount;
        }
    }
    return perscent
}

function calcProfit(baseAmount, replenishmentAmount = 0, term, perscent) {
    let finalAmount = baseAmount;
    const multiplier = 1 + perscent / 100 / 12;
    for (let index = 0; index < term; index++) {
        finalAmount = finalAmount * multiplier + replenishmentAmount;
        finalAmount = finalAmount.toFixed(2);
        console.log(finalAmount);
    }
    console.log(finalAmount);
    return finalAmount - baseAmount - replenishmentAmount * term;
}


function calcTerm(baseAmount, replenishmentAmount, targetAmount, perscent) {
    var term = 0;
    var finalAmount = baseAmount;
    const multiplier = 1 + perscent / 100 / 12;
    while (finalAmount < targetAmount) {
        finalAmount = finalAmount * multiplier + replenishmentAmount;
        term += 1;
    }
    return term;
}