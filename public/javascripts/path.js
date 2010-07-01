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

Array.prototype.filter_keys = function(keys) {
	var new_array = [];
	var key_map = [];
	
	for (var i = 0; i < keys.length; i++) {
		var k = keys[i];
		new_array.push(this[k]);
		key_map.push(k);
	}
	
	return [new_array, key_map];
};

Math.lineSize = function(p1, p2) {
	var dx = p2[0] - p1[0];
			dy = p2[1] - p1[1];
	
	return Math.sqrt(dx * dx + dy * dy);
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

simplifyPathKeys = function(path, tolerance) {
	if (path.length < 3) return path.array_get_keys();
	
	var s = [0];
	var l = 0;
	var r = path.length - 1;
	var x = r, j, line, valid_line, pd;
	
	while (l < r) {
		while (x > l) {
			line = [path[l][0], path[l][1], path[x][0], path[x][1]];
			valid_line = true;

			for (j = x - 1; j > l; j--) {
				pd = linePointDistance(line, path[j]);

				if (pd > tolerance) {
					valid_line = false;
					break;
				}
			}

			if (valid_line) {
				s.push(x);
				
				l = x;
				x = r;
			} else {
				x--;
			}	

			if ((x - l) == 1) {
				s.push(x);
				l = x;
				x = r;
				break;
			}
		}
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

curvedSimplifiedPath = function(path, tolerance, smooth_tolerance) {
	var keys = simplifyPathKeys(path, tolerance);
	var s = [];
	smooth_tolerance = smooth_tolerance || 1.9;
	s.push(path[0]);
	
	var c, p, d, pd, a, l, dxa, dya, dxb, dyb, lsa, lsb, ta, tb, ad, bm;

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
			
			if (i > 1) {
				l = s.pop();
				
				dxa = l[2] - l[4];
				dya = l[3] - l[5];
				
				dxb = c1[0] - l[4];
				dyb = c1[1] - l[5];
				
				ta = Math.atan2(dya, dxa);
				tb = Math.atan2(dyb, dxb);
				
				lsa = Math.lineSize([l[2], l[3]], [l[4], l[5]]);
				lsb = Math.lineSize(c1, [l[4], l[5]]);
				
				ad = tb - ta;
				if (ad < 0) ad += 2 * Math.PI;
				if (ad > Math.PI) ad -= 2 * Math.PI;
				
				if (Math.abs(ad) > smooth_tolerance) {
					bm = (Math.PI - Math.abs(ad)) / 2;
					
					if (ad < 0) {
						l[2] = Math.round(l[4] + lsa * Math.cos(ta + bm));
						l[3] = Math.round(l[5] + lsa * Math.sin(ta + bm));
						c1[0] = Math.round(l[4] + lsb * Math.cos(tb - bm));
						c1[1] = Math.round(l[5] + lsb * Math.sin(tb - bm));
					} else {
						l[2] = Math.round(l[4] + lsa * Math.cos(ta - bm));
						l[3] = Math.round(l[5] + lsa * Math.sin(ta - bm));
						c1[0] = Math.round(l[4] + lsb * Math.cos(tb + bm));
						c1[1] = Math.round(l[5] + lsb * Math.sin(tb + bm));
					}
				}
				
				s.push(l);
			}
			
			s.push([c1[0], c1[1], c2[0], c2[1], cp[0], cp[1]]);
		}
	}
	
	return s;
};
