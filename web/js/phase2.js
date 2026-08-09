/* =========================================================
   PHASE 2
   Scratch Reveal Engine
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       DOM
       ===================================================== */

    const card =
        document.getElementById(
            "scratchCard"
        );


    const canvas =
        document.getElementById(
            "scratchCanvas"
        );


    if (!card || !canvas) {

        console.error(
            "Phase 2: scratch elements not found."
        );

        return;
    }


    const ctx =
        canvas.getContext(
            "2d",
            {
                willReadFrequently: true
            }
        );


    if (!ctx) {

        console.error(
            "Phase 2: Canvas not supported."
        );

        return;
    }


    /* =====================================================
       STATE
       ===================================================== */

    let isDrawing = false;

    let revealed = false;

    let lastX = 0;

    let lastY = 0;

    let scratchedPixels = 0;

    let totalPixels = 0;


    /* =====================================================
       CONFIG
       ===================================================== */

    const BRUSH_SIZE = 58;

    const REVEAL_PERCENT = 0.48;


    /* =====================================================
       RESIZE CANVAS
       ===================================================== */

    function resizeCanvas() {

        const rect =
            card.getBoundingClientRect();


        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        canvas.width =
            Math.floor(
                rect.width * dpr
            );


        canvas.height =
            Math.floor(
                rect.height * dpr
            );


        canvas.style.width =
            rect.width + "px";


        canvas.style.height =
            rect.height + "px";


        ctx.setTransform(
            dpr,
            0,
            0,
            dpr,
            0,
            0
        );


        drawGoldSurface(
            rect.width,
            rect.height
        );
    }


    /* =====================================================
       GOLD SURFACE
       ===================================================== */

    function drawGoldSurface(
        width,
        height
    ) {

        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        /*
         * Main gold layer
         */

        const gradient =
            ctx.createLinearGradient(
                0,
                0,
                width,
                height
            );


        gradient.addColorStop(
            0,
            "#9f681c"
        );


        gradient.addColorStop(
            0.18,
            "#d99c32"
        );


        gradient.addColorStop(
            0.38,
            "#f2c861"
        );


        gradient.addColorStop(
            0.57,
            "#c58a28"
        );


        gradient.addColorStop(
            0.73,
            "#f7d56f"
        );


        gradient.addColorStop(
            1,
            "#b87920"
        );


        ctx.fillStyle =
            gradient;


        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * Golden light
         */

        const light =
            ctx.createRadialGradient(
                width * 0.78,
                height * 0.25,
                10,
                width * 0.78,
                height * 0.25,
                width * 0.7
            );


        light.addColorStop(
            0,
            "rgba(255,250,205,0.48)"
        );


        light.addColorStop(
            0.5,
            "rgba(255,220,120,0.14)"
        );


        light.addColorStop(
            1,
            "rgba(255,220,120,0)"
        );


        ctx.fillStyle =
            light;


        ctx.fillRect(
            0,
            0,
            width,
            height
        );


        /*
         * Texture
         */

        ctx.save();


        ctx.globalAlpha =
            0.15;


        for (
            let i = 0;
            i < 900;
            i++
        ) {

            const x =
                Math.random() *
                width;


            const y =
                Math.random() *
                height;


            const size =
                Math.random() *
                2.2;


            ctx.fillStyle =
                Math.random() > 0.5
                    ? "#fff2b2"
                    : "#70420d";


            ctx.fillRect(
                x,
                y,
                size,
                size
            );
        }


        ctx.restore();


        /*
         * Fine lines
         */

        ctx.save();


        ctx.globalAlpha =
            0.12;


        ctx.lineWidth = 1;


        for (
            let y = -height;
            y < height * 2;
            y += 5
        ) {

            ctx.beginPath();

            ctx.moveTo(
                0,
                y
            );

            ctx.lineTo(
                width,
                y + width * 0.08
            );

            ctx.strokeStyle =
                "#fff0b0";

            ctx.stroke();
        }


        ctx.restore();


        /*
         * Total pixels
         */

        totalPixels =
            width *
            height;
    }


    /* =====================================================
       POSITION
       ===================================================== */

    function getPosition(
        event
    ) {

        const rect =
            canvas.getBoundingClientRect();


        let clientX;

        let clientY;


        if (
            event.touches &&
            event.touches.length
        ) {

            clientX =
                event.touches[0].clientX;

            clientY =
                event.touches[0].clientY;

        }
        else {

            clientX =
                event.clientX;

            clientY =
                event.clientY;
        }


        return {

            x:
                clientX -
                rect.left,

            y:
                clientY -
                rect.top

        };
    }


    /* =====================================================
       START SCRATCH
       ===================================================== */

    function startScratch(
        event
    ) {

        if (revealed) {
            return;
        }


        isDrawing = true;


        const position =
            getPosition(event);


        lastX =
            position.x;


        lastY =
            position.y;


        scratch(
            lastX,
            lastY,
            lastX,
            lastY
        );


        event.preventDefault();
    }


    /* =====================================================
       MOVE SCRATCH
       ===================================================== */

    function moveScratch(
        event
    ) {

        if (
            !isDrawing ||
            revealed
        ) {
            return;
        }


        const position =
            getPosition(event);


        scratch(
            lastX,
            lastY,
            position.x,
            position.y
        );


        lastX =
            position.x;


        lastY =
            position.y;


        event.preventDefault();
    }


    /* =====================================================
       END SCRATCH
       ===================================================== */

    function endScratch() {

        isDrawing = false;

        checkReveal();
    }


    /* =====================================================
       DRAW SCRATCH
       ===================================================== */

    function scratch(
        x1,
        y1,
        x2,
        y2
    ) {

        ctx.save();


        ctx.globalCompositeOperation =
            "destination-out";


        ctx.lineWidth =
            BRUSH_SIZE;


        ctx.lineCap =
            "round";


        ctx.lineJoin =
            "round";


        ctx.beginPath();


        ctx.moveTo(
            x1,
            y1
        );


        ctx.lineTo(
            x2,
            y2
        );


        ctx.stroke();


        /*
         * Round brush
         */

        ctx.beginPath();


        ctx.arc(
            x2,
            y2,
            BRUSH_SIZE / 2,
            0,
            Math.PI * 2
        );


        ctx.fill();


        ctx.restore();
    }


    /* =====================================================
       CHECK REVEAL
       ===================================================== */

    function checkReveal() {

        if (revealed) {
            return;
        }


        const rect =
            card.getBoundingClientRect();


        const width =
            Math.floor(rect.width);


        const height =
            Math.floor(rect.height);


        /*
         * Sample pixels instead of
         * checking every pixel.
         */

        const sampleStep = 8;


        let transparent = 0;

        let samples = 0;


        const dpr =
            Math.min(
                window.devicePixelRatio || 1,
                2
            );


        const image =
            ctx.getImageData(
                0,
                0,
                canvas.width,
                canvas.height
            );


        for (
            let y = 0;
            y < height;
            y += sampleStep
        ) {

            for (
                let x = 0;
                x < width;
                x += sampleStep
            ) {

                const pixelX =
                    Math.floor(
                        x * dpr
                    );


                const pixelY =
                    Math.floor(
                        y * dpr
                    );


                const index =
                    (
                        pixelY *
                        canvas.width +
                        pixelX
                    )
                    *
                    4;


                if (
                    image.data[index + 3]
                    <
                    80
                ) {

                    transparent++;
                }


                samples++;
            }
        }


        if (!samples) {
            return;
        }


        scratchedPixels =
            transparent /
            samples;


        if (
            scratchedPixels >=
            REVEAL_PERCENT
        ) {

            revealCard();
        }
    }


    /* =====================================================
       REVEAL CARD
       ===================================================== */

    function revealCard() {

        if (revealed) {
            return;
        }


        revealed = true;


        card.classList.add(
            "revealed"
        );


        /*
         * Fade remaining gold
         */

        canvas.style.transition =
            "opacity 700ms cubic-bezier(0.22, 1, 0.36, 1)";


        canvas.style.opacity =
            "0";


        /*
         * Remove after animation
         */

        window.setTimeout(
            function () {

                canvas.style.pointerEvents =
                    "none";

            },
            750
        );


        /*
         * Small event for future
         * C++ / animation integration.
         */

        window.dispatchEvent(
            new CustomEvent(
                "phase2RevealComplete"
            )
        );
    }


    /* =====================================================
       POINTER EVENTS
       ===================================================== */

    canvas.addEventListener(
        "mousedown",
        startScratch
    );


    window.addEventListener(
        "mousemove",
        moveScratch
    );


    window.addEventListener(
        "mouseup",
        endScratch
    );


    /* =====================================================
       TOUCH EVENTS
       ===================================================== */

    canvas.addEventListener(
        "touchstart",
        startScratch,
        {
            passive: false
        }
    );


    window.addEventListener(
        "touchmove",
        moveScratch,
        {
            passive: false
        }
    );


    window.addEventListener(
        "touchend",
        endScratch,
        {
            passive: true
        }
    );


    /* =====================================================
       RESIZE
       ===================================================== */

    let resizeTimer;


    window.addEventListener(
        "resize",
        function () {

            clearTimeout(
                resizeTimer
            );


            resizeTimer =
                setTimeout(
                    function () {

                        if (!revealed) {

                            resizeCanvas();

                        }

                    },
                    150
                );
        }
    );


    /* =====================================================
       INITIALIZE
       ===================================================== */

    resizeCanvas();


})();