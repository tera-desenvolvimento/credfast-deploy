const creditList = document.getElementById("creditList");

async function listCredits() {

    const credits = await fetch(
        `${BASEPATH}/debits/list`,
        {
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ sellerId: sellerId })
        }
    );

    let response = await credits.json();

    creditList.innerHTML = "";

    response.forEach(credit => {
        var newCredit;
        var arrayLength = parseInt(credit.payments.length) - 1;

        if(arrayLength > -1) {
            var actualDate = new Date();
            actualDate.setHours(actualDate.getHours() - 3);

            var lastPaymentDate = new Date(credit.payments[arrayLength][0].date);

            lastPaymentDate.setHours(lastPaymentDate.getHours() - 3)

            var isPaidToday = lastPaymentDate.toISOString().split('T')[0] === actualDate.toISOString().split('T')[0];

            newCredit = `
            <tr class=${isPaidToday ? "paid" : "" }>
                <td>${parseInt(credit.debitId.split("_")[1]).toString()}</td>
                <td><a href="/crediarios/informativo/?debit=${credit.debitId}">${credit.customerData.name}</a></td>
                <td>R$ ${parseFloat(credit.totalValue / credit.paymentsAmount).toFixed(0)}</td>
                ${!isPaidToday ? "<td></td>" : `<td class="value">R$ ${credit.payments[arrayLength][0].value}</td>` }
                <td>${credit.payments.length}/${credit.paymentsAmount}</td>
                <td>R$ ${credit.valueRemaing}</td>
                <td><button class="pay-button" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}">R$</button></td>
                <td>
                    <img src="/assets/img/trash-solid.svg" height="10" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}"/>
                </td>
            </tr>
            `
        } else {
            newCredit = `
            <tr>
                <td>${parseInt(credit.debitId.split("_")[1]).toString()}</td>
                <td><a href="/crediarios/informativo/?debit=${credit.debitId}">${credit.customerData.name}</a></td>
                <td>R$ ${parseFloat(credit.totalValue / credit.paymentsAmount).toFixed(0)}</td>
                <td></td>
                <td>${credit.payments.length}/${credit.paymentsAmount}</td>
                <td>R$ ${credit.valueRemaing}</td>
                <td><button class="pay-button" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}">R$</button></td>
                <td>
                    <button class="remove-button" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}" onclick="toogleConfirmRemove(event)">
                        <img src="/assets/img/trash-solid.svg" data-debit-id="${credit.debitId}" data-client-name="${credit.customerData.name}"/>
                    </button>
                </td>
            </tr>
            `
        }

        creditList.innerHTML += newCredit;
    });

    addEvents();

}

function addEvents() {
    var payButtons = document.querySelectorAll('.pay-button');

    payButtons.forEach(button => button.addEventListener('click', togglePayDebit));
}

window.addEventListener('load', listCredits)
