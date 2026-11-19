-- Jimbaran Hub MySQL schema + demo seed data
-- Create/select your database in the hosting provider first, then import this file.
-- Do not put database credentials in this file or in the GitHub Pages frontend.

CREATE TABLE IF NOT EXISTS users (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 email VARCHAR(160) NOT NULL UNIQUE,
 password_hash VARCHAR(255) NOT NULL,
 phone VARCHAR(30) NULL,
 role ENUM('admin','customer') NOT NULL DEFAULT 'customer',
 is_active TINYINT(1) NOT NULL DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
 id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(80) NOT NULL UNIQUE,
 slug VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS products (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 category_id INT UNSIGNED NULL,
 name VARCHAR(160) NOT NULL,
 slug VARCHAR(180) NOT NULL UNIQUE,
 description TEXT,
 price DECIMAL(12,2) NOT NULL DEFAULT 0,
 duration VARCHAR(80),
 location VARCHAR(160),
 image_url TEXT,
 capacity INT NOT NULL DEFAULT 1,
 is_featured TINYINT(1) NOT NULL DEFAULT 0,
 is_active TINYINT(1) NOT NULL DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY(category_id) REFERENCES categories(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS product_images (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 product_id BIGINT UNSIGNED NOT NULL,
 image_url TEXT NOT NULL,
 alt_text VARCHAR(180),
 FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS vehicles (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(120) NOT NULL,
 vehicle_type ENUM('Jeep 4x4','ATV','Other') NOT NULL DEFAULT 'Jeep 4x4',
 capacity INT NOT NULL DEFAULT 1,
 description TEXT,
 image_url TEXT,
 is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS destinations (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(160) NOT NULL,
 region VARCHAR(100) DEFAULT 'Bali',
 description TEXT,
 latitude DECIMAL(10,7),
 longitude DECIMAL(10,7),
 image_url TEXT,
 is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 booking_code VARCHAR(30) NOT NULL UNIQUE,
 booking_date DATE NOT NULL,
 guest_count INT NOT NULL DEFAULT 1,
 total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
 status ENUM('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
 notes TEXT,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS booking_details (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 booking_id BIGINT UNSIGNED NOT NULL,
 product_id BIGINT UNSIGNED NULL,
 product_name VARCHAR(160) NOT NULL,
 unit_price DECIMAL(12,2) NOT NULL,
 quantity INT NOT NULL,
 subtotal DECIMAL(12,2) NOT NULL,
 FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
 FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payments (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 booking_id BIGINT UNSIGNED NOT NULL,
 payment_method VARCHAR(60),
 amount DECIMAL(12,2) NOT NULL,
 proof_url TEXT,
 status ENUM('waiting','verified','rejected') NOT NULL DEFAULT 'waiting',
 paid_at DATETIME NULL,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(booking_id) REFERENCES bookings(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS promotions (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(160) NOT NULL,
 promo_code VARCHAR(40) NOT NULL UNIQUE,
 discount_percent DECIMAL(5,2) NOT NULL DEFAULT 0,
 starts_at DATE,
 ends_at DATE,
 is_active TINYINT(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS reviews (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 user_id BIGINT UNSIGNED NOT NULL,
 rating TINYINT NOT NULL,
 comment TEXT NOT NULL,
 is_approved TINYINT(1) NOT NULL DEFAULT 0,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS galleries (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(160) NOT NULL,
 image_url TEXT NOT NULL,
 description TEXT,
 is_published TINYINT(1) NOT NULL DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO categories(name,slug) VALUES
('Jeep Offroad','jeep-offroad'),('ATV Adventure','atv-adventure'),('Sunrise Tour','sunrise-tour');

INSERT IGNORE INTO products(category_id,name,slug,description,price,duration,location,image_url,capacity,is_featured) VALUES
(1,'Jimbaran Coastal Jeep Trail','jimbaran-coastal-jeep','Jelajahi lanskap pesisir dan jalur alam Bali Selatan bersama pemandu lokal. Paket contoh untuk demonstrasi katalog.',425000,'2-3 jam','Jimbaran, Bali','https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200',4,1),
(3,'Mount Batur Sunrise Jeep','mount-batur-sunrise','Nikmati panorama matahari terbit dari kawasan Gunung Batur menggunakan kendaraan 4x4 bersama driver berpengalaman.',550000,'4-5 jam','Kintamani, Bangli','https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200',4,1),
(2,'Ubud Jungle ATV Ride','ubud-jungle-atv','Pengalaman ATV melintasi jalur tanah, area hijau, dan trek petualangan dengan perlengkapan keselamatan.',325000,'1,5-2 jam','Ubud, Gianyar','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200',1,1),
(1,'Bali Countryside 4x4','bali-countryside-4x4','Perjalanan santai dengan Jeep 4x4 menyusuri panorama pedesaan dan perbukitan Bali.',475000,'3 jam','Bali Selatan','https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200',4,0);

INSERT IGNORE INTO vehicles(name,vehicle_type,capacity,description,image_url) VALUES
('Classic 4x4 Jeep','Jeep 4x4',4,'Jeep 4x4 untuk perjalanan petualangan dengan driver.','https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900'),
('Adventure ATV Single','ATV',1,'ATV untuk satu pengendara dengan perlengkapan keselamatan.','https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900'),
('Adventure ATV Tandem','ATV',2,'ATV tandem untuk dua peserta sesuai ketentuan operator.','https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=900');

INSERT IGNORE INTO destinations(name,region,description,latitude,longitude,image_url) VALUES
('Jimbaran','Badung','Kawasan pesisir Bali Selatan dan titik awal eksplorasi area Jimbaran.',-8.7900,115.1600,'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900'),
('Gunung Batur','Kintamani, Bangli','Kawasan gunung berapi dengan panorama sunrise yang populer.',-8.2420,115.3750,'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900'),
('Ubud','Gianyar','Kawasan alam, persawahan, dan aktivitas adventure.',-8.5069,115.2625,'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900');

INSERT IGNORE INTO galleries(title,image_url,description) VALUES
('Bali Mountain Adventure','https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200','Inspirasi perjalanan alam Bali'),
('Tropical Trail','https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200','Suasana jalur hijau tropis'),
('Island Escape','https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200','Panorama Pulau Bali');
