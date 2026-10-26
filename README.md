# NPNnote

No Privacy, No Note. If others can see it, it isn't a note.

NPNnote はサーバーと通信しないノートアプリである。オープンソースのノートアプリ [AFFiNE](https://github.com/toeverything/AFFiNE) をフォークし、web 版を静的サイトとして配信する。ノートはブラウザの IndexedDB にだけ保存され、外部には送られない。

公開先: https://konaito.github.io/NPNnote/

## できること

- ドキュメントの作成、編集、削除（削除したドキュメントはゴミ箱へ移る）
- ブラウザ内への自動保存（IndexedDB）
- バックアップの書き出しと読み込み（設定 > ワークスペース > ストレージ、または画面上部の帯の「Export backup」）

バックアップは、各ドキュメントを JSON スナップショットにしたファイルと添付ファイルをまとめた zip である。別のブラウザで読み込めば、ドキュメントをそのまま追加できる。

## 通信を止める仕組み

ローカル専用ビルドでは `BUILD_CONFIG.isLocalOnly` が true になり、次の4つで通信を止める。

1. ページの Content-Security-Policy で、自分の配信元以外への読み込みと送信をブラウザに拒否させる（`packages/frontend/apps/web/template.html`）。
2. ページと全ワーカーで、fetch、XMLHttpRequest、WebSocket、EventSource、sendBeacon を差し替える。配信パス配下の静的ファイルと data:、blob: 以外は送信前に例外にする（`packages/common/env/src/network-guard.ts`）。CSP はワーカーに効かないため、この差し替えで補う。
3. クラウドサーバーの設定取得、テレメトリ、Sentry を無効にする。
4. サインイン、共有、AI、同期、アプリのダウンロード案内の画面を出さない。

CSP の script-src には `'unsafe-eval'` を入れている。アニメーションに使う lottie-web が eval を使えないと無限ループになるためである。eval を許しても、送信先の制限は変わらない。

## ビルド

Node.js 22 と Yarn 4（Corepack）が必要である。

```sh
yarn install
./scripts/npnnote-build-pages.sh
```

`.npnnote-pages/` に GitHub Pages へ置くファイルができる。配信パスを変えるときは `PUBLIC_PATH=/別のパス/` を付けて実行する。

## 制限

- Service Worker を入れていないので、初回の読み込みにはネットワークが必要である。
- GitHub Pages では、ドキュメントの URL を直接開くと HTTP ステータスが 404 になる。404.html から同じアプリが起動するので、表示と操作には影響しない。
- PDF の書き出しと Typst は AFFiNE の CDN からフォントを取る実装のままである。CSP と差し替えで止まるので、このビルドではフォントを取得できない（コードから判断した結果で、動作は未確認）。

## ライセンス

AFFiNE のライセンスをそのまま引き継ぐ。`packages/backend` と `packages/common/native` 以外は MIT ライセンス（`LICENSE-MIT`）であり、この2つのディレクトリには `packages/backend/server/LICENSE` が適用される。詳細は `LICENSE` を参照。
