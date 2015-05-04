function User(firstName, lastName, age) {
  this.firstName = firstName;
  this.lastName = lastName;
  this.age = age;

  this._meta = undefined;
}


export default function() {
  var users = [];

  for (var i = 0; i < 100; i++) {
    users.push(new User('Stefan', 'Penner', 16));
  }
  return users;
}
