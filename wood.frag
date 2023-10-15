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

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

vec3 gradient(float x, vec3 start, vec3 stop1, float stopVal, vec3 end) {
	if (x < stopVal) {
		return mix(start, stop1, x / stopVal);
	} else {
		return mix(stop1, end, (x - stopVal) / (1.0 - stopVal));
	}
	return vec3(0.0);
}

void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x / u_resolution.y;
    vec2 tmp = st;
    st *= 4.;

    st = rotate2d(gradientnoise(st) + u_mouse.x * .0001) * st;

    st *= 3.;

    float lines = sin(st.y) * 0.5 + 0.5;

    vec3 color = gradient(
    	lines, 
    	vec3(1.0, 0.0, 0.0), 
    	vec3(0.0, 1.0, 0.0), 
    	0.5, 
    	vec3(0.0, 0.0, 1.0)
	);

	st /= 12.;
	color += vec3(random(tmp) * 0.5);


   // vec3 color = mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 0.0, 1.0), lines);


    gl_FragColor = vec4(color,1.0);
}
