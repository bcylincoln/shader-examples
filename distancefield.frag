#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

float valuenoise(vec2 st) {
    vec2 index = floor(st);
    vec2 fract = fract(st);
    fract = smoothstep(0.0, 1.0, fract);

    vec2 c1 = index;
    vec2 c2 = index + vec2(1.);
    vec2 c3 = vec2(index.x, index.y + 1.);
    vec2 c4 = vec2(index.x + 1., index.y);

    float m1 = mix(random(c1), random(c4), fract.x);
    float m2 = mix(random(c3), random(c2), fract.x);
    return mix(m1, m2, fract.y);
}

// Gradient Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/XdXGW8
float gradientnoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                     dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                     dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    st *= 10.;

    st += u_time / 2.;
    // float m = valuenoise(st);
    float m = gradientnoise(st) * 2. + .5;
    m *= 10.;
    m = floor(m);
    m /= 10.;

    vec3 color = vec3(m, 0.3, 0.7);

    gl_FragColor = vec4(color,1.0);
}
