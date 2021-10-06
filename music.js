const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = 'F8_LEARNER';

const playList = $('.playlist');
const heading = $('header h2');
const cd = $('.cd');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const next = $('.btn-next');
const prev = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isChanging: false,
    isRandom: false,
    isRepeat: false,
    randomSongPlayed: [],
    //Config
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Faster Car',
            singer: 'Caliber & Anders Lystell',
            path: './asserts/song/FasterCar.mp3',
            image: './asserts/img/third.jpg'
        },
        {
            name: 'Pandemonium',
            singer: 'Mondays feat. Hanna Stone, Dag Lundberg',
            path: './asserts/song/Pandemonium.mp3',
            image: './asserts/img/second.jpg'
        },
        {
            name: 'Stressed Out',
            singer: 'Twenty One Pilots',
            path: './asserts/song/StressedOut.mp3',
            image: './asserts/img/seventh.jpg'
        },
        {
            name: 'Save Your Tears',
            singer: 'The Weeknd & Ariana Grande',
            path: './asserts/song/SaveYourTears.mp3',
            image: './asserts/img/first.jpg'
        },
        {
            name: 'Whatcha Say',
            singer: 'Jason Derulo',
            path: './asserts/song/WhatchaSay.mp3',
            image: './asserts/img/forth.jpg'
        },
        {
            name: 'Seasons',
            singer: 'Rival & Cadmium feat. Harley Bird',
            path: './asserts/song/Seasons.mp3',
            image: './asserts/img/fifth.jpg'
        },
        {
            name: 'WhateverItTakes',
            singer: 'Imagine Dragons',
            path: './asserts/song/WhateverItTakes.mp3',
            image: './asserts/img/sixth.jpg'
        },
        {
            name: 'Demons',
            singer: 'Imagine Dragons',
            path: './asserts/song/Demons.mp3',
            image: './asserts/img/eighth.jpg'
        },
        {
            name: 'Pastlives',
            singer: 'Sapientdream',
            path: './asserts/song/Pastlives.mp3',
            image: './asserts/img/ninth.jpg'
        },
        {
            name: 'If We Have Each Other',
            singer: 'Alec Benjamin',
            path: './asserts/song/IfWeHaveEachOther.mp3',
            image: './asserts/img/tenth.jpg'
        }
    ],
    //Set config
    setConfig(key, value) {
        this.config[key] = value;
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
    },
    //Handle events
    handleEvents() {
        //Target app
        const _this = this;
        //Scroll to top
        const cdWidth = cd.offsetWidth;
        window.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }
        //Play /pause a song
        playBtn.onclick = () => {
            !_this.isPlaying ? audio.play() : audio.pause();
        }
        //Check on play an audio
        audio.onplay = () => {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbRotate.play();
        }
        //Check on pause an audio
        audio.onpause = () => {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbRotate.pause();
        }
        //Progress bar
        //----------
        audio.ontimeupdate = () => {
            const progressPercent = audio.currentTime / audio.duration * 100;
            if (progressPercent && !_this.isChanging) {
                progress.value = progressPercent;
            }
        }
        progress.onpointerdown = () => {
            _this.isChanging = true;
        }
        progress.onchange = () => {
            _this.isChanging = false;
            const seekTime = progress.value * audio.duration / 100;
            audio.currentTime = seekTime;
        };
        //----------
        //Cd thumbnail rotate
        cdThumbRotate = cdThumb.animate([
            { transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        });
        cdThumbRotate.pause();
        //Next / Prev song
        next.onclick = () => {
            _this.isRandom ? (_this.randomSong(), audio.play()) : (_this.nextSong(), audio.play());
        }
        prev.onclick = () => {
            _this.isRandom ? (_this.randomSong(), audio.play()) : (_this.prevSong(), audio.play());
        }
        //Random song
        randomBtn.onclick = () => {
            _this.isRandom = !_this.isRandom;
            _this.setConfig('isRandom', _this.isRandom);
            randomBtn.classList.toggle('active', _this.isRandom);
        }
        //Next / Repeat song when an audio ends
        audio.onended = () => {
            _this.isRepeat ? audio.play() : next.click();
        }
        //Repeat
        repeatBtn.onclick = () => {
            _this.isRepeat = !_this.isRepeat;
            _this.setConfig('isRepeat', _this.isRepeat);
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
        //Play song when click
        playList.onclick = (event) => {
            const clickedSong = event.target.closest('.song:not(.active)');
            const songLyrics = event.target.closest('.option');
            if (clickedSong && !songLyrics) {
                _this.currentIndex = Number(clickedSong.dataset.index);
                _this.loadCurrentSong();
                audio.play();
            }
        }
    },
    //Random song
    randomSong() {
        this.randomSongPlayed.push(this.currentIndex);
        do {
            this.currentIndex = Math.floor(Math.random() * this.songs.length);
        } while (this.randomSongPlayed.includes(this.currentIndex));
        if (this.randomSongPlayed.length = this.songs.length) {
            this.randomSongPlayed = [];
        }
        this.loadCurrentSong();
    },
    //Next / Prev song
    nextSong() {
        this.currentIndex++;
        this.currentIndex = this.currentIndex >= this.songs.length ? 0 : this.currentIndex;
        this.loadCurrentSong();
    },
    prevSong() {
        this.currentIndex--;
        this.currentIndex = this.currentIndex < 0 ? this.songs.length - 1 : this.currentIndex;
        this.loadCurrentSong();
    },
    //Defineproperties
    defineProperties() {
        Object.defineProperty(this, 'currentSong', {
            get() {
                return this.songs[this.currentIndex];
            }
        });
    },
    //Load a song
    loadCurrentSong: function() {
        //Target app
        const _this = this;
        //This is the normal way to load a song
        // heading.textContent = this.songs[this.currentIndex].name;
        // cdThumb.style.backgroundImage = `url(${this.songs[this.currentIndex].image})`;
        // audio.src = this.songs[this.currentIndex].path;

        //The way that more efficient
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`;
        audio.src = this.currentSong.path;

        const activeSong = $('.song.active');
        if (activeSong) {
            activeSong.classList.remove('active');
        }
        const allSong = $$('.song');
        // allSong.forEach((song) => {
        //     if (Number(song.dataset.index) === _this.currentIndex) {
        //         song.classList.add('active');
        //     }
        // });
        allSong[this.currentIndex].classList.add('active');
        //Active song scrools into view
        $('.song.active').scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    },
    //Load config
    loadConfig() {
        this.isRandom = this.config.isRandom;
        this.isRepeat = this.config.isRepeat;
        //Object.assign(this, this.config);
    },
    //Rander songs
    render() {
        //Target app
        const _this = this;
        const htmls = this.songs.map(function(song, index) {
            return `
                <div class="song ${index == _this.currentIndex ? 'active': ''}" data-index="${index}">
                    <div class="thumb" style="background-image: url(${song.image})">
                    </div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `;
        });
        playList.innerHTML = htmls.join('');
    },
    //Start
    start() {
        //Load config
        this.loadConfig();
        randomBtn.classList.toggle('active', this.isRandom);
        repeatBtn.classList.toggle('active', this.isRepeat);
        //Handle events
        this.handleEvents();
        //Define properties
        this.defineProperties();
        //Render songs
        this.render();
        //Load a song
        this.loadCurrentSong();
    }
}
//Call to start
app.start();