// functions/api/data.js

// database.jsから公開されている3つのデータをすべて読み込む
import {
  HAQEI_DATA,
  haqei_potential_scores,
  haqeiMainDatabase,
} from "../lib/database.js";

/**
 * フロントエンドからのリクエストに応じて、
 * 必要なHaQeiデータをすべてまとめてJSON形式で返すAPI
 */
export async function onRequestGet(context) {
  // 3つのデータを1つのオブジェクトにまとめる
  const responseData = {
    HAQEI_DATA: HAQEI_DATA,
    haqei_potential_scores: haqei_potential_scores,
    haqeiMainDatabase: haqeiMainDatabase,
  };

  // まとめたデータをJSON形式で返す
  return new Response(JSON.stringify(responseData), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // キャッシュを有効にして、毎回読み込まないようにする（推奨）
      "Cache-Control": "public, max-age=3600", // 1時間キャッシュ
    },
  });
}
/**
 * このAPIは、HaQeiデータをフロントエンドに提供するためのものです。
 * 必要なデータをすべてまとめて返すことで、フロントエンド側でのデータ取得を簡素化します。
 *
 * 注意: このAPIは、Cloudflare Workersなどのサーバーレス環境で動作することを前提としています。
 */
