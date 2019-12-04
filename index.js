const contractSource = hereDoc(function() {/*!
  contract Predictor =

    record user = {
      creatorAddress  :  address,
      name            :  string,
      phone           :  string,
      point           :  int}

    record state = {
      users           :  map(string,user),
      userlength      :  int}

    entrypoint init() = {users = {}, userlength = 0}

    stateful entrypoint register(name' : string, phone' : string) =
      let user = {creatorAddress = Call.caller, name = name' , phone = phone', point = 0}
      let phone = phone'
      put(state{users[phone] = user, userlength = 0})

    entrypoint getUser(phone' : string) : user =
      switch(Map.lookup(phone', state.users))
        None => abort("There was no with that Phone Number")
        Some(x) => x

    payable stateful entrypoint spend(phone' : string) =
      let user = getUser(phone')
      Chain.spend(user.creatorAddress, Call.value)

    stateful entrypoint update(phone' : string, points : int) =
      let user = getUser(phone')
      let updatepoint = user.point + points
      let updatedUsers = state.users{[phone'].point = updatepoint}
      put(state{users = updatedUsers})


  */})

const contractAddress = 'ct_2Cgy5uoFLb1RBYEFLuquqJLcxSP7GceZRAo3M8w55Xkde7q2tX';
var client = null;
var memeArray = [];
var memesLength = 0;
var login = false;
var mini = 1;
var maxi = 0;
var predictnumber = 1;
var randomnum = 0;
var permission = false;
var answer = false;
var price = 0;
var point = 0;
var scoreboard = [];
var scoreframe = [];





async function callStatic(func, args) {
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  const calledGet = await contract.call(func, args ,{callStatic: true}).catch(e => console.error(e));
  const decodedGet = await calledGet.decode().catch(e => console.error(e));

  return decodedGet;

}

async function contractCall(func, args, value) {
  const contract = await client.getContractInstance(contractSource, {contractAddress});
  const calledSet = await contract.call(func, args, {amount: value}).catch(e => console.error(e));

  return calledSet;
}


window.addEventListener('load',async () => {
  $("#loader").show();

  client = await Ae.Aepp();


  // renderScore();
  //
  // scoreboard.push({score : 0});

  $('#predictRange').hide();
  $('#prediction').hide();
  $('#predictresult').hide();
  // for (let i = 1; i <= memesLength; i++) {
  //   const meme = await callStatic('getMeme', [i]);
  //
  //   memeArray.push({
  //     creatorName: meme.name,
  //     memeUrl: meme.url,
  //     index: i,
  //     votes: meme.voteCount
  //   });
  //
  // }
  //
  // renderMemes();
  //
  $("#loader").hide();
});


function renderUser() {
  // memeArray = memeArray.sort(function(a,b){return b.votes-a.votes})
  // var template = $('#template').html();
  // Mustache.parse(template);
  // var rendered = Mustache.render(template,{memeArray});
  // $('#memeBody').html(rendered);

  if (login) {
    $('#predictRange').show();
  }else {
    $('#predictRange').hide();

  }


}

function renderScore() {

  var template = $('#template').html();
  Mustache.parse(template);
  var rendered = Mustache.render(template,{scoreboard});
  $('#scoreframe').html(rendered);

}

function permissionGrant() {

  if (permission) {
    $('#prediction').show();
  }else {
    $('#prediction').hide();

  }


}

function renderResult(x,y) {

  $('#predictresult').show();
  // const phone = ($('#phone').val());

  if (x == y) {
    answer = true;
    
    ('#correct').show();
    ('#wrong').hide();

    const user =  callStatic('getUser',[phone]);
    const userpoints = user.point + point;

    scoreboard.push({score : userpoints});
    contractCall('update',[user.phone,userpoints],0);

  }else{
    answer = false;
    // ('#wrong').show();
    console.log("wrong answer")
  }
}







$('#registerBtn').click(async function(){
  $("#loader").show();

  const phone = ($('#phone').val()),
      name = ($('#name').val());

  await contractCall('register', [name, phone], 0);

  $('#failedlogin').hide();

  $('#login').show();
  login = true;
  $("#loader").hide();

  //scoreboard.push({score : 0});

  renderUser();

//  $("#loader").hide();

})


$('#loginbtn').click(async function(){
  $("#loader").show();

  const phone = ($('#phone').val());

  const user = await callStatic('getUser',[phone]);

  $('#failedlogin').hide();
  $('#login').show();
  login = true;
  $("#loader").hide();


  //$('#score').push({score : user.point});
  renderUser();

})


$('#first').click(async function(){

  console.log("first button clicked")

  $("#loader").show();

    const phone = ($('#phone').val());
    price = 20;
    point = 10;
    maxi = 10;
    await contractCall('spend',[phone],price);
    permission = true;

    permissionGrant();
    console.log("first button clicked")

    $("#loader").hide();




});


$('#second').click(async function(){

  // $('predictfield').val() = ""
  $('#loader').show();

  console.log("Second button clicked")

  const phone = ($('#phone').val());
  price = 15;
  point = 20;
  maxi = 20;
  await contractCall('spend',[phone],price);
  permission = true;

  permissionGrant();
  $('#loader').hide();



});

$('#third').click(async function(){


  console.log("Third button clicked")
  $('#loader').show();

  const phone = ($('#phone').val());
  price = 10;
  point = 50;
  maxi = 50;
  await contractCall('spend',[phone],price);
  permission = true;

  permissionGrant();
  $('#loader').hide();


});

$('#forth').click(async function(){
  // $('predictfield').val() = ""
  console.log("forth button clicked")
  $('#loader').show();

  const phone = ($('#phone').val());
  price = 5;
  point = 100;
  maxi = 100;
  await contractCall('spend',[phone],price);
  permission = true;

  permissionGrant();
  $('#loader').hide();



});

$('#predictbtn').click(async function(){

  $('#loader').show();

  predictnumber = ($('#predictfield').val());

  randomnum = getRandomInt(mini,maxi);

  

  renderResult(predictnumber, randomnum);




});

function getRandomInt(min,max){

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;

}
function hereDoc(f) {
  return f.toString().
      replace(/^[^\/]+\/\*!?/, '').
      replace(/\*\/[^\/]+$/, '');
}
