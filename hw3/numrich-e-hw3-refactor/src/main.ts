import * as utils from './utils';

const init = () => {
    //Set local storage preset
    const storedRegion = localStorage.getItem(utils.regionKey);

    //Perform if there is local data
    if (storedRegion) {
        let numberList = storedRegion.split(',');
        let testList = document.querySelector("#inputs");
        let checkList = document.querySelectorAll("input[type=checkbox]:checked");

        //For each checkbox, see if it's in the local Storage list. If it's not, remove the check
        for (let region = 0; region < checkList.length; region++) {
            let isChecked = false;

            for (let gen = 0; gen < numberList.length; gen++) {
                let element = checkList[region] as HTMLInputElement;
                if  (element.value == numberList[gen]) {
                    isChecked = true;
                }
            }

            if (!isChecked) {
                let checkItem = document.querySelector(`input[value='${checkList[region]}']`) as HTMLInputElement;
                checkItem.checked = false;
            }
        }
    }

    const playButton = document.querySelector(".play-button") as HTMLButtonElement;

    playButton.onclick = e => {
        const target = e.target as HTMLStyleElement;

        utils.playButtonClicked();
        target.setAttribute("align-items", "Center");
    }
};

export { init };