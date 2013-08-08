var express = require('express');
var app = express();
app.use(express.bodyParser());
app.set('views',__dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.get('/',function(req,res){
	res.render('index.html');
});
app.post('/',function(request,response){
	var username = request.body.username;
	var req = request.body.req;
	console.log("[INFO] Request: " + username + "|" + req);
	/// write request to file ///
	var fs = require('fs');
	fs.appendFile("./res/requests.txt",username + "|" + req + "\r\n",function(err){
		if(!err){
			console.log("[ECHO] write success!");
			response.render('index.html');
		}else{
			console.log("[ERROR] could not write!");
			response.render('error.html');
		}
	});
});
app.get('/requests',function(request,response){
	console.log("[ECHO]request for list being placed");
	response.writeHead(200, {'content-type': 'text/html' });
	var fs = require('fs');
	var data = "<table><thead><tr><th>User</th><th>Request</th></tr></thead><tbody>";
	fs.readFileSync("res/requests.txt").toString().split("\n").forEach(function(content){
		if(content.trim() != ""){
		   data += "<tr><td>" + content.substring(0, content.indexOf("|"));
		   data += "</td>";
		   data += "<td>" + content.substring(content.indexOf("|") +1) + "</td>"; 
		   data += "</tr>";
		}
	});
	data += "</tbody></table>";
	response.end(data);
});

var pf = require('portfinder');
pf.getPort(function (err,port){
  console.log("Port: " + port);
  var fs = require('fs');
  fs.writeFile("/media/sdj1/home/grognatz/www/grognatz.hades.feralhosting.com/public_html/port.txt", port, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("The file was saved!");
    }
  }); //end write to port file
  app.listen(port); //listen on port
});
