function Obj(x, y) {
  this.x = x
  this.y = y

  this.add = function(other) {
    this.x += other.x
    this.y += other.y
  }
}
var N = arguments[0]
var obj = new Obj(1, 1)
for (let x = 1, y = 1; x < N; x++, y+=2) {
  var other = new Obj(x, y)
  obj.add(other)
  if (obj.x > 50000) {
    obj.z = obj.x + obj.y
  }
}

