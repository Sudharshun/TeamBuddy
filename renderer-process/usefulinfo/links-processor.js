window.addEventListener('load', function (event) {
  console.log('called Links page')
var txt1 = document.createTextNode(" This text was added to the DIV.");
var txt2 = document.createTextNode(" This text was also added to the DIV.");

document.getElementById('actualLinks').appendChild(txt1);
document.getElementById('actualLinks').appendChild(txt2);



})
