const textInput = document.querySelector(".textinput_input_text");
const textButton = document.querySelector(".textinput_button");
const token = localStorage.getItem("Token");
const accountname = localStorage.getItem("accountname");

// 상단바 뒤로가기
document.querySelector(".icon-left-arrow").addEventListener("click", () => {
  location.href = "feed.html";
});
// 상단바 모달 설정 및 개인정보, 로그아웃
// 게시물 불러오기

const postId = localStorage.getItem("postId");
async function getFeed() {
  const url = "https://mandarin.api.weniv.co.kr";
  const res = await fetch(url + `/post/${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const heartedlist = [];
  const json = await res.json();
  console.log(json);
  const post = json.post;
  const hearted = post.hearted;
  const authorImage = post.author.image;
  const authorAccount = post.author.accountname;
  const authorName = post.author.username;
  const commentCount = post.commentCount;
  const content = post.content;
  const image = post.image;
  const heartCount = post.heartCount;
  const update = post.updatedAt.slice(0, 10);
  document.querySelector(".home-feed-container").innerHTML = `
      <section class="home-feed">
          <article class="post-art">
              <div class="post-user">
                  <div class="post-con-info">
      <img class="img-mini-profile" src="${authorImage}"/>
      <div>
      <h2 class="post-title"> ${authorName}</h2>
      <p class="post-user-id"> @${authorAccount}</p>
      </div>
      </div>
      </div>
      <div class="post-main">
      <div class="post-con-main">
      <p class="content">${content}</p>
      <img src=" ${image}" onerror="this.style.display='none'" />
      </div>
      <div class="reaction-con">
      <ul class="reaction-list">
      <li class="likes">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff" stroke="#767676" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.9201 3.0132C15.5202 2.60553 15.0455 2.28213 14.523 2.06149C14.0005 1.84085 13.4405 1.72728 12.8749 1.72728C12.3093 1.72728 11.7492 1.84085 11.2267 2.06149C10.7042 2.28213 10.2295 2.60553 9.82965 3.0132L8.99985 3.85888L8.17004 3.0132C7.3624 2.19011 6.267 1.72771 5.12483 1.72771C3.98265 1.72771 2.88725 2.19011 2.07961 3.0132C1.27197 3.83629 0.818237 4.95264 0.818237 6.11667C0.818237 7.28069 1.27197 8.39704 2.07961 9.22013L2.90941 10.0658L8.99985 16.2727L15.0903 10.0658L15.9201 9.22013C16.3201 8.81265 16.6374 8.32884 16.8539 7.79633C17.0704 7.26383 17.1819 6.69307 17.1819 6.11667C17.1819 5.54026 17.0704 4.96951 16.8539 4.437C16.6374 3.9045 16.3201 3.42069 15.9201 3.0132Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <span class="heartnumber">${heartCount}</span>
      </li>
      <li class="comments">
      <img src="img/2/footer-icon/chat.svg">
      <span class="number">${commentCount}</span>
      </li>
      <ul>
      <p class="post-date">${update}</p>
      </div>
            </div>
          </article>
        </section>
              `;
    document.querySelector('.likes').addEventListener("click",() => heartClick(postId, hearted))
  
  heartedlist.push(hearted);
  //  좋아요 구현
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

getFeed();

function heartClick(postId, hearted) {
  if(hearted){
    DeleteLikes(postId)
  }else{
    UploadLikes(postId)
  }
}

// 좋아요 올리는 부분
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

// 댓글 리스트업
async function getComments() {
  const url = "https://mandarin.api.weniv.co.kr";
  const res = await fetch(url + `/post/${postId}/comments/?limit=100&skip=0`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });

  const json = await res.json();
  console.log(json);
  const jsonComment = json.comments;
  for (let i = 0; i < jsonComment.length; i++) {
    const postId = localStorage.getItem("postId");
    const image = jsonComment[i].author.image;
    const username = jsonComment[i].author.username;
    const createdAt = jsonComment[i].createdAt.slice(0, 10);
    const time = jsonComment[i].createdAt.slice(11, 19);
    const content = jsonComment[i].content;
    const spareDate = checkDate(createdAt, time);
    const commentId = jsonComment[i].id;
    const useraccountName = jsonComment[i].author.accountname;
    console.log(useraccountName);
    console.log(accountname);
    const article = document.createElement("article");
    article.classList.add("comment-element");
    article.innerHTML = `<div class="comments-innerbox">
    <img class="comments-img" src="${image}" alt="프로필이미지" />
    <h3 class="comments-name">${username}</h3>
    <span class="settime">${spareDate}</span>
  </div>
  <img class="comments-dot" src="img/more-vertical.png" alt="">
  <p class="comments-contents">${content}</p>
    `;
    ["comments-dot"].forEach((cls) => {
      article.querySelector(`.${cls}`).addEventListener("click", function () {
        if (accountname !== useraccountName) {
          reportModal(postId, commentId);
        } else {
          deleteModal(postId, commentId);
        }
      });
    });
    ["comments-img", "comments-name"].forEach((cls) => {
      article
        .querySelector(`.${cls}`)
        .addEventListener("click", () => GoToPage(useraccountName));
    });
    document.querySelector(".comments-container").appendChild(article);
  }
}
function GoToPage(useraccountName) {
  if (accountname !== useraccountName) {
    localStorage.setItem("authorAccountName", useraccountName);
    location.href = "otherpage.html";
  } else {
    location.href = "userpage.html";
  }
}

function checkDate(createdAt, time) {
  let currentTime = new Date();
  // console.log(currentTime);
  const com_month = Number((createdAt.slice(5, 7) - 1) * 43800);
  const com_day = Number(createdAt.slice(8, 10) * 1440);
  const com_hours = (Number(time.slice(0, 2)) + 9) * 60;
  const com_min = Number(time.slice(3, 5));
  // console.log(com_min)
  const allTime = com_month + com_day + com_hours + com_min;

  const month = currentTime.getMonth();
  const date = currentTime.getDate();
  const hours = currentTime.getHours();
  const minutes = currentTime.getMinutes();
  const toallTime = month * 43800 + date * 1440 + hours * 60 + minutes;
  const spareTime = toallTime - allTime;
  // console.log(spareTime)
  if (spareTime <= 1) {
    return "방금";
  } else if (spareTime < 60) {
    return `${spareTime}분전`;
  } else if (spareTime < 1440) {
    return `${Math.floor(spareTime / 60)}시간전`;
  } else if (spareTime < 43800) {
    return `${Math.floor(spareTime / 1440)}일전`;
  } else {
    return `${Math.floor(spareTime / 43800)}개월전`;
  }
}
getComments();

// 댓글 작성

async function writeComments() {
  const url = `https://mandarin.api.weniv.co.kr/post/${postId}/comments`;
  const contentText = textInput.value;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      comment: {
        content: contentText,
      },
    }),
  });
  const json = await res.json();
}
textButton.addEventListener("click", function () {
  writeComments();
});

// 댓글 프로필 사진

async function getProfile() {
  const url = `https://mandarin.api.weniv.co.kr/profile/${accountname}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  const 이미지 = json.profile.image;
  const img = document.createElement("img");
  img.src = `${이미지}`;
  document.querySelector(".textinput").appendChild(img);
}

getProfile();

// 게시물 모달 신고

async function reportComment(postId, commentId) {
  const url = `https://mandarin.api.weniv.co.kr/post/${postId}/comments/${commentId}/report`;
  const report = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: JSON.stringify({
      report: {
        comment: commentId,
      },
    }),
  });
}

// 댓글 삭제 모달
function deleteModal(postId, commentId) {
  let modalBg = document.querySelector(".modal_bg");
  let modal = document.querySelector(".posting_modal");
  let user_delete = document.querySelector(".user_delete");
  let modalDelete = document.querySelector(".modal_delete");
  let cancleBtn = document.querySelector(".cancel-button");
  let deleteBtn = document.querySelector(".delete-btn");

  const open = () => {
    modalBg.classList.add("on");
    modal.classList.add("on");
  };

  const close = () => {
    modalBg.classList.remove("on");
    modal.classList.remove("on");
    modalDelete.classList.remove("on");
  };

  const user_delete_open = () => {
    modalDelete.classList.add("on");
  };

  const user_delete_close = () => {
    deleteComment(postId, commentId);
    location.href = "posting.html";
  };

  open();
  modalBg.addEventListener("click", close);
  user_delete.addEventListener("click", user_delete_open);
  cancleBtn.addEventListener("click", close);
  deleteBtn.addEventListener("click", user_delete_close);
}

// 댓글 신고 모달
function reportModal(postId, commentId) {
  let modalBgReport = document.querySelector(".modal_bg.report");
  let modal_Report = document.querySelector(".posting_modal.report");
  let user_report = document.querySelector(".user_report");
  let modalReport = document.querySelector(".modal_report");
  let cancleBtn = document.querySelector(".cancel-button.report");
  let reportBtn = document.querySelector(".report-btn");

  const open = () => {
    modalBgReport.classList.add("on");
    modal_Report.classList.add("on");
  };

  const close = () => {
    modalBgReport.classList.remove("on");
    modal_Report.classList.remove("on");
    modalReport.classList.remove("on");
  };

  const user_delete_open = () => {
    modalReport.classList.add("on");
  };

  const user_delete_close = () => {
    reportComment(postId, commentId);
    location.href = "posting.html";
  };

  open();
  modalBgReport.addEventListener("click", close);
  user_report.addEventListener("click", user_delete_open);
  cancleBtn.addEventListener("click", close);
  reportBtn.addEventListener("click", user_delete_close);
}

// 댓글 삭제
async function deleteComment(postId, commentId) {
  const deleteComment = await fetch(
    `https://mandarin.api.weniv.co.kr/post/${postId}/comments/${commentId}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
}

const dotBtn = document.querySelector(".icon-more");
const modalBg = document.querySelector(".modal_bg");
const modal = document.querySelector(".chatting_modal");
let inputText = document.querySelector(".textinput_input_text");
let button = document.querySelector(".textinput_button");

button.disabled = true;
inputText.addEventListener("keyup", listener);

function listener() {
  switch (!inputText.value) {
    case true:
      button.disabled = true;
      break;
    case false:
      button.disabled = false;
      break;
  }
}

const open = () => {
  modalBg.classList.add("on");
  modal.classList.add("on");
};
const close = () => {
  modalBg.classList.remove("on");
  modal.classList.remove("on");
};

dotBtn.addEventListener("click", open);
modalBg.addEventListener("click", close);
