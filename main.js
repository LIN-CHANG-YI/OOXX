////////////////////////////////////model////////////////////////////////////
const model = {
  //贏的條件
  winnerBoxMatch: [
    [1, 4, 7],
    [2, 5, 8],
    [3, 6, 9],
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [1, 5, 9],
    [3, 5, 7]
  ],
  //檢測平手的Array
  allIndex: [1, 2, 3, 4, 5, 6, 7, 8, 9],
  //紀錄目前輪到誰進攻
  currentPlayer: "",
  //紀錄上一場開局的人
  previousStartPlayer: "",
  //circle's object
  circle: {
    box: [],
    score: 0
  },
  //cross's object
  cross: {
    box: [],
    score: 0
  }
};
////////////////////////////////////view////////////////////////////////////
const view = {
  gameStartButton: document.querySelector("#gameStart"),
  againButton: document.querySelector("#again"),
  buttonChoose: document.querySelectorAll(".modal-body button"),
  playerRound: document.querySelector("#playerRound"),
  alltdBlock: document.querySelectorAll("#app table tr td"),
  restartButton: document.querySelector("#gameRestart"),
  playerInfo: document.querySelector("#playerInfo"),
  //監聽所有button
  init() {
    this.buttonChoose.forEach((button) => {
      button.addEventListener("click", controller.choose);
    });
    this.againButton.addEventListener("click", controller.again);
    this.restartButton.addEventListener("click", this.gameRestart);
  },
  //遊戲開始
  gameStart() {
    this.alltdBlock.forEach((block) => {
      block.addEventListener("click", controller.playersClickBlock);
    });
  },
  //渲染圈叉
  drawCircleOrCross(element, player) {
    element.innerHTML = `<div class="${player}"></div>`;
  },
  //渲染PlayerRound(雙黃色邊框)
  changePlayerRound(gameState) {
    if (gameState === 'circle') {
      this.playerRound.innerHTML = `<h4 class="mr-1 mt-2" style="color: rgba(121, 247, 207, 0.6">O</h4>${this.transformFirstName(gameState)}Round`;
    } else {
      this.playerRound.innerHTML = `<h4 class="mr-1 mt-2" style="color: rgba(255, 115, 50, 0.6)">✕</h4>${this.transformFirstName(gameState)}Round`;
    }
  },
  //轉換字首大小
  transformFirstName(name) {
    return name[0].toUpperCase() + name.slice(1)
  },
  //移除監聽器
  removeEventListener() {
    this.alltdBlock.forEach((block) => {
      block.removeEventListener("click", controller.playersClickBlock);
    });
  },
  //贏的人加分
  playerAddScore(element, player) {
    player.score += 1
    this.againButton.style.display = "block"
    document.querySelector(`.${element}`).innerText = `${this.transformFirstName(element)}Score: ${player.score}`
    return alert(`${this.transformFirstName(element)} WIN!!!`)
  },
  //遊戲結束
  gameOver(element, player) {
    if (player.score === 3) {
      this.againButton.style.display = "none"
      this.restartButton.style.display = "block"
      return alert(`Congratulations ${this.transformFirstName(element)} Win the game!!!`)
    }
  },
  //清空畫面
  clear() {
    this.alltdBlock.forEach(block => {
      block.innerHTML = null
    })
    model.circle.box = []
    model.cross.box = []
    this.againButton.style.display = "none"
  },
  //點擊Game Restart時呼叫，會清空所有回到起始點，(這裡view不能用this，因為this會指向restartButton.addEventListener)
  gameRestart() {
    view.alltdBlock.forEach(block => {
      block.innerHTML = null
    })
    view.playerInfo.innerHTML = `<h4 class="mr-1" style="color: rgba(121, 247, 207, 0.6">O</h4>
    <div class="circle circleScore mr-5">CircleScore: 0</div>
    <h4 class="mr-1" style="color: rgba(255, 115, 50, 0.6)">✕</h4>
    <div class="cross crossScore">CrossScore: 0</div>`
    view.playerRound.innerText = 'PlayerRound'
    view.restartButton.style.display = "none"
    view.againButton.style.display = "none"
    view.gameStartButton.style.display = "block"
    model.previousStartPlayer = ''
    model.currentPlayer = ''
    model.circle.score = 0
    model.cross.score = 0
    model.circle.box = []
    model.cross.box = []
  }
};
////////////////////////////////////controller////////////////////////////////////
const controller = {
  //起始呼叫
  init() {
    view.init();
  },
  //選擇圈叉進攻時呼叫
  choose(event) {
    const name = event.target.dataset.name
    model.previousStartPlayer = name;
    model.currentPlayer = name;
    view.gameStartButton.style.display = "none";
    view.changePlayerRound(name)
    view.gameStart();
  },
  //選擇格子時呼叫
  playersClickBlock(event) {
    if (event.target.tagName === "TD") {
      const clickIndex = Number(event.target.dataset.index);
      model[model.currentPlayer].box.push(clickIndex);
      view.drawCircleOrCross(event.target, model.currentPlayer);
      controller.checkWin();
      model.currentPlayer = model.currentPlayer === "circle" ? "cross" : "circle";
      view.changePlayerRound(model.currentPlayer);
    }
  },
  //檢查平手情況
  evenGame() {
    const stickyArray = model.circle.box.concat(model.cross.box);
    return stickyArray.length === model.allIndex.length;
  },
  //檢查贏家是誰
  checkWin() {
    for (let i = 0; i < model.winnerBoxMatch.length; i++) {
      if (model.winnerBoxMatch[i].every(winner => model[model.currentPlayer].box.includes(winner))) {
        view.playerAddScore(model.currentPlayer, model[model.currentPlayer])
        view.gameOver(model.currentPlayer, model[model.currentPlayer])
        view.removeEventListener()
        return
      }
    }
    if (this.evenGame()) {
      view.againButton.style.display = "block"
      return alert("平手!!!");
    }
  },
  //點擊Again button時呼叫
  again() {
    model.previousStartPlayer = model.previousStartPlayer === "circle" ? "cross" : "circle";
    view.changePlayerRound(model.previousStartPlayer);
    view.clear()
    view.gameStart()
  }
};
///////////GO ~ GO ~ GO ~ GAME START !!!!!///////////
controller.init();