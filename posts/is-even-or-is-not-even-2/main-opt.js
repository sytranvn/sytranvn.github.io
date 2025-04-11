function my_mod(n) {
  if (n % 2 == 1) {
    return true;
  }
  return false;
}

my_mod(0);
my_mod(1);
my_mod(2);

%PrepareFunctionForOptimization(my_mod);
%OptimizeFunctionOnNextCall(my_mod);

my_mod(2);
