/*
ローディング画面
=========================================================================*/
// テキストのカウントアップ + バーの設定
const loading = document.querySelector('.loading');
const loadingText = document.querySelector('.loading__text');

const bar = new ProgressBar.Line(loadingText, {
	easing: 'easeInOut', // アニメーション効果 linear、easeIn、easeOut、easeInOut が指定可能
	duration: 3000, // 時間指定 (1000 = 1秒)
	strokeWidth: 0.5, // 進捗ゲージの太さ
	color: '#001e5b', // 進捗ゲージのカラー
	trailWidth: 0.5, // ゲージベースの線の太さ
	trailColor: '#f4f4f4', // ゲージベースの線のカラー
	text: { // テキストの形状を直接指定
		style: {
			position: 'absolute',
			left: '50%',
			top: '50%',
			padding: '0',
			margin: '-50px 0 0 0',
			transform: 'translate(-50%,-50%)',
			fontSize: '1.25rem',
			color: '#001e5b',
		},
		// 自動付与のスタイルを切る
		autoStyleContainer: false
	},
	step: (state, bar) => {
		bar.setText(`${Math.round(bar.value() * 100)} %`);
	}
});

// アニメーションスタート
bar.animate(1.0, () => {
	setTimeout(() => {
		if (loading) {
			loading.style.transition = 'opacity 0.8s';
			loading.style.opacity = 0;
			setTimeout(() => {
				loading.style.display = 'none';
			}, 800);
		}
		// アニメーションが終わったらフェードアウト
	}, 800);
});


/*
ハンバーガーメニュー、ホバーで日本語に変換、スムーススクロール
=========================================================================*/
const hamburger = document.querySelector('.hamburger');
const gnav = document.querySelector('.gnav');
const gnavItems = document.querySelectorAll('.gnav__item')
const gnavOption = {
	duration: 500,
	easing: 'ease',
	fill: 'forwards',
}

// ハンバーガーメニューをクリックしたときの処理
hamburger.addEventListener('click', () => {
	// クリックしたときにactiveクラスを付与、削除する
	hamburger.classList.toggle('active');
	if (hamburger.classList.contains('active') === true) {

		// メニューを開く
		gnav.animate({ translate: ['100vw', 0] }, gnavOption);

		// リンクをひとつずつ表示
		gnavItems.forEach((gnavItem, gnavIndex) => {
			gnavItem.animate(
				{
					opacity: [0, 1],
					translate: ['2rem', 0],
				},
				{
					duration: 1000,
					delay: 230 * gnavIndex,
					easing: 'ease',
					fill: 'forwards',
				}
			);
		});
	} else {
		gnav.animate({ translate: [0, '100vw'] }, gnavOption);
		gnavItems.forEach((gnavItem) => {
			gnavItem.animate({ opacity: [1, 0] }, gnavOption);
		});
	}
});

// リンクにマウスを合わせると日本語に変換
const gnavLists = document.querySelectorAll('.gnav__link');
const translations = {
	HOME: 'ホーム',
	WORKS: '制作実績',
	SKILL: 'できること',
	ABOUT: '自己紹介',
	CONTACT: 'お問い合わせ',
};

gnavLists.forEach((gnavList) => {
	const originalText = gnavList.textContent.trim(); // 元のテキストを保存
	const originalSize = gnavList.style.fontSize;

	gnavList.addEventListener('mouseover', () => { // 日本語に変換
		const translatedText = translations[originalText];
		if (translatedText) {
			gnavList.textContent = translatedText;
		}
	});

	gnavList.addEventListener('mouseout', () => {
		gnavList.textContent = originalText; // 元のテキストに戻す
		gnavList.style.fontSize = originalSize; // 元のフォントサイズに戻す
	});
});

// メニュー内リンクをクリック後、メニューを閉じる＆スムーススクロール
const navLinks = document.querySelectorAll('a[href ^="#"]');
navLinks.forEach((gnavLink) => {
	gnavLink.addEventListener('click', (event) => {
		// スムーススクロール
		event.preventDefault();
		const href = gnavLink.getAttribute('href');
		const target = document.getElementById(href.replace('#', ''));

		//  + window.pageYOffsetとすることで、ターゲット要素のページ上の絶対位置を計算
		// window.scrollTo()が正確な位置にスムーススクロールするようになru
		const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
		window.scrollTo({
			top: targetPosition,
			behavior: 'smooth',
		});

		// クリック後、メニューを閉じる
		hamburger.classList.remove('active');
		gnav.animate({ translate: [0, '100vw'] }, gnavOption);
		gnavItems.forEach((gnavItem) => {
			gnavItem.animate({ opacity: [1, 0] }, gnavOption);
		});
	});
});


/*
セクションタイトル　スクロールアニメーション
=========================================================================*/
// 監視対象が範囲内に現れたら実行する動作
const animateOpen = (entries, obs) => {
	entries.forEach((entry) => {
		if (entry.isIntersecting) {
			entry.target.animate(
				{
					opacity: [0, 1],
					transform: 'scale(1, 1)',
				},
				{
					duration: 300,
					easing: 'ease-out',
					fill: 'forwards',
				}
			);
			// アニメーションが一度表示されたら監視をやめる
			obs.unobserve(entry.target);
		}
	});
};

// 監視設定
const openObserver = new IntersectionObserver(animateOpen);

// .fadeinを監視するよう指示
const openElements = document.querySelectorAll('.open');
openElements.forEach((openElement) => {
	openObserver.observe(openElement);
});


/*
スクロールアニメーション2
=========================================================================*/
// 監視対象が範囲内に現れたら実行する動作
const animateFade = (entries, obs) => {
	entries.forEach((entry, fadeIndex) => {
		if (entry.isIntersecting) {
			entry.target.animate(
				{
					opacity: [0, 1],
					filter: ['blur(0.4rem)', 'blur(0)'],
					translate: ['0 4rem', 0],
				},
				{
					duration: 1200,
					delay: 400 * fadeIndex,
					easing: 'ease',
					fill: 'forwards',
				}
			);
			// アニメーションが一度表示されたら監視をやめる
			obs.unobserve(entry.target);
		}
	});
};

// 監視設定
const fadeObserver = new IntersectionObserver(animateFade);

// .fadeinを監視するよう指示
const fadeElements = document.querySelectorAll('.fadein');
fadeElements.forEach((fadeElement) => {
	fadeObserver.observe(fadeElement);
});


/*
メールフォームのバリテーション
=========================================================================*/
document.addEventListener("DOMContentLoaded", () => {
	const form = document.querySelector(".contact-form");
	const nameInput = document.getElementById("name");
	const emailInput = document.getElementById("email");
	const messageInput = document.getElementById("message");

	form.addEventListener("submit", (event) => {
		let hasError = false;

		// エラーメッセージのクリア
		document.querySelectorAll(".error-message").forEach((el) => el.remove());

		// 名前のバリデーション
		if (!nameInput.value.trim()) {
			showError(nameInput, "名前を入力してください。");
			hasError = true;
		}

		// メールアドレスのバリデーション
		if (!validateEmail(emailInput.value.trim())) {
			showError(emailInput, "正しいメールアドレスを入力してください。");
			hasError = true;
		}

		// メッセージのバリデーション
		if (!messageInput.value.trim()) {
			showError(messageInput, "メッセージを入力してください。");
			hasError = true;
		}

		if (!hasError) {
			event.preventDefault(); // デフォルト送信をキャンセル
			HTMLFormElement.prototype.submit.call(form); // 明示的に送信
		} else {
			event.preventDefault(); // エラー時の送信キャンセル
		}
	});

	const validateEmail = (email) => {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	};

	const showError = (input, message) => {
		const errorDiv = document.createElement("div");
		errorDiv.className = "error-message";
		errorDiv.style.color = "red";
		errorDiv.textContent = message;
		input.parentElement.appendChild(errorDiv);
	};
});
