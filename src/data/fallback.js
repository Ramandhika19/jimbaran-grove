const products = [
  { id: 1, name: "Jimbaran Coastal Jeep Trail", slug: "jimbaran-coastal-jeep", category_name: "Jeep Offroad", description: "Jelajahi lanskap pesisir dan jalur alam Bali Selatan bersama pemandu lokal.", price: 425000, duration: "2-3 jam", location: "Jimbaran, Bali", image_url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=1200", capacity: 4, is_featured: 1 },
  { id: 2, name: "Mount Batur Sunrise Jeep", slug: "mount-batur-sunrise", category_name: "Sunrise Tour", description: "Nikmati panorama matahari terbit dari kawasan Gunung Batur menggunakan kendaraan 4x4 bersama driver berpengalaman.", price: 550000, duration: "4-5 jam", location: "Kintamani, Bangli", image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200", capacity: 4, is_featured: 1 },
  { id: 3, name: "Ubud Jungle ATV Ride", slug: "ubud-jungle-atv", category_name: "ATV Adventure", description: "Pengalaman ATV melintasi jalur tanah, area hijau, dan trek petualangan dengan perlengkapan keselamatan.", price: 325000, duration: "1,5-2 jam", location: "Ubud, Gianyar", image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200", capacity: 1, is_featured: 1 },
  { id: 4, name: "Bali Countryside 4x4", slug: "bali-countryside-4x4", category_name: "Jeep Offroad", description: "Perjalanan santai dengan Jeep 4x4 menyusuri panorama pedesaan dan perbukitan Bali.", price: 475000, duration: "3 jam", location: "Bali Selatan", image_url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200", capacity: 4 }
];

const vehicles = [
  { id: 1, name: "Classic 4x4 Jeep", vehicle_type: "Jeep 4x4", capacity: 4, description: "Jeep 4x4 untuk perjalanan petualangan dengan driver.", image_url: "https://images.unsplash.com/photo-1519608487953-e999c86e7455?w=900" },
  { id: 2, name: "Adventure ATV Single", vehicle_type: "ATV", capacity: 1, description: "ATV untuk satu pengendara dengan perlengkapan keselamatan.", image_url: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=900" },
  { id: 3, name: "Adventure ATV Tandem", vehicle_type: "ATV", capacity: 2, description: "ATV tandem untuk dua peserta sesuai ketentuan operator.", image_url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=900" }
];

const destinations = [
  { id: 1, name: "Jimbaran", region: "Badung", description: "Kawasan pesisir Bali Selatan dan titik awal eksplorasi area Jimbaran.", latitude: -8.7900, longitude: 115.1600, image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=900" },
  { id: 2, name: "Gunung Batur", region: "Kintamani, Bangli", description: "Kawasan gunung berapi dengan panorama sunrise yang populer.", latitude: -8.2420, longitude: 115.3750, image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=900" },
  { id: 3, name: "Ubud", region: "Gianyar", description: "Kawasan alam, persawahan, dan aktivitas adventure.", latitude: -8.5069, longitude: 115.2625, image_url: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=900" }
];

const gallery = [
  { id: 1, title: "Bali Mountain Adventure", image_url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200", description: "Inspirasi perjalanan alam Bali" },
  { id: 2, title: "Tropical Trail", image_url: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?w=1200", description: "Suasana jalur hijau tropis" },
  { id: 3, title: "Island Escape", image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200", description: "Panorama Pulau Bali" }
];

const tenants = [
  { id: 1, name: "JET Bike & Skate Park", slug: "jet-bike-skate-park", category: "Sports & Adventure", description: "Area untuk aktivitas jet bike dan skate park.", location: "Jimbaran Hub, Bali" },
  { id: 2, name: "Colabo Cafe", slug: "colabo-cafe", category: "Food & Drink", description: "Cafe dan ruang berkumpul di Jimbaran Hub.", location: "Jimbaran Hub, Bali" },
  { id: 3, name: "Biosphere School", slug: "biosphere-school", category: "Education", description: "Sekolah dengan pendekatan tech dan nature.", location: "Jimbaran Hub, Bali" },
  { id: 4, name: "JLoft Office", slug: "jloft-office", category: "Work & Coworking", description: "Ruang kerja untuk bisnis dan profesional.", location: "Jimbaran Hub, Bali" },
  { id: 5, name: "Karting Star", slug: "karting-star", category: "Sports & Adventure", description: "Pengalaman go-kart dengan lintasan 400 meter.", location: "Jimbaran Hub, Bali" },
  { id: 6, name: "Jimba Arthall", slug: "jimba-arthall", category: "Arts & Creative", description: "Ruang untuk seni, ide, dan pertunjukan.", location: "Jimbaran Hub, Bali" },
  { id: 7, name: "Padel Club Indonesia - Bali", slug: "padel-club-indonesia-bali", category: "Sports & Wellness", description: "Fasilitas padel dengan lima lapangan.", location: "Jimbaran Hub, Bali" },
  { id: 8, name: "Saia Pilates", slug: "saia-pilates", category: "Sports & Wellness", description: "Studio reformer dan sesi pilates.", location: "Jimbaran Hub, Bali" },
  { id: 9, name: "Rona di Bukit Cocktails & Grill", slug: "rona-di-bukit", category: "Food & Drink", description: "Tempat bersantap dan berkumpul di Jimbaran Hub.", location: "Jimbaran Hub, Bali" },
  { id: 10, name: "Dance Studio", slug: "dance-studio", category: "Arts & Creative", description: "Studio untuk ballet, hip-hop, tari Bali, dan kelas tari lainnya.", location: "Jimbaran Hub, Bali" },
  { id: 11, name: "Colabo Meeting Room", slug: "colabo-meeting-room", category: "Work & Coworking", description: "Ruang rapat dan kolaborasi.", location: "Jimbaran Hub, Bali" },
  { id: 12, name: "Ragi Baking Academy", slug: "ragi-baking-academy", category: "Education", description: "Akademi baking yang diumumkan sebagai coming soon.", location: "Jimbaran Hub, Bali" }
];

const events = [
  { id: 1, title: "Community Weekend at Jimbaran Hub", category: "Community", description: "Contoh agenda komunitas untuk menampilkan aktivitas dan pertemuan di Jimbaran Hub.", venue: "Jimbaran Hub, Bali", start_at: null, status: "published" },
  { id: 2, title: "Creative Market & Local Gathering", category: "Arts & Creative", description: "Contoh konsep pasar kreatif yang mempertemukan komunitas dan pelaku lokal.", venue: "Jimbaran Hub, Bali", start_at: null, status: "published" }
];

const stories = [
  { id: 1, title: "A Place to Work, Play, and Connect", slug: "work-play-connect", excerpt: "Mengenal Jimbaran Hub sebagai ruang untuk aktivitas, kreativitas, olahraga, dan komunitas.", category: "About Jimbaran Hub", image_url: "https://images.unsplash.com/photo-1517457373958-b7 pyramid".replace("b7 pyramid","b7"), published_at: null },
  { id: 2, title: "Explore More of South Bali", slug: "explore-south-bali", excerpt: "Ide perjalanan untuk menikmati alam, aktivitas, dan destinasi di Bali Selatan.", category: "Explore Bali", image_url: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1200", published_at: null }
];

const reviews = [
  { rating: 5, comment: "Pengalaman seru untuk menikmati sisi lain Bali. Data ulasan ini hanya contoh tampilan.", name: "Guest Explorer" },
  { rating: 5, comment: "Pilihan aktivitas dan tempat berkumpul yang menarik.", name: "Bali Visitor" }
];

function search(query, category = "all") {
  const q = String(query || "").toLowerCase();
  const result = [];
  const add = (items, type, url, titleField = "name", descField = "description") => {
    for (const item of items) {
      const haystack = [item[titleField], item[descField], item.category, item.category_name, item.location, item.region, item.venue].join(" ").toLowerCase();
      if (haystack.includes(q)) result.push({ id: item.id, title: item[titleField], description: item[descField] || "", image_url: item.image_url || "", location: item.location || item.region || item.venue || "Jimbaran Hub, Bali", type, category_name: item.category || item.category_name || type, url: url(item) });
    }
  };
  if (category === "all" || category === "experiences") add(products, "experience", x => "/experiences.html?id=" + x.id);
  if (category === "all" || category === "places") {
    add(tenants, "place", x => "/places.html?tenant=" + x.id);
    add(destinations, "destination", x => "/places.html?destination=" + x.id);
  }
  if (category === "all" || category === "events") add(events, "event", x => "/events.html?id=" + x.id, "title");
  if (category === "all" || category === "stories") add(stories, "story", x => "/news.html?id=" + x.id, "title", "excerpt");
  return result.slice(0, 30);
}

module.exports = { products, vehicles, destinations, gallery, tenants, events, stories, reviews, search };
