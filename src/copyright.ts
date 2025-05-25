export const copyright: string = `&copy; ${new Date().getFullYear()} tybusby.com`;

const _copyright = (document.getElementById("copyright")!.innerHTML =
    copyright);
