function [ d ] = detMatrix(m)
	r = rows(m);
	c = rows(m);
	assert(r == c, "Not a square matrix");
	d = zeros(r, r);
	for _r = 1: r
		for _c = 1: c
			_m = m;
			_m(_r,:) = [];
			_m(:,_c) = [];
			d(_r, _c) = (-1)^(_r + _c) * det(_m);
		end
	end
end
