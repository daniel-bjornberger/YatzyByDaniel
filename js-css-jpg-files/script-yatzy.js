



Vue.component("dice", {

    props: [
        "dicePictures"
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

            <button id="throw-button">Kasta tärningarna!</button>

        </div>
    `

});





////////////////////////////////////////////////////////////////////////////////////////////////////


// GÖR OBJEKT!!!



const store = new Vuex.Store({
    
    state: {

        dice: [
            {value: 1,
            locked: false},
        
            {value: 2,
            locked: true},
        
            {value: 3,
            locked: false},
        
            {value: 4,
            locked: true},
        
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

        diceDisabled: false

    },

    getters: {

        getCurrentDicePictures: state => {

            let pictures = new Array(5);

            let length = pictures.length;

            if (state.diceDisabled) {

                for (let index = 0; index < length; index++) {

                    pictures[index] = state.dicePics[ state.dice[index].value - 1 ].disabled;
    
                    // console.log("Hej!");
                    
                }

            }

            else {

                for (let index = 0; index < length; index++) {

                    if (state.dice[index].locked) {

                        pictures[index] = state.dicePics[ state.dice[index].value - 1 ].locked;

                        // console.log("Hej!");

                    }

                    else {

                        pictures[index] = state.dicePics[ state.dice[index].value - 1 ].unlocked;
                        
                    }
                    
                }

            }

            return pictures;

        }

    },

    mutations: {

        toggleLocked(state, payload) {
            state.dice[payload].locked = !state.dice[payload].locked;
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
        }
                
    },

    methods: {

        toggleLocked: function(index) {

            console.log("Hallå!");
            
            store.commit("toggleLocked", index);
        }
        
    }

});