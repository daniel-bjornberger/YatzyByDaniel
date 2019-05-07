


const dice = {

    props: [
        "dicePictures",
        "throwDiceInfo",
        "result"
    ],



    template: `
        <div class=grid-item id="dice-div">

            <div>
                <img :src="dicePictures.pics[0]" @click="toggleLocked(0)" alt="die1" :class="{minusTenDeg:dicePictures.rotations[0] === -2, minusFiveDeg:dicePictures.rotations[0] === -1, plusFiveDeg:dicePictures.rotations[0] === 1, plusTenDeg:dicePictures.rotations[0] === 2}">
            </div>

            <div>
                <img :src="dicePictures.pics[1]" @click="toggleLocked(1)" alt="die2" :class="{minusTenDeg:dicePictures.rotations[1] === -2, minusFiveDeg:dicePictures.rotations[1] === -1, plusFiveDeg:dicePictures.rotations[1] === 1, plusTenDeg:dicePictures.rotations[1] === 2}">
            </div>

            <div>
                <img :src="dicePictures.pics[2]" @click="toggleLocked(2)" alt="die3" :class="{minusTenDeg:dicePictures.rotations[2] === -2, minusFiveDeg:dicePictures.rotations[2] === -1, plusFiveDeg:dicePictures.rotations[2] === 1, plusTenDeg:dicePictures.rotations[2] === 2}">
            </div>

            <div>
                <img :src="dicePictures.pics[3]" @click="toggleLocked(3)" alt="die4" :class="{minusTenDeg:dicePictures.rotations[3] === -2, minusFiveDeg:dicePictures.rotations[3] === -1, plusFiveDeg:dicePictures.rotations[3] === 1, plusTenDeg:dicePictures.rotations[3] === 2}">
            </div>

            <div>
                <img :src="dicePictures.pics[4]" @click="toggleLocked(4)" alt="die5" :class="{minusTenDeg:dicePictures.rotations[4] === -2, minusFiveDeg:dicePictures.rotations[4] === -1, plusFiveDeg:dicePictures.rotations[4] === 1, plusTenDeg:dicePictures.rotations[4] === 2}">
            </div>

            <div>
                <p>{{ throwDiceInfo.numberOfThrowsLeft }} kast kvar</p>
            </div>

            <button id="throw-button" @click="throwDice" :class="{disabled:(throwDiceInfo.numberOfThrowsLeft === 0 || throwDiceInfo.allDiceLocked || throwDiceInfo.throwOngoing || result.allCategoriesSet)}">{{ throwDiceInfo.buttonString }}</button>

        </div>
    `,



    methods: {

        toggleLocked: function(index) {

            store.commit("toggleLocked", index);

        },



        throwDice: function() {

            if (this.throwDiceInfo.numberOfThrowsLeft > 0 && !this.throwDiceInfo.allDiceLocked && !this.throwDiceInfo.throwOngoing && !this.result.allCategoriesSet) {

                store.commit("toggleThrowOngoing");

                let numberOfRandomisations = 13;

                let interval = setInterval(function() {

                    store.commit("randomizeDice");

                    numberOfRandomisations--;

                    if (numberOfRandomisations === 0) {

                        clearInterval(interval);

                        store.commit("toggleThrowOngoing");

                        store.commit("decreaseNumberOfThrowsLeft");

                        store.commit("resetDiceRotations");

                        store.commit("calculatePoints");

                        store.commit("setInitialId");

                    }

                }, 75);

            }

        }

    },



    created() {

        window.addEventListener('keydown', function(event) {

            if(event.keyCode == 32 && event.target == document.body) {

                event.preventDefault();

            }

        });



        window.addEventListener('keyup', (event) => {

            if (event.keyCode >= 49 && event.keyCode <= 53) {

                this.toggleLocked(event.keyCode - 49);

            }

            else if (event.keyCode >= 97 && event.keyCode <= 101) {

                this.toggleLocked(event.keyCode - 97);

            }

            else if (event.keyCode === 72) {

                this.toggleLocked(0);

            }

            else if (event.keyCode === 74) {

                this.toggleLocked(1);

            }

            else if (event.keyCode === 75) {

                this.toggleLocked(2);

            }

            else if (event.keyCode === 78) {

                this.toggleLocked(3);

            }

            else if (event.keyCode === 77) {

                this.toggleLocked(4);

            }

            else if (event.keyCode === 32) {

                this.throwDice();

            }

        });

    }

};



////////////////////////////////////////////////////////////////////////////////////////////////////



const scoreCategoryRow = {

    props: [
        "categoryAndPointsRow",
        "scoreTableInfo"
    ],



    template: `
        <div class="scoreCategory">

            <div>
                <p>{{ categoryAndPointsRow.categoryString }}</p>
            </div>

            <div @click="setPoints(categoryAndPointsRow)" :class="{pointsSet: categoryAndPointsRow.pointsSet, zeroPoints: (categoryAndPointsRow.id !== 6 && categoryAndPointsRow.id !== 7 && scoreTableInfo.possibleToSetPoints && !categoryAndPointsRow.pointsSet && categoryAndPointsRow.points === 0), moreThanZeroPoints: (categoryAndPointsRow.id !== 6 && categoryAndPointsRow.id !== 7 && scoreTableInfo.possibleToSetPoints && !categoryAndPointsRow.pointsSet && categoryAndPointsRow.points > 0), currentlyChosenScoreCategory: (categoryAndPointsRow.id === scoreTableInfo.currentId && scoreTableInfo.possibleToSetPoints)}">
                <p>{{ showPoints(categoryAndPointsRow) }}</p>
            </div>

        </div>
    `,



    methods: {

        showPoints: function(currentRow) {

            if ( (currentRow.id === 6 || currentRow.id === 7) && !currentRow.pointsSet) {

                return "";

            }

            else if( currentRow.pointsSet || ( this.scoreTableInfo.numberOfThrowsLeft < 3 && !this.scoreTableInfo.throwOngoing ) ) {

                return currentRow.points;

            }

            else {

                return "";

            }

        },



        setPoints: function(currentRow) {

            if (!currentRow.pointsSet && this.scoreTableInfo.possibleToSetPoints && currentRow.id !== 6 && currentRow.id !== 7) {

                store.commit("setPoints", currentRow.id);

            }

        }

    }

};



////////////////////////////////////////////////////////////////////////////////////////////////////



const scoreTable = {

    props: [
        "categoryAndPointsInfo",
        "scoreTableInfo",
        "result"
    ],



    template: `
        <div class=grid-item id="score-grid-div">

            <p v-show=result.allCategoriesSet>
                Du fick totalt {{ result.totalPoints }} poäng av maximalt 374 poäng.
            </p>

            <button v-show=result.allCategoriesSet @click="startNewRound">Starta en ny omgång</button>

            <score-category-row
                ref="childComponent"
                v-for="categoryAndPointsRow, index in categoryAndPointsInfo"
                v-bind:category-and-points-row="categoryAndPointsRow"
                v-bind:score-table-info="scoreTableInfo"
                v-bind:key="categoryAndPointsRow.id">
            </score-category-row>

        </div>
    `,



    components: {
        "score-category-row": scoreCategoryRow
    },



    methods: {

        startNewRound: function() {

            store.commit("startNewRound");

        },



        arrowsPressed: function(keyCode) {

            if (keyCode === 37) {

                store.commit("arrowLeft");

            }

            else if (keyCode === 38) {

                store.commit("arrowUp");

            }

            else if (keyCode === 39) {

                store.commit("arrowRight");

            }

            else if (keyCode === 40) {

                store.commit("arrowDown");

            }

        },



        enterPressed: function() {

            console.log("Enter pressed!");


            if (!this.result.allCategoriesSet) {

                this.$refs.childComponent[0].setPoints(this.categoryAndPointsInfo[this.scoreTableInfo.currentId]);

            }

            else {

                this.startNewRound();

            }

        }

    },



    created() {

        window.addEventListener('keydown', function(event) {

            if(event.keyCode >= 37 && event.keyCode <= 40 && event.target == document.body) {

                event.preventDefault();

            }

        });



        window.addEventListener('keydown', function(event) {

            if(event.keyCode === 13) {

                event.preventDefault();

            }

        });



        window.addEventListener('keyup', (event) => {

            if (event.keyCode >= 37 && event.keyCode <= 40) {

                this.arrowsPressed(event.keyCode);

            }

            else if (event.keyCode === 13) {

                this.enterPressed();

            }

        });

    }

};



////////////////////////////////////////////////////////////////////////////////////////////////////



const rulesInformation = {

    props: [
        "rulesInfo"
    ],



    template: `
        <div class="grid-item" id="rules-info-div">

            <div>

                <p>{{ rulesInfo.rulesStrings[0] }}</p>

                <p>{{ rulesInfo.rulesStrings[1] }}</p>

            </div>

            <div>

                <button @click="toggleShowRules">{{ rulesInfo.buttonString }}</button>

                <p v-show="rulesInfo.showRules">{{ rulesInfo.rulesStrings[0] }}</p>

            </div>

        </div>
    `,



    methods: {

        toggleShowRules: function() {

            store.commit("toggleShowRules");

        }

    }

};



////////////////////////////////////////////////////////////////////////////////////////////////////



function countNumberOfDice(dice) {

    let numberOfDice = [];

    for (let index = 1; index <= 6; index++) {

        numberOfDice.push(dice.filter(function(die) {

            return die.value === index;

        }).length);

    }

    return numberOfDice;

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function onesToSixes(value, numberOfDice) {

    return numberOfDice[value] * (value + 1);

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function onePair(numberOfDice) {

    let indexForHighestPair = numberOfDice.reverse().findIndex(function(numberOfDie) {

        return numberOfDie >= 2;

    });

    numberOfDice.reverse();

    if (indexForHighestPair === -1) {

        return 0;

    }

    else {

        return 2 * (6 - indexForHighestPair);

    }

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function twoPair(numberOfDice) {

    let indexForLowestPair = numberOfDice.findIndex(function(numberOfDie) {

        return numberOfDie >= 2;

    });

    let indexForHighestPair = 5 - numberOfDice.reverse().findIndex(function(numberOfDie) {

        return numberOfDie >= 2;

    });

    numberOfDice.reverse();

    if ( (indexForLowestPair !== -1) && (indexForHighestPair !== 6) && (indexForLowestPair !== indexForHighestPair) ) {

        return 2 * (2 + indexForLowestPair + indexForHighestPair);

    }

    else {

        return 0;

    }

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function threeAndFourOfAKind(numberOfDice, minNumber) {

    let index = numberOfDice.findIndex(function(numberOfDie) {

        return numberOfDie >= minNumber;

    });

    if (index === -1) {

        return 0;

    }

    else {

        return minNumber * (index + 1);

    }

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function smallStraight(numberOfDice) {

    if (numberOfDice.slice(0, 5).every(function(value) {

        return value === 1;

    })) {

        return 15;

    }

    else {

        return 0;

    }

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function largeStraight(numberOfDice) {

    if (numberOfDice.slice(1, 6).every(function(value) {

        return value === 1;

    })) {

        return 20;

    }

    else {

        return 0;

    }

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function fullHouse(numberOfDice) {

    let indexPair = numberOfDice.findIndex(function(numberOfDie) {

        return numberOfDie === 2;

    });

    let indexThreeOfAKind = numberOfDice.findIndex(function(numberOfDie) {

        return numberOfDie === 3;

    });

    if (indexPair === -1 || indexThreeOfAKind === -1) {

        return 0;

    }

    else {

        return 2 * (indexPair + 1) + 3 * (indexThreeOfAKind + 1);

    }

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function chance(numberOfDice) {

    let sum = 0;

    numberOfDice.forEach(function(numberOfDie, index) {

        sum += numberOfDie * (index + 1);

    });

    return sum;

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function yatzy(numberOfDice) {

    if (numberOfDice.some(function(numberOfDie) {

        return numberOfDie === 5;

    })) {

        return 50;

    }

    else {

        return 0;

    }

}



////////////////////////////////////////////////////////////////////////////////////////////////////



function removeCurrentId(currentRowId, choosableIds) {

    if (currentRowId <= 5) {

        choosableIds.left.splice(choosableIds.left.indexOf(currentRowId), 1);

    }

    else {

        choosableIds.right.splice(choosableIds.right.indexOf(currentRowId), 1);

    }

}



////////////////////////////////////////////////////////////////////////////////////////////////////



const store = new Vuex.Store({

    state: {

        dice: [
            {value: 1,
            locked: false,
            rotation: 0},

            {value: 2,
            locked: false,
            rotation: 0},

            {value: 3,
            locked: false,
            rotation: 0},

            {value: 4,
            locked: false,
            rotation: 0},

            {value: 5,
            locked: false,
            rotation: 0},
        ],



        dicePics: [
            {unlocked: 'js-css-jpg-files/one.jpg',
            locked: 'js-css-jpg-files/one-locked.jpg',
            disabled: 'js-css-jpg-files/one-disabled.jpg'},

            {unlocked: 'js-css-jpg-files/two.jpg',
            locked: 'js-css-jpg-files/two-locked.jpg',
            disabled: 'js-css-jpg-files/two-disabled.jpg'},

            {unlocked: 'js-css-jpg-files/three.jpg',
            locked: 'js-css-jpg-files/three-locked.jpg',
            disabled: 'js-css-jpg-files/three-disabled.jpg'},

            {unlocked: 'js-css-jpg-files/four.jpg',
            locked: 'js-css-jpg-files/four-locked.jpg',
            disabled: 'js-css-jpg-files/four-disabled.jpg'},

            {unlocked: 'js-css-jpg-files/five.jpg',
            locked: 'js-css-jpg-files/five-locked.jpg',
            disabled: 'js-css-jpg-files/five-disabled.jpg'},

            {unlocked: 'js-css-jpg-files/six.jpg',
            locked: 'js-css-jpg-files/six-locked.jpg',
            disabled: 'js-css-jpg-files/six-disabled.jpg'}
        ],



        throwDiceButtonStrings: ["Kasta tärningarna!", "Kasta tärningen!", "Ingen olåst tärning", ""],


        numberOfThrowsLeft: 3,


        throwOngoing: false,


        possibleToSetPoints: false,


        scoreCategories: [
            {id: 0,
            categoryString: "Ettor",
            points: 0,
            pointsSet: false},

            {id: 1,
            categoryString: "Tvåor",
            points: 0,
            pointsSet: false},

            {id: 2,
            categoryString: "Treor",
            points: 0,
            pointsSet: false},

            {id: 3,
            categoryString: "Fyror",
            points: 0,
            pointsSet: false},

            {id: 4,
            categoryString: "Femmor",
            points: 0,
            pointsSet: false},

            {id: 5,
            categoryString: "Sexor",
            points: 0,
            pointsSet: false},

            {id: 6,
            categoryString: "Delsumma",
            points: 0,
            pointsSet: false},

            {id: 7,
            categoryString: "Bonus",
            points: 0,
            pointsSet: false},

            {id: 8,
            categoryString: "Ett par",
            points: 0,
            pointsSet: false},

            {id: 9,
            categoryString: "Två par",
            points: 0,
            pointsSet: false},

            {id: 10,
            categoryString: "Tretal",
            points: 0,
            pointsSet: false},

            {id: 11,
            categoryString: "Fyrtal",
            points: 0,
            pointsSet: false},

            {id: 12,
            categoryString: "Liten stege",
            points: 0,
            pointsSet: false},

            {id: 13,
            categoryString: "Stor stege",
            points: 0,
            pointsSet: false},

            {id: 14,
            categoryString: "Kåk",
            points: 0,
            pointsSet: false},

            {id: 15,
            categoryString: "Chans",
            points: 0,
            pointsSet: false},

            {id: 16,
            categoryString: "Yatzy",
            points: 0,
            pointsSet: false}
        ],



        rulesInfo: {
            buttonStrings: ["Visa regler och tips", "Dölj regler och tips"],
            showRules: false,
            rulesStrings: ["På denna webbsida spelas Yatzy enligt varianten \"fri\", dvs efter varje omgång av tre slag (eller färre, om man så vill) kan poängen bokföras på vilken kategori som helst, förutsatt att man inte redan tidigare bokfört poäng på kategorin.\n\nFör att kasta tärningarna, klicka/peka på knappen med texten 'Kasta tärningarna!'. Före det andra och det tredje slaget kan man välja att växla mellan låst och olåst läge på tärningarna, genom att klicka/peka på de tärningar man vill växla läge på.\n\nNär man vill bokföra ett resultat på en kategori i protokollet, så gör man det genom att klicka/peka på rutan som visar poängen för den aktuella kategorin. De kategorier som man kan välja blinkar sakta i färgerna grönt eller rött. Rött visar att om man väljer denna kategori så får man inga poäng, dvs man stryker denna kategori. Grönt innebär att man får åtminstone 1 poäng vid val av den aktuella kategorin. En tidigare vald kategori har en blå bakgrundsfärg.\n\nEfter att en hel omgång är avslutad så visas slutresultatet, samt en knapp som man kan klicka/peka på ifall man vill starta en ny omgång.",
            "Om man spelar på en dator kan man använda tangentbordet istället för musen, ifall man vill. För att kasta tärningarna trycker man på mellanslag/blanksteg.\n\nFör att växla mellan låst och olåst läge så trycker man på siffertangenterna 1 - 5. Tärningarna är numrerade på följande sätt:\n\n1  2  3\n 4  5\n\nFör att växla läge på tärningarna så kan man även använda följande tangenter:\n\nH  J  K\n  N  M\n\nFör att navigera runt i protokollet, när man vill bokföra ett resultat på en viss kategori, så använder man piltangenterna. Ett tryck på Enter/Retur bokför resultatet på den kategori som den blå markören befinner sig på. Även för att starta en ny omgång, när slutresultatet visas, så trycker man på Enter/Retur."]},



        choosableIds: {
            left: [0, 1, 2, 3, 4, 5],
            right: [8, 9, 10, 11, 12, 13, 14, 15, 16]
        },


        currentId: 0

    },



    getters: {

        getCurrentDicePictures: state => {

            let pictures = [];

            if ( (state.numberOfThrowsLeft === 3) && !state.throwOngoing) {

                for (let index = 0; index < 5; index++) {

                    pictures.push(state.dicePics[ state.dice[index].value - 1 ].disabled);

                }

            }

            else {

                for (let index = 0; index < 5; index++) {

                    if (state.dice[index].locked) {

                        pictures.push(state.dicePics[ state.dice[index].value - 1 ].locked);

                    }

                    else {

                        pictures.push(state.dicePics[ state.dice[index].value - 1 ].unlocked);

                    }

                }

            }

            let rots = [];

            for (let index = 0; index < 5; index++) {

                rots.push(state.dice[index].rotation)

            }

            return {
                pics: pictures,
                rotations: rots
            };

        },



        throwDiceInfo: state => {

            let numberOfDiceLocked = state.dice.filter(function(die) {

                return die.locked;

            }).length;

            let throwDiceButtonString;

            if (state.numberOfThrowsLeft === 0) {

                throwDiceButtonString = state.throwDiceButtonStrings[3];

            }

            else if (numberOfDiceLocked === 5) {

                throwDiceButtonString = state.throwDiceButtonStrings[2];

            }

            else if (numberOfDiceLocked === 4) {

                throwDiceButtonString = state.throwDiceButtonStrings[1];

            }

            else {

                throwDiceButtonString = state.throwDiceButtonStrings[0];

            }

            return {
                buttonString: throwDiceButtonString,
                numberOfThrowsLeft: state.numberOfThrowsLeft,
                allDiceLocked: numberOfDiceLocked === 5,
                throwOngoing: state.throwOngoing
            };

        },



        scoreTableInfo: state => {

            return {
                numberOfThrowsLeft: state.numberOfThrowsLeft,
                throwOngoing: state.throwOngoing,
                possibleToSetPoints: state.possibleToSetPoints && !state.throwOngoing,
                currentId: state.currentId
            }

        },



        rulesInfo: state => {

            let buttonString;

            if (state.rulesInfo.showRules) {

                buttonString = state.rulesInfo.buttonStrings[1];

            }

            else {

                buttonString = state.rulesInfo.buttonStrings[0];

            }

            return {
                buttonString: buttonString,
                showRules: state.rulesInfo.showRules,
                rulesStrings: state.rulesInfo.rulesStrings
            }

        },



        result: state => {

            let scoreCategoriesModified = state.scoreCategories.slice(0, 6).concat(state.scoreCategories.slice(8));

            let allCategoriesSet = scoreCategoriesModified.every(function(scoreCategory) {

                return scoreCategory.pointsSet;

            });

            let totalPoints = 0;

            if (allCategoriesSet) {

                state.scoreCategories[6].pointsSet = true;

                state.scoreCategories[7].pointsSet = true;

                state.scoreCategories[6].points = state.scoreCategories.slice(0, 6).reduce(function(accumulator, scoreCategory) {

                    return accumulator + scoreCategory.points;

                }, 0);

                if (state.scoreCategories[6].points >= 63) {

                    state.scoreCategories[7].points = 50;

                }

                else {

                    state.scoreCategories[7].points =  0;

                }

                for (let index = 6; index <= 16; index++) {

                    totalPoints += state.scoreCategories[index].points;

                }

            }

            return {
                allCategoriesSet: allCategoriesSet,
                totalPoints: totalPoints
            }

        }

    },



    mutations: {

        toggleLocked(state, payload) {

            if (state.numberOfThrowsLeft < 3 && !state.throwOngoing) {

                state.dice[payload].locked = !state.dice[payload].locked;

            }

        },



         decreaseNumberOfThrowsLeft(state) {

            state.numberOfThrowsLeft--;

         },



         randomizeDice(state) {

            state.dice.forEach(function(die) {

                if (!die.locked) {

                    die.value = Math.floor(Math.random() * 6) + 1;

                    die.rotation = Math.floor(Math.random() * 5) - 2;

                }

            });

         },



         toggleThrowOngoing(state) {

            state.throwOngoing = !state.throwOngoing;

         },



         resetDiceRotations(state) {

            state.dice.forEach(function(die) {

                die.rotation = 0;

            });

         },



         toggleShowRules(state) {

            state.rulesInfo.showRules = !state.rulesInfo.showRules;

         },



         calculatePoints(state) {

            let numberOfDice = countNumberOfDice(state.dice);

            state.scoreCategories.forEach(function(scoreCategory) {

                if(!scoreCategory.pointsSet) {

                    switch (scoreCategory.id) {

                        case 0:
                        case 1:
                        case 2:
                        case 3:
                        case 4:
                        case 5:
                            scoreCategory.points = onesToSixes(scoreCategory.id, numberOfDice);
                            break;

                        case 8:
                            scoreCategory.points = onePair(numberOfDice);
                            break;

                        case 9:
                            scoreCategory.points = twoPair(numberOfDice);
                            break;

                        case 10:
                            scoreCategory.points = threeAndFourOfAKind(numberOfDice, 3);
                            break;

                        case 11:
                            scoreCategory.points = threeAndFourOfAKind(numberOfDice, 4);
                            break;

                        case 12:
                            scoreCategory.points = smallStraight(numberOfDice);
                            break;

                        case 13:
                            scoreCategory.points = largeStraight(numberOfDice);
                            break;

                        case 14:
                            scoreCategory.points = fullHouse(numberOfDice);
                            break;

                        case 15:
                            scoreCategory.points = chance(numberOfDice);
                            break;

                        case 16:
                            scoreCategory.points = yatzy(numberOfDice);
                            break;

                    }

                }

            });

            state.possibleToSetPoints = true;

         },



         setPoints(state, currentRowId) {

            state.scoreCategories[currentRowId].pointsSet = true;

            state.possibleToSetPoints = false;

            state.numberOfThrowsLeft = 3;

            removeCurrentId(currentRowId, state.choosableIds);

            state.dice.forEach(function(die) {

                die.locked = false;

            });

         },



         startNewRound(state) {

            state.scoreCategories.forEach(function(scoreCategory) {

                scoreCategory.pointsSet = false;

            });

            state.choosableIds.left = [0, 1, 2, 3, 4, 5];

            state.choosableIds.right = [8, 9, 10, 11, 12, 13, 14, 15, 16];

         },



         setInitialId(state) {

            if (state.choosableIds.left.length > 0) {

                state.currentId = state.choosableIds.left[0];

            }

            else if (state.choosableIds.right.length > 0) {

                state.currentId = state.choosableIds.right[0];

            }

            else {

                state.currentId = -1;

            }

         },



         arrowUp(state) {

            if (state.currentId <= 5 && state.choosableIds.left.indexOf(state.currentId) > 0) {

                state.currentId = state.choosableIds.left[ state.choosableIds.left.indexOf(state.currentId) - 1 ];

            }

            else if (state.currentId >= 8 && state.choosableIds.right.indexOf(state.currentId) > 0) {

                state.currentId = state.choosableIds.right[ state.choosableIds.right.indexOf(state.currentId) - 1 ];

            }

         },



         arrowDown(state) {

            if (state.currentId <= 5 && state.choosableIds.left.indexOf(state.currentId) < state.choosableIds.left.length - 1) {

                state.currentId = state.choosableIds.left[ state.choosableIds.left.indexOf(state.currentId) + 1 ];

            }

            else if (state.currentId >= 8 && state.choosableIds.right.indexOf(state.currentId) < state.choosableIds.right.length - 1) {

                state.currentId = state.choosableIds.right[ state.choosableIds.right.indexOf(state.currentId) + 1 ];

            }

         },



         arrowRight(state) {

            if (state.currentId <= 5 && state.choosableIds.right.length > 0) {

                let possibleNewId = state.currentId + 8;

                if (state.choosableIds.right.indexOf(possibleNewId) !== -1) {

                    state.currentId = possibleNewId;

                }

                else {

                    let possibleNewIndex = state.choosableIds.right.findIndex(function(value) {

                        return value > possibleNewId;

                    });

                    if (possibleNewIndex === 0) {

                        state.currentId = state.choosableIds.right[0];

                    }

                    else if (possibleNewIndex === -1) {

                        state.currentId = state.choosableIds.right.slice(-1)[0];

                    }

                    else {

                        state.currentId = state.choosableIds.right[possibleNewIndex - 1];

                    }

                }

            }

         },



         arrowLeft(state) {

            if (state.currentId >= 8 && state.choosableIds.left.length > 0) {

                let possibleNewId = state.currentId - 8;

                if (state.choosableIds.left.indexOf(possibleNewId) !== -1) {

                    state.currentId = possibleNewId;

                }

                else {

                    let possibleNewIndex = state.choosableIds.left.findIndex(function(value) {

                        return value > possibleNewId;

                    });

                    if (possibleNewIndex === 0) {

                        state.currentId = state.choosableIds.left[0];

                    }

                    else if (possibleNewIndex === -1) {

                        state.currentId = state.choosableIds.left.slice(-1)[0];

                    }

                    else {

                        state.currentId = state.choosableIds.left[possibleNewIndex - 1];

                    }

                }

            }

        }

    }

});



////////////////////////////////////////////////////////////////////////////////////////////////////



const app = new Vue({

    el: "#app",

    store,

    components: {
        "dice": dice,
        "score-table": scoreTable,
        "rules-information": rulesInformation
    },



    computed: {

        currentDicePictures() {

            return this.$store.getters.getCurrentDicePictures;

        },



        throwButtonDisabled() {

            return this.$store.getters.throwButtonDisabled;

        },


        throwDiceInfo() {

            return this.$store.getters.throwDiceInfo;

        },



        scoreCategories() {

            return this.$store.state.scoreCategories;

        },



        scoreTableInfo() {

            return this.$store.getters.scoreTableInfo;

        },



        rulesInfo() {

            return this.$store.getters.rulesInfo;

        },



        result() {

            return this.$store.getters.result;

        }

    }

});


