



Vue.component("dice", {

    props: [
        "dicePictures",

        "throwButtonDisabled",

        "numberOfThrowsLeft",

        "throwDiceInfo"
    ],

    template: `
        <div class=grid-item id="dice-div">

            <div>
                <img :src="dicePictures[0]" @click="toggleLocked(0)" alt="die1">
            </div>

            <div>
                <img :src="dicePictures[1]" @click="toggleLocked(1)" alt="die2">
            </div>
                
            <div>
                <img :src="dicePictures[2]" @click="toggleLocked(2)" alt="die3">
            </div>

            <div>
                <img :src="dicePictures[3]" @click="toggleLocked(3)" alt="die4">
            </div>

            <div>
                <img :src="dicePictures[4]" @click="toggleLocked(4)" alt="die5">
            </div>

            <div>
                <p>Antal kast kvar: {{ numberOfThrowsLeft }}</p>
            </div>

            <button id="throw-button" :class="{disabled:throwButtonDisabled}">{{ throwDiceInfo }}</button>

        </div>
    `,

    methods: {

        toggleLocked: function(index) {

            //console.log("Hallå!");
            
            store.commit("toggleLocked", index);
        }
        
    }

});





////////////////////////////////////////////////////////////////////////////////////////////////////


// GÖR OBJEKT!!!



const store = new Vuex.Store({
    
    state: {

        dice: [
            {value: 1,
            locked: false},
        
            {value: 2,
            locked: false},
        
            {value: 3,
            locked: false},
        
            {value: 4,
            locked: false},
        
            {value: 5,
            locked: false},        
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

        throwDiceInfo: ["Kasta tärningarna!", "Kasta tärningen!", "Ingen olåst tärning"],

        numberOfThrowsLeft: 2

    },

    getters: {

        getCurrentDicePictures: state => {

            let pictures = [];

            if (state.numberOfThrowsLeft === 3) {

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

            return pictures;

        },



        throwButtonDisabled: state => {

            let allDiceLocked = state.dice.every(function(die) {
                return die.locked;
            });

            return allDiceLocked || state.numberOfThrowsLeft === 0;

        },



        throwDiceInfo: state => {

            let numberOfDiceLocked = state.dice.filter(function(die) {
                return die.locked;
            }).length;

            let throwDiceInfoString;

            if (numberOfDiceLocked === 5) {
                throwDiceInfoString = state.throwDiceInfo[2];
            }
            else if (numberOfDiceLocked === 4) {
                throwDiceInfoString = state.throwDiceInfo[1];
            }
            else {
                throwDiceInfoString = state.throwDiceInfo[0];
            }            

            return throwDiceInfoString;

        }

    },

    mutations: {

        toggleLocked(state, payload) {

            if (state.numberOfThrowsLeft < 3) {
                state.dice[payload].locked = !state.dice[payload].locked;
            }

        }

    }

});









////////////////////////////////////////////////////////////////////////////////////////////////////


const app = new Vue({

    el: "#app",

    store,

    computed: {

        currentDicePictures() {
            return this.$store.getters.getCurrentDicePictures;
        },

        throwButtonDisabled() {
            return this.$store.getters.throwButtonDisabled;
        },

        numberOfThrowsLeft() {
            return this.$store.state.numberOfThrowsLeft;
        },

        throwDiceInfo() {
            return this.$store.getters.throwDiceInfo;
        }
                
    },

    methods: {

        
        
    }

});