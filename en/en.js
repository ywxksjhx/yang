/* 同一时间只有一个audio在播放 */
let audio = document.getElementsByTagName("audio");
let len = audio.length;
for (let i = 0; i < len; i++) {
    audio[i].addEventListener("play", () => {
        for (let j = 0; j < len; j++) {
            if (j !== i && !audio[j].paused) {
                audio[j].pause();
                // audio[j].currentTime = 0;
            }
        }
    })
}