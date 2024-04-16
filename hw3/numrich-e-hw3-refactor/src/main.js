import * as utils from './utils.js';

const init = () => {
    //Set local storage preset
    const storedRegion = localStorage.getItem(utils.regionKey);

    //Perform if there is local data
    if (storedRegion){
        let numberList = storedRegion.split(',');
        let checkList = document.querySelectorAll("input[type=checkbox]:checked");
        
        //For each checkbox, see if it's in the local Storage list. If it's not, remove the check
        for(let region = 0; region < checkList.length; region++){
            let isChecked = false;

            for (let gen = 0; gen < numberList.length; gen++){
                if(checkList[region].value == numberList[gen]){
                    isChecked = true;
                }
            }

            if(!isChecked){
                document.querySelector(`input[value='${checkList[region].value}']`).checked = false;
            }
        }
    }

    document.querySelector('.play-button').onclick = utils.playButtonClicked;
    document.querySelector('.play-button').style = "align-items: center";
};

export {init};