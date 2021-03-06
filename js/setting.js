const $profileImg = document.querySelector(".profile-img")
const $saveBtn = document.querySelector(".profile-save-btn")
const $idinput_error = document.querySelector(".join-idinput-error")
const token = localStorage.getItem("Token");
const arrow = document.querySelector('.arrow')

arrow.addEventListener('click',function() {
  location.href = "feed.html"
})

async function imageUpload(files) {
    const formData = new FormData();
    formData.append("image", files[0]); 
    const res = await fetch(`https://mandarin.api.weniv.co.kr/image/uploadfile`, {
        method: "POST",
        body : formData
    })
    const data = await res.json()
    const productImgName = data["filename"];
    return productImgName;
  }

  async function profileImage(e) {
    const files = e.target.files
    const result = await imageUpload(files)
    $profileImg.src = "https://mandarin.api.weniv.co.kr" + "/" + result
    console.log($profileImg.src)
    document.querySelector('.profile-user-image').src =  $profileImg.src
  }
  document.querySelector("#profileImg").addEventListener("change", profileImage)
  
  async function join(){
    const userName = document.querySelector("#userNameInput").value;
    const userId = document.querySelector("#userIdInput").value;
    const intro = document.querySelector("#userIntroInput").value;
    const imageUrl = document.querySelector(".profile-user-image").src
    {
        const res = await fetch("https://mandarin.api.weniv.co.kr/user", {
            method: "PUT",
            headers: {
                "Authorization" : `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body : JSON.stringify({
                "user": {
                    "username": userName,
                    "accountname": userId,
                    "intro": intro,
                    "image": imageUrl,
                }
            })
        })

        const json = await res.json()
        const message = json.message
        if(res.status === 422) {
          if (message == "?????? ???????????? ?????? ID?????????.") {
            $idinput_error.innerHTML = "*?????? ???????????? ?????? ID?????????.";
          }
          else {
            $idinput_error.innerHTML = "*??????, ??????, ?????? ??? ???????????? ????????? ??? ????????????."
          }
        }
        if(res.status == 200){
            localStorage.setItem("accountname", json.user.accountname);
            location.href = "feed.html"
        }
        else{
            console.log(json)
        }
    }
}
  $saveBtn.addEventListener("click", join)