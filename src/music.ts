import { Videos } from "./videos.js";

const URLS = [
    "https://www.youtube.com/embed/vmDDOFXSgAs", // Dave Brubeck - Take Five
    "https://www.youtube.com/embed/cRyKCJUXehM", // Colin Hay - Land Down Under
    "https://www.youtube.com/embed/xTgKRCXybSM", // A Perfect Circle - Judith
    "https://www.youtube.com/embed/ag6KMH0UlVM", // Sting - I Burn For You
    "https://www.youtube.com/embed/KHR6HkHySWY", // Ray Charles - It's Not Easy Being Green
    "https://www.youtube.com/embed/-xKM3mGt2pE", // A-Ha - Take On Me (Unplugged)
    "https://www.youtube.com/embed/4N82TLB03Vk", // David Gilmour - Fender Guitar 50th Anniversary
    "https://www.youtube.com/embed/wwXeSk2Helo", // Doris Day - Autumn Leaves
    "https://www.youtube.com/embed/Rc7_lCfbQP0", // Bobby Darin - Beyond The Sea
    "https://www.youtube.com/embed/2SF1iLXSQto", // Tom Petty - It's Good To Be King
    "https://www.youtube.com/embed/8uxt-FnNy2I", // Coldplay - Don't Panic
    "https://www.youtube.com/embed/ggGzE5KfCio", // Ray Charles - Georgia On My Mind
    "https://www.youtube.com/embed/rPOlakkBlj8", // Ella Fitzgerald - Misty
    "https://www.youtube.com/embed/ivdh3zvoQGw", // Bjork - Heirloom
    "https://www.youtube.com/embed/PYD-DIggB2k", // Simon and Garfunkle - April Come She Will
];

new Videos("music-video-grid", URLS);
