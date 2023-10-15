#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

float circle(in vec2 _st, in float _radius){
    vec2 dist = _st-vec2(0.5);
    float r2 = _radius * _radius;
	return 1.-smoothstep(r2-(r2*0.01),
                         r2+(r2*0.01),
                         dot(dist,dist));
}


float vertical_motion(float pct) {
	return fract(pct) * floor(mod(pct, 2.0));
}

float horizontal_motion(float pct) {
	return vertical_motion(pct - 1.0);
}

float canvas_motion(float pct) {
	return floor(mod(pct * 0.5, 2.0));
}

vec2 tileSpace(vec2 _st, float offset_x, float offset_y, float _zoom){
    _st *= _zoom;

    // Here is where the offset is happening
    float tmp = _st.x;

    _st.x += step(1., mod(_st.y, 2.0)) * offset_x;
    _st.x += step(1., mod(_st.y + 1.0, 2.0)) * -offset_x;
    

    _st.y += step(1., mod(tmp , 2.0)) * offset_y;
    _st.y += step(1., mod(tmp + 1.0, 2.0)) * -offset_y;


    return fract(_st);
}


void main (void) {
    vec2 st = gl_FragCoord.xy/u_resolution.xy;

    st.x *= u_resolution.x/u_resolution.y;

    float zoom = 20.0;
    float tileSize = 1. / zoom;

    st.x += (tileSize / 2.) * canvas_motion(u_time + 1.0);
    st.y += (tileSize / 2.) * canvas_motion(u_time);

    float offs_x = 0.5 * horizontal_motion(u_time);
    float offs_y = 0.5 * vertical_motion(u_time);

    st = tileSpace(st, offs_x, offs_y, zoom);



    vec3 color = vec3(0.0);
    float dot = circle(st, 0.3);
    float bkg = 1.0 - dot;
    color += (vec3(1.0, 0.0, 0.0) * dot) + (vec3(1.0) * bkg);
    gl_FragColor = vec4(color,1.0);
}
