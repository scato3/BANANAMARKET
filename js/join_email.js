const $emailPw = document.querySelector(".cont-banana");
const $id_error = document.querySelector(".join-id-error");
const $pw_error = document.querySelector(".join-pw-error");
const $profile = document.querySelector(".profile");
const $profileImg = document.querySelector(".profile-img");

// 회원가입 메인창
const idPwForm = document.querySelector('.cont-banana.email-pw');
const inputId = document.querySelector("#join-id");
const inputPw = document.querySelector("#join-pw");
const $loginBtn = document.querySelector(".login-button.next");
const $idinput_error = document.querySelector(".join-idinput-error");
const $loginBtn_b = document.querySelector(".login-button.submit");

// 회원가입 디테일
const userName = document.querySelector("#userNameInput");
const userId = document.querySelector("#userIdInput");
const intro = document.querySelector("#userIntroInput");
const emailPwForm = document.querySelector('.cont-banana.profile');

$loginBtn.disabled = true;
$loginBtn_b.disabled = true;

idPwForm.addEventListener("keyup", function () {
  if(inputId.value && inputPw.value) {
    $loginBtn.disabled = false;
  } else {
    $loginBtn.disabled = true;
  }
})

// function listener1() {
//   switch (inputId.value && !inputPw.value) {
//     case true:
//       $loginBtn.disabled = true;
//       break;
//     case false:
//       $loginBtn.disabled = false;
//       break;
//   }
// }

emailPwForm.addEventListener("keyup", function () {
  if(userName.value && userId.value && intro.value) {
    $loginBtn_b.disabled = false;
  } else {
    $loginBtn_b.disabled = true;
  }
})

async function checkEmailValid(email) {
  const url = "https://mandarin.api.weniv.co.kr";
  const res = await fetch(url + "/user/emailvalid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user: {
        email: email,
      },
    }),
  });
  const json = await res.json();
  return json.message == "사용 가능한 이메일 입니다." ? true : false;
}

document
  .querySelector(".login-button.next")
  .addEventListener("click", async () => {
    const email = document.querySelector("#join-id").value;
    const pw = document.querySelector("#join-pw").value;
    const exptext =
      /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
    if (exptext.test(email) === false) {
      $id_error.innerHTML = "*올바르지 않은 이메일 형식입니다.";
    }
    if (pw.length < 6)
      $pw_error.innerHTML = "*비밀번호는 6자 이상이어야 합니다.";
    else {
      if (exptext.test(email) === true) {
        const emailValid = await checkEmailValid(email);
        if (emailValid) {
          $emailPw.style.display = "none";
          $profile.style.display = "flex";
        } else {
          $id_error.innerHTML = "*이미 가입된 이메일 주소입니다.";
        }
      }
    }
  });

async function imageUpload(files) {
  const formData = new FormData();
  formData.append("image", files[0]);
  const res = await fetch(`https://mandarin.api.weniv.co.kr/image/uploadfile`, {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  const productImgName = data["filename"];
  return productImgName;
}

async function profileImage(e) {
  const files = e.target.files;
  const result = await imageUpload(files);
  $profileImg.src = "https://mandarin.api.weniv.co.kr" + "/" + result;
  console.log($profileImg.src);
  document.querySelector(".profile-user-image").src = $profileImg.src;
}
document.querySelector("#profileImg").addEventListener("change", profileImage);

async function join() {
  // const user = makeUser();
  const email = document.querySelector("#join-id").value;
  const password = document.querySelector("#join-pw").value;
  const userName = document.querySelector("#userNameInput");
  const userId = document.querySelector("#userIdInput");
  const intro = document.querySelector("#userIntroInput");
  const imageUrl = document.querySelector(".profile-user-image").src;
  try {
    const res = await fetch("https://mandarin.api.weniv.co.kr/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          email: email,
          password: password,
          username: userName.value,
          accountname: userId.value,
          intro: intro.value,
          image: imageUrl,
        },
      }),
    });
    const json = await res.json();
    const message = json.message;
    //  const data = await join(user)
    if (res.status === 422) {
      if (message == "이미 사용중인 계정 ID입니다.") {
        $idinput_error.innerHTML = "*이미 사용중인 계정 ID입니다.";
      } else {
        $idinput_error.innerHTML =
          "*영문, 숫자, 밑줄 및 마침표만 사용할 수 있습니다.";
      }
    }
    if (res.status == 200) {
      alert("회원가입 완료. 로그인 하세요");
      location.href = "index.html";
    } else {
      console.log(json);
    }
  } catch (err) {
    alert(err);
  }
  
}
$loginBtn_b.addEventListener("click", join);
