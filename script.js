const Gameboard = (() => {
	let board = [];

	const setBoard = () => {
		const tempBoard = [];
		document.querySelectorAll(".sign").forEach((el) => {
			tempBoard.push(el.innerText);
		});
		while (tempBoard.length) board.push(tempBoard.splice(0, 3));
	};

	const getBoard = () => board;

	const clearBoard = () => (board = []);

	return {
		setBoard,
		getBoard,
		clearBoard,
	};
})();

const Player = (name, sign) => {
	const getSign = () => sign;
	const getName = () => name;
	const setName = (x) => (name = x);
	return {
		getName,
		getSign,
		setName,
	};
};

const ControlFlow = (() => {
	let AI = false;
	Gameboard.setBoard();
	document.querySelectorAll(".field").forEach((e) => {
		e.classList.add("not-active");
	});
	const popup = document.querySelector(".info");
	let name1 = "Player X";
	let name2 = "Player O";
	const player1 = Player(name1, "x");
	const player2 = Player(name2, "o");
	const preparingAI = () => {
		if (AI) {
			if (!(player1.getName() == "AI" || player2.getName() == "AI")) {
				player2.setName("AI");
			}
		}
	};

	const startGame = () => {
		tour = player1.getName();
		document.querySelectorAll(".field").forEach((e) => {
			e.classList.remove("not-active");
		});
		let name1Temp = document.querySelector(".first-input").value;
		let name2Temp = document.querySelector(".second-input").value;
		document.querySelector(".first-input").value = "";
		document.querySelector(".second-input").value = "";
		document.querySelector(".start-game").classList.add("not-active");
		document.querySelector(".first-input").classList.add("not-active");
		document.querySelector(".second-input").classList.add("not-active");
		if (name1Temp !== "") {
			player1.setName(name1Temp);
			document.querySelector(".first-player-name").innerText = name1Temp;
		}
		if (name2Temp !== "") {
			player2.setName(name2Temp);
			document.querySelector(".second-player-name").innerText = name2Temp;
		}
		if (getTour() == "AI") {
			Gameboard.setBoard();
			addSign();
		}
	};

	const restartGame = () => {
		Gameboard.clearBoard();
		DisplayController.clearBoard();
		popup.classList.remove("info-active");
		tour = player1.getName();
		if (!AI) {
			player1.setName("Player X");
			player2.setName("Player O");
		}
		preparingAI();
		document.querySelectorAll(".field").forEach((e) => {
			e.classList.add("not-active");
		});
		document.querySelectorAll(".winning-line").forEach((e) => {
			e.classList.remove("active");
		});
		document.querySelectorAll(".sign").forEach((e) => {
			e.classList.remove("taken-sign");
		});
		document.querySelector(".first-player-name").innerText = "Player X";
		document.querySelector(".second-player-name").innerText = "Player O";
		document.querySelector(".start-game").classList.remove("not-active");
		document.querySelector(".first-input").classList.remove("not-active");
		document.querySelector(".second-input").classList.remove("not-active");

		document.querySelector(".start-game").addEventListener("click", startGame);
	};

	let tour = player1.getName();
	const getTour = () => tour;

	const changeTour = () => {
		if (tour === player1.getName()) tour = player2.getName();
		else tour = player1.getName();
	};

	const isFieldEmpty = (field) => {
		if (field.innerText === "") return true;
	};

	const addSign = (e) => {
		if (e) {
			const field = e.target.firstElementChild;
			if (isFieldEmpty(field)) {
				if (getTour() === player1.getName()) {
					DisplayController.addSign(field, player1.getSign());
				} else {
					DisplayController.addSign(field, player2.getSign());
				}
				Gameboard.clearBoard();
				Gameboard.setBoard();
				checkWin();
				changeTour();
			}
		}
		if (AI) {
			let sign;
			if (player1.getName() == "AI") sign = "x";
			else sign = "o";
			let wynik = aiTurn(sign);
			if (!wynik) return;
			console.log("Tablica ktora zwrocila funckja aiTurn", wynik);
			DisplayController.updateBoardForAI(wynik, sign);
			Gameboard.clearBoard();
			Gameboard.setBoard();
			checkWin();
			changeTour();
		}
	};

	// Checking if somewhere is win

	const checkRow = () => {
		for (let i = 0; i < 3; i++) {
			if (
				Gameboard.getBoard()[i].every(
					(e) => e === Gameboard.getBoard()[i][0] && e !== ""
				)
			) {
				whereIsWin(0, i);
				return 1;
			}
		}
	};

	const checkCol = () => {
		for (let i = 0; i < 3; i++) {
			if (
				Gameboard.getBoard()[0][i] === Gameboard.getBoard()[1][i] &&
				Gameboard.getBoard()[0][i] === Gameboard.getBoard()[2][i] &&
				Gameboard.getBoard()[0][i] !== ""
			) {
				whereIsWin(1, i);
				return 1;
			}
		}
	};

	const checkDiagonals = () => {
		if (
			Gameboard.getBoard()[0][0] === Gameboard.getBoard()[1][1] &&
			Gameboard.getBoard()[0][0] === Gameboard.getBoard()[2][2] &&
			Gameboard.getBoard()[0][0] !== ""
		) {
			whereIsWin(2, 0);
			return 1;
		} else if (
			Gameboard.getBoard()[0][2] === Gameboard.getBoard()[1][1] &&
			Gameboard.getBoard()[0][2] === Gameboard.getBoard()[2][0] &&
			Gameboard.getBoard()[0][2] !== ""
		) {
			whereIsWin(3, 0);
			return 1;
		}
	};

	const whereIsWin = (x, y) => {
		let pos = "" + x + y;
		document.querySelector(`.winning-line${pos}`).classList.add("active");
	};

	const checkWin = () => {
		if (checkRow() || checkCol() || checkDiagonals()) {
			let winner = "";
			if (tour === player1.getName()) winner = player1.getName();
			else winner = player2.getName();
			popup.classList.add("info-active");
			popup.innerText = `The winner is ${winner}!`;
			document.querySelectorAll(".field").forEach((e) => {
				e.classList.add("not-active");
			});
		} else checkDraw();
	};

	const checkDraw = () => {
		const newArray = Gameboard.getBoard().flat();
		if (newArray.every((e) => e !== "")) {
			const popup = document.querySelector(".info");
			popup.classList.add("info-active");
			popup.innerText = `Draw!`;
		}
	};
	document.querySelector(".start-game").addEventListener("click", startGame);
	document
		.querySelector(".restart-game")
		.addEventListener("click", restartGame);
	document.querySelectorAll(".field").forEach((field) => {
		field.addEventListener("click", addSign);
	});
	document.querySelector(".ai").addEventListener("click", () => {
		AI ? (AI = false) : (AI = true);
		if (AI) preparingAI();
		console.log('AI właczone?: ', AI);
	});
	document.querySelector(".change").addEventListener("click", () => {
		if (player2.getName() == "AI") {
			player1.setName("AI");
			player2.setName("Player O");
		} else {
			player1.setName("Player O");
			player2.setName("AI");
		}
		console.log(player1.getName(), player2.getName());
	});
})();

const DisplayController = (() => {
	const updateBoardForAI = (newBoard, sign) => {
		const tempBoard1 = Gameboard.getBoard().flat();
		const tempBoard2 = newBoard.flat();
		let index = 0;
		for (let i = 0; i < tempBoard1.length; i++) {
			if (tempBoard1[i] != tempBoard2[i]) break;
			index++;
		}
		if (index == 9) {
			index = 8;
			console.log("BLAD, funkcja nic nie zwrocila");
		}
		const field = document.querySelectorAll(".sign")[index];
		field.innerText = sign;
		field.classList.add("taken-sign");
	};
	const addSign = (field, sign) => {
		field.innerText = sign;
		field.classList.add("taken-sign");
	};
	const clearBoard = () => {
		document.querySelectorAll(".sign").forEach((e) => {
			e.innerText = "";
		});
	};
	return {
		addSign,
		clearBoard,
		updateBoardForAI,
	};
})();
