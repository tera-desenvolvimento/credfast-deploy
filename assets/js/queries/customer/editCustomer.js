const Params = new URLSearchParams(window.location.search);
const customerId = Params.get("cid");

var nameEl = document.getElementById("nameInput");
var docIdEl = document.getElementById("cpfcnpjInput");
var streetEl = document.getElementById("streetInput");
var numberEl = document.getElementById("numberInput");
var cityEl = document.getElementById("cityInput");
var stateEl = document.getElementById("stateInput");
var hoodEl = document.getElementById("hoodInput");
var referenceEl = document.getElementById("referenceInput");
var businessModelEl = document.getElementById("modelInput");
var phoneEl = document.getElementById("phoneInput");

var errorContainer = document.getElementById("error-message-container");
var errorMessage = document.getElementById("error-message");
var saveCustomerBtn = document.getElementById("saveCustomerBt");
var newCreditLink = document.getElementById("createDebit");

var clientId;

async function loadCustomerData() {
     var requestData = JSON.stringify({
        customerId: customerId,
     })

     const customer = await fetch(
        `${BASEPATH}/customer/find`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
            body: requestData
        }
    );

    let response = await customer.json();

    if (response._id) {
        nameEl.value = response.name;
        docIdEl.value = response.docId;
        businessModelEl.value = response.businessModel;
        streetEl.value = response.address.street;
        numberEl.value = response.address.number;
        cityEl.value = response.address.city;
        stateEl.value = response.address.uf;
        hoodEl.value = response.address.hood;
        referenceEl.value = response.address.reference;
        phoneEl.value = response.phone;
        newCreditLink.href = `/crediarios/novo?cid=${response._id}`;

        clientId = response.customerId;
    }
}

var customerChanges = [];

function prepareChanges(event) {
    var change = {
        customerId: customerId,
        key: event.target.name,
        newvalue: event.target.value
    };

    customerChanges.push(change);
}

function prepareAddressChanges(event) {
    var change = {
        customerId: customerId,
        key: `address.${event.target.name}`,
        newvalue: event.target.value
    }

    customerChanges.push(change);
}

function sendChanges(){
    if (customerChanges.length > 0){

        customerChanges.forEach(async change => {
            const updatedCustomer = await fetch(
                `${BASEPATH}/customer/update`,
                {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(change)
                }
            );

                let response = await updatedCustomer.json();
                
                if (response.customerId) {
                    window.location.pathname = "/clientes";
                }
        });
    } else {
        errorMessage.innerHTML = "Nenhuma alteração feita nos dados do cliente"
        errorContainer.style.display = "flex";

        setTimeout(() => { errorContainer.style.display = "none"; }, 3000)
    }
}

async function excludeCustomer() {
    var requestData = JSON.stringify({
        customerId: clientId,
        sellerId: sellerId
    })

    const excluded = await fetch(
        `${BASEPATH}/customer/exclude`,
        {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: requestData
        }
    );

    var response = await excluded.json();

    if (response.message == "CUSTOMER_HAVE_DEBITS") {
        alert("Cliente tem débitos pendentes!")
    } else {
        window.location.pathname = '/clientes';
    }
    
}

window.addEventListener('load', loadCustomerData);

