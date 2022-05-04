const 뒤로가기 = document.querySelector(".back");
const home = document.querySelector(".img-home");
const chat = document.querySelector(".img-chat");
const plus = document.querySelector(".img-plus");
const profile = document.querySelector(".img-profile");
const myAccountname = localStorage.getItem("accountname");
const authorAccount = localStorage.getItem("authorAccountName");
const token = localStorage.getItem("Token");

뒤로가기.addEventListener("click", function () {
  location.href = "otherpage.html";
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

//타인의 팔로워 불러오기
async function getFollowing() {
  const userid = localStorage.getItem("myId");
  const url = `https://mandarin.api.weniv.co.kr/profile/${authorAccount}/following?limit=100&skip=0`;
  const token = localStorage.getItem("Token");
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  const json = await res.json();
  // console.log(json);
  let 팔로우버튼 = '팔로우';
  json.forEach((i) => {
    const 유저어카운트네임 = i.accountname;
    const 팔로우이미지 = i.image;
    const 팔로우이름 = i.username;
    const 팔로우소개 = i.intro;
    const accountName = i.accountname;
    let 팔로우버튼 = '취소';
    let btnclass = 'cancle-btn';
    let fBtn = 'fBtn'
    
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

    function Markup(팔로우버튼,btnclass){
      if(i._id === userid){
        fBtn = 'hide';
      }
      const li = document.createElement("li");
      li.classList.add("follow-list");
      li.insertAdjacentHTML (
        "afterbegin",`
          <li class="follow-list">
              <img class="display-inline" src="${팔로우이미지}"/>
              <div class="follower-desc display-inline">
                  <p class="followName">${팔로우이름}</p>
                  <small class="followIntro">${팔로우소개}</small>
              </div>
              <button type="submit" class="${fBtn} ${btnclass}">${팔로우버튼}</button>
          </li>
          `);

          [`${fBtn}`].forEach((cls) => {
            const btn = li.querySelector(`.${cls}`);

            li.querySelector(`.${cls}`).addEventListener("click", () => {
              if(btn.classList.contains("cancle-btn")){
                btn.innerText = '팔로우'
                btn.classList.remove('cancle-btn');
                btn.classList.add("follow-btn");
                팔로우취소(`${유저어카운트네임}`)
                console.log(`${유저어카운트네임}`)
              }else{
                btn.classList.add('cancle-btn');
                btn.classList.remove("follow-btn");
                btn.innerText = '취소' 
                팔로우업로드(`${유저어카운트네임}`)
                console.log(`${유저어카운트네임}`)};
            })
          });
        
          ["display-inline", "followName", "followIntro"].forEach((cls) => {
            li.querySelector(`.${cls}`).addEventListener("click", () =>
              GoToPage(accountName)
            );
          });
          document.querySelector(".container").appendChild(li);
        }
  });
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
  const token = localStorage.getItem("Token");
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

function GoToPage(accountName) {
  if(myAccountname == accountName) {
    location.href = "userpage.html"
  } else  {
  localStorage.setItem("authorAccountName", accountName)
  location.href = "otherpage.html"
  }
}

getFollowing();
