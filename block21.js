let partyContainer = document.getElementById("partyContainer");
let fetchPartyBtn = document.getElementById("fetchPartiesBtn");
let addPartyForm = document.getElementById('addPartyForm');

let parties = [];

async function getParties() {
    try {
        let response = await fetch('https://fsa-crud-2aa9294fe819.herokuapp.com/api/2404-FTB-ET-WEB-AM/events');
        if (!response.ok) { throw new Error('Network response was not ok'); }
        let dataResult = await response.json();
        parties = dataResult.data;
        renderParties(parties);
    }
    catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
}

fetchPartyBtn.addEventListener('click', () => getParties());

function renderParties(parties) {
    partyContainer.innerHTML = '';
    parties.forEach(party => {
        const partyElement = createPartyElement(party);
        partyContainer.appendChild(partyElement);
    });
}

function createPartyElement(party) {
    let partyElement = document.createElement('div');
    partyElement.classList.add('partyBox');

    let formattedDate=party.date.substring(0, 10);


    partyElement.innerHTML = `
    <h3>Name: ${party.name}</h3>
    <p>
    Description: ${party.description}<br><br>
    Location: ${party.location}<br><br>
    Date: ${formattedDate}<br>
    </p>
    <button class="deleteBtn">Delete</button>
    `;

    partyElement.querySelector('.deleteBtn').addEventListener('click', () => deleteParty(party.id));

    return partyElement;
}

async function deleteParty(id) {
    try {
        let response = await fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2404-FTB-ET-WEB-AM/events/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let resultText = await response.text();
        getParties();

    } catch (error) {
        console.error('Error deleting party:', error.message);
    }
}


async function addParty(newParty) {
    try {
        let response = await fetch(`https://fsa-crud-2aa9294fe819.herokuapp.com/api/2404-FTB-ET-WEB-AM/events`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newParty)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let result = await response.json();

        if (result.success) {
            console.log("Party added successfully");
            await getParties();
        } else {
            const errorMessage = result.error ? result.error.message : 'Unknown error';
            console.error('Failed to add party:', errorMessage);
        }
    } catch (error) {
        console.error('We were not able to add the party:', error);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    buildParty();
}

addPartyForm.addEventListener('submit', handleFormSubmit);

async function buildParty() {
    let partyName = document.getElementById("partyName").value;
    let partyDescription = document.getElementById("partyDescription").value;
    let partyLocation = document.getElementById("partyLocation").value;
    let partyDate = document.getElementById("partyDate").value;

    let newParty = {
        name: partyName,
        description: partyDescription,
        date: new Date(partyDate).toISOString(),
        location: partyLocation,
    };

    await addParty(newParty);

    document.getElementById("partyName").value = ''
    document.getElementById("partyDescription").value = ''
    document.getElementById("partyLocation").value = ''
    document.getElementById("partyDate").value = ''
}








