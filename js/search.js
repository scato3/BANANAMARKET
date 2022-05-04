// 검색 기능 구현
const token = localStorage.getItem("Token");
const userList = document.querySelector(".search-result-list");
const searchInput = document.querySelector(".user-search-input");
const url = "https://mandarin.api.weniv.co.kr";
const search_result_list = document.querySelector('.search-result-list')
const accountname = localStorage.getItem("accountname");

async function searchId(search) {  
  const res = await fetch(`${url}/user/searchuser/?keyword=${search}`, {
    method: "GET",
    headers: {
    "Authorization" : `Bearer ${token}`,
    "Content-type" : "application/json"
    }
  });

  const data = await res.json();
  console.log(data);
  data.forEach(user => {
    const authorName = user.username;
    const authorAccount = user.accountname;
    const profileImg = user.image;
    const li = document.createElement("li");
    li.classList.add("user-list");

    const copyAuthorName = authorName
      .split(search)
      .join(`<span class="orange">${search}</span>`);
    const copyauthorAccount = authorAccount
      .split(search)
      .join(`<span class="orange">${search}</span>`);

    li.innerHTML = `
    <div class="post-con-info">
      <img
        src="${profileImg}"
        onError="javascript:this.src='img/basic-profile.png'"
        alt=""
        class="img-mini-profile"
      />
      <div class="search-title">
        <h2 class="post-title">${copyAuthorName}</h2>
        <p class="post-user-id">@${copyauthorAccount}</p>
      </div>
    </div>
    `;
    ["img-mini-profile", "post-title", "post-user-id"].forEach((cls) => {
      li
        .querySelector(`.${cls}`)
        .addEventListener("click", () => GoToPage(authorAccount));
    });
    search_result_list.appendChild(li);
  });
}
searchId();

searchInput.addEventListener('input', (e) => {
  if(e.target.value === ""){
    removeAllList(userList);
  } else {
    removeAllList(userList);
    searchId(e.target.value);
  }
})

function removeAllList(ele){
  while(ele.hasChildNodes()){
    ele.removeChild(ele.firstChild);
  }
}

function GoToPage(authorAccount) {
  if(accountname == authorAccount) {
    location.href = "userpage.html"
  } else {
    localStorage.setItem("authorAccountName", authorAccount);
    location.href = "otherpage.html"
  }
}
