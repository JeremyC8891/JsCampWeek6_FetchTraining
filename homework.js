// ========================================
// 第六週作業：電商 API 資料串接練習
// 執行方式：node homework.js
// 環境需求：Node.js 18+（內建 fetch）
// ========================================

// 載入環境變數
require("dotenv").config({ path: ".env" });

// API 設定（從 .env 讀取）
const API_PATH = process.env.API_PATH;
const BASE_URL = "https://livejs-api.hexschool.io";
const ADMIN_TOKEN = process.env.API_KEY;

// ========================================
// 任務一：基礎 fetch 練習
// ========================================

/**
 * 1. 取得產品列表
 * 使用 fetch 發送 GET 請求
 * @returns {Promise<Array>} - 回傳 products 陣列
 */
async function getProducts() {
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
	const data = await response.json(); 
	return data.products;
	// 請實作此函式
	// 提示：
	// 1. 使用 fetch() 發送 GET 請求
	// 2. 使用 response.json() 解析回應
	// 3. 回傳 data.products
}

/**
 * 2. 取得購物車列表
 * @returns {Promise<Object>} - 回傳 { carts: [...], total: 數字, finalTotal: 數字 }
 */
async function getCart() {
	// 請實作此函式
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`);
	const data = await response.json(); 
	return {
		carts: data.carts,
		total: data.total,
		finalTotal: data.finalTotal
	};
}

/**
 * 3. 錯誤處理：當 API 回傳錯誤時，回傳錯誤訊息
 * @returns {Promise<Object>} - 回傳 { success: boolean, data?: [...], error?: string }
 */
async function getProductsSafe() {
	// 請實作此函式
	// 提示：
	// 1. 加上 try-catch 處理錯誤
	// 2. 檢查 response.ok 判斷是否成功
	// 3. 成功回傳 { success: true, data: [...] }
	// 4. 失敗回傳 { success: false, error: '錯誤訊息' }
	try {
		const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/products`);
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		const data = await response.json();
		return { success: true, data: data.products };
	} catch (error) {
		console.error(error);
		return { success: false, error: error.message };
	}

}

// ========================================
// 任務二：POST 請求 - 購物車操作
// ========================================

/**
 * 1. 加入商品到購物車
 * @param {string} productId - 產品 ID
 * @param {number} quantity - 數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function addToCart(productId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 POST 請求
	// 2. body 格式：{ data: { productId: "xxx", quantity: 1 } }
	// 3. 記得設定 headers: { 'Content-Type': 'application/json' }
	// 4. body 要用 JSON.stringify() 轉換
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		// body要包住一個有data屬性的JSON物件，因為網路傳輸只能用字串，所以要用JSON.stringify()轉換成字串
		body: JSON.stringify({
			data: {
				productId: productId,
				quantity: quantity
			}
		})
	});
	const data = await response.json(); // 解析回應
	return data;
}

/**
 * 2. 編輯購物車商品數量
 * @param {string} cartId - 購物車項目 ID
 * @param {number} quantity - 新數量
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function updateCartItem(cartId, quantity) {
	// 請實作此函式
	// 提示：
	// 1. 發送 PATCH 請求
	// 2. body 格式：{ data: { id: "購物車ID", quantity: 數量 } }
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			data: {
				id: cartId,
				quantity: quantity
			}
		})
	});
	const data = await response.json(); 
	return data;

}

/**
 * 3. 刪除購物車特定商品
 * @param {string} cartId - 購物車項目 ID
 * @returns {Promise<Object>} - 回傳更新後的購物車資料
 */
async function removeCartItem(cartId) {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts/{id}
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts/${cartId}`, {
		method: 'DELETE'
	});
	const data = await response.json(); 
	return data;
}

/**
 * 4. 清空購物車
 * @returns {Promise<Object>} - 回傳清空後的購物車資料
 */
async function clearCart() {
	// 請實作此函式
	// 提示：發送 DELETE 請求到 /carts
	const response = await fetch(`${BASE_URL}/api/livejs/v1/customer/${API_PATH}/carts`, {
		method: 'DELETE'
	});
	const data = await response.json(); 
	return data;
}

// ========================================
// HTTP 知識測驗 (額外練習)
// ========================================

/*
請回答以下問題（可以寫在這裡或另外繳交）：

1. HTTP 狀態碼的分類（1xx, 2xx, 3xx, 4xx, 5xx 各代表什麼）
   答：
	1xx 資訊回應 – 請求已接收，正在繼續處理  
	2xx 成功 – 請求已成功接收、理解並接受，一般常見的有 200 OK、201 Created 等
	3xx 重新導向 – 需要採取進一步的措施以完成請求
	4xx 客戶端錯誤 – 請求包含語法錯誤或無法完成  //就是前端的包
	5xx 伺服器錯誤 – 伺服器在處理請求時發生錯誤  //就是後端的包

2. GET、POST、PATCH、PUT、DELETE 的差異
   答：
	GET：用於從伺服器獲取資料，請求不應該有副作用（不修改資料）
	POST：用於向伺服器提交資料，通常會創建新的資源
	PATCH：用於對資源進行部分更新
	PUT：用於對資源進行完整更新（替換整個資源）
	DELETE：用於刪除資源

3. 什麼是 RESTful API？ 
   答：
	小小建議，以後在教學上，也可以簡單介紹其他 API 風格，我覺得對於第一次接觸的人會比較容易理解。
	以下AI給我的答案，如果有錯也麻煩助教給我指正。
	謝謝

   一般API是指應用程式介面（Application Programming Interface），它定義了軟體系統之間如何互動和通信的規則和協議。API 可以是 RESTful API、GraphQL API、SOAP API 等多種形式。
	
   RESTful API 是一種基於 REST（Representational State Transfer）架構風格設計的 API。它使用 HTTP 方法（GET、POST、PUT、PATCH、DELETE）來操作資源，並且資源通常以 URL 的形式表示。RESTful API 強調無狀態性（statelessness），即每個請求都應該包含完成請求所需的所有資訊，伺服器不應該保留客戶端的狀態。		

	目前主流的API設計有4種
	1. REST (Representational State Transfer)
	這是目前網路上最流行、最標準的風格。它將一切視為「資源」，並利用 HTTP 動詞（GET, POST, PUT, DELETE）來操作。

	特點：無狀態（Stateless）、快取機制強、易於擴展。

	傳輸格式：主要使用 JSON，也可以是 XML。

	例子：GET /api/users/123 代表獲取 ID 為 123 的使用者資料。

	2. GraphQL
	由 Meta (Facebook) 開發，為了解決 REST 獲取過多資料（Over-fetching）或不足（Under-fetching）的問題。

	特點：由前端決定資料結構。你只需要一個端點（Endpoint），透過查詢語句精確取得所需的欄位。

	適用場景：複雜的行動裝置應用、資料關聯性強的系統。

	例子：你可以在一次請求中同時要求「使用者名稱」與「該使用者的前三篇貼文」。

	3. gRPC (Remote Procedure Call)
	由 Google 開發，基於 HTTP/2 協議，速度極快且效率極高。

	特點：使用 Protocol Buffers (Protobuf) 作為序列化格式（二進位傳輸），比 JSON 更小更快速。

	適用場景：微服務（Microservices） 之間的內部溝通、對效能要求極高的系統。

	4. Webhook
	這是一種「被動式」的 API 風格，通常稱為「反向 API」。

	特點：當事件發生時，伺服器主動「推播」通知給客戶端，而不是客戶端一直去詢問伺服器。

	適用場景：支付完成通知、GitHub 程式碼推播通知。

*/

// ========================================
// 匯出函式供測試使用
// ========================================
module.exports = {
	API_PATH,
	BASE_URL,
	ADMIN_TOKEN,
	getProducts,
	getCart,
	getProductsSafe,
	addToCart,
	updateCartItem,
	removeCartItem,
	clearCart,
};

// ========================================
// 直接執行測試
// ========================================
if (require.main === module) {
	async function runTests() {
		console.log("=== 第六週作業測試 ===\n");
		console.log("API_PATH:", API_PATH);
		console.log("");

		if (!API_PATH) {
			console.log("請先在 .env 檔案中設定 API_PATH！");
			return;
		}

		// 任務一測試
		console.log("--- 任務一：基礎 fetch ---");
		try {
			const products = await getProducts();
			console.log(
				"getProducts:",
				products ? `成功取得 ${products.length} 筆產品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getProducts 錯誤:", error.message);
		}

		try {
			const cart = await getCart();
			console.log(
				"getCart:",
				cart ? `購物車有 ${cart.carts?.length || 0} 筆商品` : "回傳 undefined",
			);
		} catch (error) {
			console.log("getCart 錯誤:", error.message);
		}

		try {
			const result = await getProductsSafe();
			console.log(
				"getProductsSafe:",
				result?.success ? "成功" : result?.error || "回傳 undefined",
			);
		} catch (error) {
			console.log("getProductsSafe 錯誤:", error.message);
		}

		console.log("\n=== 測試結束 ===");
		console.log("\n提示：執行 node test.js 進行完整驗證");
	}

	runTests();
}
