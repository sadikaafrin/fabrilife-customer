// ================= Start Data Layer Push function =================
export function dataLayerPush(eventType, items = []) {
  const validEvents = [
    "view_item",
    "add_to_cart",
    "remove_from_cart",
    "view_cart",
    "add_to_wishlist",
    "remove_from_wishlist",
    "begin_checkout",
    "purchase",
    "page_view"
  ];

  const event = validEvents.includes(eventType) ? eventType : "custom_event";

  // Ensure dataLayer exists
  window.dataLayer = window.dataLayer || [];

  if (event === "page_view") {
    window.dataLayer.push({
      event: "page_view",
      page: {
        page_path: window.location.pathname,
        page_title: document.title,
        page_location: window.location.href
      }
    });

    console.log("Data Layer Push: page_view", {
      path: window.location.pathname,
      title: document.title,
      url: window.location.href
    });
    return;
  }

  // Normalize single vs multiple items
  const normalizedItems = Array.isArray(items) ? items : [items];

  const ecommerceItems = normalizedItems.map((itemData) => ({
    item_id: itemData.code || "",
    item_name: itemData.name || "",
    price: Number(itemData.price) || 0,
    quantity: Number(itemData.quantity) || 1,
    item_category: itemData.category || "",
    item_category2: itemData.subCategory || "",
    item_brand: itemData.brand || "",
    item_variant: itemData.variant || ""
  }));

  window.dataLayer.push({
    event,
    ecommerce: {
      currency: "BDT",
      items: ecommerceItems
    }
  });

  console.log("Data Layer Push:", event, ecommerceItems);
}


export function sendSMS(phoneNumber, message) {
    const url = "https://api.bdbulksms.net/api.php?json";

    // Create form data like a form submission
    const formData = new FormData();
    formData.append("token", "109451845141733661914aa3b8fbd868b0da6e2a5c16939ee6f9a");
    formData.append("to", phoneNumber);
    formData.append("message", message);

    // Send request
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.send(formData);

    xhr.onload = function () {
        try {
            const response = JSON.parse(this.responseText);
            console.log("SMS Response:", response);
        } catch (err) {
            console.error("Invalid JSON response:", this.responseText);
        }
    };
}