var apiKey = "&apikey=2957NRM1W9NEHAVICBVTWCG4PNE1RDCD3V";
var apiBlockNum = "https://api.etherscan.io/api?module=block&action=getblockreward&blockno=2165403"+ apiKey;
var apiLastBlockNum = "https://api.etherscan.io/api?module=proxy&action=eth_blockNumber"+ apiKey;
var apiPrice = "https://api.etherscan.io/api?module=stats&action=ethprice"+ apiKey;
var apiSupply = "https://api.etherscan.io/api?module=stats&action=ethsupply"+ apiKey;
var apiAddress = "";
var apiBlock = "";
var apiTransactions = "";

// Global varibale to use between data updations
var prevPriceUsd = 0;
var addressInput = $("input[name=address]");
var priceUsd = 0;
var blockNumberHex = 0;

// Execute the script after page loading is complete
window.onload = function(){
updateData();
// Add event handler to Address Input
addressInput = $("input[name=address]");
addressInput.change(() => fetchAddress());
}

// Update the page data every few seconds
//setInterval(updateData, 3000);

const updateData = function(){
  console.log("Updating Data");
  fetchLastBlockNum();
  fetchPrice();
}

// Fetch the Last Block and Display it
async function fetchLastBlockNum(){
    const response_LastBlockNum = await fetch(apiLastBlockNum);
    const json_LastBlockNum = await response_LastBlockNum.json();
    //console.log(json_LastBlockNum);
    blockNumberHex = json_LastBlockNum.result;
    var blockNumber = parseInt(blockNumberHex,16);
    console.log("Latest Block number - "+blockNumber);
    $("#lastBlock").text(blockNumber);
    fetchDifficultyHash();
}

// Fetch lastest Price and Market Cap of Ether
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

// Fetch the Last Block and Calculate Hash Rate, Network Difficulty and Number of Transactions
async function fetchDifficultyHash(){
  console.log("BlockNumberHex - ",blockNumberHex);
  apiBlock = "https://api.etherscan.io/api?module=proxy&action=eth_getBlockByNumber&tag="+ blockNumberHex +"&boolean=true"+ apiKey;
  try{
    const response_Block = await fetch(apiBlock);
    const json_Block = await response_Block.json();
    // console.log(json_Block);
    var difficulty = parseInt(json_Block.result.difficulty,16)/10**12;
    console.log("Difficulty - "+difficulty);
    $("#networkDifficulty").text(difficulty.toFixed(2)+" TH");
    var hashRate = difficulty / 15 * 1000;
    $("#hashRate").text(hashRate.toFixed(2)+" GH/s");
    var transactionNum = json_Block.result.transactions.length;
    // console.log(transactionNum);
    $("#transactions").text(transactionNum);
  }catch{
    // Try next time
  }
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
