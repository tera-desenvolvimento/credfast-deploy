var paymentData = {};

function toogleConfirmRemove(e) {
    var confirmRemoveContainer = document.getElementById('confirm-remove-container');
    var clientNameEl = document.getElementById('nomeClienteRemove');

    confirmRemoveContainer.classList.toggle('hide');

    if (!confirmRemoveContainer.classList.contains('hide')) {
        paymentData.debitId = e.target.dataset.debitId;
        paymentData.clientName = e.target.dataset.clientName;
    
        clientNameEl.innerText = paymentData.clientName;
    } else {
        paymentData = {
            debitId: "",
            clientName: ""
        };
    }
}

async function removeCredit() {
    const removed = await fetch(
        `${BASEPATH}/debits/remove`,
        {
            method: 'POST', 
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ debitId: paymentData.debitId })
        });

        let response = await removed.json();

        if (response.errorId === "error_001") {
            alert("Débito não encontrado")
        } else if (response.errorId === "error_002") {
            alert("Já existem pagamentos nesse débito");
        } else if (!response.errorId) {
            window.location.reload();
        }
}