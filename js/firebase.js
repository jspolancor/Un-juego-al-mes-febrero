function registerUser(){

  var nickname = $('#register-nickname').val();
  var email = $('#register-email').val();
  var password = $('#register-password').val();

  if (nickname.length < 3) {
    $('#errors-register').html('Nickname should be at least 3 characters');
    return;
  }

  firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {

    user.updateProfile({
      displayName: nickname
    }).then(function() { }, function(error) { });

  }).catch(function(error){

    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    $('#errors-register').html(errorMessage);

  });

}

function loginUser(){

  var email = $('#login-email').val();
  var password = $('#login-password').val();

  firebase.auth().signInWithEmailAndPassword(email, password)
    .catch(function(error) {
  // Handle Errors here.
  var errorCode = error.code;
  var errorMessage = error.message;
  if (errorCode === 'auth/wrong-password') {
    $('#errors-login').html('Wrong password.');
  } else {
    $('#errors-login').html(errorMessage);
  }
  console.log(error);
});

}

function logout(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
  }, function(error) {
    // An error happened.
  });
}

function openLogin(){
  $('#errors-login').html('');
  $('#modalRegister').modal('hide');
  $('#modalLogin').modal('show');
}

function openRegister(){
  $('#errors-register').html('');
  $('#modalLogin').modal('hide');
  $('#modalRegister').modal('show');
}
