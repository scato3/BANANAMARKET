const saveBtn = document.querySelector('.sale-save');
const saleImg = document.querySelector('#product-img');
saveBtn.disabled = true;
const userToken = localStorage.getItem("Token");
const useraccount = userToken.useraccount;
//입력하면 버튼 활성화
const form_txt = document.querySelector('.product-sale-form');
const saleName = document.querySelector('#product');
const salePrice = document.querySelector('#price');
const saleLink = document.querySelector('#sale-link');

form_txt.addEventListener('keyup',()=>{
  let saleName_val = saleName.value;
  let salePrice_val = salePrice.value;
  let saleLink_val = saleLink.value;
  let saleImg_val = saleImg.files[0];
  if((saleName_val)  && (salePrice_val) && (saleLink_val) &&(saleImg_val)){
    saveBtn.disabled = false;
    saveBtn.classList.add('click');
  }
})

saveBtn.addEventListener("click",()=>{
  console.log('click');
  imgFile = (saleImg.files);
  uploadSaleImgName(imgFile);
  UploadSalePost(imgFile);
})

//이미지 등록하면 이미지 url을 보내줌. url을 이미지 
//이미지 업로드 
async function uploadSaleImgName(files){
  const dataform = new FormData();
  dataform.append('image',files[0]);
      const imgdata = await fetch(`https://mandarin.api.weniv.co.kr/image/uploadfile`, {
        method: "POST", 
        body : dataform
    })
    const data = await imgdata.json();
    const saleImgFileName = data.filename;
    return saleImgFileName;
}

// 미리보기 구현
async function profileImage(e) {
  const files = e.target.files
  const result = await uploadSaleImgName(files);
  saleImg.src = "https://mandarin.api.weniv.co.kr" + "/" + result;
  const saleImgUrl = saleImg.src;
  document.querySelector('.sale-img-bg').style.backgroundImage = `url(${saleImgUrl})`;
}

saleImg.addEventListener("change", profileImage);

// 판매 게시글 업로드 saleImg.src
async function UploadSalePost(files){
  let salePrice_val = salePrice.value;
  salePrice_val = Number(salePrice_val);
  const urlresult = await uploadSaleImgName(files);
  const imgUrl = "https://mandarin.api.weniv.co.kr" + "/" + urlresult;

  try{
    const res = await fetch("https://mandarin.api.weniv.co.kr/product", {
        method: "POST",
        headers: {
          "Authorization" : `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
        body : JSON.stringify({
          "product":{
            "itemName": saleName.value,
            "price": salePrice_val,
            "link": saleLink.value,
            "itemImage":imgUrl

          }
        })
    })
    const saleData = await res.json()
    console.log(saleData);
    const message =  saleData.message    
    if(res.status==200){
      location.href = "userpage.html"; }

  }catch(err){
    console.log('오류가 났습니다.')
}}