export const isMobile = () => { return ('ontouchstart' in document.documentElement); }

export const halfScreenWidth = window.innerWidth / 2

export const toggleFullScreen = (isFullscreen) => {
    isFullscreen ? document.documentElement.requestFullscreen() : document.exitFullscreen();
}