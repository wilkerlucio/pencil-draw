Array.prototype.concat_el = function(arr) {
	for (var i = 0; i < arr.length; i++) {
		this.push(arr[i]);
	}
};

Array.prototype.array_get_keys = function() {
	var keys = [];
	
	for (var i = 0; i < this.length; i++) {
		keys.push(i);
	}
	
	return keys;
};

linePointDistance = function(line, point) {
	var ax = line[0],
			ay = line[1],
			bx = line[2],
			by = line[3],
			cx = point[0],
			cy = point[1];

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
	
	return Math.sqrt(edx * edx + edy * edy);
};

isLineCollidingCircle = function(line, circle) {
	var cp = [circle[0], circle[1]];
	var cr = circle[2];
	
	var lec = linePointDistance(line, cp);
	return lec <= cr;
};

simplifyPathKeys = function(path, tolerance, left_index, right_index) {
	left_index = left_index || 0;
	right_index = right_index || path.length - 1;
	
	if((right_index - left_index) < 2) return path.array_get_keys().slice(left_index, right_index + 1);

	var s = [left_index, right_index];
	var line = [path[left_index][0], path[left_index][1], path[right_index][0], path[right_index][1]];
	var c = [0, 0, tolerance], p, i;
	var exceded = false;
	
	for(i = left_index + 1; i < right_index; i++) {
		p = path[i];
		c[0] = p[0], c[1] = p[1];
	
		if (!isLineCollidingCircle(line, c)) {
			exceded = true;
			break;
		}
	}

	if (exceded) {
		var m = Math.floor((right_index - left_index) * 0.5) + left_index;
		
		var s1 = simplifyPathKeys(path, tolerance, left_index, m);
		var s2 = simplifyPathKeys(path, tolerance, m, right_index);
	
		s = s1;
		s.concat_el(s2.slice(1));
	}
	
	return s;
};

simplifyPath = function(path, tolerance) {
	var keys = simplifyPathKeys(path, tolerance);
	var s = [];
	
	for (var i = 0; i < keys.length; i++) {
		s.push(path[keys[i]]);
	}
	
	return s;
};

curvedSimplifiedPath = function(path, tolerance) {
	var keys = simplifyPathKeys(path, tolerance);
	var s = [];
	s.push(path[0]);
	
	var c, p, d, pd;

	for (var i = 1; i < keys.length; i++) {
		c = keys[i];
		p = keys[i - 1];
		d = c - p;
		
		cp = path[c];
		pp = path[p];
		
		if (d == 1) { // dont smooth
			s.push([cp[0], cp[1], pp[0], pp[1], cp[0], cp[1]]);
		} else { // lets make the curve
			c1 = path[Math.ceil(d * 0.25) + p];
			c2 = path[Math.floor(d * 0.75) + p];
			
			s.push([c1[0], c1[1], c2[0], c2[1], cp[0], cp[1]]);
		}
	}
	
	return s;
};
