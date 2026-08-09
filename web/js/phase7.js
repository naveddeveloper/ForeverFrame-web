/* =========================================================
   PHASE 7
   FAQ INTERACTION + ANIMATION
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ROOT
       ===================================================== */

    const section =
        document.getElementById(
            "phase7"
        );


    if (!section) {

        console.warn(
            "Phase 7: #phase7 was not found."
        );

        return;

    }


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const items =
        section.querySelectorAll(
            ".phase7-item"
        );


    const questions =
        section.querySelectorAll(
            ".phase7-question"
        );


    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       SECTION REVEAL
       ===================================================== */

    if (reducedMotion) {

        section.classList.add(
            "is-visible"
        );

    } else {

        const revealObserver =
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

                                revealObserver.unobserve(
                                    entry.target
                                );

                            }

                        }
                    );

                },

                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -100px 0px"
                }

            );


        revealObserver.observe(
            section
        );

    }


    /* =====================================================
       CLOSE ALL
       ===================================================== */

    function closeAll(
        exceptItem = null
    ) {

        items.forEach(
            function (item) {

                if (
                    item === exceptItem
                ) {

                    return;

                }


                item.classList.remove(
                    "is-open"
                );


                const button =
                    item.querySelector(
                        ".phase7-question"
                    );


                if (button) {

                    button.setAttribute(
                        "aria-expanded",
                        "false"
                    );

                }

            }
        );

    }


    /* =====================================================
       OPEN / CLOSE FAQ
       ===================================================== */

    function toggleItem(
        item
    ) {

        const button =
            item.querySelector(
                ".phase7-question"
            );


        if (!button) {

            return;

        }


        const isOpen =
            item.classList.contains(
                "is-open"
            );


        /*
         * Only one FAQ stays open
         * at a time.
         */

        closeAll(
            isOpen
                ? null
                : item
        );


        if (isOpen) {

            item.classList.remove(
                "is-open"
            );

            button.setAttribute(
                "aria-expanded",
                "false"
            );

        } else {

            item.classList.add(
                "is-open"
            );

            button.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    /* =====================================================
       CLICK EVENTS
       ===================================================== */

    questions.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    const item =
                        button.closest(
                            ".phase7-item"
                        );


                    if (!item) {

                        return;

                    }


                    toggleItem(
                        item
                    );

                }
            );

        }
    );


    /* =====================================================
       KEYBOARD SUPPORT
       ===================================================== */

    questions.forEach(
        function (button) {

            button.addEventListener(
                "keydown",
                function (event) {

                    if (
                        event.key ===
                        "Enter"
                    ) {

                        event.preventDefault();

                        button.click();

                    }


                    if (
                        event.key ===
                        " "
                    ) {

                        event.preventDefault();

                        button.click();

                    }

                }
            );

        }
    );


    /* =====================================================
       OPTIONAL: OPEN FIRST FAQ
       ===================================================== */

    /*
     * Disabled intentionally.
     *
     * The reference starts with every FAQ closed.
     *
     * If you ever want the first one open:
     *
     * toggleItem(items[0]);
     */


    /* =====================================================
       MOUSE MICRO-MOTION
       ===================================================== */

    if (!reducedMotion) {

        items.forEach(
            function (item) {

                const question =
                    item.querySelector(
                        ".phase7-question"
                    );


                const questionBox =
                    item.querySelector(
                        ".phase7-question-text"
                    );


                if (
                    !question ||
                    !questionBox
                ) {

                    return;

                }


                question.addEventListener(
                    "mousemove",
                    function (event) {

                        const rect =
                            question.getBoundingClientRect();


                        const relativeX =
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width;


                        const relativeY =
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height;


                        const moveX =
                            (
                                relativeX -
                                0.5
                            ) *
                            2;


                        const moveY =
                            (
                                relativeY -
                                0.5
                            ) *
                            2;


                        /*
                         * Extremely subtle
                         * cinematic movement.
                         */

                        questionBox.style.transform =
                            "translate(" +
                            (
                                moveX * 2
                            ) +
                            "px," +
                            (
                                moveY * 1.5
                            ) +
                            "px)";

                    }
                );


                question.addEventListener(
                    "mouseleave",
                    function () {

                        questionBox.style.transform =
                            "";

                    }
                );

            }
        );

    }


    /* =====================================================
       LOG
       ===================================================== */

    console.log(
        "Phase 7: FAQ initialized."
    );

})();