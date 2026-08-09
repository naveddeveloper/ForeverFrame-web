/* =========================================================
   PHASE 3
   Wedding Venue Animation
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const section =
        document.getElementById(
            "phase3"
        );


    const image =
        document.getElementById(
            "phase3Image"
        );


    if (!section) {

        console.error(
            "Phase 3: section not found."
        );

        return;
    }


    /* =====================================================
       INTERSECTION OBSERVER
       ===================================================== */

    const observer =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            section.classList.add(
                                "is-visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.18
            }
        );


    observer.observe(
        section
    );


    /* =====================================================
       PARALLAX
       ===================================================== */

    let targetY = 0;

    let currentY = 0;


    function updateParallax() {

        const rect =
            section.getBoundingClientRect();


        const viewport =
            window.innerHeight;


        /*
         * Section center relative
         * to viewport center.
         */

        const sectionCenter =
            rect.top +
            rect.height / 2;


        const viewportCenter =
            viewport / 2;


        const distance =
            sectionCenter -
            viewportCenter;


        targetY =
            Math.max(
                -1,
                Math.min(
                    1,
                    distance /
                    viewport
                )
            );


        currentY +=
            (
                targetY -
                currentY
            )
            *
            0.055;


        if (image) {

            const offset =
                currentY *
                -18;


            image.style.transform =
                "translate3d(0, " +
                offset +
                "px, 0)";
        }


        requestAnimationFrame(
            updateParallax
        );
    }


    updateParallax();


    /* =====================================================
       MOUSE PARALLAX
       ===================================================== */

    let mouseX = 0;

    let mouseY = 0;

    let currentMouseX = 0;

    let currentMouseY = 0;


    window.addEventListener(
        "mousemove",
        function (event) {

            mouseX =
                (
                    event.clientX /
                    window.innerWidth
                )
                -
                0.5;


            mouseY =
                (
                    event.clientY /
                    window.innerHeight
                )
                -
                0.5;

        },
        {
            passive: true
        }
    );


    function updateMouse() {

        currentMouseX +=
            (
                mouseX -
                currentMouseX
            )
            *
            0.025;


        currentMouseY +=
            (
                mouseY -
                currentMouseY
            )
            *
            0.025;


        if (
            image &&
            section.classList.contains(
                "is-visible"
            )
        ) {

            /*
             * Only tiny movement.
             *
             * This keeps the illustration
             * elegant instead of making it
             * feel like a gaming UI.
             */

            const x =
                currentMouseX *
                8;


            const y =
                currentMouseY *
                5;


            const scrollOffset =
                currentY *
                -18;


            image.style.transform =
                "translate3d(" +
                x +
                "px, " +
                (
                    scrollOffset +
                    y
                ) +
                "px, 0)";
        }


        requestAnimationFrame(
            updateMouse
        );
    }


    updateMouse();


    /* =====================================================
       IMAGE LOAD
       ===================================================== */

    if (image) {

        image.addEventListener(
            "load",
            function () {

                image.classList.add(
                    "loaded"
                );

            }
        );

    }


    /* =====================================================
       CLEAN CONSOLE MESSAGE
       ===================================================== */

    console.log(
        "%cPHASE 3 — WEDDING VENUE READY",
        "font-weight:bold;"
    );

})();