const updateData = function(){
//window.onload = function(){

    console.log("updateData Called");
    apiKey = "&apikey=2957NRM1W9NEHAVICBVTWCG4PNE1RDCD3V";
    apiBlockNum = "https://api.etherscan.io/api?module=block&action=getblockreward&blockno=2165403"+ apiKey;
    apiLastBlockNum = "https://api.etherscan.io/api?module=proxy&action=eth_blockNumber"+ apiKey;
    apiPrice = "https://api.etherscan.io/api?module=stats&action=ethprice"+ apiKey;
    apiSupply = "https://api.etherscan.io/api?module=stats&action=ethsupply"+ apiKey;

    var priceUsd = 0;

    console.log(apiKey);
    console.log(apiBlockNum);

      fetch(apiLastBlockNum)
      .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
              console.log(myJson);
              var blockNumber = parseInt(myJson.result,16);
              console.log(blockNumber);
              $("#lastBlock").text(blockNumber);
        });

        fetch(apiPrice)
       .then(function(response) {
          return response.json();
        })
        .then(function(myJson) {
              console.log(myJson);
              priceUsd = myJson.result.ethusd;
              var priceBtc = myJson.result.ethbtc;
              //if ( prevPriceUsd != priceUsd) prevPriceUsd = priceUsd;
              console.log(prevPriceUsd , priceUsd , priceBtc);
              $("#price").text("$"+priceUsd+" @ 0."+priceBtc+" BTC/ETH");
              if (prevPriceUsd != 0){
                  var perc = ( (priceUsd - prevPriceUsd)/prevPriceUsd*100).toPrecision(5) ;
                  console.log("Percentage Change - "+perc);
                  $("#percentage").text(perc+"%");
                  (perc < 0) ? $("#percentage").css("color","red") : $("#percentage").css("color","greenyellow");
              }
              else{
                  prevPriceUsd = priceUsd;
                  console.log("prevPriceUsd="+prevPriceUsd)
              }
        })
        .then(function(){
            fetch(apiSupply)
            .then(function(response) {
                return response.json();
              })
              .then(function(myJson) {
                    console.log(myJson);
                    var supply = myJson.result/ 10**18;
                    var marketCap = supply * priceUsd / 10**9;
                    console.log("Supply - "+supply);
                    $("#marketCap").text(`MARKET CAP OF $${marketCap.toPrecision(5)} BILLION`);
              });
        })

        const addressInput = $("input[name=address]");
        addressInput.change((addressValue) => {
            console.log("Address is - "+addressValue.target.value);
            apiAddress = "http://api.etherscan.io/api?module=account&action=txlist&address="+addressValue.target.value+"&startblock=0&endblock=99999999&sort=asc"+ apiKey;

            fetch(apiAddress)
            .then(function(response) {
               return response.json();
             })
             .then(function(myJson) {
                   console.log(myJson);
                   if (myJson.message == "OK"){
                        var numTrax = myJson.result.length;
                        console.log(numTrax);
                        $("#numTrax").text(`You have ${numTrax} transactions`);
                        $("#Trax").text(JSON.stringify(myJson.result));
                   } else {
                        $("#numTrax").text(`Invalid address.`);
                        $("#Trax").text(" ");
                   }
             });
        })
}

var prevPriceUsd = 0;

window.onload = updateData();

setInterval(updateData, 3000);
