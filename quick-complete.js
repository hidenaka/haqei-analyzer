// 高速で36問すべてに答えて結果画面を確認
async function quickComplete() {
  // 36問すべてに答える
  for (let i = 0; i < 36; i++) {
    // 最初の選択肢を選ぶ
    const firstOption = document.querySelector('input[type="radio"]');
    if (firstOption) {
      firstOption.checked = true;
      firstOption.dispatchEvent(new Event('change'));
    }
    
    // 次の質問ボタンをクリック
    const nextBtn = document.getElementById('next-btn');
    if (nextBtn && !nextBtn.disabled) {
      nextBtn.click();
      // 少し待機
      await new Promise(resolve => setTimeout(resolve, 200));
    } else {
      console.log('質問完了 or ボタンが無効:', i + 1);
      break;
    }
  }
}

quickComplete();