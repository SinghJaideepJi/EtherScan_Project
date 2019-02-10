apiKey = "&apikey=2957NRM1W9NEHAVICBVTWCG4PNE1RDCD3V";
apiBlockNum = "https://api.etherscan.io/api?module=block&action=getblockreward&blockno=2165403"+ apiKey;
apiLastBlockNum = "https://api.etherscan.io/api?module=proxy&action=eth_blockNumber"+ apiKey;
apiPrice = "https://api.etherscan.io/api?module=stats&action=ethprice"+ apiKey;
apiSupply = "https://api.etherscan.io/api?module=stats&action=ethsupply"+ apiKey;

// Global varibale to use between data updations
var prevPriceUsd = 0;
var addressInput = $("input[name=address]");
var priceUsd = 0;

// Fetch te Last Block and Display it
async function fetchLastBlockNum(){
    const response_LastBlockNum = await fetch(apiLastBlockNum);
    const json_LastBlockNum = await response_LastBlockNum.json();
    // console.log(json_LastBlockNum);
    var blockNumber = parseInt(json_LastBlockNum.result,16);
    console.log("Latest Block nuber - "+blockNumber);
    $("#lastBlock").text(blockNumber);
}

// Fetch lastes Price and Market Cap of Ether
async function fetchPrice(){
    //Fetch Price
    const response_Price = await fetch(apiPrice);
    const json_Price = await response_Price.json();
    // console.log(json_Price);
    priceUsd = json_Price.result.ethusd;
    var priceBtc = json_Price.result.ethbtc;
    console.log("Price prev,USD,BTC - "+prevPriceUsd , priceUsd , priceBtc);
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

    // Fetch Supply and calculate Market Cap from Supply and Price
    const response_Supply = await fetch(apiSupply);
    const json_Supply = await response_Supply.json();
    // console.log(json_Supply);
    var supply = json_Supply.result/ 10**18;
    var marketCap = supply * priceUsd / 10**9;
    console.log("Supply - "+supply);
    $("#marketCap").text(`MARKET CAP OF $${marketCap.toPrecision(5)} BILLION`);
}

// display ALL Transactions related to the Entered Address
async function fetchAddress(){
  addressValue = addressInput.val();
  console.log("Address is - "+addressValue);
  apiAddress = "http://api.etherscan.io/api?module=account&action=txlist&address="+addressValue+"&startblock=0&endblock=99999999&sort=asc"+ apiKey;
    try{
    const response_Address = await fetch(apiAddress);
    const json_Address = await response_Address.json();
    // console.log(json_Address);
    if (json_Address.message == "OK"){
        var numTrax = json_Address.result.length;
        console.log("Number of Transactions - "+numTrax);
        $("#numTrax").text(`You have ${numTrax} transactions`);
        $("#Trax").text(JSON.stringify(json_Address.result));
    } else {
        $("#numTrax").text(`Invalid address.`);
        $("#Trax").text(" ");
    }
  }catch{
    $("#numTrax").text(`Invalid address.`);
    $("#Trax").text(" ");
  }
}

const updateData = function(){
    console.log("Updating Data");
    fetchLastBlockNum();
    fetchPrice();
}

// Execute the script after page loading is complete
window.onload = function(){
  updateData();
// Add event handler to Address Input
addressInput = $("input[name=address]");
addressInput.change(() => fetchAddress());
}

// Update the page data every few seconds
setInterval(updateData, 3000);
