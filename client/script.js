const base_url = "https://fancy-todos-aaz.herokuapp.com/"


$(document).ready(() => {
  auth()

})

function auth() {
  if (localStorage.access_token) {
    $("#register").hide()
    $("#login").hide()
    $("#form-add").show()
    $("#div-logout").show()
    $("#exchangeapi").show()
    $("#todo-list").show()
    $("#login-register").hide()
    exchangeRate()
    fetchTodos()
  } else {
    $("#register").show()
    $("#login").show()
    $("#form-add").hide()
    $("#div-logout").hide()
    $("#exchangeapi").hide()
    $("#todo-list").hide()
    $("#login-register").show()
  }
}

$("#register-form").submit((e) => {
  e.preventDefault()
  register()
})

$("#login-form").submit(e => {
  e.preventDefault()
  login()
})


$("#nav-logout").click((e) => {
  e.preventDefault()
  logout()
})

function register() {
  const email = $("#register-email").val()
  const password = $("#register-password").val()
  $.ajax({
    url: base_url + "register",
    method: "POST",
    data: {
      email,
      password
    }
  })
    .done((response) => {
      console.log(response);
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
    .always((_) => {
      console.log("always register");
      $("#register-email").val("")
      $("#register-password").val("")
    })
}

function login() {
  const email = $("#login-email").val()
  const password = $("#login-password").val()
  
  $.ajax({
    url: base_url + "login",
    method: "POST",
    data: {
      email,
      password
    }
  })
    .done(response => {
      // console.log(response);
      localStorage.setItem("access_token", response.access_token)
      auth()
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
    .always((_) => {
      console.log("always login");
      $("#login-email").val("")
      $("#login-password").val("")
    })
}

function onSignIn(googleUser) {
  // var profile = googleUser.getBasicProfile();
  // console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  // console.log('Name: ' + profile.getName());
  // console.log('Image URL: ' + profile.getImageUrl());
  // console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  var id_token = googleUser.getAuthResponse().id_token;
  // console.log(id_token);

  $.ajax({
    url: base_url+"googlelogin",
    method: "POST",
    data: {
      googleToken: id_token
    }
  })
  .done(response => {
    localStorage.setItem("access_token", response.access_token)
    // console.log(response);
    auth()
  })
  .fail(err => {
    console.log(err);
  })
}


function logout() {
  localStorage.clear()
  let auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
    auth()
}


function exchangeRate() {
  $.ajax({
    method: "GET",
    url: `${base_url}todos/exchange`,
    headers: {
      token: localStorage.getItem("access_token")
    }
  })
    .done(response => {
      $("#exchangeapi").remove()
      $("#div-logout").prepend(`
      <div id="exchangeapi" class="col ms-3">
        <p class="m-0">1 Dollar Amerika Serikat sama dengan ${response} Rupiah Indonesia</p>
      </div>
      `)
    })
    .fail((xhr, text) => {
      console.log(xhr, text, "<<<<<<<gagal bro");
    })
}


function fetchTodos() {
  $.ajax({
    method: "GET",
    url: base_url+"todos",
    headers: {
      token: localStorage.getItem("access_token")
    }
  })
    .done((todos) => {
      // console.log(todos);
      $('.card').remove()
      todos.forEach(e => {
        let selected = ''
        if (!e.status) selected = 'selected'
        else selected = ''
        $("#todo-list").append(`
          <div class="card shadow rounded p-4 mb-2" id="todo-${e.id}">
            <div class="row mb-2">
              <label for="todo-title-${e.id}" class="col-sm-2 col-form-label">Title</label>
              <div class="col-sm-10">
                <input class="card-title form-control-plaintext" id="todo-title-${e.id}" value="${e.title}"></input>
              </div>
            </div>
            <div class="row mb-2">
              <label for="todo-description-${e.id}" class="col-sm-2 col-form-label">Description</label>
              <div class="col-sm-10">
                <input class="card-text form-control-plaintext" id="todo-description-${e.id}" value="${e.description}"></input>
              </div>
            </div>
            <div class="row">
              <label class="col-form-label col-sm-2">Due Date</label>
              <div class="col-sm-10 d-flex align-items-center">
                <input type="date" id="todo-due_date-${e.id}" value="${new Date(e.due_date).toISOString().substr(0, 10)}"></input>
              </div>
            </div>
            <div class="row">
              <label class="col-form-label col-sm-2">Status</label>
              <div class="col-sm-2">
                <select class="form-select" id="todo-status-${e.id}">
                  <option value="true" ${selected}>Done</option>
                  <option value="false" ${selected}>Todo</option>
                </select>
              </div>
            </div>
            <div class="d-flex flex-row justify-content-end">
              <div class="mx-2">
                <button class="btn btn-secondary" onclick="updateCard(${e.id})">Update</button>
              </div>
              <div class="">
                <button class="btn btn-danger" onclick="deleteCard(${e.id})">Delete</button>
              </div>
            </div>
          </div>
        `)
      })
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
    .always(_ => {
      console.log('always get todo');
    })
}

$("#form-add-todo").submit((e) => {
  e.preventDefault()
  const title = $("#new-todo-title").val()
  const description = $("#new-todo-description").val()
  const due_date = $("#new-todo-due-date").val()
  console.log(title, description, due_date);
  $.ajax({
    method: "POST",
    url: base_url+"todos",
    headers: {
      token: localStorage.getItem("access_token")
    },
    data: {
      title,
      description,
      due_date
    }
  })
    .done((response) => {
      auth()
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
    .always(() => {
      console.log('always add todo');
      $("#new-todo-title").val("")
      $("#new-todo-description").val("")
      $("#new-todo-due-date").val("")
    })
})

function updateCard(id) {
  const title = $(`#todo-title-${id}`).val()
  const description = $(`#todo-description-${id}`).val()
  const status = $(`#todo-status-${id}`).val()
  const due_date = $(`#todo-due_date-${id}`).val()
  console.log(title, description,status,due_date);
  $.ajax({
    url: `${base_url}todos/${id}`,
    method: "PUT",
    headers: {
      token: localStorage.getItem("access_token")
    },
    data: {
      title,
      description,
      status,
      due_date,
    }
  })
    .done(response => {
      auth()
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
}

function deleteCard(id) {
  $.ajax({
    url: `${base_url}todos/${id}`,
    method: "DELETE",
    headers: {
      token: localStorage.getItem("access_token")
    }
  })
    .done((_) => {
      console.log("berhasil didelete");
      auth()
    })
    .fail((xhr, text) => {
      console.log(xhr, text);
    })
}


