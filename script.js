'use strict';

// Data
const account1 = {
  owner: 'Harsh Dixit',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1403,
};

const account2 = {
  owner: 'Shubhi Sharma',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 1001,
};

const account3 = {
  owner: 'Jasmine Singh',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 2512,
};

const account4 = {
  owner: 'Vansh Singhal',
  movements: [430, -1000, 700, 50, 90, 5000 , -2000 , 440 , -2299],
  interestRate: 1.2,
  pin: 505,
};

const account5 = {
  owner: 'Ritushre Bohra ',
  movements: [800 , 50 , -900 , 500 , 5000 , 800 , 7500 ],
  interestRate: 1,
  pin: 607,
};

const account6 = {
  owner: 'Harshwardan Singh Shekawat',
  movements: [500,900,-1000,8000,-500,7000,5500,-9000],
  interestRate: 1,
  pin: 306 ,
};

const account7 = {
  owner: 'Kavya Jain',
  movements: [8000,-900,800,930,-8000,1000,3500,-4825],
  interestRate: 1,
  pin: 1411,
};

const accounts = [account1, account2, account3, account4 , account5 , account6 , account7];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

const displayMovements = function (movements , sort = false) {
  containerMovements.innerHTML = ' ';

  const movs = sort ? movements.slice().sort((a,b) => a-b) : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcBalance = acc => {
  acc.balance = acc.movements.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  labelBalance.textContent = `${acc.balance} EUR`;
};

const calcDisplaySummary = acc => {
  const income = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${income} EUR`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out)} EUR`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * Number(acc.interestRate)) / 100)
    .reduce((acc, mov) => acc + mov);
  labelSumInterest.textContent = `${interest} EUR`;
};

const createUsername = accounts => {
  accounts.forEach(accs => {
    accs.userName = accs.owner
      .toLowerCase()
      .split(' ')
      .map(word => word[0])
      .join('');
  });
};
createUsername(accounts);

const maxMovement = movements.reduce((acc, mov) => {
  if (acc > mov) {
    return acc;
  } else return mov;
}, movements[0]);

const updateUi = function () {
  // Display movements
  displayMovements(currentAccount.movements);
  // Display balance
  calcBalance(currentAccount);
  // Display summary
  calcDisplaySummary(currentAccount);
};

let currentAccount;
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  //Finding current account
  currentAccount = accounts.find(
    acc => acc.userName == inputLoginUsername.value
  );
  if (currentAccount?.pin == Number(inputLoginPin.value)) {
    //display UI and messsage
    containerApp.style.opacity = 100;
    labelWelcome.textContent = `Welcome Back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    //clear input fields
    inputLoginPin.value = '';
    inputLoginUsername.value = '';
    inputLoginPin.blur();

    updateUi();
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const recieverAcc = accounts.find(
    acc => acc.userName == inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  //check if transfer is valid
  if (
    amount > 0 &&
    recieverAcc &&
    currentAccount.balance >= amount &&
    recieverAcc.userName != currentAccount.userName
  ) {
    //add negative movement to current user
    currentAccount.movements.push(Number(`-${amount}`));
    //add positive movement to recipient
    recieverAcc.movements.push(amount);
    //update Ui
    updateUi();
  }
});

btnLoan.addEventListener('click' , (e) => {
  e.preventDefault();
  const amount = Number(inputLoanAmount.value);
  if(amount > 0 && currentAccount.movements.some(mov => mov >= amount*0.1)){
    currentAccount.movements.push(amount);
    updateUi();
    inputLoanAmount.value = '';
  };
})

btnClose.addEventListener('click', e => {
  e.preventDefault();
  //correct credetials?
  if (
    inputCloseUsername.value == currentAccount.userName &&
    Number(inputClosePin.value) == currentAccount.pin
  ) {
    //delete user from data
    const index = accounts.findIndex(acc => acc.userName == currentAccount.userName)
    console.log(index)
    accounts.splice(index , 1);
    //log user out (hide UI)
    containerApp.style.opacity = 0;
  }
  inputClosePin.value = inputCloseUsername.value = '' 
});

let sorted = false;
btnSort.addEventListener('click' , (e) =>{
  e.preventDefault();
  displayMovements(currentAccount.movements , !sorted);
  sorted = !sorted; 
})



