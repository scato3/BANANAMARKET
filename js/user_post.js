const profile = document.querySelector(".img-profile");
const $image = document.querySelector(".textinput_input_file");
const $content = document.querySelector(".user_post-inp");
const $uploadBtn = document.querySelector(".upload-btn");
const $preview = document.querySelector(".art-preview");
document.querySelector(".icon-left-arrow").addEventListener("click", () => {
    window.history.back();
});

// 버튼 활성화
const form_txt = document.querySelector(".user_post-article-cont");
$uploadBtn.disabled = true;
$content.addEventListener("keyup", listener);

function listener() {
    switch (!$content.value) {
        case true:
            $uploadBtn.disabled = true;
            break;
        case false:
            $uploadBtn.disabled = false;
            break;
    }
}
// 프로필 사진 불러오기
async function getProfile() {
    const accountname = localStorage.getItem("accountname");

    const url = `https://mandarin.api.weniv.co.kr/profile/${accountname}`;
    const token = localStorage.getItem("Token");
    const res = await fetch(url, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-type": "application/json",
        },
    });
    const json = await res.json();
    const 이미지 = json.profile.image;
    const 계정 = json.profile.accountname;
    document.querySelector(".main-img").innerHTML = `
    <img class="profile-img-small" src="${이미지}" alt="${계정}의 프로필 사진">
    `;
}
getProfile();

// 선택한 사진 미리보기
function handleFiles(files) {
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        if (!file.type.startsWith("image/")) {
            continue;
        }

        const img = document.createElement("img");
        img.classList.add("art-preview_img");
        img.file = file;
        $preview.appendChild(img);

        const reader = new FileReader();
        reader.onload = (function (aImg) {
            return function (e) {
                aImg.src = e.target.result;
            };
        })(img);
        reader.readAsDataURL(file);
    }
}
$image.addEventListener("change", function () {
    handleFiles($image.files);
});

// 이미지 서버 올리기
async function imageUpload(files, index) {
    const formData = new FormData();
    formData.append("image", files[index]); //formData.append("키이름","값")
    const res = await fetch(`https://mandarin.api.weniv.co.kr/image/uploadfile`, {
        method: "POST",
        body: formData,
    });
    const data = await res.json();
    const productImgName = data["filename"];
    return productImgName;
}

async function createPost() {
    const url = "https://mandarin.api.weniv.co.kr";
    const token = localStorage.getItem("Token");
    //입력한 텍스트 불러와야함
    const contentText = $content.value;
    //여기는 나중에 이미지 주소가 추가될 예정
    const imageUrls = [];
    const files = $image.files;
    //file갯수를 판별하여 3개 이하일때만 실행하게한다.
    if (files.length <= 3) {
        // file을 입력한 갯수만큼 반복해서 실행합니다. 여기서 이미지 url배열에 추가되는부분
        for (let index = 0; index < files.length; index++) {
            const imgurl = await imageUpload(files, index);
            //완성된 url을 만들어서 넣어준다.
            imageUrls.push(url + "/" + imgurl);
        }
        const res = await fetch(url + "/post", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`, //토큰을 넣어줍니다.
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                post: {
                    content: contentText,
                    image: imageUrls + "", //"imageurl1", "imageurl2" 형식으로
                },
            }),
        });
        const json = await res.json();
        location.href = "userpage.html";
    } else {
        alert("아 이미지 갯수가 너무 많소");
    }
}

$uploadBtn.addEventListener("click", function () {
    createPost();
});
