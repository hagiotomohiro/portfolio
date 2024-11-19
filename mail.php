<?php
mb_language("uni");
mb_internal_encoding("UTF-8");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // 入力値のサニタイズとバリデーション
    $name = htmlspecialchars(trim($_POST["name"]), ENT_QUOTES, "UTF-8");
    $email = filter_var(trim($_POST["email"]), FILTER_VALIDATE_EMAIL);
    $messageBody = htmlspecialchars(trim($_POST["message"]), ENT_QUOTES, "UTF-8");

    // エラーメッセージ格納用
    $errors = [];

    // 名前のチェック
    if (empty($name)) {
        $errors[] = "お名前を入力してください。";
    } elseif (mb_strlen($name) > 50) {
        $errors[] = "お名前は50文字以内で入力してください。";
    }

    // メールアドレスのチェック
    if (empty($email)) {
        $errors[] = "メールアドレスを入力してください。";
    } elseif (!$email) {
        $errors[] = "正しいメールアドレスを入力してください。";
    }

    // お問い合わせ内容のチェック
    if (empty($messageBody)) {
        $errors[] = "お問い合わせ内容を入力してください。";
    } elseif (mb_strlen($messageBody) > 1000) {
        $errors[] = "お問い合わせ内容は1000文字以内で入力してください。";
    }

    // エラーがある場合は終了
    if (!empty($errors)) {
        foreach ($errors as $error) {
            echo "<p style='color:red;'>$error</p>";
        }
        exit; // 処理を終了
    }

    // メール送信の準備
    $to = 'hagio.tomohiro.0629@gmail.com';
    $subject = 'お問い合わせがありました';
    $message = "お問い合わせがありました。\n\n";
    $message .= "お問い合わせの内容は以下の通りです。\n---\n\n";
    $message .= "お名前: $name\n";
    $message .= "メールアドレス: $email\n";
    $message .= "お問い合わせ本文: $messageBody\n";

    // メールヘッダーの追加
    $headers = "From: Tomohiro Hagio | 萩尾智弘 <hagio.tomohiro.0629@gmail.com>\n";
    $headers .= "Reply-To: $email\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";

    // 自動返信メールの送信
    date_default_timezone_set('Asia/Tokyo');
    $auto_reply_subject = 'お問い合わせありがとうございます。';
    $auto_reply_text = "この度は、お問い合わせ頂き誠にありがとうございます。\n";
    $auto_reply_text .= "下記の内容でお問い合わせを受け付けました。\n\n";
    $auto_reply_text .= "お問い合わせ日時：" . date("Y-m-d H:i") . "\n";
    $auto_reply_text .= "氏名：$name\n";
    $auto_reply_text .= "メールアドレス：$email\n";
    $auto_reply_text .= "お問い合わせ内容：$messageBody\n\n";
    $auto_reply_text .= "Tomohiro Hagio | 萩尾智弘";

    // 自動返信メール送信（問い合わせ元へ）
    if (!mb_send_mail($email, $auto_reply_subject, $auto_reply_text, $headers)) {
        error_log("自動返信メールの送信に失敗しました\n", 3, "/var/log/php_errors.log");
        echo "自動返信メールの送信に失敗しました。";
        exit;
    }

    // 問い合わせ内容のメール送信（問い合わせ先へ）
    if (mb_send_mail($to, $subject, $message, $headers)) {
        // メール送信成功時にリダイレクト
        header("Location: complete.html");
        exit;
    } else {
        error_log("メールの送信に失敗しました\n", 3, "/var/log/php_errors.log");
        echo "メールの送信に失敗しました。詳細をログを確認してください。";
        exit;
    }
} else {
    echo "不正なリクエストです。";
    exit;
}
