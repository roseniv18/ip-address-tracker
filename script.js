const diceBtn = document.querySelector('.dice-btn');
const adviceNum = document.querySelector('#advice-num');
const adviceText = document.querySelector('.advice-text');

const getAdvice = async () => {
    const response = await fetch('https://api.adviceslip.com/advice', {cache: "no-store"});
    const data = response.json();
    return data;
}

function showAdvice() {
            getAdvice()
                .then(data => {
                    adviceText.innerText = data.slip.advice;
                    adviceNum.innerText = data.slip.id;
                    console.log(data);
                })
                .catch(err => console.log(err));
} 

showAdvice();

diceBtn.addEventListener('click', () => {
    showAdvice();
})