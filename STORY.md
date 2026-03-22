# Day029 Story — Flow Board Builder

## Why
毎日使う小さな課題を、1ページで即解決できる形にしたかったため。

## Requirements
- Webブラウザだけで完結すること
- 1画面で主要操作が終わること
- GitHub Pagesで公開できること

## Design highlights
- Day029専用にテーマをseed固定して再生成時の見た目を安定化
- devtools用途に寄せた単機能UIで迷いを減らす
- 出力をそのまま再利用できるテキスト構造
- Family: flow_board
- Mechanic: lane_movement
- Input/Output: card_creation -> lane_board
- Audience Promise: clearer_flow_visibility
- Publish Hook: 詰まりレーンを可視化して改善
- Complexity Tier: small
- Selected components: none
- Complexity hint: Keep the tool single-purpose and stable. Add at most one safe enhancement component.

## Trade-offs / Known issues
- ローカル保存機能は未実装
- 複雑な入力バリデーションは最小限

## Next ideas
- 履歴保存
- プリセット追加
- エクスポート形式拡張

## Social copy
Day029｜Flow Board Builder
作業カードを流しながらボトルネックを見つけるボード型ツール。（話題:Zenn Feed）
