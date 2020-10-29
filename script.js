class Game{
  elements = {
    // startBtn: document.getElementById('startBtn'),
    resetBtn: document.getElementById('resetBtn'),
    message:  document.getElementById('message'),
    list:     document.querySelectorAll('.box')
  }
  state = []
  userMark = null
  aiMark = null
  userFirst = null
  
  constructor() {
    /*------Initial Game State------*/
    
    this.state = [['', '', ''], ['', '', ''], ['', '', '']]
    console.log('initialize state', this.state)
    this.userMark = 'O'
    this.aiMark = 'X'

    if (Math.random() < 0.5){
      this.userFirst = true
      const {message} = this.elements
      message.innerHTML = 'You go first'
    }
    else{
      this.userFirst = false
      const {message} = this.elements
      message.innerHTML = 'AI goes first'

      this.makeMove()

    }
    
    const {list} = this.elements
    list.forEach(x => x.style.pointerEvents = 'auto')
    this.addEvents()
  }

  addEvents() {
    console.log('adding event listeners')
    
    const {resetBtn} = this.elements
    resetBtn.addEventListener('click', this.resetGame)

    const {list} = this.elements
    list.forEach(x => x.addEventListener('click', y => this.clickBox(x)))
  }

  clickBox(htmlBox){
    console.log(htmlBox.id, 'is clicked')
    let boxIndex = this.htmlToState(htmlBox.id)
    let curMark = this.state[boxIndex[0]][boxIndex[1]]
    if (curMark !== ''){
      console.log(`Box ${htmlBox.id} is occupied.`)
      alert(`Box ${htmlBox.id} is occupied.`)
    }
    else{
      console.log('box not occupied')
      this.assignMark(htmlBox, boxIndex, this.userMark)
      
      this.makeMove()
    }

  }

  assignMark(htmlBox, boxIndex, mark){
    console.log(this.state)
    this.state[boxIndex[0]][boxIndex[1]] = mark
    
    htmlBox.innerHTML = mark
    console.log(this.state)

    let result = this.isTerminal(this.state)
    
    const {message} = this.elements
    switch (result){
      case 'O':
        message.innerHTML = 'You Win'
        this.disableClicks()
        break;
      case 'X':
        message.innerHTML = 'AI Wins'
        this.disableClicks()
        break
      case '-':
        message.innerHTML = 'Draw'
        this.disableClicks()
        break
      default:
    }

  }

  disableClicks(){
    const {list} = this.elements
    list.forEach(x => x.style.pointerEvents = 'none')
  }

  isTerminal(state){
    const combinations = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    const flatten = state.flat()
    
    for (let ind of combinations){
      let com = ind.map(x => flatten[x])
      if (com.some(x => x === '')){
        continue
      }
      else{
        if(com[0] === com[1] && com[1] === com[2]){
          return flatten[ind[0]]
        }
      }
    }
    if (!flatten.some(x => x === '')){
      return '-'
    } 
    
    return ''
    
  }

  makeMove(){
    const {list} = this.elements
    console.log('AI making move')
    let moveIndex = this.bestMove()
    // console.log(moveIndex)
    this.assignMark(list[this.stateToHTML(moveIndex)], moveIndex, this.aiMark)
  }

  bestMove(){
    //ai choosing move
    let bestScore = -Infinity
    let move
    for (let i = 0; i < 3; i++){
      for (let j = 0; j < 3; j++){
        if (this.state[i][j] === ''){
          this.state[i][j] = this.aiMark
          let score = this.minimax(this.state, 0, false)
          this.state[i][j] = ''
          if (score > bestScore){
            bestScore = score
            move = [i, j]
          }
        }
      }
    }
    console.log(bestScore)
    return move
  }

  minimax(curState, depth, isMaxminimizing){
    let result = this.isTerminal(curState)
    if (result === 'X'){
      return 1
    }
    else if (result === 'O'){
      return -1
    }
    else if (result === '-'){
      return 0
    }

    if (isMaxminimizing){
      let bestScore = -Infinity
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (curState[i][j] == '') {
            curState[i][j] = this.aiMark
            let score = this.minimax(curState, depth + 1, false)
            curState[i][j] = ''
            bestScore = Math.max(score, bestScore)
          }
        }
      }
      return bestScore
    }
    else{
      let bestScore = Infinity;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (curState[i][j] == '') {
            curState[i][j] = this.userMark
            let score = this.minimax(curState, depth + 1, true)
            curState[i][j] = ''
            bestScore = Math.min(score, bestScore)
          }
        }
      }
      return bestScore
    }
  
  }
  

  

  resetGame = event =>{
    console.log('resetting game')
    this.state = [['', '', ''], ['', '', ''], ['', '', '']]
    
    const {list} = this.elements
    list.forEach(x => x.innerHTML = x.id)
    console.log('initialize state', this.state)
    
    this.userMark = 'O'
    this.aiMark = 'X'
    if (Math.random() < 0.5){
      this.userFirst = true
      const {message} = this.elements
      message.innerHTML = 'You go first'
    }
    else{
      this.userFirst = false
      const {message} = this.elements
      message.innerHTML = 'AI goes first'

      this.makeMove()
    }
    
    list.forEach(x => x.style.pointerEvents = 'auto')
  }

  stateToHTML(x){
    return parseInt(x[0]) * 3 + parseInt(x[1])
  }

  htmlToState(x){
    let index = [0, 0]
    index[0] = Math.floor(parseInt(x) / 3)
    index[1] = parseInt(x) % 3
    return index
  }
}



new Game()
