//execute
fetch(`http://api.dev.cakeiteasy.no/api/store/bakeries/test-bakery-pay-in-store/?country=NO`).then(response => {
    return response.json();
})
    .then(bakeryData => {
        getScheduleArray(bakeryData);
    })
    .then(() => {
        generateString();
    })
    .then(() => {
        console.log(toRender);
    });

//variables

let scheduleArray = [];
let targetString;
const toRender = [];

//functions
//get a schedule array

getScheduleArray = (bakeryData) => {
    let schedule = bakeryData.schedule;
    let scheduleKeys = Object.keys(schedule);

    let pushProps;

    for (let i = 0; i < scheduleKeys.length; i++) {
        let key = scheduleKeys[i];
        let value = schedule[key];

        pushProps = {
            name: key,
            day_off: value.day_off,
            order_before: value.order_before,
            days_before_order: value.days_before_order,
            is_relative: value.is_relative,
        };

        scheduleArray.push(pushProps);
    }
};

//compare two days

compareTwoDays = (dayOne, dayTwo) => {

    if (dayOne.day_off === dayTwo.day_off && dayOne.order_before === dayTwo.order_before && dayOne.days_before_order === dayTwo.days_before_order) {
        return true;
    } else {
        return false;
    }
}

//generate left side of target string

generateLeftSide = (dayOne, dayTwo) => {
    let dayNameStart = dayOne.name;
    let dayNameEnd = dayTwo.name;
    return dayNameStart + ` - ` + dayNameEnd + `:`;
}

//generate left side of target string for a unique day

generateLeftSideOneDay = (dayStart) => {
    let dayNameStart = dayStart.name;
    return dayNameStart + ` :`
}

//generate right side of target string

generateRightSide = (dayOne) => {
    let order_before = dayOne.order_before;
    let days_before_order = dayOne.days_before_order;
    let day_off = dayOne.day_off;
    //a function to avoid incorrect time format, like 15:0
    function timeFormat(order_before) {
        const hours = Math.floor(order_before / 60);
        const minutes = order_before % 60
        if (minutes === 0) {
            return hours + `:` + `0` + `0`;
        }
        return hours + `:` + minutes;
    }
    if (day_off === false) {
        return ` before ` + timeFormat(order_before) + `, ` + days_before_order + ` day(s) before`
    } else {
        return " closed"
    }
}

//generate target strings

generateString = () => {
    let dayStart;

    for (let i = 0; i < scheduleArray.length - 1; i++) {
        let dayOne = scheduleArray[i];
        let dayTwo = scheduleArray[i + 1];

        compareTwoDays(dayOne, dayTwo);

        if ((compareTwoDays(dayOne, dayTwo) === true) && (i < scheduleArray.length - 2)) {
            if (dayStart) {
                // noinspection UnnecessaryContinueJS
                continue;
            } else {
                dayStart = dayOne;
                // noinspection UnnecessaryContinueJS
                continue;
            }
        }

        else if (compareTwoDays(dayOne, dayTwo) === false && (i < scheduleArray.length - 2)) {

            if (dayStart) {
                targetString = generateLeftSide(dayStart, dayOne) + generateRightSide(dayStart);

                toRender.push(targetString);

                dayStart = undefined;
                // noinspection UnnecessaryContinueJS
                continue;

            } else {
                targetString = generateLeftSideOneDay(dayOne) + generateRightSide(dayOne);

                toRender.push(targetString);

                // noinspection UnnecessaryContinueJS
                continue;
            }

        } else if (i === scheduleArray.length - 2) {
            if (dayStart && compareTwoDays(dayOne, dayTwo) === true) {
                targetString = generateLeftSide(dayStart, dayTwo) + generateRightSide(dayStart);

                toRender.push(targetString);
                // noinspection UnnecessaryContinueJS
                continue;

            } else if (dayStart && compareTwoDays(dayOne, dayTwo) === false ){
                targetString = generateLeftSide(dayStart, dayOne) + generateRightSide(dayStart)
                toRender.push(targetString);

                targetString = generateLeftSideOneDay(dayTwo) + generateRightSide(dayTwo)
                toRender.push(targetString);

                dayStart = undefined;
                // noinspection UnnecessaryContinueJS
                continue;


            } else if (compareTwoDays(dayOne, dayTwo) === true) {
                let dayStart = dayOne;
                targetString = generateLeftSide(dayStart, dayTwo) + generateRightSide(dayStart)

                toRender.push(targetString);

            } else if (compareTwoDays(dayOne, dayTwo) === false) {
                targetString = generateLeftSideOneDay(dayOne) + generateRightSide(dayOne)
                toRender.push(targetString);

                targetString = generateLeftSideOneDay(dayTwo) + generateRightSide(dayTwo);
                toRender.push(targetString);
            }
        }
    }
    return toRender;
};