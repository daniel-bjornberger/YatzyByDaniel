



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


const store = new Vuex.Store({
    
    state: {

        locked: [false, false, false, false, false],

        activeDicePics: ['js-css-jpg-files/one.jpg', 'js-css-jpg-files/two.jpg', 'js-css-jpg-files/three.jpg',
                            'js-css-jpg-files/four.jpg', 'js-css-jpg-files/five.jpg', 'js-css-jpg-files/six.jpg'],

        disabledDicePics: ['js-css-jpg-files/one-disabled.jpg', 'js-css-jpg-files/two-disabled.jpg',
                            'js-css-jpg-files/three-disabled.jpg', 'js-css-jpg-files/four-disabled.jpg',
                            'js-css-jpg-files/five-disabled.jpg', 'js-css-jpg-files/six-disabled.jpg'],

        diceValues: [2, 6, 4, 3, 1],

        diceDisabled: false

    },

    getters: {

        getCurrentDicePictures: state => {

            let pictures = new Array(5);

            let length = pictures.length;

            for (let index = 0; index < length; index++) {

                pictures[index] = state.activeDicePics[ state.diceValues[index] - 1 ];

                console.log("hwj");
                
                
            }

            return pictures;

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
        
    }

});