(function () {

    "use strict";


    // =========================================================
    // STATE
    // =========================================================

    let targetScroll = 0;
    let currentScroll = 0;

    let targetMouseX = 0;
    let targetMouseY = 0;

    let currentMouseX = 0;
    let currentMouseY = 0;


    // =========================================================
    // SCROLL
    // =========================================================

    function updateScroll() {

        const scrollTop =
            window.scrollY || 0;

        const documentHeight =
            document.documentElement.scrollHeight;

        const viewportHeight =
            window.innerHeight;

        const maxScroll =
            documentHeight -
            viewportHeight;


        let progress = 0;


        if (maxScroll > 0) {

            progress =
                scrollTop /
                maxScroll;

        }


        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );


        targetScroll =
            progress;


        if (
            typeof Module !== "undefined" &&
            typeof Module._setScrollProgress === "function"
        ) {

            Module._setScrollProgress(
                progress
            );

        }

    }


    // =========================================================
    // MOUSE
    // =========================================================

    function updateMouse(event) {

        const width =
            window.innerWidth;

        const height =
            window.innerHeight;


        if (
            width <= 0 ||
            height <= 0
        ) {

            return;

        }


        targetMouseX =
            (
                event.clientX /
                width
            ) *
            2 -
            1;


        targetMouseY =
            (
                event.clientY /
                height
            ) *
            2 -
            1;


        if (
            typeof Module !== "undefined" &&
            typeof Module._setMousePosition === "function"
        ) {

            Module._setMousePosition(
                targetMouseX,
                targetMouseY
            );

        }

    }


    // =========================================================
    // SMOOTH DOM ANIMATION
    // =========================================================

    function animationLoop() {

        currentScroll +=
            (
                targetScroll -
                currentScroll
            )
            *
            0.075;


        currentMouseX +=
            (
                targetMouseX -
                currentMouseX
            )
            *
            0.08;


        currentMouseY +=
            (
                targetMouseY -
                currentMouseY
            )
            *
            0.08;


        document.documentElement.style.setProperty(
            "--scroll-progress",
            currentScroll
        );


        document.documentElement.style.setProperty(
            "--mouse-x",
            currentMouseX
        );


        document.documentElement.style.setProperty(
            "--mouse-y",
            currentMouseY
        );


        requestAnimationFrame(
            animationLoop
        );

    }


    // =========================================================
    // SCROLL BUTTON
    // =========================================================

    function initializeScrollButton() {

        const button =
            document.getElementById(
                "scrollButton"
            );


        const music =
            document.getElementById(
                "weddingMusic"
            );


        if (!button) {

            return;

        }


        button.addEventListener(
            "click",
            function () {

                if (music) {

                    music.volume =
                        0.65;


                    music.play()
                        .catch(
                            function () { }
                        );

                }


                window.scrollTo({

                    top:
                        window.innerHeight,

                    behavior:
                        "smooth"

                });

            }
        );

    }


    // =========================================================
    // MUSIC / MUTE
    // =========================================================

    function initializeMuteButton() {

        const button =
            document.getElementById(
                "muteButton"
            );


        const music =
            document.getElementById(
                "weddingMusic"
            );


        if (
            !button ||
            !music
        ) {

            return;

        }


        button.addEventListener(
            "click",
            function () {

                if (music.paused) {

                    music.volume =
                        0.65;


                    music.play()
                        .then(
                            function () {

                                music.muted =
                                    false;


                                button.innerHTML =
                                    '<span class="mute-icon">♫</span>';

                            }
                        )
                        .catch(
                            function () { }
                        );


                    return;

                }


                music.muted =
                    !music.muted;


                if (music.muted) {

                    button.innerHTML =
                        '<span class="mute-icon">♩</span>';

                    button.style.opacity =
                        "0.60";

                }
                else {

                    button.innerHTML =
                        '<span class="mute-icon">♫</span>';

                    button.style.opacity =
                        "1";

                }

            }
        );

    }


    // =========================================================
    // INITIALIZE PHASE 1
    // =========================================================

    function initializePhase1() {

        window.addEventListener(
            "scroll",
            updateScroll,
            {
                passive: true
            }
        );


        window.addEventListener(
            "mousemove",
            updateMouse,
            {
                passive: true
            }
        );


        window.addEventListener(
            "resize",
            updateScroll,
            {
                passive: true
            }
        );


        initializeScrollButton();

        initializeMuteButton();


        updateScroll();


        animationLoop();

    }


    // =========================================================
    // START
    // =========================================================

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initializePhase1
        );

    }
    else {

        initializePhase1();

    }


})();