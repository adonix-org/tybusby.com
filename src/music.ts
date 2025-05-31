import { VideoGroup } from "./videos.js";

const YOU_TUBE_EMBED = "https://www.youtube-nocookie.com/embed";

const URLS = [
    `${YOU_TUBE_EMBED}/vmDDOFXSgAs`, // Dave Brubeck - Take Five
    `${YOU_TUBE_EMBED}/xTgKRCXybSM`, // A Perfect Circle - Judith
    `${YOU_TUBE_EMBED}/ag6KMH0UlVM`, // Sting - I Burn For You
    `${YOU_TUBE_EMBED}/KHR6HkHySWY`, // Ray Charles - It's Not Easy Being Green
    `${YOU_TUBE_EMBED}/-xKM3mGt2pE`, // A-Ha - Take On Me (Unplugged)
    `${YOU_TUBE_EMBED}/4N82TLB03Vk`, // David Gilmour - Fender Guitar 50th Anniversary
    `${YOU_TUBE_EMBED}/wwXeSk2Helo`, // Doris Day - Autumn Leaves
    `${YOU_TUBE_EMBED}/Rc7_lCfbQP0`, // Bobby Darin - Beyond The Sea
    `${YOU_TUBE_EMBED}/2SF1iLXSQto`, // Tom Petty - It's Good To Be King
    `${YOU_TUBE_EMBED}/8uxt-FnNy2I`, // Coldplay - Don't Panic
    `${YOU_TUBE_EMBED}/ggGzE5KfCio`, // Ray Charles - Georgia On My Mind
    `${YOU_TUBE_EMBED}/rPOlakkBlj8`, // Ella Fitzgerald - Misty
    `${YOU_TUBE_EMBED}/ivdh3zvoQGw`, // Bjork - Heirloom
    `${YOU_TUBE_EMBED}/PYD-DIggB2k`, // Simon and Garfunkle - April Come She Will
    `${YOU_TUBE_EMBED}/cRyKCJUXehM`, // Colin Hay - Land Down Under
    `${YOU_TUBE_EMBED}/DeumyOzKqgI`, // Adele - Skyfall
];

new VideoGroup("music-video-grid", URLS)
    .on("progress", (progress) => {
        console.log(progress.percent);
    })
    .load();
