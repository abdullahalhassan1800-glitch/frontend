<?php
/**
 * Static Product Page Generator
 * Run this from admin panel to generate SEO-friendly product pages.
 * Usage: POST with token, or GET with token to preview.
 */
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

$data_dir = __DIR__ . '/data';
$products_dir = __DIR__ . '/../products';

$valid_token = 'MilesToken@2026';
$token = $_REQUEST['token'] ?? '';
if ($token !== $valid_token) {
    http_response_code(401);
    echo json_encode(['success' => false, 'error' => 'Invalid token']);
    exit;
}

// Load web products
$file_path = $data_dir . '/taiva_web_products.json';
if (!file_exists($file_path)) {
    echo json_encode(['success' => false, 'error' => 'No products file found']);
    exit;
}
$content = file_get_contents($file_path);
$products = json_decode($content, true);
if (!is_array($products) || count($products) === 0) {
    echo json_encode(['success' => false, 'error' => 'No products to generate pages for']);
    exit;
}

// Create products directory
if (!is_dir($products_dir)) {
    mkdir($products_dir, 0755, true);
}

function escapeAttr($s) {
    return htmlspecialchars($s ?? '', ENT_QUOTES, 'UTF-8');
}

function escapeJs($s) {
    return str_replace("'", "\\'", str_replace('\\', '\\\\', $s ?? ''));
}

$generated = 0;
$errors = [];

foreach ($products as $p) {
    if (empty($p['slug']) || ($p['active'] ?? true) === false) continue;
    
    $slug = preg_replace('/[^a-z0-9-]/', '', strtolower($p['slug']));
    if (empty($slug)) continue;
    
    $name = escapeAttr($p['name'] ?? 'Product');
    $tagline = escapeAttr($p['tagline'] ?? '');
    $desc = escapeAttr($p['description'] ?? '');
    $price = $p['price'] ?? 0;
    $origPrice = $p['originalPrice'] ?? 0;
    $rating = $p['rating'] ?? 4.8;
    $reviewCount = $p['reviewCount'] ?? 0;
    $category = escapeAttr($p['category'] ?? '');
    $images = $p['images'] ?? [];
    $benefits = $p['benefits'] ?? [];
    
    $mainImage = !empty($images[0]) ? $images[0] : '';
    $discount = ($origPrice > 0 && $origPrice > $price) ? round((1 - $price / $origPrice) * 100) : 0;
    
    // Generate star HTML
    $starsHtml = '';
    for ($s = 0; $s < 5; $s++) {
        $starsHtml .= ($s < floor($rating)) ? '&#9733;' : '&#9734;';
    }
    
    // Gallery thumbs HTML
    $thumbsHtml = '';
    foreach ($images as $i => $img) {
        $active = $i === 0 ? ' active' : '';
        $thumbsHtml .= '<img src="' . escapeAttr($img) . '" alt="' . $name . ' ' . ($i+1) . '" class="' . $active . '" data-index="' . $i . '" onclick="setGallery(' . $i . ')">';
    }
    
    // Benefits HTML
    $benefitsHtml = '';
    foreach ($benefits as $b) {
        $benefitsHtml .= '<div class="pd-benefit"><i class="fa-solid fa-check-circle"></i> ' . escapeAttr($b) . '</div>';
    }
    
    // JSON-LD
    $jsonLd = json_encode([
        '@context' => 'https://schema.org',
        '@type' => 'Product',
        'name' => $p['name'] ?? '',
        'description' => $p['description'] ?? '',
        'image' => $images,
        'brand' => ['@type' => 'Brand', 'name' => 'OMS'],
        'offers' => [
            '@type' => 'Offer',
            'price' => $price,
            'priceCurrency' => 'INR',
            'availability' => 'https://schema.org/InStock',
        ],
        'aggregateRating' => [
            '@type' => 'AggregateRating',
            'ratingValue' => $rating,
            'reviewCount' => $reviewCount,
        ],
    ], JSON_UNESCAPED_SLASHES);
    
    $pageHtml = '<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>' . $name . ' | OMS</title>
  <meta name="description" content="' . $desc . '">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <link rel="stylesheet" href="../style.css">
  <script type="application/ld+json">' . $jsonLd . '</script>
</head>
<body>

  <!-- ANNOUNCEMENT BAR -->
  <div class="announcement-bar">
    <div class="container">
      <span>🌿 100% Natural Ayurvedic Formulations</span>
      <span>🚚 Free Shipping Across India on Orders Above ₹499</span>
      <span>✅ Clinically Tested & Science-Backed</span>
    </div>
  </div>

  <!-- HEADER -->
  <header class="main-header">
    <div class="header-inner">
      <a href="../index.html" class="logo">
        <img src="../images/taiva-logo-white.png" alt="OMS">
        <span>OMS</span>
      </a>
      <nav class="desktop-nav">
        <ul>
          <li><a href="../index.html">Home</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <button onclick="openCartDrawer()"><i class="fa-solid fa-bag-shopping"></i><span class="cart-count">0</span></button>
      </div>
    </div>
  </header>

  <!-- CART DRAWER -->
  <div class="cart-drawer-overlay" id="cartOverlay" onclick="closeCartDrawer()"></div>
  <div class="cart-drawer" id="cartDrawer">
    <div class="drawer-header">
      <h3>Your Cart</h3>
      <button class="drawer-close" onclick="closeCartDrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-body" id="cartBody">
      <div class="empty-state" id="cartEmpty"><i class="fa-solid fa-bag-shopping"></i><p>Your cart is empty</p></div>
      <div id="cartItems"></div>
    </div>
    <div class="drawer-footer">
      <div class="total-row"><span>Total</span><span id="cartTotal">Rs. 0</span></div>
      <button class="checkout-btn" onclick="openCheckout()">Proceed to Checkout</button>
    </div>
  </div>

  <main>
    <section class="pd-section">
      <div class="container">
        <div class="pd-layout">
          <div class="pd-gallery">
            <div class="pd-main-image"><img id="galleryMain" src="' . escapeAttr($mainImage) . '" alt="' . $name . '"></div>
            <div class="pd-thumbs" id="galleryThumbs">' . $thumbsHtml . '</div>
          </div>
          <div class="pd-info">
            <div class="pd-meta">
              <span class="stars">' . $starsHtml . '</span>
              <span class="review-count">' . $rating . ' (' . $reviewCount . ' reviews)</span>
            </div>
            <h1 id="pdName">' . $name . '</h1>
            <p class="pd-subtitle" id="pdTagline">' . $tagline . '</p>
            <div class="pd-price">
              <span class="current">Rs. ' . number_format($price) . '</span>
              ' . ($origPrice > 0 && $origPrice > $price ? '<span class="original">Rs. ' . number_format($origPrice) . '</span><span class="discount">-' . $discount . '%</span>' : '') . '
            </div>
            <p class="pd-desc">' . $desc . '</p>
            <div class="pd-benefits">' . $benefitsHtml . '</div>
            <div class="pd-actions">
              <div class="qty-control">
                <button onclick="changeQty(-1)">-</button>
                <span id="qtyVal">1</span>
                <button onclick="changeQty(1)">+</button>
              </div>
              <button class="add-to-cart-btn" onclick="handleAddToCart()">Add to Cart</button>
              <button class="buy-now-btn" onclick="handleBuyNow()">Buy Now</button>
            </div>
            <div class="pd-trust">
              <span><i class="fa-solid fa-leaf"></i> 100% Natural</span>
              <span><i class="fa-solid fa-flask"></i> Lab Tested</span>
              <span><i class="fa-solid fa-truck"></i> Free Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container">
      <div class="footer-bottom"><p>&copy; 2026 OMS. All Rights Reserved.</p></div>
    </div>
  </footer>

  <a href="https://wa.me/919582908080" target="_blank" class="whatsapp-float"><i class="fa-brands fa-whatsapp"></i></a>

  <script>
    var currentProduct = ' . json_encode($p) . ';
    var galleryImages = currentProduct.images || [];
    
    function setGallery(idx) {
      document.getElementById("galleryMain").src = galleryImages[idx];
      document.querySelectorAll(".pd-thumbs img").forEach(function(t,i) {
        t.classList.toggle("active", i === idx);
      });
    }
    
    function changeQty(d) {
      var el = document.getElementById("qtyVal");
      var v = parseInt(el.textContent) + d;
      if (v < 1) v = 1; if (v > 10) v = 10;
      el.textContent = v;
    }
    
    function handleAddToCart() {
      var qty = parseInt(document.getElementById("qtyVal").textContent) || 1;
      var img = (currentProduct.images && currentProduct.images[0]) || "";
      if (typeof addToCart === "function") {
        addToCart(currentProduct.name, currentProduct.price, img, qty);
      } else {
        var cart = JSON.parse(localStorage.getItem("taiva_cart") || "[]");
        var existing = -1;
        for (var i = 0; i < cart.length; i++) {
          if (cart[i].name === currentProduct.name) { existing = i; break; }
        }
        if (existing !== -1) { cart[existing].qty = (cart[existing].qty || 1) + qty; }
        else { cart.push({ name: currentProduct.name, price: currentProduct.price, image: img, qty: qty }); }
        localStorage.setItem("taiva_cart", JSON.stringify(cart));
      }
      openCartDrawer();
    }
    
    function handleBuyNow() { handleAddToCart(); setTimeout(function() { openCheckout(); }, 300); }
  </script>
  <script src="../app.js"></script>
</body>
</html>';
    
    $file_path = $products_dir . '/' . $slug . '.html';
    if (file_put_contents($file_path, $pageHtml) !== false) {
        $generated++;
    } else {
        $errors[] = $slug;
    }
}

echo json_encode([
    'success' => true,
    'generated' => $generated,
    'errors' => $errors,
    'message' => $generated . ' product page(s) generated in /products/',
]);
