#include <emscripten.h>
#include <emscripten/html5.h>
#include <GLES3/gl3.h>

#include <algorithm>
#include <cstdio>


// Global Animation State

float targetScroll = 0.0f;
float currentScroll = 0.0f;

float targetMouseX = 0.0f;
float targetMouseY = 0.0f;

float currentMouseX = 0.0f;
float currentMouseY = 0.0f;

float elapsedTime = 0.0f;


// ========================================
// EXPORTED C++ FUNCTIONS
// ========================================

extern "C"
{

    EMSCRIPTEN_KEEPALIVE
        void setScrollProgress(float progress)
    {
        targetScroll = std::clamp(
            progress,
            0.0f,
            1.0f
        );
    }


    EMSCRIPTEN_KEEPALIVE
        void setMousePosition(
            float x,
            float y
        )
    {
        targetMouseX = std::clamp(
            x,
            -1.0f,
            1.0f
        );

        targetMouseY = std::clamp(
            y,
            -1.0f,
            1.0f
        );
    }

}


// ========================================
// JAVASCRIPT: SINGLE INITIALIZATION
// ========================================

EM_JS(
    void,
    initializeJavaScript,
    (),
    {
        // ====================================
        // SCROLL
        // ====================================

        window.addEventListener(
            "scroll",
            function()
            {
                var scrollTop =
                    window.scrollY || 0;

                var documentHeight =
                    document.documentElement.scrollHeight;

                var viewportHeight =
                    window.innerHeight;

                var maxScroll =
                    documentHeight - viewportHeight;

                var progress = 0.0;

                if (maxScroll > 0)
                {
                    progress =
                        scrollTop / maxScroll;
                }

                if (
                    typeof Module != "undefined" &&
                    typeof Module._setScrollProgress == "function"
                )
                {
                    Module._setScrollProgress(progress);
                }
            },
            {
                passive: true
            }
        );


        // ====================================
        // MOUSE
        // ====================================

        window.addEventListener(
            "mousemove",
            function(event)
            {
                var width =
                    window.innerWidth;

                var height =
                    window.innerHeight;

                if (width <= 0 || height <= 0)
                {
                    return;
                }

                var x =
                    (event.clientX / width) * 2.0 - 1.0;

                var y =
                    (event.clientY / height) * 2.0 - 1.0;

                if (
                    typeof Module != "undefined" &&
                    typeof Module._setMousePosition == "function"
                )
                {
                    Module._setMousePosition(
                        x,
                        y
                    );
                }
            },
            {
                passive: true
            }
        );


        // ====================================
        // SCROLL BUTTON + MUSIC
        // ====================================

        var scrollButton =
            document.getElementById(
                "scrollButton"
            );

        var music =
            document.getElementById(
                "weddingMusic"
            );

        if (scrollButton)
        {
            scrollButton.addEventListener(
                "click",
                function()
                {
                    if (music)
                    {
                        music.volume = 0.65;

                        var playPromise =
                            music.play();

                        if (playPromise)
                        {
                            playPromise.catch (
                                function(error)
                                {
                                    console.log(
                                        "Music playback waiting for user interaction.",
                                        error
                                    );
                                }
                            );
                        }
                    }

                    window.scrollTo(
                        {
                            top:
                                window.innerHeight,

                            behavior :
                                "smooth"
                        }
                    );
                }
            );
        }


        // ====================================
        // MUTE BUTTON
        // ====================================

        var muteButton =
            document.getElementById(
                "muteButton"
            );

        if (muteButton && music)
        {
            var muted = true;

            muteButton.addEventListener(
                "click",
                function()
                {
                    if (music.paused)
                    {
                        music.volume = 0.65;

                        music.play()
                            .then(
                                function()
                                {
                                    muted = false;

                                    muteButton.innerHTML =
                                        '<span class="mute-icon">♫</span>';

                                    muteButton.style.opacity =
                                        "1";
                                }
                            )
                            .catch (
                                function(error)
                                {
                                    console.log(
                                        "Could not start music.",
                                        error
                                    );
                                }
                            );

                        return;
                    }

                    music.muted =
                        !music.muted;

                    muted =
                        music.muted;

                    if (muted)
                    {
                        muteButton.innerHTML =
                            '<span class="mute-icon">♩</span>';

                        muteButton.style.opacity =
                            "0.60";
                    }
                    else
                    {
                        muteButton.innerHTML =
                            '<span class="mute-icon">♫</span>';

                        muteButton.style.opacity =
                            "1";
                    }
                }
            );
        }


        // ====================================
        // INITIAL SCROLL STATE
        // ====================================

        window.dispatchEvent(
            new Event("scroll")
        );
    }
);


// ========================================
// UPDATE DOM
// ========================================

void updateDOM()
{
    EM_ASM(
        {
            document.documentElement.style.setProperty(
                "--scroll-progress",
                String($0)
            );

            document.documentElement.style.setProperty(
                "--mouse-x",
                String($1)
            );

            document.documentElement.style.setProperty(
                "--mouse-y",
                String($2)
            );
        },

        currentScroll,
        currentMouseX,
        currentMouseY
    );
}


// ========================================
// WEBGL VERTEX SHADER
// ========================================

const char* vertexShaderSource =
R"(#version 300 es

precision highp float;

layout(location = 0)
in vec2 a_position;

out vec2 v_uv;

void main()
{
    v_uv =
        a_position * 0.5 +
        0.5;

    gl_Position =
        vec4(
            a_position,
            0.0,
            1.0
        );
}

)";


// ========================================
// WEBGL FRAGMENT SHADER
// ========================================

const char* fragmentShaderSource =
R"(#version 300 es

precision highp float;

in vec2 v_uv;

out vec4 outColor;

uniform float u_time;
uniform float u_scroll;
uniform vec2 u_mouse;


 -------
// RANDOM
 -------

float randomValue(vec2 position)
{
    return fract(
        sin(
            dot(
                position,
                vec2(
                    12.9898,
                    78.233
                )
            )
        )
        *
        43758.5453123
    );
}


 -------
// MAIN
 -------

void main()
{
    vec2 uv =
        v_uv;


    // Mouse parallax

    uv.x +=
        u_mouse.x * 0.015;

    uv.y +=
        u_mouse.y * 0.015;


    // Sky colors

    vec3 topColor =
        vec3(
            0.48,
            0.60,
            0.70
        );

    vec3 bottomColor =
        vec3(
            0.84,
            0.86,
            0.82
        );


    float skyGradient =
        smoothstep(
            0.0,
            1.0,
            uv.y
        );


    vec3 color =
        mix(
            bottomColor,
            topColor,
            skyGradient
        );


    // Soft moving light

    float lightX =
        sin(
            u_time * 0.12
        ) * 0.15;


    float distanceToLight =
        length(
            uv -
            vec2(
                0.50 + lightX,
                0.35
            )
        );


    float glow =
        smoothstep(
            0.60,
            0.0,
            distanceToLight
        );


    color +=
        vec3(
            0.10,
            0.08,
            0.05
        )
        *
        glow
        *
        0.15;


    // Grain

    float noise =
        randomValue(
            uv * 800.0
        );


    color +=
        (noise - 0.5)
        *
        0.018;


    // Vignette

    vec2 center =
        uv - vec2(0.5);


    float vignette =
        smoothstep(
            0.25,
            0.85,
            length(center)
        );


    color *=
        1.0 -
        vignette * 0.10;


    outColor =
        vec4(
            color,
            1.0
        );
}

)";


// webgl globals

GLuint shaderProgram = 0;

GLuint quadBuffer = 0;

GLint timeLocation = -1;

GLint scrollLocation = -1;

GLint mouseLocation = -1;

EMSCRIPTEN_WEBGL_CONTEXT_HANDLE webglContext = 0;


// compile shader

GLuint compileShader(
    GLenum shaderType,
    const char* source
)
{
    GLuint shader =
        glCreateShader(
            shaderType
        );


    glShaderSource(
        shader,
        1,
        &source,
        nullptr
    );


    glCompileShader(
        shader
    );


    GLint success = 0;


    glGetShaderiv(
        shader,
        GL_COMPILE_STATUS,
        &success
    );


    if (!success)
    {
        char log[2048];

        glGetShaderInfoLog(
            shader,
            sizeof(log),
            nullptr,
            log
        );

        printf(
            "\n"
            "===========================\n"
            "WEBGL SHADER ERROR\n"
            "===========================\n"
            "%s\n",
            log
        );
    }


    return shader;
}


//create shader program

GLuint createShaderProgram()
{
    GLuint vertexShader =
        compileShader(
            GL_VERTEX_SHADER,
            vertexShaderSource
        );


    GLuint fragmentShader =
        compileShader(
            GL_FRAGMENT_SHADER,
            fragmentShaderSource
        );


    GLuint program =
        glCreateProgram();


    glAttachShader(
        program,
        vertexShader
    );


    glAttachShader(
        program,
        fragmentShader
    );


    glLinkProgram(
        program
    );


    GLint success = 0;


    glGetProgramiv(
        program,
        GL_LINK_STATUS,
        &success
    );


    if (!success)
    {
        char log[2048];

        glGetProgramInfoLog(
            program,
            sizeof(log),
            nullptr,
            log
        );

        printf(
            "\n"
            "===========================\n"
            "WEBGL PROGRAM ERROR\n"
            "===========================\n"
            "%s\n",
            log
        );
    }


    glDeleteShader(
        vertexShader
    );

    glDeleteShader(
        fragmentShader
    );


    return program;
}


// resize canvas

void resizeCanvas()
{
    double width = 0.0;

    double height = 0.0;


    emscripten_get_element_css_size(
        "#webgl",
        &width,
        &height
    );


    int pixelWidth =
        static_cast<int>(
            width
            );


    int pixelHeight =
        static_cast<int>(
            height
            );


    if (pixelWidth < 1)
    {
        pixelWidth = 1;
    }


    if (pixelHeight < 1)
    {
        pixelHeight = 1;
    }


    emscripten_set_canvas_element_size(
        "#webgl",
        pixelWidth,
        pixelHeight
    );


    glViewport(
        0,
        0,
        pixelWidth,
        pixelHeight
    );
}


// resize callback
EM_BOOL onResize(
    int eventType,
    const EmscriptenUiEvent* event,
    void* userData
)
{
    resizeCanvas();

    return EM_TRUE;
}


// initialize webgl

bool initializeWebGL()
{
    EmscriptenWebGLContextAttributes attributes;


    emscripten_webgl_init_context_attributes(
        &attributes
    );


    attributes.majorVersion = 2;

    attributes.minorVersion = 0;

    attributes.alpha = true;

    attributes.antialias = true;

    attributes.depth = false;

    attributes.stencil = false;


    webglContext =
        emscripten_webgl_create_context(
            "#webgl",
            &attributes
        );


    if (webglContext <= 0)
    {
        printf(
            "ERROR: WebGL 2 context failed.\n"
        );

        return false;
    }


    EMSCRIPTEN_RESULT result =
        emscripten_webgl_make_context_current(
            webglContext
        );


    if (
        result !=
        EMSCRIPTEN_RESULT_SUCCESS
        )
    {
        printf(
            "ERROR: WebGL context could not be activated.\n"
        );

        return false;
    }


    shaderProgram =
        createShaderProgram();


    if (!shaderProgram)
    {
        return false;
    }


    timeLocation =
        glGetUniformLocation(
            shaderProgram,
            "u_time"
        );


    scrollLocation =
        glGetUniformLocation(
            shaderProgram,
            "u_scroll"
        );


    mouseLocation =
        glGetUniformLocation(
            shaderProgram,
            "u_mouse"
        );


    // Fullscreen triangle

    const float vertices[] =
    {
        -1.0f,
        -1.0f,

         3.0f,
        -1.0f,

        -1.0f,
         3.0f
    };


    glGenBuffers(
        1,
        &quadBuffer
    );


    glBindBuffer(
        GL_ARRAY_BUFFER,
        quadBuffer
    );


    glBufferData(
        GL_ARRAY_BUFFER,
        sizeof(vertices),
        vertices,
        GL_STATIC_DRAW
    );


    resizeCanvas();


    emscripten_set_resize_callback(
        EMSCRIPTEN_EVENT_TARGET_WINDOW,
        nullptr,
        true,
        onResize
    );


    return true;
}


// Animation Update

void updateAnimation()
{
    // Scroll smoothing

    currentScroll +=
        (
            targetScroll -
            currentScroll
            )
        *
        0.075f;


    // Mouse smoothing

    currentMouseX +=
        (
            targetMouseX -
            currentMouseX
            )
        *
        0.08f;


    currentMouseY +=
        (
            targetMouseY -
            currentMouseY
            )
        *
        0.08f;
}



// Web GL render
void renderWebGL()
{
    glClearColor(
        0.72f,
        0.78f,
        0.83f,
        1.0f
    );


    glClear(
        GL_COLOR_BUFFER_BIT
    );


    glUseProgram(
        shaderProgram
    );


    if (timeLocation >= 0)
    {
        glUniform1f(
            timeLocation,
            elapsedTime
        );
    }


    if (scrollLocation >= 0)
    {
        glUniform1f(
            scrollLocation,
            currentScroll
        );
    }


    if (mouseLocation >= 0)
    {
        glUniform2f(
            mouseLocation,
            currentMouseX,
            currentMouseY
        );
    }


    glBindBuffer(
        GL_ARRAY_BUFFER,
        quadBuffer
    );


    glEnableVertexAttribArray(
        0
    );


    glVertexAttribPointer(
        0,
        2,
        GL_FLOAT,
        GL_FALSE,
        0,
        nullptr
    );


    glDrawArrays(
        GL_TRIANGLES,
        0,
        3
    );


    glDisableVertexAttribArray(
        0
    );
}


void mainLoop()
{
    elapsedTime +=
        0.016f;


    updateAnimation();

    updateDOM();

    renderWebGL();
}



int main()
{
    printf(
        "\n"
        "===========================\n"
        "     WEBCPP WEDDING EXPERIENCE\n"
        "             PHASE 1\n"
        "===========================\n"
    );


    if (!initializeWebGL())
    {
        printf(
            "WebGL initialization failed.\n"
        );

        return 1;
    }


    initializeJavaScript();


    printf(
        "WebGL: READY\n"
    );


    printf(
        "Scroll Engine: READY\n"
    );


    printf(
        "Mouse Parallax: READY\n"
    );


    printf(
        "Hero Engine: READY\n"
    );


    emscripten_set_main_loop(
        mainLoop,
        0,
        true
    );


    return 0;
}