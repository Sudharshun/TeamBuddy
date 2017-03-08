const path = require('path')
const linksNow = require(path.resolve('assets/data/links'))
window.addEventListener('load', function (event) {
  console.log('called Links page' + linksNow[0].url)
  var linksTable = ""

  if (linksNow) {
    linksTable += "<table border='1' align=\"left\">"
    for (link in linksNow) {
      if (linksNow[link].url) {
        linksTable += "<tr><td>" + linksNow[link].title + "</td><td><a href='" + linksNow[link].url + "'/>" + linksNow[link].url + "</a></td></tr>";
      }
      if (linksNow[link].sublinks) {
        linksTable += "<tr><td>" + linksNow[link].title + "</td><td><table border='1' align='left'>"
        for (sublink in linksNow[link].sublinks) {
          linksTable += "<tr><td>" + linksNow[link].sublinks[sublink].title + "</td><td><a href='" + linksNow[link].sublinks[sublink].url + "'/>" + linksNow[link].sublinks[sublink].url + "</a></td></tr>";
        }

        linksTable += "</table></td></tr>"

      }

    }
    linksTable += "</table>"
 


    document.getElementById('actualLinks').innerHTML = linksTable

  }


})
