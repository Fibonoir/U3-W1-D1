// Define the Smartphone interface
interface Smartphone {
    credit: number;
    nrCalls: number;
}

// Define the User class that implements the Smartphone interface
class User implements Smartphone {
    credit: number;
    nrCalls: number;
    name: string;
    surname: string;
    readonly costPerCall: number = 0.20; // 20 cents per minute cost

    constructor(name: string, surname: string, initialCredit: number = 0) {
        this.name = name;
        this.surname = surname;
        this.credit = initialCredit; // Initial SIM credit
        this.nrCalls = 0; // Initial number of minutes spent on calls
    }

    // Method to recharge credit on the SIM
    recharge(amount: number): void {
        this.credit += amount;
        console.log(`${this.name} ${this.surname} recharged ${amount} €. New balance: ${this.credit} €`);
    }

    // Method to make a call and update the remaining credit
    call(minutes: number): void {
        const cost = minutes * this.costPerCall;
        
        // Check if there is enough credit to make the call
        if (this.credit >= cost) {
            this.credit -= cost;
            this.nrCalls += minutes;
            console.log(`${this.name} ${this.surname} made a call for ${minutes} minutes. Remaining credit: ${this.credit} €`);
        } else {
            console.log(`Insufficient credit to make a ${minutes}-minute call. Current balance: ${this.credit} €`);
        }
    }

    // Method to return the leftover credit on the SIM
    call404(): number {
        return this.credit;
    }

    // Method to return the total number of minutes spent on calls
    getNrCalls(): number {
        return this.nrCalls;
    }

    // Method to clear the number of calls (reset to 0)
    clearCalls(): void {
        this.nrCalls = 0;
        console.log(`${this.name} ${this.surname} reset their call count.`);
    }
}

// Global list of users
const users: User[] = [];

// Add user function to add a new user
function addUser() {
    const nameInput = <HTMLInputElement>document.getElementById("name");
    const surnameInput = <HTMLInputElement>document.getElementById("surname");
    const initialCreditInput = <HTMLInputElement>document.getElementById("initialCredit");

    if (nameInput && surnameInput && initialCreditInput) {
        const name = nameInput.value;
        const surname = surnameInput.value;
        const initialCredit = parseFloat(initialCreditInput.value) || 0;

        const newUser = new User(name, surname, initialCredit);
        users.push(newUser);
        renderUsers();
    }
}

// Render user cards
function renderUsers() {
    const userContainer = document.getElementById("user-container");
    if (userContainer) {
        userContainer.innerHTML = ""; // Clear current cards

        users.forEach((user, index) => {
            const userCard = document.createElement("div");
            userCard.className = "user-card";
            userCard.innerHTML = `
                <div>
                    <h3>${user.name} ${user.surname}</h3>
                    <p>Credit: ${user.call404()} €</p>
                    <p>Total Calls: ${user.getNrCalls()} minutes</p>
                </div>
                <div>
                    <input type="checkbox" id="call-${index}" name="callUser" value="${index}">
                    <label for="call-${index}">Call</label>
                </div>
                <div>
                    <input type="checkbox" id="recharge-${index}" name="rechargeUser" value="${index}">
                    <label for="recharge-${index}">Recharge</label>
                </div>
            `;
            userContainer.appendChild(userCard);
        });
    }
}

// Handle making a call with the selected user
function makeCall() {
    const callMinutesInput = <HTMLInputElement>document.getElementById("callMinutes");
    const minutes = parseFloat(callMinutesInput.value) || 0;

    // Find the selected user to make a call
    const selectedCallUser = document.querySelector('input[name="callUser"]:checked') as HTMLInputElement;

    if (selectedCallUser && minutes > 0) {
        const userIndex = parseInt(selectedCallUser.value);
        users[userIndex].call(minutes);
        renderUsers();
    }
}

// Handle recharging selected users
function rechargeUsers() {
    const rechargeAmountInput = <HTMLInputElement>document.getElementById("rechargeAmount");
    const amount = parseFloat(rechargeAmountInput.value) || 0;

    // Find all selected users to recharge
    const selectedRechargeUsers = document.querySelectorAll('input[name="rechargeUser"]:checked') as NodeListOf<HTMLInputElement>;

    selectedRechargeUsers.forEach((checkbox) => {
        const userIndex = parseInt(checkbox.value);
        users[userIndex].recharge(amount);
    });

    renderUsers();
}
