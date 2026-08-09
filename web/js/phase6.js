/* =========================================================
   PHASE 6
   ADDITIONAL DETAILS
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       DATA
       ===================================================== */

    const details = {

        accommodations: {

            title:
                "Accommodations",

            image:
                "assets/images/details-accommodations.jpg",

            text:
                "We've gathered a selection of comfortable places to stay close to the celebration. Choose the option that feels right for you and enjoy a relaxed stay surrounded by everything you need."
        },


        food: {

            title:
                "Food & Drinks",

            image:
                "assets/images/details-food.jpg",

            text:
                "From welcome drinks and delicious bites to dinner and late-evening treats, we've planned a selection of food and drinks for everyone to enjoy throughout the celebration."
        },


        dress: {

            title:
                "Dress Code",

            image:
                "assets/images/details-dress-code.jpg",

            text:
                "Come dressed for a beautiful evening of celebration. We recommend elegant, comfortable attire that lets you enjoy every moment, from dinner through the final dance."
        }

    };


    /* =====================================================
       ROOT
       ===================================================== */

    const section =
        document.getElementById(
            "phase6"
        );


    if (!section) {

        console.error(
            "Phase 6: #phase6 not found."
        );

        return;

    }


    /* =====================================================
       ELEMENTS
       ===================================================== */

    const cards =
        section.querySelectorAll(
            ".phase6-card"
        );


    const modal =
        section.querySelector(
            ".phase6-modal"
        );


    const modalImage =
        section.querySelector(
            ".phase6-modal-image img"
        );


    const modalTitle =
        section.querySelector(
            ".phase6-modal-content h3"
        );


    const modalText =
        section.querySelector(
            ".phase6-modal-content p"
        );


    const closeButton =
        section.querySelector(
            ".phase6-modal-close"
        );


    const backdrop =
        section.querySelector(
            ".phase6-modal-backdrop"
        );


    /* =====================================================
       REDUCED MOTION
       ===================================================== */

    const reducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* =====================================================
       CARD REVEAL
       ===================================================== */

    const revealObserver =
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


    cards.forEach(
        function (card) {

            revealObserver.observe(
                card
            );

        }
    );


    /* =====================================================
       IMAGE PARALLAX
       ===================================================== */

    if (!reducedMotion) {

        let ticking = false;


        function updateParallax() {

            const viewportCenter =
                window.innerHeight / 2;


            cards.forEach(
                function (card) {

                    const rect =
                        card.getBoundingClientRect();


                    const cardCenter =
                        rect.top +
                        rect.height / 2;


                    const distance =
                        cardCenter -
                        viewportCenter;


                    let offset =
                        distance * -0.025;


                    offset =
                        Math.max(
                            -10,
                            Math.min(
                                10,
                                offset
                            )
                        );


                    const image =
                        card.querySelector(
                            ".phase6-card-image img"
                        );


                    if (!image) {

                        return;

                    }


                    image.style.transform =
                        "scale(1.045) " +
                        "translate3d(0," +
                        offset +
                        "px,0)";

                }
            );


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

    }


    /* =====================================================
       OPEN MODAL
       ===================================================== */

    function openModal(
        key
    ) {

        const detail =
            details[key];


        if (!detail) {

            return;

        }


        modalImage.src =
            detail.image;

        modalImage.alt =
            detail.title;

        modalTitle.textContent =
            detail.title;

        modalText.textContent =
            detail.text;


        modal.classList.add(
            "is-open"
        );


        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";

    }


    /* =====================================================
       CLOSE MODAL
       ===================================================== */

    function closeModal() {

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
       CARD CLICK
       ===================================================== */

    cards.forEach(
        function (card) {

            const button =
                card.querySelector(
                    ".phase6-plus"
                );


            const key =
                card.dataset.detail;


            if (button) {

                button.addEventListener(
                    "click",
                    function (event) {

                        event.stopPropagation();

                        openModal(
                            key
                        );

                    }
                );

            }


            card.addEventListener(
                "click",
                function () {

                    openModal(
                        key
                    );

                }
            );

        }
    );


    /* =====================================================
       CLOSE EVENTS
       ===================================================== */

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeModal
        );

    }


    if (backdrop) {

        backdrop.addEventListener(
            "click",
            closeModal
        );

    }


    /* =====================================================
       ESCAPE
       ===================================================== */

    document.addEventListener(
        "keydown",
        function (event) {

            if (
                event.key === "Escape" &&
                modal.classList.contains(
                    "is-open"
                )
            ) {

                closeModal();

            }

        }
    );


    /* =====================================================
       MOUSE PARALLAX
       ===================================================== */

    if (!reducedMotion) {

        cards.forEach(
            function (card) {

                card.addEventListener(
                    "mousemove",
                    function (event) {

                        const rect =
                            card.getBoundingClientRect();


                        const x =
                            (
                                event.clientX -
                                rect.left
                            ) /
                            rect.width -
                            0.5;


                        const y =
                            (
                                event.clientY -
                                rect.top
                            ) /
                            rect.height -
                            0.5;


                        const image =
                            card.querySelector(
                                ".phase6-card-image img"
                            );


                        if (!image) {

                            return;

                        }


                        image.style.transform =
                            "scale(1.10) " +
                            "translate3d(" +
                            (
                                x * -8
                            ) +
                            "px," +
                            (
                                y * -8
                            ) +
                            "px,0)";

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    function () {

                        const image =
                            card.querySelector(
                                ".phase6-card-image img"
                            );


                        if (!image) {

                            return;

                        }


                        image.style.transform =
                            "scale(1.045) translate3d(0,0,0)";

                    }
                );

            }
        );

    }


    /* =====================================================
       INITIALIZE
       ===================================================== */

    console.log(
        "Phase 6: Additional Details initialized."
    );

})();