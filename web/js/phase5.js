/* =========================================================
   PHASE 5
   WEDDING DAY TIMELINE ANIMATION
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const phase5 =
        document.getElementById(
            "phase5"
        );


    if (!phase5) {

        console.error(
            "Phase 5: #phase5 not found."
        );

        return;

    }


    const events =
        phase5.querySelectorAll(
            ".phase5-event"
        );


    const lineProgress =
        phase5.querySelector(
            ".phase5-line-progress"
        );


    const end =
        phase5.querySelector(
            ".phase5-end"
        );


    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const reduceMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (reduceMotion) {

        events.forEach(
            function (event) {

                event.classList.add(
                    "is-visible"
                );

            }
        );


        if (end) {

            end.classList.add(
                "is-visible"
            );

        }


        if (lineProgress) {

            lineProgress.style.height =
                "100%";

        }


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

                            entry.target.classList.add(
                                "is-visible"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.18,

                rootMargin:
                    "0px 0px -10% 0px"
            }
        );


    events.forEach(
        function (event) {

            observer.observe(
                event
            );

        }
    );


    /* =====================================================
       END OBSERVER
       ===================================================== */

    if (end) {

        const endObserver =
            new IntersectionObserver(
                function (entries) {

                    entries.forEach(
                        function (entry) {

                            if (
                                entry.isIntersecting
                            ) {

                                end.classList.add(
                                    "is-visible"
                                );

                            }

                        }
                    );

                },
                {
                    threshold: 0.3
                }
            );


        endObserver.observe(
            end
        );

    }


    /* =====================================================
       TIMELINE LINE SCROLL PROGRESS
       ===================================================== */

    let ticking = false;


    function updateTimeline() {

        const rect =
            phase5.getBoundingClientRect();


        const viewportHeight =
            window.innerHeight;


        const sectionHeight =
            phase5.offsetHeight;


        /*
         * How much of the section
         * has passed through viewport.
         */

        const start =
            viewportHeight -
            rect.top;


        const total =
            sectionHeight +
            viewportHeight;


        let progress =
            start / total;


        progress =
            Math.max(
                0,
                Math.min(
                    1,
                    progress
                )
            );


        if (lineProgress) {

            lineProgress.style.height =
                (
                    progress *
                    100
                ) + "%";

        }


        ticking = false;

    }


    function requestTimelineUpdate() {

        if (!ticking) {

            window.requestAnimationFrame(
                updateTimeline
            );

            ticking = true;

        }

    }


    window.addEventListener(
        "scroll",
        requestTimelineUpdate,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        requestTimelineUpdate
    );


    /* =====================================================
       PHOTO PARALLAX
       ===================================================== */

    function updatePhotoParallax() {

        const viewportCenter =
            window.innerHeight / 2;


        events.forEach(
            function (event) {

                const rect =
                    event.getBoundingClientRect();


                const eventCenter =
                    rect.top +
                    rect.height / 2;


                const distance =
                    eventCenter -
                    viewportCenter;


                /*
                 * Very subtle movement.
                 *
                 * Isliye layout disturb nahi hoga.
                 */

                const movement =
                    Math.max(
                        -12,
                        Math.min(
                            12,
                            -distance * 0.018
                        )
                    );


                const stack =
                    event.querySelector(
                        ".phase5-photo-stack"
                    );


                if (!stack) {

                    return;

                }


                stack.style.transform =
                    "translate3d(0," +
                    movement +
                    "px,0)";

            }
        );

    }


    let parallaxTicking =
        false;


    function requestParallax() {

        if (
            !parallaxTicking
        ) {

            window.requestAnimationFrame(
                function () {

                    updatePhotoParallax();

                    parallaxTicking =
                        false;

                }
            );


            parallaxTicking =
                true;

        }

    }


    window.addEventListener(
        "scroll",
        requestParallax,
        {
            passive: true
        }
    );


    /* =====================================================
       ACTIVE EVENT
       ===================================================== */

    const activeObserver =
        new IntersectionObserver(
            function (entries) {

                entries.forEach(
                    function (entry) {

                        if (
                            entry.isIntersecting
                        ) {

                            events.forEach(
                                function (event) {

                                    event.classList.remove(
                                        "is-active"
                                    );

                                }
                            );


                            entry.target.classList.add(
                                "is-active"
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.55
            }
        );


    events.forEach(
        function (event) {

            activeObserver.observe(
                event
            );

        }
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    requestTimelineUpdate();

    requestParallax();


    console.log(
        "Phase 5: Wedding Day Timeline initialized."
    );


})();