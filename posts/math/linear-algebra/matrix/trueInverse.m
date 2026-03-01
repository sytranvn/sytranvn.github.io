function [ d ] = trueInverse(m)
	if (det(m) == 0)
		printf("No inverse\n")
	else
		dm = detMatrix(m);
		d = 1/det(m)*dm.';
	endif
end
