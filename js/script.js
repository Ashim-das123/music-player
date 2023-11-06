
const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressBar = wrapper.querySelector(".progress-bar"),
    progressArea = wrapper.querySelector(".progress-area"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close");





let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);


window.addEventListener('load', () => {
    loadMusic(musicIndex);
    playingNow();
})


function loadMusic(indexNumber) {
    musicName.innerText = allMusic[indexNumber - 1].name;
    musicArtist.innerText = allMusic[indexNumber - 1].artist;
    musicImg.src = `images/${allMusic[indexNumber - 1].img}.jfif`;
    mainAudio.src = `songs/${allMusic[indexNumber - 1].src}.mp3`
}


// play music

function playMusic() {
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();

}
//pause music

function pauseMusic() {
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow";
    mainAudio.pause();

}

function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}



playPauseBtn.addEventListener('click', () => {
    const isMusicPaused = wrapper.classList.contains("paused");

    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
})

nextBtn.addEventListener('click', () => {
    nextMusic();
})
prevBtn.addEventListener('click', () => {
    prevMusic();
})


mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration; // total duration of song
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;


    let musicCurrentTime = wrapper.querySelector(".current"),
        musicDuration = wrapper.querySelector(".duration");
    mainAudio.addEventListener("loadeddata", () => {

        // update total duration of song
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;

        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;

    });
    // update playing current time of song

    let currMin = Math.floor(currentTime / 60);
    let currSec = Math.floor(currentTime % 60);
    if (currSec < 10) {
        currSec = `0${currSec}`;

    }
    musicCurrentTime.innerText = `${currMin}:${currSec}`;
})




progressArea.addEventListener('click', (e) => {
    let progressWidthval = progressArea.clientWidth; // content width including padding
    let clickedOffsetX = e.offsetX; // div er jekhane click hbe tar horizonatl val ta dibe
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffsetX / progressWidthval) * songDuration;

    playMusic();
})


// repeat, suffle
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener('click', () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped");
            break;
        case "repeat_one":
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle");
            break;
        case "shuffle":
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped");
            break;
    }
});


mainAudio.addEventListener('ended', () => {
    let getText = repeatBtn.innerText;

    switch (getText) {
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime = 0;
            loadMusic(musicIndex)
            playMusic()
            break;
        case "shuffle":
            let randomIdx = Math.floor((Math.random() * allMusic.length) + 1);
            do {
                randomIdx = Math.floor((Math.random() * allMusic.length) + 1);
            } while (musicIndex == randomIdx)
            musicIndex = randomIdx;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
})



showMoreBtn.addEventListener('click', () => {
    musicList.classList.toggle("show");
})
hideMusicBtn.addEventListener('click', () => {
    showMoreBtn.click();
})


const ulTag = wrapper.querySelector("ul");

for (let i = 0; i < allMusic.length; i++) {
    let liTag = `<li li-index="${i + 1}">
                <div class="row">
                    <span>${allMusic[i].name}</span>
                    <p>${allMusic[i].artist}</p>
                </div>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                <span id="${allMusic[i].src}" class="audio-duration">3:12</span>
                 </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag)

    let liAudioTagDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);

    liAudioTag.addEventListener("loadeddata", () => {


        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;

        }
        liAudioTagDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioTagDuration.setAttribute("t-duration", `${totalMin}:${totalSec}`);

    });
}


//play songs from playlists

const allLiTags = ulTag.querySelectorAll("li");
// console.log(allLiTags);
function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {

        let audioTag = allLiTags[j].querySelector(".audio-duration");

        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");

            let addDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = addDuration;
        }
        // which song is playing
        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing");
            if (audioTag.innerText = "Playing");
        }

        allLiTags[j].setAttribute("onclick", "clicked(this)");
    }
}

function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}