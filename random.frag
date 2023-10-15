#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float random (in float x) {
    return fract(sin(x + .001)*1e4);
}

float pattern(in vec2 _st, float offset) {
	_st.x -= offset;
	_st = floor(_st);
	return step(0.5, random(_st * .001));
}

void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    vec3 color = vec3(0.0);
    st.x *= 200.;
    st.y *= 50.;

    st.x += u_time * 10.;

    float vel = 50. * random(floor(st.y));
    float offset = vel * u_time;
 
 	float color1 = (1.0 - step(0.1, fract(st.y))) * pattern(st, offset + (random(floor(st.y)) * .5));
 	float color2 = (1.0 - step(0.1, fract(st.y))) * pattern(st, offset - (random(floor(st.y)) * .5));
    color = vec3(color2, color1, color2);
    gl_FragColor = vec4(color, 1.0);
}
