
function strTrim(str) {  
  var start = -1,  
  end = str.length;  
  while (str.charCodeAt(--end) < 33);  
  while (str.charCodeAt(++start) < 33);  
  return str.slice(start, end + 1);  
}; 

function strTrimSize(str){
	var strStart=-1;
	var strEnd=str.length;
	while(str.charCodeAt(--strEnd) < 125);
	while(str.charCodeAt(++strStart) < 33);	
	return str.slice(strStart, strEnd);
};

function strTrimSize2(str){
	var strStart=-1;
	
	while(str.charCodeAt(++strStart) < 125);
	var strEnd=str.length-strStart+1;
	return str.slice(strStart+1, str.length);
};

function addCommas(nStr)
{
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function addRow(asignColumn,text,size,selected)
{
	var row = Ti.UI.createPickerRow({custom_item:text});
	if (!size){
		size=20;
	};
	var label = Ti.UI.createLabel({
		text:L(text),
		testAlign:'center',
		//font:{fontSize:20,fontWeight:'bold'},
		font:{fontSize:size,fontWeight:'bold'},
		//color:text,
		width:'auto',
		height:'auto'
	});

	row.add(label);
	
	if (selected){
		row.selected=true;
	};
	asignColumn.addRow(row);
};

function getPriceFromXML(){
	
	Ti.API.info('Function Called : getPriceFromXML');
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET","http://filebase.selfip.com/diamondprice.xml");
	xhr.setTimeout(10000);
	xhr.onerror = function(e)
	{
		Ti.API.info('Update Error ' + e.error);
	};

	xhr.onload = function()
	{
		var listdate;
		try
		{

			var doc = this.responseXML.documentElement;
			var db = Titanium.Database.open('diamondpricelite');
			
			Ti.API.info("Get ready for import");
			
			db.execute('delete from diamondprice ;');
			
			listdate = doc.evaluate("//pricedata/listdate/text()").item(0).nodeValue;
			
			var Items = doc.getElementsByTagName("item");	
			var sqlString='';

			for (var i=0;i<Items.length;i++)
			{
				var sqlString = Items.item(i).text;
				Ti.API.info(sqlString);
				db.execute(sqlString);

			}
			Ti.API.info("Done Loading Prices");

			db.close();
			
		}
		catch(E)
		{
			alert(E);
		}
	};
	xhr.send();	
};


function getPriceFromFile(){
	
	Ti.API.info('Function Called : getPriceFromFile');
	
	var f = Ti.Filesystem.getFile(Ti.Filesystem.resourcesDirectory,'hs_data_basic.xml');
	var xhr = f.read().text;	
	var doc = Ti.XML.parseString(xhr).documentElement;	
	var db = Titanium.Database.open('hs_product');
	
	Ti.API.info("Get ready for import");
		
	var Items = doc.getElementsByTagName("item");	
	var sqlString='';

	for (var i=0;i<Items.length;i++)
	{
		var sqlString = Items.item(i).text;
		Ti.API.info(sqlString);
		db.execute(sqlString);
	};

	db.close();	
};

function getExchangeRatefromXML(currencyCode){
	
	Ti.API.info('Function Called : getExchangeRatefromXML');
	var xhr = Ti.Network.createHTTPClient();
	xhr.open("GET","http://www.webservicex.net/CurrencyConvertor.asmx/ConversionRate?FromCurrency=USD&ToCurrency="+currencyCode);
	xhr.setTimeout(3000);
	xhr.onerror = function(e)
	{
		exRate= '1';
	};
	
	xhr.onload = function()
	{
		try
		{
			var doc = this.responseXML.documentElement;
			
			Ti.API.info("Get ready for import");
			
			exRate = doc.getElementsByTagName("double").item(0).text;	

			Ti.API.info("Done Loading Prices:"+exRate);
			//exRate= '1.2514';

		}
		catch(E)
		{
			exRate= '1';
		}
	};
	xhr.send();

};

function dbInitialize(){
	
	var db = Titanium.Database.open('hs_product');
		
	db.execute('CREATE TABLE IF NOT EXISTS prodetail ( PNO VARCHAR(7), PMNAME VARCHAR(30), PMNUM INTEGER, PMWEIGHT DOUBLE, PMUNIT VARCHAR(4) );');
	db.execute('CREATE TABLE IF NOT EXISTS promaster ( PNO VARCHAR(7), PNAME VARCHAR(30), PTYPE VARCHAR(50), PCATEGORY VARCHAR(50), PLPRICE INTEGER, PUPRICE INTEGER, TPRICE DOUBLE);');
	db.execute('CREATE INDEX IF NOT EXISTS PNO_Detail ON prodetail(PNO ASC);');
	db.execute('CREATE INDEX IF NOT EXISTS PNO_Master ON promaster(PNO ASC);');

	var rows = db.execute('SELECT * FROM promaster');
	Titanium.API.info('ROW COUNT 0 = ' + rows.getRowCount());

	if (!rows.getRowCount()){
		getPriceFromFile();
		//db.execute('INSERT INTO DIAMONDPRICE VALUES("2011-08-27",0,0.3,0.4,"D",47,40,35,31,27,22,19,17,0,0,0);');
		//db.execute('INSERT INTO DIAMONDPRICE VALUES("2011-08-27",0,0.3,0.4,"E",40,36,32,28,25,21,18,17,0,0,0);');
	};
	
	db.close();	
};

function getDiamondPrice(diamondShape,diamondColor,diamondClarity,diamondSize_str,actualSize_str,exchangeRate_str){
	var diamondPrice=0;
	var shapeGrade=1;
	var diamondSize=parseFloat(diamondSize_str);
	var actualSize=parseFloat(actualSize_str);
	var exchangeRate=parseFloat(exchangeRate_str);
	if (diamondShape==L('_Round')){
		shapeGrade=0;
	};

	Ti.API.info('ShapeGrade:'+shapeGrade);
	
	Ti.API.info('Color:'+diamondColor);
	Ti.API.info('Clarity:'+diamondClarity);
	Ti.API.info('Size:'+diamondSize);

	var db = Titanium.Database.open('diamondpricelite');
	
	var rows = db.execute('SELECT * FROM DIAMONDPRICE WHERE (SHAPE = ?) AND (COLOR = ?) AND (MINSIZE <= ?) AND (MAXSIZE > ?) ORDER BY PRICEDATE DESC;',shapeGrade,diamondColor,diamondSize,diamondSize);
	Titanium.API.info('Price Data COUNT = ' + rows.getRowCount());
	
	if (rows.isValidRow()){
		Titanium.API.info('Shape: ' + rows.fieldByName('shape') + ' SizeRange: ' + rows.fieldByName('minsize') + '~' + rows.fieldByName('maxsize') + ' Color: ' + rows.fieldByName('color') ) ;		
		diamondPrice=rows.fieldByName(diamondClarity);
	} else {
		alert(L('_NoPrice'));
	};
	
	if (actualSize==0){
		label4.text='Ref. Date : '+rows.fieldByName('pricedate');		
		//label4.text=L('_refPriceComment');
	};
		
	rows.close();
	db.close();

	 
	if (actualSize>0){
		return addCommas(String.format('$%.2f',diamondPrice*100*actualSize*exchangeRate));		
	} else {
		return addCommas(String.format('$%.0f',diamondPrice*100*exchangeRate));
	};	

};
//
//  CREATE CUSTOM LOADING INDICATOR
//
var indWin = null;
var actInd = null;
function showIndicator()
{
	if (Ti.Platform.osname != 'android')
	{
		// window container
		indWin = Titanium.UI.createWindow({
			height:150,
			width:200,
			left:572
		});

		// black view
		var indView = Titanium.UI.createView({
			height:150,
			width:200,
			backgroundColor:'#000',
			borderRadius:10,
			opacity:0.6
		});
		indWin.add(indView);
	}

	// loading indicator
	actInd = Titanium.UI.createActivityIndicator({
		style:Titanium.UI.iPhone.ActivityIndicatorStyle.BIG,
		height:50,
		width:50
	});

	if (Ti.Platform.osname != 'android')
	{
		indWin.add(actInd);

		// message
		var message = Titanium.UI.createLabel({
			text:'Loading',
			color:'#fff',
			width:'auto',
			height:'auto',
			font:{fontSize:20,fontWeight:'bold'},
			bottom:20
		});
		indWin.add(message);
		indWin.open();
	} else {
		actInd.message = "Loading";
	}
	actInd.show();

}

function hideIndicator()
{
	actInd.hide()
	if (Ti.Platform.osname != 'android') {
		indWin.close({opacity:0,duration:500});
	}
}

function encode_price(price,priceheader){
	var pricebase = Math.round(price/1000)
	//Ti.API.info(pricebase+'--'+price)
	
	if (priceheader){var price_encoded=priceheader} else {price_encoded='TJ'}
	price_encoded = price_encoded+(Math.round(Math.random()*10))+'0'
	for (var i=pricebase.toString().length;i>0;--i){
		//Ti.API.info(pricebase.toString().slice(i-1,i))
		price_encoded = price_encoded+pricebase.toString().slice(i-1,i)
		//Ti.API.info(price_encoded)
	}
	price_encoded = price_encoded+(Math.round(Math.random()*10))+'-'+(Math.round(Math.random()*100))
	return price_encoded
}
