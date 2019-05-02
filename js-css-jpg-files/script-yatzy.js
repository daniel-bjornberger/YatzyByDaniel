



const dice = {

    props: [
        "dicePictures",

        "throwDiceInfo"
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

            <button id="throw-button" @click="throwDice" :class="{disabled:(throwDiceInfo.numberOfThrowsLeft === 0 || throwDiceInfo.allDiceLocked || throwDiceInfo.throwOngoing)}">{{ throwDiceInfo.buttonString }}</button>

        </div>
    `,

    methods: {

        toggleLocked: function(index) {

            //console.log("Hallå!");
            
            store.commit("toggleLocked", index);
        },


        throwDice: function() {

            if (this.throwDiceInfo.numberOfThrowsLeft > 0 && !this.throwDiceInfo.allDiceLocked && !this.throwDiceInfo.throwOngoing) {

                store.commit("toggleThrowOngoing");

                //store.commit("decreaseNumberOfThrowsLeft");

                // minska antal slag med 1, via en commit

                let numberOfRandomisations = 13;

                let interval = setInterval(function() {

                    //commit, kör random på de tärningar som ej är låsta

                    store.commit("randomizeDice");

                    //console.log("throwDice!!!");                

                    numberOfRandomisations--;

                    if (numberOfRandomisations === 0) {

                        clearInterval(interval);

                        store.commit("toggleThrowOngoing");

                        store.commit("decreaseNumberOfThrowsLeft");

                        store.commit("resetDiceRotations");

                    }

                }, 75);                

            }

        }
        
    }

};



////////////////////////////////////////////////////////////////////////////////////////////////////


const scoreCategoryRow = {

    props: [
        "categoryAndPointsRow"
    ],


    template: `
        <div class="scoreCategory">

            <div>
                <p>{{ categoryAndPointsRow.categoryString }}</p>
            </div>

            <div>
                <p>{{ categoryAndPointsRow.points }}</p>
            </div>

        </div>
    `

};


////////////////////////////////////////////////////////////////////////////////////////////////////


const scoreTable = {

    props: [

        "categoryAndPointsInfo"

    ],


    template: `
        <div class=grid-item id="score-grid-div">

            <score-category-row
                v-for="categoryAndPointsRow, index in categoryAndPointsInfo"
                v-bind:category-and-points-row="categoryAndPointsRow"
                v-bind:key="categoryAndPointsRow.id">
            </score-category-row>

        </div>
    `,


    components: {
        "score-category-row": scoreCategoryRow
    },




};


////////////////////////////////////////////////////////////////////////////////////////////////////



const rulesInformation = {

    props: [
    
        "rulesInfo"
    
    ],

    template: `
        <div class="grid-item" id="rules-info-div">

            <div>
            
                <p>{{ rulesInfo.rulesString }}</p>

            </div>

            <div>
            
                <button @click="toggleShowRules">{{ rulesInfo.buttonString }}</button>

                <p v-show="rulesInfo.showRules">{{ rulesInfo.rulesString }}</p>

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


        scoreCategories: [
            {id: 1,
            categoryString: "Ettor",
            points: 0,
            pointsSet: false},

            {id: 2,
            categoryString: "Tvåor",
            points: 0,
            pointsSet: false},

            {id: 3,
            categoryString: "Treor",
            points: 0,
            pointsSet: false},

            {id: 4,
            categoryString: "Fyror",
            points: 0,
            pointsSet: false},

            {id: 5,
            categoryString: "Femmor",
            points: 0,
            pointsSet: false},

            {id: 6,
            categoryString: "Sexor",
            points: 0,
            pointsSet: false},

            {id: 7,
            categoryString: "Delsumma",
            points: 0,
            pointsSet: false},

            {id: 8,
            categoryString: "Bonus",
            points: 0,
            pointsSet: false},

            {id: 9,
            categoryString: "Ett par",
            points: 0,
            pointsSet: false},

            {id: 10,
            categoryString: "Två par",
            points: 0,
            pointsSet: false},

            {id: 11,
            categoryString: "Tretal",
            points: 0,
            pointsSet: false},

            {id: 12,
            categoryString: "Fyrtal",
            points: 0,
            pointsSet: false},

            {id: 13,
            categoryString: "Liten stege",
            points: 0,
            pointsSet: false},

            {id: 14,
            categoryString: "Stor stege",
            points: 0,
            pointsSet: false},

            {id: 15,
            categoryString: "Kåk",
            points: 0,
            pointsSet: false},

            {id: 16,
            categoryString: "Chans",
            points: 0,
            pointsSet: false},

            {id: 17,
            categoryString: "Yatzy",
            points: 0,
            pointsSet: false}
        ],



        rulesInfo: {
            buttonStrings: ["Visa regler och tips", "Dölj regler och tips"],
            showRules: false,
        
            rulesString: "- Här ska det stå info om regler -\n- Och andra tips... -\n\n- Så småningom... -"}


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



        // throwButtonDisabled: state => {

        //     let allDiceLocked = state.dice.every(function(die) {
        //         return die.locked;
        //     });

        //     return allDiceLocked || state.numberOfThrowsLeft === 0;

        // },



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
                rulesString: state.rulesInfo.rulesString
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
                    
                    //console.log(die.rotation);                    

                }

            });

         },



         toggleThrowOngoing(state) {

            state.throwOngoing = !state.throwOngoing;
            
            //console.log("mutation toggleThrowOngoing");            

         },



         resetDiceRotations(state) {

            state.dice.forEach(function(die) {
                die.rotation = 0;
            });

         },



         toggleShowRules(state) {

            state.rulesInfo.showRules = !state.rulesInfo.showRules;
            
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




        // showPoints(index) {


            
        // },



        


        rulesInfo() {
            return this.$store.getters.rulesInfo;
        }


                
    }

});