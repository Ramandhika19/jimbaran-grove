const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");
const auth = require("../middleware/auth");

const asyncRoute = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const clean = value => String(value ?? "").trim();

router.get("/health", asyncRoute(async (_req, res) => { await pool.query("SELECT 1"); res.json({ status: "ok", database: "connected", app: "Jimbaran Hub" }); }));

router.get("/bootstrap", asyncRoute(async (_req, res) => {
  const [[row]] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role='admin'");
  if (Number(row.total) > 0) return res.status(409).json({ message: "Admin sudah dibuat." });
  const name = clean(process.env.ADMIN_NAME), email = clean(process.env.ADMIN_EMAIL), password = process.env.ADMIN_PASSWORD;
  if (!email || !password || password.length < 12) return res.status(400).json({ message: "Isi ADMIN_EMAIL dan ADMIN_PASSWORD minimal 12 karakter di environment hosting." });
  const hash = await bcrypt.hash(password, 12);
  await pool.query("INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,'admin')", [name || "Administrator", email, hash]);
  res.status(201).json({ message: "Admin pertama berhasil dibuat. Hapus ADMIN_PASSWORD dari environment setelahnya." });
}));

router.post("/auth/register", asyncRoute(async (req, res) => {
  const name = clean(req.body.name), email = clean(req.body.email).toLowerCase(), password = String(req.body.password || "");
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || password.length < 8) return res.status(400).json({ message: "Nama, email valid, dan password minimal 8 karakter wajib diisi." });
  const hash = await bcrypt.hash(password, 12);
  try {
    const [result] = await pool.query("INSERT INTO users(name,email,password_hash,role) VALUES(?,?,?,'customer')", [name,email,hash]);
    res.status(201).json({ message: "Akun berhasil dibuat.", userId: result.insertId });
  } catch (err) { if (err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email sudah terdaftar." }); throw err; }
}));

router.post("/auth/login", asyncRoute(async (req, res) => {
  const email = clean(req.body.email).toLowerCase(), password = String(req.body.password || "");
  const [rows] = await pool.query("SELECT id,name,email,password_hash,role FROM users WHERE email=? AND is_active=1", [email]);
  if (!rows.length || !(await bcrypt.compare(password, rows[0].password_hash))) return res.status(401).json({ message: "Email atau password salah." });
  const user = rows[0], token = jwt.sign({ id:user.id, name:user.name, email:user.email, role:user.role }, process.env.JWT_SECRET, { expiresIn:"12h" });
  res.json({ token, user:{ id:user.id, name:user.name, email:user.email, role:user.role } });
}));

router.get("/products", asyncRoute(async (req,res) => {
  const [rows] = await pool.query(`SELECT p.*, c.name AS category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.is_active=1 ORDER BY p.is_featured DESC,p.id DESC`);
  res.json(rows);
}));
router.get("/products/:id", asyncRoute(async (req,res) => {
  const [[row]] = await pool.query("SELECT p.*,c.name AS category_name FROM products p LEFT JOIN categories c ON c.id=p.category_id WHERE p.id=? AND p.is_active=1",[req.params.id]);
  if(!row) return res.status(404).json({message:"Paket tidak ditemukan."});
  res.json(row);
}));
router.get("/vehicles", asyncRoute(async (_req,res) => { const [rows]=await pool.query("SELECT * FROM vehicles WHERE is_active=1 ORDER BY id DESC"); res.json(rows); }));
router.get("/destinations", asyncRoute(async (_req,res) => { const [rows]=await pool.query("SELECT * FROM destinations WHERE is_active=1 ORDER BY name"); res.json(rows); }));
router.get("/gallery", asyncRoute(async (_req,res) => { const [rows]=await pool.query("SELECT * FROM galleries WHERE is_published=1 ORDER BY created_at DESC LIMIT 30"); res.json(rows); }));

router.post("/bookings", auth(), asyncRoute(async (req,res) => {
  const productId=Number(req.body.product_id), guests=Number(req.body.guests), date=clean(req.body.booking_date), notes=clean(req.body.notes);
  if(!productId || !Number.isInteger(guests) || guests<1 || guests>30 || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return res.status(400).json({message:"Paket, tanggal, dan jumlah peserta (1-30) wajib valid."});
  const [[product]]=await pool.query("SELECT id,name,price FROM products WHERE id=? AND is_active=1",[productId]);
  if(!product) return res.status(404).json({message:"Paket tidak tersedia."});
  const total=Number(product.price)*guests;
  const [result]=await pool.query("INSERT INTO bookings(user_id,booking_code,booking_date,guest_count,total_amount,status,notes) VALUES(?,CONCAT('JH',DATE_FORMAT(NOW(),'%y%m%d'),LPAD(FLOOR(RAND()*99999),5,'0')),?,?,?,'pending',?)",[req.user.id,date,guests,total,notes]);
  await pool.query("INSERT INTO booking_details(booking_id,product_id,product_name,unit_price,quantity,subtotal) VALUES(?,?,?,?,?,?)",[result.insertId,product.id,product.name,product.price,guests,total]);
  res.status(201).json({message:"Booking berhasil dikirim.",bookingId:result.insertId,total});
}));
router.get("/my-bookings", auth(), asyncRoute(async(req,res)=>{const [rows]=await pool.query("SELECT b.*,bd.product_name FROM bookings b LEFT JOIN booking_details bd ON bd.booking_id=b.id WHERE b.user_id=? ORDER BY b.created_at DESC",[req.user.id]);res.json(rows);}));
router.post("/reviews", auth(), asyncRoute(async(req,res)=>{const rating=Number(req.body.rating),comment=clean(req.body.comment);if(!Number.isInteger(rating)||rating<1||rating>5||!comment)return res.status(400).json({message:"Rating 1-5 dan komentar wajib diisi."});await pool.query("INSERT INTO reviews(user_id,rating,comment,is_approved) VALUES(?,?,?,0)",[req.user.id,rating,comment]);res.status(201).json({message:"Ulasan dikirim dan menunggu moderasi."});}));
router.get("/reviews", asyncRoute(async(_req,res)=>{const [rows]=await pool.query("SELECT r.rating,r.comment,r.created_at,u.name FROM reviews r JOIN users u ON u.id=r.user_id WHERE r.is_approved=1 ORDER BY r.created_at DESC LIMIT 12");res.json(rows);}));

router.get("/admin/stats",auth("admin"),asyncRoute(async(_req,res)=>{const [[customers]]=await pool.query("SELECT COUNT(*) total FROM users WHERE role='customer'");const [[bookings]]=await pool.query("SELECT COUNT(*) total FROM bookings");const [[pending]]=await pool.query("SELECT COUNT(*) total FROM bookings WHERE status='pending'");const [[revenue]]=await pool.query("SELECT COALESCE(SUM(total_amount),0) total FROM bookings WHERE status IN ('confirmed','completed')");res.json({customers:customers.total,bookings:bookings.total,pending:pending.total,revenue:Number(revenue.total)});}));
router.get("/admin/bookings",auth("admin"),asyncRoute(async(_req,res)=>{const [rows]=await pool.query("SELECT b.*,u.name customer_name,u.email,bd.product_name FROM bookings b JOIN users u ON u.id=b.user_id LEFT JOIN booking_details bd ON bd.booking_id=b.id ORDER BY b.created_at DESC");res.json(rows);}));
router.patch("/admin/bookings/:id/status",auth("admin"),asyncRoute(async(req,res)=>{const allowed=["pending","confirmed","completed","cancelled"];if(!allowed.includes(req.body.status))return res.status(400).json({message:"Status tidak valid."});const [r]=await pool.query("UPDATE bookings SET status=? WHERE id=?",[req.body.status,req.params.id]);if(!r.affectedRows)return res.status(404).json({message:"Booking tidak ditemukan."});res.json({message:"Status booking diperbarui."});}));
router.get("/admin/customers",auth("admin"),asyncRoute(async(_req,res)=>{const [rows]=await pool.query("SELECT id,name,email,phone,created_at,is_active FROM users WHERE role='customer' ORDER BY created_at DESC");res.json(rows);}));

router.post("/admin/products",auth("admin"),asyncRoute(async(req,res)=>{const {category_id,name,slug,description,price,duration,location,image_url,capacity}=req.body;if(!name||!slug||Number(price)<0)return res.status(400).json({message:"Nama, slug, dan harga wajib valid."});const [r]=await pool.query("INSERT INTO products(category_id,name,slug,description,price,duration,location,image_url,capacity) VALUES(?,?,?,?,?,?,?,?,?)",[category_id||null,name,slug,description||"",price,duration||"",location||"",image_url||"",capacity||1]);res.status(201).json({id:r.insertId,message:"Paket ditambahkan."});}));
router.put("/admin/products/:id",auth("admin"),asyncRoute(async(req,res)=>{const {category_id,name,slug,description,price,duration,location,image_url,capacity,is_active}=req.body;await pool.query("UPDATE products SET category_id=?,name=?,slug=?,description=?,price=?,duration=?,location=?,image_url=?,capacity=?,is_active=? WHERE id=?",[category_id||null,name,slug,description||"",price,duration||"",location||"",image_url||"",capacity||1,is_active===false?0:1,req.params.id]);res.json({message:"Paket diperbarui."});}));
router.delete("/admin/products/:id",auth("admin"),asyncRoute(async(req,res)=>{await pool.query("UPDATE products SET is_active=0 WHERE id=?",[req.params.id]);res.json({message:"Paket dinonaktifkan."});}));
router.post("/admin/vehicles",auth("admin"),asyncRoute(async(req,res)=>{const {name,vehicle_type,capacity,description,image_url}=req.body;const [r]=await pool.query("INSERT INTO vehicles(name,vehicle_type,capacity,description,image_url) VALUES(?,?,?,?,?)",[name,vehicle_type,capacity||1,description||"",image_url||""]);res.status(201).json({id:r.insertId});}));
router.post("/admin/destinations",auth("admin"),asyncRoute(async(req,res)=>{const {name,region,description,latitude,longitude,image_url}=req.body;const [r]=await pool.query("INSERT INTO destinations(name,region,description,latitude,longitude,image_url) VALUES(?,?,?,?,?,?)",[name,region||"Bali",description||"",latitude||null,longitude||null,image_url||""]);res.status(201).json({id:r.insertId});}));
router.get("/admin/payments",auth("admin"),asyncRoute(async(_req,res)=>{const [rows]=await pool.query("SELECT p.*,b.booking_code,u.name customer_name FROM payments p JOIN bookings b ON b.id=p.booking_id JOIN users u ON u.id=b.user_id ORDER BY p.created_at DESC");res.json(rows);}));
router.patch("/admin/payments/:id/status",auth("admin"),asyncRoute(async(req,res)=>{if(!["verified","rejected"].includes(req.body.status))return res.status(400).json({message:"Status tidak valid."});await pool.query("UPDATE payments SET status=? WHERE id=?",[req.body.status,req.params.id]);res.json({message:"Pembayaran diperbarui."});}));
router.get("/admin/reports",auth("admin"),asyncRoute(async(_req,res)=>{const [rows]=await pool.query("SELECT DATE_FORMAT(created_at,'%Y-%m') month,COUNT(*) bookings,SUM(CASE WHEN status IN ('confirmed','completed') THEN total_amount ELSE 0 END) revenue FROM bookings GROUP BY DATE_FORMAT(created_at,'%Y-%m') ORDER BY month DESC LIMIT 12");res.json(rows);}));

router.use((err,_req,res,_next)=>{console.error(err);res.status(500).json({message:"Terjadi kesalahan server."});});
module.exports=router;