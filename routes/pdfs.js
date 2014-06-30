var express = require('express');
var Q = require("Q");
var fs = require('fs');
var mysql = require('mysql');
var router = express.Router();
var data;
var pdf;
var pdflist;



/* GET pdfs page. */
router.get('/', function(req,res) {

   	data = getPdfByRisk();
   	res.render('pdfs',{pdfs:data}); 

   	function getPdfByRisk(){
		
		var connection = mysql.createConnection({
		  	host     : 'localhost',   //CHANGE THIS INFORMATION TO YOUR DATABASE MATCH.
		  	user     : 'amfuser',
		  	password : 'Sy8fukr8899'
		});			 

		var sql = 'SELECT * from pdf_byrisk order by riskname, lang';
		
		connection.connect();
		console.log("Connected to db");
		connection.query('use amf');
		console.log("Using AMF DB");
		connection.query(sql, function(err, rows, fields) { 
		//TO DO : REMOVE THE WRITE FILE (not necessary) 
		  fs.writeFile('./data/pdfbyrisk.json', JSON.stringify(rows,null,4), function (err) {
		        if (err) {
		            console.log(err);
		        }else{
		            
		            data = rows; // We're gtg.
		            console.log("writing rows to file");
		           
		        }
		    });
		});   
		
		return data;
		connection.end();
	}
}); 



/** Get the  Selected PDF Risk ID and display PDF List **/
router.get('/:id', function(req, res) {
  
  if (req.param("id")){ 
    
  	var fs         = require('fs');
    var mysql      = require('mysql');
    var connection = mysql.createConnection({
	      	host     : 'localhost',   //CHANGE THIS INFORMATION TO YOUR DATABASE MATCH.
	      	user     : 'amfuser',
	      	password : 'Sy8fukr8899'
    	}); 	 
    var riskid = req.param("id"); //riskid        
    connection.connect();	
	getSinglePdf(riskid,res);   
       
   }


   // Retrieve Single Risk id.
   function getSinglePdf(riskid,res){ 	
      	var sql = 'SELECT * from pdf_byrisk where riskid='+riskid+';';
      	var sql2 = 'SELECT * from pdf_byrisklist where pdf_riskid='+riskid+' order by pdf_risktype';	
      	console.log(sql);   
	    connection.query('use amf');
	    connection.query(sql, function(err,rows1){
	    	if(!err){	    		 
	             connection.query(sql2,function(err,rows2){
	             	if (!err){
	             		res.render('pdfs',{pdfs:rows1, pdflist: rows2}); 
	             	}
	             });  
        	}else{
        		console.log(err);
        	}
	    });	     
   }
 /*
	function getPdfByRiskList(riskid){
		
	    var sql = 'SELECT * from pdf_byrisklist where pdf_riskid='+riskid+' order by pdf_risktype';    
	    console.log(sql);     
	    connection.query('use amf');
	    connection.query(sql,function(err,rows){
	    	if(!err){
	    		pdflist = rows;	    		
	    	}else{
        		console.log(err);
        	}
	    });	    
	   
		connection.end();
	    
	    
	}

*/

});

module.exports = router;


