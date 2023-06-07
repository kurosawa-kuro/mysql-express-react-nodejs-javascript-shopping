# mysql-express-react-nodejs-javascript-shopping

```
このアプリケーションは、ユーザーの管理、商品の管理、注文の管理、画像のアップロードの各機能を提供します。

#### ユーザー管理

1. ユーザーの登録（`/api/users/register`）
2. ユーザーのログインとログアウト（`/api/users/login`, `/api/users/logout`）
3. ユーザープロフィールの取得と更新（`/api/users/profile`）
4. ユーザーの削除、取得（ID指定）、更新（管理者専用、ユーザーIDが必要）（`/api/users/:id`）
5. 全ユーザーの取得（管理者専用）（`/api/users`）

#### 商品管理

1. トップ商品の取得（`/api/products/top`）
2. 全商品の取得、新規商品の作成（管理者専用）（`/api/products`）
3. 商品情報の取得、更新、削除（管理者専用、商品IDが必要）（`/api/products:id`）
4. 商品レビューの作成（`/api/products/:id/reviews`）

#### 注文管理

1. 注文アイテムの追加（`/api/orders`）
2. 自分の注文の取得（`/api/orders/mine`）
3. 注文情報の取得（注文IDが必要）（`/api/orders/:id`）
4. 支払いステータスの更新（注文IDが必要）（`/api/orders/:id/pay`）
5. 配送ステータスの更新（管理者専用、注文IDが必要）（`/api/orders/:id/deliver`）
6. 全注文の取得（管理者専用）（`/api/orders`）

#### 画像アップロード

1. 画像のアップロード（`/api/upload`）
```

![shopping_er](https://github.com/kurosawa-kuro/mysql-express-react-nodejs-javascript-shopping/assets/15902862/e1fbbe66-d42d-470b-9862-6b42d8eab6aa)

