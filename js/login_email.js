const join = document.querySelector(".join-email");
const error = document.querySelector(".error-msg");




async function login() {
  const email = document.querySelector("#login-id").value;
  const pw = document.querySelector("#login-pw").value;
  const url = "https://mandarin.api.weniv.co.kr";
  const loginData = {
    user: {
      email: email,
      password: pw,
    },
  };

  const res = await fetch(url + "/user/login", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },

    body: JSON.stringify(loginData),
  });
  const json = await res.json();
  console.log(json);
  if (json.status === 422) {
    error.innerHTML = `*${json.message}`;
  }
  localStorage.setItem("Token", json.user.token);
  localStorage.setItem("accountname", json.user.accountname);
  localStorage.setItem("myId", json.user._id);
  location.href = "feed.html";
}

// 버튼 활성화
const inputId = document.querySelector("#login-id")
const inputPw = document.querySelector("#login-pw")
const $loginBtn = document.querySelector(".login-button");

$loginBtn.disabled = true;
$loginBtn.addEventListener("click", login);

inputId.addEventListener('keyup', listener );
inputPw.addEventListener('keyup', listener );

function listener() {
  switch (!inputId.value || !inputPw.value) {
      case true: $loginBtn.disabled = true; break;
      case false: $loginBtn.disabled = false; break;
  }
}

join.addEventListener("click", function () {
  location.href = "join_email.html";
});
