#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

#define PI 3.14159265358979323846

float rand(vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}

vec2 rotate2D (vec2 _st, float _angle) {
    _st -= 0.5;
    _st =  mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle)) * _st;
    _st += 0.5;
    return _st;
}

vec2 tile(vec2 _st, float zoom) {
	_st *= zoom;
	return fract(_st);
}

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
    float r2 = _radius * _radius;
	return 1.-smoothstep(r2-(r2*0.01),
                         r2+(r2*0.01),
                         dot(dist,dist));
}

// vec2 rotateTiles(vec2 _st) {
// 	_st *= 2.0;

// 	vec2 ii = floor(mod(_st, 2.0));
// 	float i = (ii.x * 2.0) + ii.y;

// 	if(i == 0.0) {
// 		_st = rotate2D(_st, PI);
// 	} 
// 	else if (i == 1.0) {
// 		//_st = rotate2D(_st, PI / 2.0);
// 	} else if (i == 2.0) {
// 		//_st = rotate2D(_st, 3.0 * PI/ 2.0);
// 	} else {
// 		_st = _st;
// 	}

// 	return fract(_st);
// }

float drawTile(vec2 _st) {
	return circle(_st - vec2(0.5, 0.5), 0.5) + circle(_st + vec2(0.5, 0.5), 0.5);
}

float truchetTile(vec2 _st, vec2 ii) {
	float toss = rand(ii);
	if (toss < 0.25) {
		return drawTile(_st);
	} else if (toss < 0.5) {
		return 1.0 - drawTile(_st);
	} else if (toss < 0.75) {
		_st = rotate2D(_st, PI / 2.);
		return drawTile(_st);
	} else {
		_st = rotate2D(_st, PI / 2.);
		return 1.0 - drawTile(_st);
	}
}

void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    st.y += u_time * 0.05;
    //st.x += sqrt(rand(st * u_time)) * 0.02;
    // st.y += rand(st * 2. * u_time);
    st *= 10.0;
    vec3 color = vec3(0.0);

    // triangles
    // vec3 color = vec3(step(st.y, st.x));
    // circles
    color = vec3(truchetTile(fract(st), floor(st)));

    gl_FragColor = vec4(color,1.0);
}
