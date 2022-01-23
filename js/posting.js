// 변수 설정
// 상단바 뒤로가기
document.querySelector(".icon-left-arrow").addEventListener("click", () => {
  window.history.back();
});
// 상단바 모달 설정 및 개인정보, 로그아웃
// 게시물 불러오기

// console.log(localStorage.getItem("Token"));
const postId = localStorage.getItem("postId");
async function getFeed() {
  const url = "http://146.56.183.55:5050";
  const token = localStorage.getItem("Token");
  const res = await fetch(url + `/post/${postId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });

  const json = await res.json();
  const post = json.post;
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
      <img src=" ${image}"/>
      </div>
      <div class="reaction-con">
      <ul class="reaction-list">
      <li class="likes">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="#fff" stroke="#767676" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.9201 3.0132C15.5202 2.60553 15.0455 2.28213 14.523 2.06149C14.0005 1.84085 13.4405 1.72728 12.8749 1.72728C12.3093 1.72728 11.7492 1.84085 11.2267 2.06149C10.7042 2.28213 10.2295 2.60553 9.82965 3.0132L8.99985 3.85888L8.17004 3.0132C7.3624 2.19011 6.267 1.72771 5.12483 1.72771C3.98265 1.72771 2.88725 2.19011 2.07961 3.0132C1.27197 3.83629 0.818237 4.95264 0.818237 6.11667C0.818237 7.28069 1.27197 8.39704 2.07961 9.22013L2.90941 10.0658L8.99985 16.2727L15.0903 10.0658L15.9201 9.22013C16.3201 8.81265 16.6374 8.32884 16.8539 7.79633C17.0704 7.26383 17.1819 6.69307 17.1819 6.11667C17.1819 5.54026 17.0704 4.96951 16.8539 4.437C16.6374 3.9045 16.3201 3.42069 15.9201 3.0132Z" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      <span class="number">${heartCount}</span>
      </li>
      <li class="comments">
      <img src="./img/2/footer-icon/chat.svg">
      <span class="number">${commentCount}</span>
      </li>
      <ul>
      <p class="post-date">${update}</p>
      </div>
            </div>
          </article>
        </section>
              `;
  //  좋아요 구현
  const likesBtns = document.querySelectorAll(".likes svg");
  likesBtns.forEach((likeBtn) => {
    likeBtn.addEventListener("click", function () {
      if (likeBtn.classList.contains("likes-on")) {
        likeBtn.classList.remove("likes-on");
      } else {
        likeBtn.classList.add("likes-on");
      }
    });
  });
}

getFeed();

// 댓글 리스트업
async function getComments() {
  const url = "http://146.56.183.55:5050";
  const token = localStorage.getItem("Token");
  const res = await fetch(url + `/post/${postId}/comments`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  const jsonComment = json.comments;
  for (let i = 0; i < jsonComment.length; i++) {
    const image = jsonComment[i].author.image;
    const username = jsonComment[i].author.username;
    const createdAt = jsonComment[i].createdAt.slice(0, 10);
    const time = jsonComment[i].createdAt.slice(11, 19);
    const content = jsonComment[i].content;
    const spareDate = checkDate(createdAt, time);
    // console.log(createdAt)
    // console.log(username)
    const article = document.createElement("article");
    article.classList.add("comment-element");
    article.innerHTML = `<div class="comments-innerbox">
    <img class="comments-profile" src="${image}" alt="프로필이미지" />
    <h3>${username}</h3>
    <span class="settime">${spareDate}</span>
  </div>
  <img class="comments-dot" src="img/more-vertical.png" alt="">
  <p class="comments-contents">${content}</p>
    `;
    document.querySelector(".comments-container").appendChild(article);
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
  console.log(spareTime);
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

// 게시물 모달 신고 표시
// 댓글 모달 삭제 표시
// 댓글 입력 게시 활성화

let inputText = document.querySelector(".textinput_input_text");
let button = document.querySelector(".textinput_button");
let dotBtn = document.querySelector(".icon-more");
let modalBg = document.querySelector(".modal_bg");
let modal = document.querySelector(".chatting_modal");

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
