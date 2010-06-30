Array.prototype.concat_el = function(arr) {
	for (var i = 0; i < arr.length; i++) {
		this.push(arr[i]);
	}
};

isLineCollidingCircle = function(line, circle) {
	var ax = line[0],
			ay = line[1],
			bx = line[2],
			by = line[3],
			cx = circle[0],
			cy = circle[1],
			cr = circle[2];
	
	var dx = bx - ax;
	var dy = by - ay;
	
	var lab = Math.sqrt(dx * dx + dy * dy);
	
	dx = dx / lab;
	dy = dy / lab;
	
	var t = dx * (cx - ax) + dy * (cy - ay);
	if (t < 0) t = 0;
	if (t > lab) t = lab;
	
	var ex = t * dx + ax;
	var ey = t * dy + ay;
	
	var edx = ex - cx;
	var edy = ey - cy;
	
	var lec = Math.sqrt(edx * edx + edy * edy);
	
	return lec <= cr;
};

simplifyPath = function(path, tolerance) {
	if(path.length < 3) return path;
	
	var s = [path[0], path[path.length - 1]];
	var line = [s[0][0], s[0][1], s[1][0], s[1][1]];
	var c = [0, 0, tolerance], p, i;
	var exceded = false;
	
	for(i = 1; i < path.length - 1; i++) {
		p = path[i];
		c[0] = p[0], c[1] = p[1];
		
		if (!isLineCollidingCircle(line, c)) {
			exceded = true;
			break;
		}
	}
	
	if (exceded) {
		var m = Math.floor((path.length - 1) * 0.5);
		
		var s1 = simplifyPath(path.slice(0, m + 1), tolerance);
		var s2 = simplifyPath(path.slice(m), tolerance);
		
		s = s1;
		s.concat_el(s2.slice(1));
	}
	
	return s;
};