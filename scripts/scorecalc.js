function Player(playerNo, playerIndex) {
    this.playerNo = playerIndex
    this.name = (playerNo) ? ("Player " + playerNo) : "New Player"
    this.counts = [];
    this.counts["fire"] = 0;
    this.counts["water"] = 0;
    this.counts["air"] = 0;
    this.counts["earth"] = 0;
    this.counts["lightning"] = 0;
    this.counts["stars"] = 0;
}

Player.prototype.setName = function (name) {
    this.name = name
}

Player.prototype.setCount = function (item, value) {
    this.counts[item] = value;
}

Player.prototype.calcScore = function () {
    var scoreTable = [0, 1, 2, 4, 7, 11, 16]
    var score = 0
    var minSetBonus = undefined

    for (var key in this.counts) {
        if (this.counts[key] >= 0 && this.counts[key] < 7 && key != "stars") {
            score += scoreTable[this.counts[key]]
        } else if (this.counts[key] >= 7 && key != "stars") {
            score += scoreTable[6]
            score += (this.counts[key] - 6) * 5 // five stars for every item after 7
        }
        if (minSetBonus == undefined && key != "stars") {
            minSetBonus = this.counts[key]
        } else if (key != "stars" && minSetBonus > this.counts[key]) {
            minSetBonus = this.counts[key]
        }
    }
    score += this.counts["stars"]
    score += (minSetBonus * 5) //5 per complete set
    return score
}

Player.prototype.getPlayerStats = function () {
    return {
        name: this.name,
        fire: this.counts["fire"],
        water: this.counts["water"],
        air: this.counts["air"],
        earth: this.counts["earth"],
        lightning: this.counts["lightning"],
        stars: this.counts["stars"],
        index: this.playerNo
    }
}

function GameCalc() {
    this.players = []
    this.playerCount = 0;
}

GameCalc.prototype.addPlayer = function (cb) {
    var newPlayer = new Player(this.playerCount + 1, this.playerCount)
    this.players[this.playerCount] = newPlayer
    this.playerCount = this.playerCount + 1
    cb(newPlayer)
}

GameCalc.prototype.removePlayer = function (playerIndex, cb) {
    this.players[playerIndex] = undefined
    cb()
}

GameCalc.prototype.getPlayers = function () {
    return this.players;
}

GameCalc.prototype.loadPlayer = function (playerIndex, cb) {
    var player = this.players[playerIndex]
    if (player != undefined) {
        cb(player)
    }
}



$(document).ready(function () {

    var activePlayer = undefined;
    function renderPlayer(player) {
        activePlayer = player
        var playerStats = player.getPlayerStats()
        $("#name").val(playerStats.name)
        $("#fire").val(playerStats.fire)
        $("#water").val(playerStats.water)
        $("#air").val(playerStats.air)
        $("#earth").val(playerStats.earth)
        $("#lightning").val(playerStats.lightning)
        $("#stars").val(playerStats.stars)
    }

    function clearNav() {
        var navbar = document.querySelector("#playerMenu")
        navbar.innerHTML = ""
    }

    function renderNavbar(gameCalc) {
        for (var player of gameCalc.getPlayers()) {
            if (player) {
                addPlayerLink(player)
            }
        }
    }

    function addPlayerLink(player) {
        var playerData = player.getPlayerStats()
        var playerName = playerData.name
        var playerIndex = playerData.index
        if ('content' in document.createElement('template')) {
            var template = document.querySelector('#linkTemplate');
            var clone = document.importNode(template.content, true);
            var link = clone.querySelector("a")
            link.textContent = playerName
            link.setAttribute("data-index", playerIndex)
            var navbar = document.querySelector("#playerMenu")
            navbar.appendChild(clone);

        } else {
            // Find another way to add the rows to the table because 
            // the HTML template element is not supported.
        }
    }

    var gameCalc = new GameCalc()
    gameCalc.addPlayer(function (newPlayer) {
        renderPlayer(newPlayer)
        $("#loading").addClass("d-none")
        $("#scorecard").removeClass("d-none")
        clearNav()
        renderNavbar(gameCalc)
    })

    $("#addPlayer").click(function () {
        gameCalc.addPlayer(function (player) {
            clearNav()
            renderNavbar(gameCalc)
            renderPlayer(player)
        })
    })

    $("#fire").on("change paste keyup", function () {
        try{
            activePlayer.setCount('fire', parseInt($('#fire').val()))
        } catch(e){
            $('#fire').val(activePlayer.getPlayerStats().fire)
        }
    });

    $("#air").on("change paste keyup", function () {
        try{
            activePlayer.setCount('air', parseInt($('#air').val()))
        } catch(e){
            $('#air').val(activePlayer.getPlayerStats().air)
        }
    });

    $("#water").on("change paste keyup", function () {
        try{
            activePlayer.setCount('water', parseInt($('#water').val()))
        } catch(e){
            $('#water').val(activePlayer.getPlayerStats().water)
        }
    });

    $("#earth").on("change paste keyup", function () {
        try{
            activePlayer.setCount('earth', parseInt($('#earth').val()))
        } catch(e){
            $('#earth').val(activePlayer.getPlayerStats().earth)
        }
    });

    $("#lightning").on("change paste keyup", function () {
        try{
            activePlayer.setCount('lightning', parseInt($('#lightning').val()))
        } catch(e){
            $('#lightning').val(activePlayer.getPlayerStats().lightning)
        }
    });

    $("#stars").on("change paste keyup", function () {
        try{
            activePlayer.setCount('stars', parseInt($('#stars').val()))
        } catch(e){
            $('#stars').val(activePlayer.getPlayerStats().stars)
        }
    });

    $('#calcButton').click(function(){
        $("#result").text(activePlayer.calcScore())
        $(".score").removeClass("d-none")
        $('#calcButton').text("Re-Calculate")
    })

    $('#deleteButton').click(function(){
        gameCalc.removePlayer(activePlayer.getPlayerStats().index)
    })

    

});