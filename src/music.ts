import { VideoGroup } from "./videos.js";

const YT_BASE_URL = "https://www.youtube-nocookie.com/embed";

const URLS = [
    `${YT_BASE_URL}/vmDDOFXSgAs`, // Dave Brubeck - Take Five
    `${YT_BASE_URL}/xTgKRCXybSM`, // A Perfect Circle - Judith
    `${YT_BASE_URL}/ag6KMH0UlVM`, // Sting - I Burn For You
    `${YT_BASE_URL}/KHR6HkHySWY`, // Ray Charles - It's Not Easy Being Green
    `${YT_BASE_URL}/-xKM3mGt2pE`, // A-Ha - Take On Me (Unplugged)
    `${YT_BASE_URL}/4N82TLB03Vk`, // David Gilmour - Fender Guitar 50th Anniversary
    `${YT_BASE_URL}/wwXeSk2Helo`, // Doris Day - Autumn Leaves
    `${YT_BASE_URL}/Rc7_lCfbQP0`, // Bobby Darin - Beyond The Sea
    `${YT_BASE_URL}/2SF1iLXSQto`, // Tom Petty - It's Good To Be King
    `${YT_BASE_URL}/8uxt-FnNy2I`, // Coldplay - Don't Panic
    `${YT_BASE_URL}/ggGzE5KfCio`, // Ray Charles - Georgia On My Mind
    `${YT_BASE_URL}/rPOlakkBlj8`, // Ella Fitzgerald - Misty
    `${YT_BASE_URL}/ivdh3zvoQGw`, // Bjork - Heirloom
    `${YT_BASE_URL}/PYD-DIggB2k`, // Simon and Garfunkle - April Come She Will
    `${YT_BASE_URL}/cRyKCJUXehM`, // Colin Hay - Land Down Under
    `${YT_BASE_URL}/DeumyOzKqgI`, // Adele - Skyfall
];

new VideoGroup("music-video-grid", URLS)
    .on("progress", (progress) => {
        console.log(progress.percent);
    })
    .load();
