/* =========================================================
   PHASE 4
   PINNED SCROLL-DRIVEN HORIZONTAL TIMELINE
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const section =
        document.getElementById(
            "phase4"
        );


    if (!section) {

        console.error(
            "Phase 4: #phase4 not found."
        );

        return;

    }


    const track =
        section.querySelector(
            ".phase4-track"
        );


    if (!track) {

        console.error(
            "Phase 4: .phase4-track not found."
        );

        return;

    }


    /* =====================================================
       STATE
       ===================================================== */

    let maxTranslate = 0;

    let targetTranslate = 0;

    let currentTranslate = 0;

    let animationFrame = null;


    /* =====================================================
       CALCULATE HORIZONTAL WIDTH
       ===================================================== */

    function calculateWidth() {

        const trackWidth =
            track.scrollWidth;


        const viewportWidth =
            window.innerWidth;


        maxTranslate =
            Math.max(
                0,
                trackWidth -
                viewportWidth
            );

    }


    /* =====================================================
       GET SCROLL PROGRESS
       ===================================================== */

    function getProgress() {

        const rect =
            section.getBoundingClientRect();


        const scrollDistance =
            section.offsetHeight -
            window.innerHeight;


        if (
            scrollDistance <= 0
        ) {

            return 0;

        }


        let progress =
            -rect.top /
            scrollDistance;


        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );


        return progress;

    }


    /* =====================================================
       SCROLL
       ===================================================== */

    function updateScroll() {

        const progress =
            getProgress();


        /*
         * Vertical scroll:
         *
         * 0%
         *      ↓
         * 50%
         *      ↓
         * 100%
         *
         * becomes
         *
         * X = 0
         *      ↓
         * X = negative
         */

        targetTranslate =
            -(
                maxTranslate *
                progress
            );


        startAnimation();

    }


    /* =====================================================
       SMOOTH HORIZONTAL MOVEMENT
       ===================================================== */

    function startAnimation() {

        if (
            animationFrame !== null
        ) {

            return;

        }


        animationFrame =
            requestAnimationFrame(
                animate
            );

    }


    function animate() {

        const distance =
            targetTranslate -
            currentTranslate;


        /*
         * Smoothness
         *
         * Bigger = faster
         * Smaller = smoother
         */

        currentTranslate +=
            distance * 0.10;


        /*
         * Stop micro movement
         */

        if (
            Math.abs(
                distance
            ) < 0.05
        ) {

            currentTranslate =
                targetTranslate;

        }


        track.style.transform =
            "translate3d(" +
            currentTranslate +
            "px, 0, 0)";


        animationFrame = null;


        if (
            Math.abs(
                targetTranslate -
                currentTranslate
            ) > 0.05
        ) {

            startAnimation();

        }

    }


    /* =====================================================
       EVENTS
       ===================================================== */

    window.addEventListener(
        "scroll",
        updateScroll,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        function () {

            calculateWidth();

            updateScroll();

        }
    );


    /* =====================================================
       WAIT FOR IMAGES
       ===================================================== */

    const images =
        section.querySelectorAll(
            "img"
        );


    let imagesLeft =
        images.length;


    function initialize() {

        calculateWidth();

        updateScroll();

    }


    if (
        imagesLeft === 0
    ) {

        initialize();

    } else {

        images.forEach(
            function (image) {

                if (
                    image.complete
                ) {

                    imagesLeft--;

                    return;

                }


                image.addEventListener(
                    "load",
                    function () {

                        imagesLeft--;


                        if (
                            imagesLeft === 0
                        ) {

                            initialize();

                        }

                    },
                    {
                        once: true
                    }
                );


                image.addEventListener(
                    "error",
                    function () {

                        imagesLeft--;


                        if (
                            imagesLeft === 0
                        ) {

                            initialize();

                        }

                    },
                    {
                        once: true
                    }
                );

            }
        );


        if (
            imagesLeft === 0
        ) {

            initialize();

        }

    }


    /* =====================================================
       FIRST FRAME
       ===================================================== */

    requestAnimationFrame(
        function () {

            calculateWidth();

            updateScroll();

        }
    );


    /* =====================================================
       DEBUG
       ===================================================== */

    console.log(
        "Phase 4: Pinned Horizontal Timeline initialized."
    );


})();