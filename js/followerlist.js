const 뒤로가기 = document.querySelector(".back");
const home = document.querySelector(".img-home");
const chat = document.querySelector(".img-chat");
const plus = document.querySelector(".img-plus");
const profile = document.querySelector(".img-profile");
const token = localStorage.getItem("Token");
const myAccountname = localStorage.getItem("accountname");

뒤로가기.addEventListener("click", function () {
  location.href = "userpage.html";
});

//내가 팔로우한 사용자와 비교하기
async function getMyFollowing(id) {
  const url = `https://mandarin.api.weniv.co.kr/profile/${myAccountname}/following?limit=100&skip=0`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  return json;
}

async function getFollow() {
  const accountname = localStorage.getItem("accountname");

  const url = `https://mandarin.api.weniv.co.kr/profile/${accountname}/follower?limit=100&skip=0`;
  const token = localStorage.getItem("Token");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  //forEach문으로 받아온 데이터 전부 살펴보면서 그려주는 부분
  json.forEach((i) => {
    const 팔로우이미지 = i.image;
    const 팔로우이름 = i.username;
    const 팔로우소개 = i.intro;
    const accountName = i.accountname;
    let 팔로우버튼 = '팔로우';
    let btnclass = 'cancle-btn';
    const 팔로우버튼함수 = async () => {
      try{
        const datas = await getMyFollowing(i._id);
        if (datas.filter((data) => data._id === i._id).length !== 0) {
            return await('취소');
        }
        return await('팔로우');
      } catch {
        return console.log('error');
      }
    }
    팔로우버튼함수().then((value) => {
      팔로우버튼= value;
      if(value==='팔로우'){
        btnclass = 'follow-btn'
      }
      
      Markup(value,btnclass)
    });

    function Markup(팔로우버튼, btnclass) {
      const li = document.createElement("li");
      li.classList.add("follow-list");
      li.innerHTML = `
          <li class="follow-list">
              <img class="display-inline" src="${팔로우이미지}"/>
              <div class="follower-desc display-inline">
                  <p class="followName">${팔로우이름}</p>
                  <small class="followIntro">${팔로우소개}</small>
              </div>
              <button type="submit" class="${btnclass} fBtn">${팔로우버튼}</button>
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
    }
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
    
getFollow();
