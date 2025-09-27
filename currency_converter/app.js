const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");


const BASE_CURRENCY = "usd";


for (let select of dropdowns) {
  select.innerHTML = "";
  for (let currCode in countryList) {
    let option = document.createElement("option");
    option.value = currCode;
    option.innerText = currCode;

    
    if (select.name === "from" && currCode === "USD") option.selected = true;
    if (select.name === "to" && currCode === "INR") option.selected = true;

    select.appendChild(option);
  }

  select.addEventListener("change", (evt) => updateFlag(evt.target));
}

// Update exchange rate using BASE_CURRENCY
const updateExchangeRate = async () => {
  let amountInput = document.querySelector(".amount input");
  let amtVal = parseFloat(amountInput.value);
  if (isNaN(amtVal) || amtVal <= 0) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();
  const URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${BASE_CURRENCY}.json`;

  try {
    const res = await fetch(URL);
    if (!res.ok) throw new Error("Currency data not available");

    const data = await res.json();
    const rates = data[BASE_CURRENCY];

    if (!rates[from] || !rates[to]) throw new Error("Invalid currency conversion");

    // Convert: FROM → BASE → TO
    const convertedAmount = (amtVal / rates[from] * rates[to]).toFixed(4);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${convertedAmount} ${toCurr.value}`;
  } catch (err) {
    console.error(err);
    msg.innerText = `Unable to fetch rate for ${fromCurr.value} → ${toCurr.value}`;
  }
};

// Update flag images
const updateFlag = (selectElement) => {
  const currCode = selectElement.value;
  const countryCode = countryList[currCode];
  const img = selectElement.parentElement.querySelector("img");
  img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

// Button click event
btn.addEventListener("click", (e) => {
  e.preventDefault();
  updateExchangeRate();
});

// Initialize on page load
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});






