-- Jimbaran Hub multi-page content and global search extension
CREATE TABLE IF NOT EXISTS hub_tenants (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 name VARCHAR(160) NOT NULL,
 slug VARCHAR(180) NOT NULL UNIQUE,
 category VARCHAR(80) NOT NULL,
 description TEXT,
 location VARCHAR(180) DEFAULT 'Jimbaran Hub, Bali',
 image_url TEXT,
 website_url TEXT,
 is_active TINYINT(1) NOT NULL DEFAULT 1,
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hub_events (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(180) NOT NULL,
 slug VARCHAR(200) NOT NULL UNIQUE,
 category VARCHAR(80) DEFAULT 'Community',
 description TEXT,
 venue VARCHAR(180),
 start_at DATETIME NULL,
 end_at DATETIME NULL,
 image_url TEXT,
 booking_url TEXT,
 status ENUM('draft','published','cancelled') NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS hub_stories (
 id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 title VARCHAR(180) NOT NULL,
 slug VARCHAR(200) NOT NULL UNIQUE,
 excerpt TEXT,
 content LONGTEXT,
 category VARCHAR(80),
 image_url TEXT,
 published_at DATETIME NULL,
 status ENUM('draft','published') NOT NULL DEFAULT 'draft',
 created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT IGNORE INTO hub_tenants(name,slug,category,description) VALUES
('JET Bike & Skate Park','jet-bike-skate-park','Sports & Adventure','Area untuk aktivitas jet bike dan skate park.'),
('Colabo Cafe','colabo-cafe','Food & Drink','Cafe dan ruang berkumpul di Jimbaran Hub.'),
('Biosphere School','biosphere-school','Education','Sekolah dengan pendekatan tech dan nature.'),
('JLoft Office','jloft-office','Work & Coworking','Ruang kerja untuk bisnis dan profesional.'),
('Karting Star','karting-star','Sports & Adventure','Pengalaman go-kart dengan lintasan 400 meter.'),
('Jimba Arthall','jimba-arthall','Arts & Creative','Ruang untuk seni, ide, dan pertunjukan.'),
('Padel Club Indonesia - Bali','padel-club-indonesia-bali','Sports & Wellness','Fasilitas padel dengan lima lapangan.'),
('Saia Pilates','saia-pilates','Sports & Wellness','Studio reformer dan sesi pilates.'),
('Rona di Bukit Cocktails & Grill','rona-di-bukit','Food & Drink','Tempat bersantap dan berkumpul di Jimbaran Hub.'),
('Dance Studio','dance-studio','Arts & Creative','Studio untuk ballet, hip-hop, tari Bali, dan kelas tari lainnya.'),
('Colabo Meeting Room','colabo-meeting-room','Work & Coworking','Ruang rapat dan kolaborasi.'),
('Ragi Baking Academy','ragi-baking-academy','Education','Akademi baking yang diumumkan sebagai coming soon.');

-- Events and stories start empty: publish verified information through the content manager.
