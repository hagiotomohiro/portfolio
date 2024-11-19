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