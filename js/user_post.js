const profile = document.querySelector(".img-profile");
console.log(localStorage.getItem("Token"));
// 상단바 뒤로가기
document.querySelector(".icon-left-arrow").addEventListener("click", () => {
    window.history.back();
});
// 유저 프로필 사진
// 사진 미리보기
async function imageDisplay(e) {}
// 게시물 업로드
const $image = document.querySelector(".textinput_input_file");
const $content = document.querySelector(".user_post-inp");
const $uploadBtn = document.querySelector(".upload-btn");
//여기부터
async function imageUpload(files, index) {
    const formData = new FormData();
    formData.append("image", files[index]); //formData.append("키이름","값")
    const res = await fetch(`http://146.56.183.55:5050/image/uploadfile`, {
        method: "POST",
        body: formData,
    });
    const data = await res.json();
    const productImgName = data["filename"];
    return productImgName;
}
async function createPost(e) {
    const url = "http://146.56.183.55:5050";
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
        console.log(json);
    } else {
        alert("아 이미지 갯수가 너무 많소");
    }
}
//여기까지 이미지 여러개 업로드하기.
$uploadBtn.addEventListener("click", createPost);