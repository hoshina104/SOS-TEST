// Write JavaScript here 
var response = document.getElementById("res");
response.innerHTML='応答';
var reset = document.getElementById("rest-button");
reset.onclick = function(){
  response.innerHTML='応答'
};

var GetResult =`{
  "request": "GetResult",
  "service": "SOS",
  "version": "2.0.0",
  "offering": "offering0",
  "observedProperty": "https://www.kantei.go.jp/jp/singi/it2/senmon_bunka/shiryo/agro-env.html#air_temperature",
  "featureOfInterest": "Kyouinshitu-3",
  "temporalFilter": [
    {
      "during": {
        "ref": "om:phenomenonTime",
        "value": [
          "%START%",
          "%END%"
        ]
      }
    }    
  ]
}`;

var table = {
  START:"2020-02-04T16:00:00+09:00",
  END:  "2020-02-04T16:10:00+09:00"
};

var getresult = ReplaceStrings_text(GetResult);
console.log(getresult.replace_table(table));

var getresult = JSON.parse(GetResult);
  
$( function() {
    $('#ajax-button').click(
    function() {
       var hostUrl= 'https://httpbin.org/post';
//        var hostUrl = 'http://eeciot.tsuruoka-nct.ac.jp:8080/52nSOS/service';
        var param1 = 1;
        var param2 = 10;
        $.ajax({
            url: hostUrl,
            type:'POST',
            dataType: 'json',
//            data : {parameter1 : param1, parameter2 : param2 },
          data : getresult,
            timeout:3000,
        }).done(function(data) {
          response.innerHTML='<pre>'+JSON.stringify(data,null,'    ')+'</pre>';
          alert("ok");
        }).fail(function(XMLHttpRequest, textStatus, errorThrown) {
           alert("error");
        })
    });
} );