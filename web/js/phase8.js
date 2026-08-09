/* =========================================================
   PHASE 8
   FINAL HERO
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const section =
        document.getElementById(
            "phase8"
        );


    if (!section) {

        console.warn(
            "Phase 8: #phase8 not found."
        );

        return;

    }


    const frame =
        section.querySelector(
            ".phase8-frame"
        );


    const background =
        section.querySelector(
            ".phase8-background-image"
        );


    const rsvpButton =
        document.getElementById(
            "phase8RsvpButton"
        );


    const modal =
        document.getElementById(
            "phase8Modal"
        );


    const modalClose =
        document.getElementById(
            "phase8ModalClose"
        );


    const modalBackdrop =
        section.querySelector(
            ".phase8-modal-backdrop"
        );


    const form =
        document.getElementById(
            "phase8RsvpForm"
        );


    /* =====================================================
       SECTION REVEAL
       ===================================================== */

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
                threshold: 0.18,

                rootMargin:
                    "0px 0px -80px 0px"

            }

        );


    revealObserver.observe(
        section
    );


    /* =====================================================
       CINEMATIC PARALLAX
       ===================================================== */

    let ticking = false;


    function updateParallax() {

        const rect =
            frame.getBoundingClientRect();


        const viewportHeight =
            window.innerHeight;


        const center =
            rect.top +
            rect.height / 2;


        const distance =
            (
                center -
                viewportHeight / 2
            ) /
            viewportHeight;


        const movement =
            distance * -24;


        if (background) {

            background.style.transform =
                "translate3d(0, " +
                movement +
                "px, 0) scale(1.06)";

        }


        ticking = false;

    }


    function requestParallax() {

        if (!ticking) {

            window.requestAnimationFrame(
                updateParallax
            );

            ticking = true;

        }

    }


    window.addEventListener(
        "scroll",
        requestParallax,
        {
            passive: true
        }
    );


    window.addEventListener(
        "resize",
        requestParallax
    );


    requestParallax();


    /* =====================================================
       RSVP MODAL OPEN
       ===================================================== */

    function openModal() {

        if (!modal) {

            return;

        }


        modal.classList.add(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        setTimeout(
            function () {

                const firstInput =
                    modal.querySelector(
                        "input"
                    );


                if (firstInput) {

                    firstInput.focus();

                }

            },
            350
        );

    }


    /* =====================================================
       RSVP MODAL CLOSE
       ===================================================== */

    function closeModal() {

        if (!modal) {

            return;

        }


        modal.classList.remove(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }


    /* =====================================================
       RSVP BUTTON
       ===================================================== */

    if (rsvpButton) {

        rsvpButton.addEventListener(
            "click",
            function () {

                openModal();

            }
        );

    }


    /* =====================================================
       CLOSE BUTTON
       ===================================================== */

    if (modalClose) {

        modalClose.addEventListener(
            "click",
            function () {

                closeModal();

            }
        );

    }


    /* =====================================================
       BACKDROP CLOSE
       ===================================================== */

    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            function () {

                closeModal();

            }
        );

    }


    /* =====================================================
       ESCAPE KEY
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key ===
                "Escape"
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       RSVP FORM
       ===================================================== */

    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();


                const formData =
                    new FormData(
                        form
                    );


                const name =
                    formData.get(
                        "name"
                    );


                const attendance =
                    formData.get(
                        "attendance"
                    );


                console.log(
                    "RSVP:",
                    {
                        name:
                            name,

                        attendance:
                            attendance
                    }
                );


                /*
                 * Frontend demo.
                 *
                 * Yahan baad mein
                 * backend / Google Sheets /
                 * email API connect kar sakte ho.
                 */


                const submitButton =
                    form.querySelector(
                        "button"
                    );


                if (submitButton) {

                    const originalHTML =
                        submitButton.innerHTML;


                    submitButton.innerHTML =
                        "Thank you ♥";


                    submitButton.disabled =
                        true;


                    setTimeout(
                        function () {

                            submitButton.innerHTML =
                                originalHTML;

                            submitButton.disabled =
                                false;

                            form.reset();

                            closeModal();

                        },
                        1600
                    );

                }

            }
        );

    }


    /* =====================================================
       MOUSE PARALLAX
       ===================================================== */

    const canHover =
        window.matchMedia(
            "(hover: hover)"
        ).matches;


    if (canHover) {

        frame.addEventListener(
            "mousemove",
            function (event) {

                const rect =
                    frame.getBoundingClientRect();


                const x =
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width;


                const y =
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height;


                const moveX =
                    (
                        x -
                        0.5
                    ) *
                    8;


                const moveY =
                    (
                        y -
                        0.5
                    ) *
                    5;


                /*
                 * Very subtle cinematic
                 * movement.
                 */

                if (background) {

                    background.style.transform =
                        "translate3d(" +
                        moveX +
                        "px, " +
                        moveY +
                        "px, 0) scale(1.06)";

                }

            }
        );


        frame.addEventListener(
            "mouseleave",
            function () {

                if (background) {

                    background.style.transform =
                        "translate3d(0, 0, 0) scale(1.06)";

                }

            }
        );

    }


    /* =====================================================
       FINAL CONSOLE
       ===================================================== */

    console.log(
        "Phase 8: Final wedding hero initialized."
    );

})();