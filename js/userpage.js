// 로그인한 프로필 가져오기
const token = localStorage.getItem("Token");
async function getProfile() {
  const accountname = localStorage.getItem("accountname");
  const url = `https://mandarin.api.weniv.co.kr/profile/${accountname}`;
  const token = localStorage.getItem("Token");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type" : "application/json",
    },
  });
  const json = await res.json();
  const 이미지 = json.profile.image;
  const 이름 = json.profile.username;
  const 계정 = json.profile.accountname;
  const 소개 = json.profile.intro;
  const 팔로워수 = json.profile.followerCount;
  const 팔로잉수 = json.profile.followingCount;
  document.querySelector(".profile").innerHTML += `
  <a href="" class="display-inline basic-profile"><img src="${이미지}" alt=""></a>
  <div class="profile-desc">
  <h2>${이름}</h2>
  <small>@ ${계정}</small>
  <p>${소개}</p>
  </div>
  <div class="btn-set">
    <button type="submit" class="display-inline unfollow-btn proEdit">프로필 수정</button>
    <button type="submit" class="display-inline unfollow-btn register">상품 등록</button>
  </div>
    `;

  document.querySelector(".followers-num").innerHTML += `
    <p class="followBtn">${팔로워수}</p>
    <small>followers</small>
  `;

  document.querySelector(".followings-num").innerHTML += `
  <p class="followingBtn">${팔로잉수}</p>
  <small>followings</small>
`;
  // 프로필수정, 상품등록버튼 클릭시 이동
  const register = document.querySelector(".register")
  const proEdit = document.querySelector(".proEdit")
  const moveTo_rg = () => {
    location.href = "sale_post.html"
  }
  const moveTo_pe = () => {
    location.href = "setting.html"
  }
  register.addEventListener("click", moveTo_rg); 
  proEdit.addEventListener("click", moveTo_pe); 


  const 팔로워 = document.querySelector(".followBtn");
  const 팔로잉 = document.querySelector(".followingBtn");

  팔로워.addEventListener("click", function () {
    location.href = "followerlist.html";
  });
  팔로잉.addEventListener("click", function () {
    location.href = "followinglist.html";
  });
}

getProfile();

const sellDiv = document.querySelector(".sell-items");

// 판매 게시글 가져오기
async function GetSaleInfo() {
  const token = localStorage.getItem("Token");
  const accountname = localStorage.getItem("accountname");
  const saleimgdata = await fetch(
    `https://mandarin.api.weniv.co.kr/product/${accountname}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  const salejson = await saleimgdata.json();
  const sale_pro = salejson.product;
  console.log(sale_pro);
  sale_pro.forEach((el) => {
    const itemName = el.itemName;
    const itemImg = el.itemImage;
    const itemPrice = el.price;
    const itemId = el.id;
    const itemLink = el.link;
    console.log(itemId);
    let sellArt = document.createElement("article");
    sellArt.classList.add("display-sell");
    sellArt.innerHTML = `
        <img class="saleImg" src="${itemImg}" alt="">
        <p class="saleName">${itemName}</p>
        <small class="salePrice">${itemPrice}원</small>
      </a>
    `;
    ["saleImg", "saleName", "salePrice"].forEach((cls) => {
      sellArt
        .querySelector(`.${cls}`)
        .addEventListener("click", () => saleModal(itemId, itemLink));
    });
    sellDiv.appendChild(sellArt);
  });
}

// 판매 상품 삭제
async function deleteItem(itemId) {
  const token = localStorage.getItem("Token");
  const deleteSale = await fetch(
    `https://mandarin.api.weniv.co.kr/product/${itemId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
}

// 피드 보여주는 버튼 부분
const albumBtn = document.querySelector(".show-album img");
const listBtn = document.querySelector(".show-list img");
const albumSec = document.querySelector(".album");
const listSec = document.querySelector(".home-feed");
window.onload = function () {
  GetSaleInfo();
  albumSec.classList.add("hide");
  GetList();
  GetAlbum();
};

albumBtn.addEventListener("click", () => {
  albumBtn.src = "img/icon-post-album-on.png";
  listBtn.src = "img/icon-post-list-off.png";
  listSec.classList.add("hide");
  albumSec.classList.remove("hide");
});

listBtn.addEventListener("click", () => {
  albumBtn.src = "img/icon-post-album-off.png";
  listBtn.src = "img/icon-post-list-on.png";
  albumSec.classList.add("hide");
  listSec.classList.remove("hide");
});

const feedSec = document.querySelector('.home-feed');
// 피드 가져오기 리스트형식
async function GetList() {
  const token = localStorage.getItem("Token");
  const accountname = localStorage.getItem("accountname");
  const feedimgdata = await fetch(
    `https://mandarin.api.weniv.co.kr/post/${accountname}/userpost`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  const list = await feedimgdata.json();
  const listPost = list.post;
  const heartedlist = [];
  listPost.forEach((el, i) => {
    const postId = el.id;
    const username = el.author.username;
    const userImg = el.author.image;
    const accountname = el.author.accountname;
    const content = el.content;
    const feedImg = el.image;
    const hearted = el.hearted;
    let updateAt = el.updatedAt;
    // updateAt = updateAt.match(/[0-9]{4}-[0-9]{2}-[0-9]{2}/g);
    const year = updateAt.slice(0, 4);
    const month = updateAt.slice(5, 7);
    const date = updateAt.slice(8, 10);
 
    let heartCount = 0;
    let commentCount = 0;

    if (hearted && el.comments) {
      heartCount = el.heartCount;
      commentCount = el.comments.length;
    }

    let feedArt = document.createElement("article");
    feedArt.classList.add("art-post");
    feedArt.insertAdjacentHTML(
      "afterbegin",
      `
    <div class="post-user">
      <img
        src="${userImg}"
        alt=""
        class="img-mini-profile"
      />
      <div>
        <h2 class="post-title">${username}</h2>
        <p class="post-user-id">@${accountname}</p>
      </div>
      <button>
        <img id="more" class="more" src="img/more-vertical.png" alt="" />
      </button>
    </div>
    <!-- 포스트 메인-->
    <div class="post-main">
      <!-- 글 -->
      <div class="con-post-main">
        <p>
          ${content}
        </p>
        <div class="feedImg"> 
        <img src="${feedImg}" alt="" onerror="this.style.display = 'none'"/>
        </div>
      </div>
      <!-- likes -->
      <div class="con-reaction">
        <!-- likes & comments -->
        <ul class="list-reaction">
          <li class="likes">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff" stroke="#767676" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.9201 3.0132C15.5202 2.60553 15.0455 2.28213 14.523 2.06149C14.0005 1.84085 13.4405 1.72728 12.8749 1.72728C12.3093 1.72728 11.7492 1.84085 11.2267 2.06149C10.7042 2.28213 10.2295 2.60553 9.82965 3.0132L8.99985 3.85888L8.17004 3.0132C7.3624 2.19011 6.267 1.72771 5.12483 1.72771C3.98265 1.72771 2.88725 2.19011 2.07961 3.0132C1.27197 3.83629 0.818237 4.95264 0.818237 6.11667C0.818237 7.28069 1.27197 8.39704 2.07961 9.22013L2.90941 10.0658L8.99985 16.2727L15.0903 10.0658L15.9201 9.22013C16.3201 8.81265 16.6374 8.32884 16.8539 7.79633C17.0704 7.26383 17.1819 6.69307 17.1819 6.11667C17.1819 5.54026 17.0704 4.96951 16.8539 4.437C16.6374 3.9045 16.3201 3.42069 15.9201 3.0132Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
            <span class="heartnumber">${heartCount}</span>
          </li>
          <li class="comments">
            <img class="comments-img" src="img/2/footer-icon/chat.svg" alt="" />
            <span class="number">${commentCount}</span>
          </li>
        </ul>
        <!-- 업로드 날짜 -->
        <p class="post-date">${year}년 ${month}월 ${date}일 </p>
        </div>
      </div>
    </div>
        `
    );
    
    ["likes"].forEach((cls) => {
      feedArt
        .querySelector(`.${cls}`)
        .addEventListener("click", () => heartClick(postId, hearted))
      });
    listSec.appendChild(feedArt);
    heartedlist.push(hearted);
    
    ["more"].forEach((cls) => {
      feedArt
        .querySelector(`.${cls}`)
        .addEventListener("click", () => editModal(postId))
      });
    ["comments-img"].forEach((cls) => {
        feedArt
          .querySelector(`.${cls}`)
          .addEventListener("click", () => GoToComment(postId))
        });
  });
  
  //좋아요가 있는 부분은 색이 있는 하트 보여주기
  
  const likesBtns = document.querySelectorAll(".likes svg");
  const likeNums = document.querySelectorAll('.heartnumber');
  heartedlist.forEach((list, i) => {
    if (list === true){
      likesBtns[i].classList.add("likes-on");
    } 
  })
  
  likesBtns.forEach((likeBtn, i) => {
    likeBtn.addEventListener("click", function () {
      if (likeBtn.classList.contains("likes-on")) {
        likeBtn.classList.remove("likes-on");
        likeNums[i].innerText = (+(likeNums[i].innerText) - 1);
      } else {
        likeBtn.classList.add("likes-on");
        likeNums[i].innerText = (+(likeNums[i].innerText) + 1);
      }
    });
  });

}
function GoToComment(postId) {
  localStorage.setItem("postId", postId);
  location.href = "posting.html"
}

function heartClick(postId, hearted) {
  if(hearted){
    DeleteLikes(postId)
  }else{
    UploadLikes(postId)
  }
}



//좋아요 올리는 부분
async function UploadLikes(postId) {
  const token = localStorage.getItem("Token");
  // const dataform = new FormData();
  // dataform.append("heartCount", heartState);
  const likedata = await fetch(
    `https://mandarin.api.weniv.co.kr/post/${postId}/heart`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      }
    }
  );
}

//좋아요 취소
async function DeleteLikes(postId) {
  const token = localStorage.getItem("Token");
  const likedata = await fetch(
    `https://mandarin.api.weniv.co.kr/post/${postId}/unheart`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      }
    }
  );
}

// 피드 가져오기 앨범형식
async function GetAlbum() {
  const token = localStorage.getItem("Token");
  const accountname = localStorage.getItem("accountname");
  const albumPhotoDiv = document.querySelector(".album-photos");
  const albumimgdata = await fetch(
    `https://mandarin.api.weniv.co.kr/post/${accountname}/userpost`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  const album = await albumimgdata.json();
  const albumPost = album.post;
  albumPost.forEach((el) => {
    const imgsrc = el.image;
    if (!(imgsrc === "")) {
      let albumDiv = document.createElement("div");
      albumDiv.innerHTML = `
      <div class="album-img-con">
        <a href="">
        <img src="${imgsrc}" alt=""onerror="this.style.display = 'none'">
        </a>
      </div>
      `;
      const albumImgDiv = document.querySelector(".album-img-con");
      albumPhotoDiv.appendChild(albumDiv);
    }
  });
}
// 게시글 삭제 및 수정 모달
function editModal(postId) {
  let modalBg = document.querySelector(".modal_bg.post")
  let modal = document.querySelector(".userpage_modal.post")
  let user_delete = document.querySelector(".user_delete")
  let user_edit = document.querySelector(".user_edit")
  let modalDelete = document.querySelector(".modal_delete")
  let cancleBtn = document.querySelector(".cancel-button")
  let deleteBtn = document.querySelector(".delete-btn")
  
  const open = () => {
    modalBg.classList.add("on")
    modal.classList.add("on")
  }
  
  const close = () => {
    modalBg.classList.remove("on")
    modal.classList.remove("on")
    modalDelete.classList.remove("on")
  }

  const user_delete_open = () => {
    modalDelete.classList.add("on")
  }
  
  const user_delete_close = () => {
    deletePost(postId)
    location.href = "userpage.html"
  }
  
  open();
  modalBg.addEventListener("click", close);
  user_delete.addEventListener("click", user_delete_open);
  user_edit.addEventListener("click", function() {
    localStorage.setItem("postId",postId)
    location.href = "edituser_post.html"
  });
  cancleBtn.addEventListener("click", close)
  deleteBtn.addEventListener("click", user_delete_close);
}

// 게시글 삭제

async function deletePost(postId) {
  const token = localStorage.getItem("Token");
  const deletePost = await fetch(
    `https://mandarin.api.weniv.co.kr/post/${postId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
}

// 로그아웃 모달창 구현

let modalBg = document.querySelector(".modal_bg")
let modal = document.querySelector(".userpage_modal")
let logout = document.querySelector(".user_logout")
let modalLogout = document.querySelector(".modal_logout")
let cancleBtn = document.querySelector(".cancle-btn")
let logoutBtn = document.querySelector(".logout-btn")
let userSetting = document.querySelector(".user_setting")
let dotBtn = document.querySelector(".icon-more")

const open = () => {
  modalBg.classList.add("on")
  modal.classList.add("on")
}
const close = () => { 
  modalBg.classList.remove("on")
  modal.classList.remove("on")
  modalLogout.classList.remove("on")
}

const Logout_open = () => {
  modalLogout.classList.add("on")
}
const Logout_close = () => {
  location.href = "index.html"
  localStorage.clear()
}

const Setting = () => {
  location.href = "userpage.html"
}

dotBtn.addEventListener("click", open);
modalBg.addEventListener("click", close);
logout.addEventListener("click", Logout_open);
cancleBtn.addEventListener("click", close);
logoutBtn.addEventListener("click", Logout_close)
userSetting.addEventListener("click", Setting)

// 판매 상품 모달
function saleModal(itemId, itemLink) {
  let modalBg = document.querySelector(".modal_bg.sale_post")
  let modal = document.querySelector(".userpage_modal.sale_post")
  let user_delete = document.querySelector(".user_delete.sale_post")
  let user_edit = document.querySelector(".user_edit.sale_post")
  let modalDelete = document.querySelector(".modal_salepost_delete")
  let cancleBtn = document.querySelector(".cancel-btn")
  let deleteBtn = document.querySelector(".delete-btn.sale_post")
  let saleSite = document.querySelector(".sale_post_site")

  const open = () => {
    modalBg.classList.add("on")
    modal.classList.add("on")
  }
  
  const close = () => {
    modalBg.classList.remove("on")
    modal.classList.remove("on")
    modalDelete.classList.remove("on")
  }

  const user_delete_open = () => {
    modalDelete.classList.add("on")
  }
  
  const user_delete_close = () => {
    deleteItem(itemId)
    location.href = "userpage.html"
  }
  
  open();
  modalBg.addEventListener("click", close);
  user_delete.addEventListener("click", user_delete_open);
  user_edit.addEventListener("click", function() {
    localStorage.setItem("itemId",itemId)
    location.href = "editsale_post.html"
  });
  cancleBtn.addEventListener("click", close)
  deleteBtn.addEventListener("click", user_delete_close);
  saleSite.addEventListener("click", function () {
    location.href = `${itemLink}`
  })
}