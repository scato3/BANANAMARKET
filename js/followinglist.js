const 뒤로가기 = document.querySelector(".back");
const home = document.querySelector(".img-home");
const chat = document.querySelector(".img-chat");
const plus = document.querySelector(".img-plus");
const profile = document.querySelector(".img-profile");
const token = localStorage.getItem("Token");

뒤로가기.addEventListener("click", function () {
  location.href = "userpage.html";
});
async function getFollowing() {
  const accountname = localStorage.getItem("accountname");

  const url = `https://mandarin.api.weniv.co.kr/profile/${accountname}/following?limit=100&skip=0`;
  const token = localStorage.getItem("Token");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();

  json.forEach((i) => {
    const 팔로우이미지 = i.image;
    const 팔로우이름 = i.username;
    const 팔로우소개 = i.intro;
    const accountName = i.accountname;
    const li = document.createElement("li");
    li.classList.add("follow-list");
    li.innerHTML = `
        <li class="follow-list">
            <img class="display-inline" src="${팔로우이미지}"/>
            <div class="follower-desc display-inline">
                <p class="followName">${팔로우이름}</p>
                <small class="followIntro">${팔로우소개}</small>
            </div>
            <button type="submit" class="cancle-btn fBtn">취소</button>
        </li>
        `;
    ["fBtn"].forEach((cls) => {
      const btn = li.querySelector(`.${cls}`);
      btn.addEventListener("click", () => followBtn(btn, `${accountName}`));
    });
    ["display-inline", "followName", "followIntro"].forEach((cls) => {
      li.querySelector(`.${cls}`).addEventListener("click", () =>
        GoToPage(accountName)
      );
    });
    document.querySelector(".container").appendChild(li);
  });
  function followBtn(e,accountName) {
        if (e.innerText === "팔로우") {
          e.classList.remove("follow-btn");
          e.classList.add("cancle-btn");
          e.innerText = "취소";
          팔로우업로드(accountName);

        } else {
          e.classList.remove("cancle-btn");
          e.classList.add("follow-btn");
          e.innerText = "팔로우";
          팔로우취소(accountName);
        }
      }
}

function GoToPage(accountName) {
    localStorage.setItem("authorAccountName", accountName)
    location.href = "otherpage.html"
}

//팔로우 반영 하기
async function 팔로우업로드(listAccountName) {
  console.log(listAccountName)
  const 팔로우데이터 = await fetch(
    `https://mandarin.api.weniv.co.kr/profile/${listAccountName}/follow`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  const data = await 팔로우데이터.json();
  console.log('팔로우완료');
  console.log(data)
}

//팔로우 취소 하기
async function 팔로우취소(listAccountName) {
  console.log(listAccountName)

  const 팔로우취소데이터 = await fetch(
    `https://mandarin.api.weniv.co.kr/profile/${listAccountName}/unfollow`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  const data = await 팔로우취소데이터.json();
  console.log("팔로우취소완료");
  console.log(data)
}

getFollowing();
