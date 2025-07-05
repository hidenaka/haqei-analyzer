// functions/api/data.js

// haqei_main_database.jsからデータをインポートします
import { HAQEI_DATA } from "../lib/database.js";

// GETリクエストが来たら、HAQEI_DATAをJSONとして返すだけのシンプルな関数
export async function onRequestGet(context) {
  return new Response(JSON.stringify(HAQEI_DATA), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
}
