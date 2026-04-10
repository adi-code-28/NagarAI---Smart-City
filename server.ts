import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // In-memory store for demo purposes
  let complaints = [
    { 
      id: '1', 
      title: 'Large pothole on NH-48', 
      category: 'road', 
      location: 'Mahipalpur', 
      status: 'in_progress', 
      priority: 'critical', 
      score: 87, 
      time: '2h ago',
      department: 'PWD Road Maintenance',
      deptEmail: 'pwd.roads@delhi.gov.in',
      history: [
        { status: 'open', action: 'Complaint registered via NagarAI', time: '2h ago', timestamp: Date.now() - 7200000 },
        { status: 'in_progress', action: 'Assigned to PWD Field Team 4', time: '1h ago', timestamp: Date.now() - 3600000 },
        { status: 'in_progress', action: 'On-site inspection completed', time: '30m ago', timestamp: Date.now() - 1800000 }
      ]
    },
    { 
      id: '2', 
      title: 'Overflowing garbage near market', 
      category: 'garbage', 
      location: 'Lajpat Nagar', 
      status: 'open', 
      priority: 'high', 
      score: 71, 
      time: '5h ago',
      department: 'MCD Sanitation Dept',
      deptEmail: 'mcd.sanitation@delhi.gov.in',
      history: [
        { status: 'open', action: 'Complaint registered via NagarAI', time: '5h ago', timestamp: Date.now() - 18000000 }
      ]
    },
    { 
      id: '3', 
      title: 'Street light not working', 
      category: 'electricity', 
      location: 'Karol Bagh', 
      status: 'resolved', 
      priority: 'medium', 
      score: 45, 
      time: '1d ago',
      department: 'BSES Yamuna Power',
      deptEmail: 'bses.yamuna@delhi.gov.in',
      history: [
        { status: 'open', action: 'Complaint registered via NagarAI', time: '1d ago', timestamp: Date.now() - 86400000 },
        { status: 'in_progress', action: 'Technician dispatched', time: '20h ago', timestamp: Date.now() - 72000000 },
        { status: 'resolved', action: 'Bulb replaced and tested', time: '18h ago', timestamp: Date.now() - 64800000 }
      ]
    },
  ];

  let events = [
    {
      id: 'e0',
      title: 'LIVE: Urban Mobility Summit',
      category: 'technical',
      date: 'Today',
      time: 'Happening Now',
      location: 'Vigyan Bhawan, Delhi',
      description: 'Live discussion on the future of transport in Delhi with urban planners and AI experts.',
      organizer: 'Ministry of Urban Development',
      image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      tags: ['Live', 'Transport', 'AI'],
      isFree: true,
      isLive: true
    },
    {
      id: 'e1',
      title: 'Delhi Smart City Hackathon 2026',
      category: 'hackathon',
      date: 'May 15, 2026',
      time: '09:00 AM',
      location: 'IIT Delhi, Hauz Khas',
      description: 'A 48-hour hackathon to solve urban challenges using AI and IoT. Win prizes up to ₹5 Lakhs.',
      organizer: 'Delhi Government & IIT Delhi',
      image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80',
      tags: ['AI', 'Smart City', 'Innovation'],
      isFree: true,
      registrationUrl: 'https://example.com/hackathon'
    },
    {
      id: 'e2',
      title: 'Dilli Haat Cultural Fest 2026',
      category: 'cultural',
      date: 'April 20, 2026',
      time: '05:00 PM',
      location: 'Dilli Haat, INA',
      description: 'Experience the rich heritage of India through folk dance, music, and crafts from across the country.',
      organizer: 'Delhi Tourism',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
      tags: ['Culture', 'Music', 'Heritage'],
      isFree: false
    },
    {
      id: 'e3',
      title: 'Tech-Delhi Meetup: Web3 & Future',
      category: 'technical',
      date: 'April 25, 2026',
      time: '06:30 PM',
      location: 'Cyber Hub, Gurgaon',
      description: 'Join the leading developers in the city to discuss the future of Web3 and decentralized applications.',
      organizer: 'TechDelhi Community',
      image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      tags: ['Web3', 'Blockchain', 'Networking'],
      isFree: true
    },
    {
      id: 'e4',
      title: 'NagarAI Social Impact Workshop',
      category: 'social',
      date: 'May 02, 2026',
      time: '10:00 AM',
      location: 'India Habitat Centre, Lodhi Road',
      description: 'A workshop focused on using technology for social good and community development.',
      organizer: 'NagarAI Foundation',
      image: 'https://images.unsplash.com/photo-1597041066672-442d61028f44?auto=format&fit=crop&w=800&q=80',
      tags: ['Social Good', 'Workshop', 'Community'],
      isFree: true
    },
    {
      id: 'e5',
      title: 'International Jazz Night 2026',
      category: 'cultural',
      date: 'April 30, 2026',
      time: '08:00 PM',
      location: 'The Piano Man, Safdarjung',
      description: 'An evening of soulful jazz performances by international artists.',
      organizer: 'The Piano Man Jazz Club',
      image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      tags: ['Jazz', 'Music', 'Nightlife'],
      isFree: false
    },
    {
      id: 'e6',
      title: 'Green Delhi Plantation Drive',
      category: 'social',
      date: 'June 05, 2026',
      time: '07:00 AM',
      location: 'Yamuna Bank, Delhi',
      description: 'Join us for a massive tree plantation drive to make Delhi greener and cleaner.',
      organizer: 'Give Me Trees Trust',
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&w=800&q=80',
      tags: ['Environment', 'Social Service', 'Green Delhi'],
      isFree: true
    },
    {
      id: 'e7',
      title: 'IPL 2026: Delhi Capitals vs Mumbai Indians',
      category: 'social',
      date: 'April 15, 2026',
      time: '07:30 PM',
      location: 'Arun Jaitley Stadium, Delhi',
      description: 'Catch the high-octane T20 action live as the home team takes on the five-time champions.',
      organizer: 'BCCI / IPL',
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
      tags: ['Cricket', 'Sports', 'Entertainment'],
      isFree: false
    },
    {
      id: 'e8',
      title: 'Delhi International Film Festival',
      category: 'cultural',
      date: 'May 10, 2026',
      time: '11:00 AM',
      location: 'Siri Fort Auditorium',
      description: 'A celebration of world cinema featuring screenings, workshops, and interactions with renowned filmmakers.',
      organizer: 'DIFF Foundation',
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80',
      tags: ['Cinema', 'Art', 'International'],
      isFree: false
    },
    {
      id: 'e9',
      title: 'Startup India: Delhi Summit',
      category: 'technical',
      date: 'April 22, 2026',
      time: '10:00 AM',
      location: 'Pragati Maidan, New Delhi',
      description: 'The biggest gathering of entrepreneurs, investors, and policy makers in the capital.',
      organizer: 'Ministry of Commerce & Industry',
      image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=800&q=80',
      tags: ['Startup', 'Business', 'Economy'],
      isFree: true
    },
    {
      id: 'e10',
      title: 'Holi Music Festival 2026',
      category: 'cultural',
      date: 'March 25, 2026',
      time: '10:00 AM',
      location: 'Jawaharlal Nehru Stadium',
      description: 'Celebrate the festival of colors with the best DJs, organic colors, and traditional sweets.',
      organizer: 'Sunburn Delhi',
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=800&q=80',
      tags: ['Festival', 'Holi', 'Party'],
      isFree: false
    }
  ];

  const getDeptInfo = (category: string) => {
    const depts: Record<string, { name: string, email: string }> = {
      road: { name: 'PWD Road Maintenance', email: 'pwd.roads@delhi.gov.in' },
      garbage: { name: 'MCD Sanitation Dept', email: 'mcd.sanitation@delhi.gov.in' },
      electricity: { name: 'BSES Yamuna Power', email: 'bses.yamuna@delhi.gov.in' },
      water: { name: 'Delhi Jal Board', email: 'djb.water@delhi.gov.in' },
      other: { name: 'Civic Grievance Cell', email: 'civic.cell@delhi.gov.in' }
    };
    return depts[category] || depts.other;
  };

  // API Routes
  app.get("/api/complaints", (req, res) => {
    try {
      res.json(complaints);
    } catch (error) {
      console.error("Complaints error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/complaints/:id", (req, res) => {
    try {
      const complaint = complaints.find(c => c.id === req.params.id);
      if (!complaint) return res.status(404).json({ error: "Complaint not found" });
      res.json(complaint);
    } catch (error) {
      console.error("Complaint detail error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/events", (req, res) => {
    try {
      res.json(events);
    } catch (error) {
      console.error("Events error:", error);
      res.status(500).json({ error: "Failed to fetch events" });
    }
  });

  app.get("/api/notifications", (req, res) => {
    try {
      if (!Array.isArray(complaints)) {
        return res.json([]);
      }
      // Return recent status changes for notifications
      const notifications = complaints.flatMap(c => 
        (Array.isArray(c.history) ? c.history : []).map((h, idx) => ({
          id: `${c.id}-${idx}`,
          complaintId: c.id,
          title: c.title || 'Untitled Complaint',
          action: h.action || 'No action recorded',
          status: h.status || 'unknown',
          time: h.time || 'Unknown',
          timestamp: h.timestamp || 0,
          read: false
        }))
      ).sort((a, b) => b.timestamp - a.timestamp).slice(0, 10);
      res.json(notifications);
    } catch (error) {
      console.error("Notifications error:", error);
      res.status(500).json({ error: "Failed to fetch notifications" });
    }
  });

  app.get("/api/queue-status", (req, res) => {
    try {
      const { location } = req.query;
      
      if (!location) {
        return res.status(400).json({ error: "Location is required" });
      }

      // Simulate real-world data based on location type
      const locationData: Record<string, { base: number, variance: number, serviceRate: number }> = {
      'AIIMS Delhi': { base: 45, variance: 15, serviceRate: 12 },
      'Safdarjung Hospital': { base: 38, variance: 12, serviceRate: 10 },
      'Passport Seva Kendra': { base: 25, variance: 8, serviceRate: 8 },
      'RTO Janakpuri': { base: 20, variance: 10, serviceRate: 6 },
      'New Delhi Railway Station': { base: 50, variance: 20, serviceRate: 15 },
      'ISBT Kashmiri Gate': { base: 40, variance: 15, serviceRate: 12 },
      'Delhi High Court': { base: 15, variance: 5, serviceRate: 5 },
      'Supreme Court of India': { base: 12, variance: 4, serviceRate: 4 },
      'Delhi University (North)': { base: 10, variance: 5, serviceRate: 3 },
      'Sarojini Nagar Market (Parking)': { base: 30, variance: 15, serviceRate: 8 },
      'Lajpat Nagar Market (Parking)': { base: 28, variance: 12, serviceRate: 7 },
      'Connaught Place (Palika Parking)': { base: 35, variance: 10, serviceRate: 9 },
      'Police Headquarters': { base: 8, variance: 3, serviceRate: 4 },
      'Delhi Jal Board': { base: 18, variance: 7, serviceRate: 5 },
      'DTC Headquarters': { base: 14, variance: 6, serviceRate: 4 },
      'Ambedkar University': { base: 6, variance: 3, serviceRate: 2 },
      'JNU Campus': { base: 5, variance: 2, serviceRate: 2 },
      'IIT Delhi': { base: 4, variance: 2, serviceRate: 2 },
      'National Museum': { base: 12, variance: 5, serviceRate: 4 },
      'MCD Civic Centre': { base: 22, variance: 10, serviceRate: 6 },
      'Max Super Speciality': { base: 35, variance: 15, serviceRate: 9 },
      'DDA Head Office': { base: 28, variance: 12, serviceRate: 7 },
      'LNJP Hospital': { base: 42, variance: 18, serviceRate: 11 },
      'Fortis Hospital': { base: 32, variance: 14, serviceRate: 8 },
      'Tihar Jail (Visitor)': { base: 15, variance: 7, serviceRate: 4 },
      'Akshardham Temple': { base: 55, variance: 25, serviceRate: 15 },
      'Delhi Secretariat': { base: 20, variance: 8, serviceRate: 6 },
      'Vikas Minar (DDA)': { base: 24, variance: 10, serviceRate: 7 },
      'Ram Manohar Lohia Hospital': { base: 38, variance: 15, serviceRate: 10 },
      'Guru Teg Bahadur Hospital': { base: 40, variance: 16, serviceRate: 11 },
      'Indira Gandhi International Airport (T3)': { base: 60, variance: 30, serviceRate: 20 },
    };

    const data = locationData[location as string] || { base: 15, variance: 5, serviceRate: 5 };
    const currentCount = Math.floor(data.base + (Math.random() * data.variance * 2 - data.variance));
    
    res.json({
      location,
      count: Math.max(1, currentCount),
      waitTime: Math.max(5, Math.floor(currentCount * (20 / data.serviceRate))),
      load: Math.min(100, Math.floor((currentCount / (data.base + data.variance)) * 100)),
      status: currentCount > data.base + data.variance * 0.5 ? 'critical' : currentCount > data.base ? 'high' : 'normal'
    });
    } catch (error) {
      console.error("Queue status error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/complaints", (req, res) => {
    try {
      const { category } = req.body;
      const deptInfo = getDeptInfo(category);
      const newComplaint = {
        ...req.body,
        id: Date.now().toString(),
        time: 'Just now',
        department: deptInfo.name,
        deptEmail: deptInfo.email,
        history: [
          { status: 'open', action: 'Complaint registered via NagarAI', time: 'Just now', timestamp: Date.now() },
          { status: 'open', action: `Routed to ${deptInfo.name} (${deptInfo.email})`, time: 'Just now', timestamp: Date.now() }
        ]
      };
      complaints.unshift(newComplaint);
      res.status(201).json(newComplaint);
    } catch (error) {
      console.error("Create complaint error:", error);
      res.status(500).json({ error: "Failed to create complaint" });
    }
  });

  app.post("/api/dispatch-daily", (req, res) => {
    try {
      // Simulate finding complaints from last 24h
      // In a real app, we'd check timestamps. Here we just take a subset.
      const recentComplaints = complaints.filter(c => !c.time.includes('d ago'));
      
      // Simulate "sending" email
      console.log(`[DISPATCH] Sending ${recentComplaints.length} complaints to gov-portal@delhi.gov.in`);
      
      res.json({ 
        success: true, 
        count: recentComplaints.length,
        targetEmail: 'gov-portal@delhi.gov.in',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Dispatch error:", error);
      res.status(500).json({ error: "Failed to dispatch" });
    }
  });

  // Learning Portal Data
  const categories = [
    { id: 'jee', title: 'JEE Preparation', description: 'Master Physics, Chemistry, and Maths for JEE Main & Advanced.', thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80', icon: 'GraduationCap' },
    { id: 'neet', title: 'NEET Preparation', description: 'Comprehensive Biology, Physics, and Chemistry for Medical aspirants.', thumbnail: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80', icon: 'Activity' },
    { id: 'class10', title: 'Class 10 Boards', description: 'Complete syllabus coverage for Class 10 Board exams.', thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80', icon: 'BookOpen' },
    { id: 'class12', title: 'Class 12 Boards', description: 'In-depth preparation for Class 12 Board exams and competitive basics.', thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&q=80', icon: 'Book' },
    { id: 'skills', title: 'Skill Development', description: 'Learn Coding, AI, Communication, and more for the future.', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', icon: 'Zap' },
    { id: 'upsc', title: 'UPSC Civil Services', description: 'Comprehensive preparation for IAS, IPS, and other civil services.', thumbnail: 'https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&w=800&q=80', icon: 'ShieldCheck' },
    { id: 'finance', title: 'Financial Literacy', description: 'Master Personal Finance, Stock Markets, and Wealth Management.', thumbnail: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=800&q=80', icon: 'TrendingUp' },
    { id: 'marketing', title: 'Digital Marketing', description: 'Learn SEO, SEM, Social Media, and Content Strategy.', thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80', icon: 'BarChart3' },
    { id: 'cyber', title: 'Cyber Security', description: 'Protect digital assets with Ethical Hacking and Network Security.', thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80', icon: 'ShieldCheck' }
  ];

  const courses = [
    // JEE Preparation
    {
      id: 'jee-p1',
      categoryId: 'jee',
      title: 'JEE Physics: Mechanics Masterclass',
      description: 'Comprehensive coverage of Mechanics for JEE Main & Advanced. From Kinematics to Rotational Dynamics.',
      thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
      instructor: 'Alakh Pandey (PW)',
      level: 'Advanced',
      duration: '45 Hours',
      lectures: [
        { 
          id: 'jee-p1-l1', 
          courseId: 'jee-p1', 
          title: 'Introduction to Vectors', 
          duration: '52m', 
          order: 1,
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Theory: The Nature of Vectors</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  In Physics, quantities are broadly classified into <strong>Scalars</strong> and <strong>Vectors</strong>. While scalars only require magnitude (e.g., mass, time), vectors demand both magnitude and a specific direction (e.g., force, velocity).
                </p>
                <div class="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-2xl mb-6">
                  <h4 class="font-bold text-blue-900 mb-2">Key Properties:</h4>
                  <ul class="list-disc pl-5 space-y-2 text-blue-800">
                    <li><strong>Commutative Law:</strong> A + B = B + A</li>
                    <li><strong>Associative Law:</strong> (A + B) + C = A + (B + C)</li>
                    <li><strong>Unit Vector:</strong> A vector with magnitude 1, denoted as â = A / |A|.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Vector Operations</h3>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-3">Dot Product (Scalar)</h4>
                    <p class="text-sm text-slate-600 mb-4">A · B = |A||B| cosθ</p>
                    <p class="text-xs text-slate-500 italic">Used for calculating Work Done (W = F · d).</p>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-3">Cross Product (Vector)</h4>
                    <p class="text-sm text-slate-600 mb-4">A × B = |A||B| sinθ n̂</p>
                    <p class="text-xs text-slate-500 italic">Used for Torque (τ = r × F).</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Numerical Masterclass</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: A force F = 5i + 2j - 3k acts on a particle, displacing it from r1 = i + j to r2 = 3i + 4j. Find the work done.</p>
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Step 1</span>
                      <p class="text-sm font-medium text-slate-600">Find Displacement: Δr = r2 - r1 = (3-1)i + (4-1)j = 2i + 3j</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Step 2</span>
                      <p class="text-sm font-medium text-slate-600">Work = F · Δr = (5)(2) + (2)(3) + (-3)(0) = 10 + 6 = 16 Joules</p>
                    </div>
                    <div class="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p class="text-emerald-900 font-black">Final Answer: 16 J</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">4. Practice Questions (Self-Assessment)</h3>
                <div class="space-y-4">
                  <div class="p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <p class="text-sm font-bold text-slate-800">1. Find the angle between A = i + j and B = i - j.</p>
                    <p class="text-xs text-slate-400 mt-1">Hint: Use the Dot Product formula.</p>
                  </div>
                  <div class="p-5 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-colors">
                    <p class="text-sm font-bold text-slate-800">2. If |A + B| = |A - B|, what is the angle between A and B?</p>
                    <p class="text-xs text-slate-400 mt-1">Difficulty: JEE Main Level</p>
                  </div>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4 flex items-center gap-3">
                  <span class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-xs">📝</span>
                  Quick Revision Notes
                </h3>
                <ul class="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
                  <li class="flex gap-2"><span class="text-blue-500">●</span> Magnitude of A = √(Ax² + Ay² + Az²)</li>
                  <li class="flex gap-2"><span class="text-blue-500">●</span> Two vectors are parallel if A × B = 0</li>
                  <li class="flex gap-2"><span class="text-blue-500">●</span> Two vectors are perpendicular if A · B = 0</li>
                  <li class="flex gap-2"><span class="text-blue-500">●</span> Maximum value of A + B is |A| + |B|</li>
                </ul>
              </section>
            </div>
          `
        },
        { 
          id: 'jee-p1-l2', 
          courseId: 'jee-p1', 
          title: 'Laws of Motion - Part 1', 
          duration: '58m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Newton's First Law (Inertia)</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  An object remains in a state of rest or of uniform motion in a straight line unless compelled to change that state by an applied force.
                </p>
                <div class="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded-r-2xl mb-6">
                  <h4 class="font-bold text-indigo-900 mb-2">Types of Inertia:</h4>
                  <ul class="list-disc pl-5 space-y-2 text-indigo-800 text-sm">
                    <li><strong>Inertia of Rest:</strong> Tendency to remain at rest.</li>
                    <li><strong>Inertia of Motion:</strong> Tendency to maintain uniform velocity.</li>
                    <li><strong>Inertia of Direction:</strong> Tendency to maintain a specific direction.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Newton's Second Law (F = ma)</h3>
                <p class="text-slate-600 mb-6">The rate of change of momentum of an object is proportional to the applied unbalanced force in the direction of the force.</p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">F = dp/dt = m(dv/dt) = ma</p>
                  <p class="text-xs text-slate-400 mt-2 italic">Note: This form (F=ma) is only valid when mass 'm' is constant.</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Numerical: Pulley-Block System</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: Two masses m1 = 5kg and m2 = 3kg are connected by a string over a frictionless pulley. Find the acceleration of the system.</p>
                  <div class="space-y-4">
                    <div class="flex items-center gap-3">
                      <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Step 1</span>
                      <p class="text-sm font-medium text-slate-600">Equation for m1: m1g - T = m1a</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Step 2</span>
                      <p class="text-sm font-medium text-slate-600">Equation for m2: T - m2g = m2a</p>
                    </div>
                    <div class="flex items-center gap-3">
                      <span class="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase">Step 3</span>
                      <p class="text-sm font-medium text-slate-600">Add equations: (m1 - m2)g = (m1 + m2)a</p>
                    </div>
                    <div class="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p class="text-emerald-900 font-black">a = (5-3)10 / (5+3) = 20/8 = 2.5 m/s²</p>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">📝 Key Notes</h3>
                <ul class="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
                  <li class="flex gap-2"><span class="text-blue-500">●</span> Force is a vector quantity.</li>
                  <li class="flex gap-2"><span class="text-blue-500">●</span> SI Unit: Newton (N) = kg·m/s².</li>
                  <li class="flex gap-2"><span class="text-blue-500">●</span> Impulse = Δp = F · Δt.</li>
                  <li class="flex gap-2"><span class="text-blue-500">●</span> Friction always opposes relative motion.</li>
                </ul>
              </section>
            </div>
          `
        },
        { 
          id: 'jee-p1-l3', 
          courseId: 'jee-p1', 
          title: 'Work, Energy and Power', 
          duration: '64m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Work Done by a Force</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Work is said to be done when a force acts on an object and causes a displacement.
                </p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">W = F · d = |F||d| cosθ</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Kinetic and Potential Energy</h3>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <h4 class="font-bold text-blue-900 mb-2">Kinetic Energy (KE)</h4>
                    <p class="text-sm text-blue-800">Energy due to motion: KE = ½mv²</p>
                  </div>
                  <div class="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <h4 class="font-bold text-amber-900 mb-2">Potential Energy (PE)</h4>
                    <p class="text-sm text-amber-800">Energy due to position: PE = mgh</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Work-Energy Theorem</h3>
                <p class="text-slate-600 mb-4 italic">"The work done by all forces (conservative, non-conservative, internal, external) acting on a particle is equal to the change in its kinetic energy."</p>
                <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                  <p class="text-xl font-black text-emerald-900">W_net = ΔKE = KE_f - KE_i</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">4. Numerical: Variable Force</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: A force F = (3x² + 2x) N acts on a particle. Find the work done in displacing it from x = 0 to x = 2m.</p>
                  <div class="space-y-4">
                    <p class="text-sm text-slate-600">W = ∫ F dx = ∫ (3x² + 2x) dx from 0 to 2</p>
                    <p class="text-sm text-slate-600">W = [x³ + x²] from 0 to 2</p>
                    <p class="text-sm text-slate-600">W = (2³ + 2²) - (0) = 8 + 4 = 12 J</p>
                    <p class="text-emerald-600 font-black">Answer: 12 Joules</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { id: 'jee-p1-l4', courseId: 'jee-p1', title: 'Circular Motion', duration: '55m', order: 4, content: '<h3 class="text-xl font-bold mb-4">Theory: Uniform Circular Motion</h3><p>Motion of an object in a circle at a constant speed.</p>' },
        { id: 'jee-p1-l5', courseId: 'jee-p1', title: 'Rotational Dynamics', duration: '70m', order: 5, content: '<h3 class="text-xl font-bold mb-4">Theory: Moment of Inertia</h3><p>A quantity expressing a body\'s tendency to resist angular acceleration.</p>' }
      ]
    },
    {
      id: 'jee-c1',
      categoryId: 'jee',
      title: 'JEE Chemistry: Organic Fundamentals',
      description: 'Master the core concepts of Organic Chemistry, reaction mechanisms, and IUPAC nomenclature.',
      thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&w=800&q=80',
      instructor: 'Dr. Pankaj Sijairya',
      level: 'Advanced',
      duration: '38 Hours',
      lectures: [
        { 
          id: 'jee-c1-l1', 
          courseId: 'jee-c1', 
          title: 'General Organic Chemistry (GOC)', 
          duration: '72m', 
          order: 1,
          content: `
            <h3 class="text-xl font-bold mb-4">Theory: General Organic Chemistry</h3>
            <p class="mb-4">GOC is the foundation of organic chemistry. It deals with the study of electronic effects and their applications in understanding reaction mechanisms.</p>
            <h4 class="font-bold mb-2">Key Concepts:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li><strong>Inductive Effect:</strong> Permanent displacement of sigma electrons along a saturated carbon chain due to difference in electronegativity.</li>
              <li><strong>Resonance:</strong> Delocalization of pi electrons within a molecule. It provides extra stability.</li>
              <li><strong>Hyperconjugation:</strong> Delocalization of sigma electrons of C-H bond with adjacent empty p-orbital or pi-orbital.</li>
            </ul>
            <h4 class="font-bold mb-2">Numerical/Problem:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: Arrange the following in increasing order of stability: (CH3)3C+, (CH3)2CH+, CH3CH2+, CH3+</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: CH3+ < CH3CH2+ < (CH3)2CH+ < (CH3)3C+</p>
              <p class="text-sm text-slate-500 mt-1">Reason: Stability increases with the number of alpha-hydrogens due to hyperconjugation (+H effect).</p>
            </div>
          `
        },
        { 
          id: 'jee-c1-l2', 
          courseId: 'jee-c1', 
          title: 'Isomerism in Organic Compounds', 
          duration: '65m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Structural Isomerism</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Compounds having the same molecular formula but different connectivity of atoms.
                </p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Chain Isomerism</h4>
                    <p class="text-xs text-slate-500">Difference in carbon skeleton (e.g., n-butane and isobutane).</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Position Isomerism</h4>
                    <p class="text-xs text-slate-500">Difference in position of functional group (e.g., Propan-1-ol and Propan-2-ol).</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Stereoisomerism</h3>
                <div class="space-y-4">
                  <div class="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <h4 class="font-bold text-indigo-900">Geometrical Isomerism (Cis-Trans)</h4>
                    <p class="text-sm text-indigo-800">Occurs due to restricted rotation around double bonds. Cis (same side), Trans (opposite side).</p>
                  </div>
                  <div class="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                    <h4 class="font-bold text-rose-900">Optical Isomerism</h4>
                    <p class="text-sm text-rose-800">Compounds that can rotate plane-polarized light. Requires a <strong>Chiral Carbon</strong> (4 different groups attached).</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practice Question</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: How many structural isomers are possible for C4H10O (Alcohols only)?</p>
                  <div class="space-y-2 text-sm text-slate-600">
                    <p>1. Butan-1-ol</p>
                    <p>2. Butan-2-ol</p>
                    <p>3. 2-Methylpropan-1-ol</p>
                    <p>4. 2-Methylpropan-2-ol</p>
                    <p class="text-emerald-600 font-black mt-4">Answer: 4</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'jee-c1-l3', 
          courseId: 'jee-c1', 
          title: 'Reaction Mechanisms', 
          duration: '80m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Nucleophilic Substitution (SN1 vs SN2)</h3>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-2">SN1 Mechanism</h4>
                    <ul class="text-xs text-slate-600 space-y-1">
                      <li>● Two-step process</li>
                      <li>● Formation of Carbocation</li>
                      <li>● Racemization occurs</li>
                      <li>● Order: 3° > 2° > 1°</li>
                    </ul>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900 mb-2">SN2 Mechanism</h4>
                    <ul class="text-xs text-slate-600 space-y-1">
                      <li>● Single-step (Concerted)</li>
                      <li>● Walden Inversion</li>
                      <li>● No intermediate</li>
                      <li>● Order: 1° > 2° > 3°</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Electrophilic Addition</h3>
                <p class="text-slate-600 mb-4">Common in Alkenes. Follows <strong>Markownikoff's Rule</strong>: The negative part of the addendum goes to the carbon with fewer hydrogen atoms.</p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <p class="text-sm text-blue-800 font-bold">Example: CH3-CH=CH2 + HBr → CH3-CH(Br)-CH3 (Major)</p>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">💡 JEE Advanced Concept: Rearrangement</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  In SN1 or E1 reactions, if a more stable carbocation can be formed via <strong>1,2-Hydride shift</strong> or <strong>1,2-Methyl shift</strong>, it will always happen before the final product is formed.
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'jee-m1',
      categoryId: 'jee',
      title: 'JEE Maths: Calculus for Advanced',
      description: 'Deep dive into Differential and Integral Calculus for JEE Advanced level problem solving.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sachin Sir (PW)',
      level: 'Advanced',
      duration: '50 Hours',
      lectures: [
        { 
          id: 'jee-m1-l1', 
          courseId: 'jee-m1', 
          title: 'Limits, Continuity & Differentiability', 
          duration: '80m', 
          order: 1,
          content: `
            <h3 class="text-xl font-bold mb-4">Theory: Limits and Continuity</h3>
            <p class="mb-4">A function f(x) is said to be continuous at x = a if LHL = RHL = f(a).</p>
            <h4 class="font-bold mb-2">Standard Limits:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li>lim (x->0) sin(x)/x = 1</li>
              <li>lim (x->0) (e^x - 1)/x = 1</li>
              <li>lim (x->0) log(1+x)/x = 1</li>
            </ul>
            <h4 class="font-bold mb-2">Numerical/Problem:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: Evaluate lim (x->0) (1 - cos(2x)) / x^2</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: 2</p>
              <p class="text-sm text-slate-500 mt-1">Solution: Use 1 - cos(2x) = 2sin^2(x). So, lim 2sin^2(x)/x^2 = 2 * (lim sinx/x)^2 = 2 * 1^2 = 2.</p>
            </div>
          `
        },
        { 
          id: 'jee-m1-l2', 
          courseId: 'jee-m1', 
          title: 'Application of Derivatives', 
          duration: '75m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Tangents and Normals</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  The derivative dy/dx at a point (x1, y1) represents the slope of the tangent to the curve at that point.
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3">
                  <p class="text-sm text-blue-800"><strong>Equation of Tangent:</strong> y - y1 = m(x - x1)</p>
                  <p class="text-sm text-blue-800"><strong>Equation of Normal:</strong> y - y1 = (-1/m)(x - x1)</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Maxima and Minima</h3>
                <div class="space-y-4">
                  <p class="text-slate-600 text-sm">To find local extrema of f(x):</p>
                  <ol class="list-decimal pl-5 space-y-2 text-sm text-slate-600">
                    <li>Find f'(x) and set it to 0 to get critical points.</li>
                    <li>Use the <strong>Second Derivative Test</strong>:
                      <ul class="list-disc pl-5 mt-1">
                        <li>If f''(c) > 0, then f(c) is a local minimum.</li>
                        <li>If f''(c) < 0, then f(c) is a local maximum.</li>
                      </ul>
                    </li>
                  </ol>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Numerical: Rate of Change</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: The radius of a circle is increasing at the rate of 3 cm/s. Find the rate of increase of its area when r = 10 cm.</p>
                  <div class="space-y-4">
                    <p class="text-sm text-slate-600">A = πr²</p>
                    <p class="text-sm text-slate-600">dA/dt = 2πr (dr/dt)</p>
                    <p class="text-sm text-slate-600">dA/dt = 2π(10)(3) = 60π cm²/s</p>
                    <p class="text-emerald-600 font-black">Answer: 60π cm²/s</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'jee-m1-l3', 
          courseId: 'jee-m1', 
          title: 'Definite Integration', 
          duration: '90m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Fundamental Theorem of Calculus</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  If F(x) is the antiderivative of f(x), then the integral from a to b of f(x) dx is F(b) - F(a).
                </p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">∫[a to b] f(x) dx = F(b) - F(a)</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Properties of Definite Integrals</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">King's Property</h4>
                    <p class="text-xs text-slate-500">∫[a to b] f(x) dx = ∫[a to b] f(a+b-x) dx</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Even/Odd Property</h4>
                    <p class="text-xs text-slate-500">If f(-x) = -f(x), then ∫[-a to a] f(x) dx = 0</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Numerical: Area Under Curve</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: Find the area bounded by y = x² and y = x.</p>
                  <div class="space-y-4">
                    <p class="text-sm text-slate-600">Points of intersection: x² = x ⇒ x = 0, 1</p>
                    <p class="text-sm text-slate-600">Area = ∫[0 to 1] (x - x²) dx</p>
                    <p class="text-sm text-slate-600">Area = [x²/2 - x³/3] from 0 to 1 = 1/2 - 1/3 = 1/6</p>
                    <p class="text-emerald-600 font-black">Answer: 1/6 sq. units</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { id: 'jee-m1-l4', courseId: 'jee-m1', title: 'Differential Equations', duration: '85m', order: 4, content: '<h3 class="text-xl font-bold mb-4">Theory: Differential Equations</h3><p>Equations involving derivatives of an unknown function.</p>' }
      ]
    },
    {
      id: 'jee-p2',
      categoryId: 'jee',
      title: 'JEE Physics: Electromagnetism (Part 1)',
      description: 'Master Electrostatics, Current Electricity, and Magnetism for JEE.',
      thumbnail: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
      instructor: 'Alakh Pandey (PW)',
      level: 'Advanced',
      duration: '40 Hours',
      lectures: [
        { 
          id: 'jee-p2-l1', 
          courseId: 'jee-p2', 
          title: 'Electric Charges & Fields', 
          duration: '65m', 
          order: 1,
          content: `
            <h3 class="text-xl font-bold mb-4">Theory: Electrostatics</h3>
            <p class="mb-4">Electrostatics is the study of stationary electric charges.</p>
            <h4 class="font-bold mb-2">Coulomb's Law:</h4>
            <p class="mb-4">F = k * |q1 * q2| / r², where k is Coulomb's constant.</p>
            <h4 class="font-bold mb-2">Numerical Problem:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: Calculate the force between two charges of 1C each separated by 1m in vacuum.</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: 9 × 10⁹ N</p>
              <p class="text-sm text-slate-500 mt-1">Solution: F = (9 × 10⁹ * 1 * 1) / 1² = 9 × 10⁹ N.</p>
            </div>
          `
        },
        { id: 'jee-p2-l2', courseId: 'jee-p2', title: 'Current Electricity', duration: '70m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Ohm\'s Law</h3><p>V = IR, where V is voltage, I is current, and R is resistance.</p>' }
      ]
    },

    // NEET Preparation
    {
      id: 'neet-b1',
      categoryId: 'neet',
      title: 'NEET Biology: Human Physiology (Part 1)',
      description: 'Detailed exploration of human body systems, vital for NEET aspirants.',
      thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=800&q=80',
      instructor: 'Dr. Samapti Mam',
      level: 'Intermediate',
      duration: '42 Hours',
      lectures: [
        { 
          id: 'neet-b1-l1', 
          courseId: 'neet-b1', 
          title: 'Digestion and Absorption', 
          duration: '55m', 
          order: 1,
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Overview of the Digestive System</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  The human digestive system consists of the <strong>Alimentary Canal</strong> and the <strong>Associated Glands</strong>. The alimentary canal begins with an anterior opening—the mouth, and it opens out posteriorly through the anus.
                </p>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                    <h4 class="font-bold text-rose-900 mb-2">The Mouth & Buccal Cavity</h4>
                    <p class="text-sm text-rose-800">Contains teeth and a muscular tongue. Humans have <strong>Thecodont</strong> (teeth embedded in sockets), <strong>Diphyodont</strong> (two sets of teeth), and <strong>Heterodont</strong> (different types of teeth) dentition.</p>
                  </div>
                  <div class="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                    <h4 class="font-bold text-rose-900 mb-2">The Stomach</h4>
                    <p class="text-sm text-rose-800">A J-shaped muscular bag. It has four parts: Cardiac, Fundic, Body, and Pyloric. It secretes HCl and proenzyme Pepsinogen.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Histology of Alimentary Canal</h3>
                <p class="text-slate-600 mb-4">The wall of the alimentary canal from esophagus to rectum possesses four layers:</p>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8">
                  <ul class="space-y-4">
                    <li class="flex items-center gap-4">
                      <span class="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">1</span>
                      <div>
                        <p class="font-bold text-slate-900">Serosa</p>
                        <p class="text-xs text-slate-500">Outermost layer made of thin mesothelium.</p>
                      </div>
                    </li>
                    <li class="flex items-center gap-4">
                      <span class="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">2</span>
                      <div>
                        <p class="font-bold text-slate-900">Muscularis</p>
                        <p class="text-xs text-slate-500">Inner circular and outer longitudinal smooth muscles.</p>
                      </div>
                    </li>
                    <li class="flex items-center gap-4">
                      <span class="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">3</span>
                      <div>
                        <p class="font-bold text-slate-900">Sub-mucosa</p>
                        <p class="text-xs text-slate-500">Loose connective tissue containing nerves and vessels.</p>
                      </div>
                    </li>
                    <li class="flex items-center gap-4">
                      <span class="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-bold">4</span>
                      <div>
                        <p class="font-bold text-slate-900">Mucosa</p>
                        <p class="text-xs text-slate-500">Innermost lining, forms rugae in stomach and villi in small intestine.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. NEET High-Yield Facts</h3>
                <div class="bg-slate-900 text-white p-10 rounded-[3rem]">
                  <div class="grid md:grid-cols-2 gap-8">
                    <div class="space-y-2">
                      <p class="text-rose-400 font-black uppercase text-[10px] tracking-widest">Dental Formula</p>
                      <p class="text-2xl font-bold">2123 / 2123</p>
                      <p class="text-xs text-slate-400">Adult Human: 2 Incisors, 1 Canine, 2 Premolars, 3 Molars.</p>
                    </div>
                    <div class="space-y-2">
                      <p class="text-rose-400 font-black uppercase text-[10px] tracking-widest">Small Intestine</p>
                      <p class="text-2xl font-bold">Duodenum, Jejunum, Ileum</p>
                      <p class="text-xs text-slate-400">Ileum is the highly coiled part where max absorption occurs.</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">4. Practice Questions</h3>
                <div class="space-y-4">
                  <div class="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <p class="font-bold text-slate-800">Q1. Which of the following is the correct sequence of layers in the wall of the alimentary canal from outside to inside?</p>
                    <p class="text-sm text-blue-600 mt-2">A) Serosa → Muscularis → Sub-mucosa → Mucosa</p>
                  </div>
                  <div class="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm">
                    <p class="font-bold text-slate-800">Q2. The J-shaped bag-like structure of the alimentary canal is?</p>
                    <p class="text-sm text-blue-600 mt-2">A) Stomach</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'neet-b1-l2', 
          courseId: 'neet-b1', 
          title: 'Breathing and Exchange of Gases', 
          duration: '60m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Mechanism of Breathing</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Breathing involves two stages: <strong>Inspiration</strong> (atmospheric air is drawn in) and <strong>Expiration</strong> (alveolar air is released out).
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 class="font-bold text-blue-900 mb-2">Key Muscles Involved:</h4>
                  <ul class="list-disc pl-5 space-y-2 text-blue-800 text-sm">
                    <li><strong>Diaphragm:</strong> Contraction increases thoracic volume.</li>
                    <li><strong>External Intercostal Muscles:</strong> Lift ribs and sternum.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Respiratory Volumes and Capacities</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Tidal Volume (TV)</h4>
                    <p class="text-xs text-slate-500">Volume of air inspired or expired during normal respiration (~500 mL).</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Vital Capacity (VC)</h4>
                    <p class="text-xs text-slate-500">Maximum volume of air a person can breathe in after a forced expiration.</p>
                  </div>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">💡 NEET High-Yield: Oxygen Dissociation Curve</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  The curve is <strong>Sigmoid</strong>. Factors shifting the curve to the <strong>RIGHT</strong> (decreasing affinity of Hb for O2):
                  <br/>● High pCO2
                  <br/>● High H+ concentration (Low pH)
                  <br/>● High Temperature
                </p>
              </section>
            </div>
          `
        },
        { 
          id: 'neet-b1-l3', 
          courseId: 'neet-b1', 
          title: 'Body Fluids and Circulation', 
          duration: '65m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Composition of Blood</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Blood is a special connective tissue consisting of a fluid matrix, plasma, and formed elements.
                </p>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                    <h4 class="font-bold text-rose-900">RBCs</h4>
                    <p class="text-[10px] text-rose-800">Erythrocytes (Transport O2)</p>
                  </div>
                  <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                    <h4 class="font-bold text-blue-900">WBCs</h4>
                    <p class="text-[10px] text-blue-800">Leukocytes (Immunity)</p>
                  </div>
                  <div class="p-4 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                    <h4 class="font-bold text-amber-900">Platelets</h4>
                    <p class="text-[10px] text-amber-800">Thrombocytes (Clotting)</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. The Cardiac Cycle</h3>
                <p class="text-slate-600 mb-4">The sequential event in the heart which is cyclically repeated is called the cardiac cycle. It lasts for <strong>0.8 seconds</strong>.</p>
                <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <ul class="space-y-2 text-sm text-slate-600">
                    <li>● <strong>Joint Diastole:</strong> All four chambers are in a relaxed state (0.4s).</li>
                    <li>● <strong>Atrial Systole:</strong> Contraction of atria (0.1s).</li>
                    <li>● <strong>Ventricular Systole:</strong> Contraction of ventricles (0.3s).</li>
                  </ul>
                </div>
              </section>

              <section class="bg-rose-600 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">🩸 Fact Check: Blood Groups</h3>
                <p class="text-rose-100 text-sm leading-relaxed">
                  <strong>ABO Grouping:</strong> Based on presence or absence of two surface antigens on RBCs (A and B).
                  <br/>● Universal Donor: <strong>O negative</strong>
                  <br/>● Universal Recipient: <strong>AB positive</strong>
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'neet-p1',
      categoryId: 'neet',
      title: 'NEET Physics: Ray Optics',
      description: 'Master the principles of light, reflection, and refraction for NEET.',
      thumbnail: 'https://images.unsplash.com/photo-1514373941175-0a141072bbc8?auto=format&fit=crop&w=800&q=80',
      instructor: 'MR Sir',
      level: 'Intermediate',
      duration: '30 Hours',
      lectures: [
        { 
          id: 'neet-p1-l1', 
          courseId: 'neet-p1', 
          title: 'Reflection of Light', 
          duration: '50m', 
          order: 1,
          content: `
            <h3 class="text-xl font-bold mb-4">Theory: Reflection of Light</h3>
            <p class="mb-4">Reflection is the change in direction of a wavefront at an interface between two different media so that the wavefront returns into the medium from which it originated.</p>
            <h4 class="font-bold mb-2">Laws of Reflection:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li>The incident ray, the reflected ray and the normal to the reflection surface at the point of the incidence lie in the same plane.</li>
              <li>The angle which the incident ray makes with the normal is equal to the angle which the reflected ray makes with the same normal. (∠i = ∠r)</li>
            </ul>
            <h4 class="font-bold mb-2">Numerical Problem:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: If an object is placed 10cm in front of a plane mirror, what is the distance between the object and its image?</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: 20cm</p>
              <p class="text-sm text-slate-500 mt-1">Reason: In a plane mirror, image distance = object distance. So, total distance = 10 + 10 = 20cm.</p>
            </div>
          `
        },
        { id: 'neet-p1-l2', courseId: 'neet-p1', title: 'Refraction & Lenses', duration: '55m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Snell\'s Law</h3><p>n1 sinθ1 = n2 sinθ2, where n is refractive index.</p>' },
        { id: 'neet-p1-l3', courseId: 'neet-p1', title: 'Optical Instruments', duration: '60m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Simple Microscope</h3><p>A simple microscope is a convex lens of short focal length.</p>' }
      ]
    },
    {
      id: 'neet-c1',
      categoryId: 'neet',
      title: 'NEET Chemistry: Chemical Bonding',
      description: 'Understand the forces that hold atoms together in molecules.',
      thumbnail: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sudhanshu Sir (PW)',
      level: 'Intermediate',
      duration: '25 Hours',
      lectures: [
        { 
          id: 'neet-c1-l1', 
          courseId: 'neet-c1', 
          title: 'Ionic & Covalent Bonding', 
          duration: '60m', 
          order: 1,
          content: `
            <h3 class="text-xl font-bold mb-4">Theory: Chemical Bonding</h3>
            <p class="mb-4">Chemical bonding is the physical process responsible for the attractive interactions between atoms and molecules.</p>
            <h4 class="font-bold mb-2">Types of Bonds:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li><strong>Ionic Bond:</strong> Formed by complete transfer of electrons from one atom to another.</li>
              <li><strong>Covalent Bond:</strong> Formed by mutual sharing of electrons between atoms.</li>
              <li><strong>Coordinate Bond:</strong> A type of covalent bond where both shared electrons come from the same atom.</li>
            </ul>
            <h4 class="font-bold mb-2">Numerical/Problem:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: Which of the following has the highest lattice energy? LiF, NaCl, KBr, CsI</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: LiF</p>
              <p class="text-sm text-slate-500 mt-1">Reason: Lattice energy is inversely proportional to the size of ions. Li+ and F- are the smallest ions.</p>
            </div>
          `
        },
        { id: 'neet-c1-l2', courseId: 'neet-c1', title: 'VSEPR Theory', duration: '55m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: VSEPR Theory</h3><p>Valence Shell Electron Pair Repulsion theory used to predict the geometry of individual molecules.</p>' },
        { id: 'neet-c1-l3', courseId: 'neet-c1', title: 'Molecular Orbital Theory', duration: '65m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Molecular Orbital Theory</h3><p>A method for describing the electronic structure of molecules using quantum mechanics.</p>' }
      ]
    },
    {
      id: 'neet-b2',
      categoryId: 'neet',
      title: 'NEET Biology: Genetics & Evolution',
      description: 'Master the principles of inheritance and the history of life.',
      thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
      instructor: 'Dr. Samapti Mam (PW)',
      level: 'Advanced',
      duration: '45 Hours',
      lectures: [
        { 
          id: 'neet-b2-l1', 
          courseId: 'neet-b2', 
          title: 'Mendelian Genetics', 
          duration: '70m', 
          order: 1,
          content: `
            <h3 class="text-xl font-bold mb-4">Theory: Mendelian Genetics</h3>
            <p class="mb-4">Gregor Mendel, the father of genetics, conducted hybridization experiments on garden peas (Pisum sativum) for seven years.</p>
            <h4 class="font-bold mb-2">Mendel's Laws:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li><strong>Law of Dominance:</strong> In a heterozygote, one trait will conceal the presence of another trait for the same characteristic.</li>
              <li><strong>Law of Segregation:</strong> During gamete formation, the alleles for each gene segregate from each other so that each gamete carries only one allele for each gene.</li>
              <li><strong>Law of Independent Assortment:</strong> Genes for different traits can segregate independently during the formation of gametes.</li>
            </ul>
            <h4 class="font-bold mb-2">Numerical/Problem:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: What is the phenotypic ratio of a dihybrid cross in F2 generation?</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: 9:3:3:1</p>
              <p class="text-sm text-slate-500 mt-1">Explanation: This ratio represents the distribution of four possible phenotypes resulting from the independent assortment of two pairs of alleles.</p>
            </div>
          `
        },
        { id: 'neet-b2-l2', courseId: 'neet-b2', title: 'Molecular Basis of Inheritance', duration: '80m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Molecular Basis of Inheritance</h3><p>Study of genes at the molecular level, including DNA replication, transcription, and translation.</p>' }
      ]
    },

    // Class 10 Boards
    {
      id: 'c10-m1',
      categoryId: 'class10',
      title: 'Class 10 Maths: Full Board Prep (Algebra)',
      description: 'Complete syllabus coverage for Class 10 Mathematics Board Exams.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sunil Sir',
      level: 'Beginner',
      duration: '35 Hours',
      lectures: [
        { 
          id: 'c10-m1-l1', 
          courseId: 'c10-m1', 
          title: 'Real Numbers', 
          duration: '45m', 
          order: 1,
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Euclid's Division Lemma</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  For any two positive integers <strong>a</strong> and <strong>b</strong>, there exist unique integers <strong>q</strong> and <strong>r</strong> such that:
                  <br/><br/>
                  <span class="text-xl font-black text-blue-600">a = bq + r, where 0 ≤ r < b</span>
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 class="font-bold text-blue-900 mb-2">Fundamental Theorem of Arithmetic:</h4>
                  <p class="text-sm text-blue-800">Every composite number can be expressed as a product of primes, and this factorization is unique, apart from the order in which the prime factors occur.</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Step-by-Step Numerical</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-6 italic">Q: Find the HCF of 4052 and 12576 using Euclid's Division Algorithm.</p>
                  <div class="space-y-4">
                    <div class="flex items-start gap-4">
                      <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">1</div>
                      <p class="text-sm text-slate-600">12576 = 4052 × 3 + 420</p>
                    </div>
                    <div class="flex items-start gap-4">
                      <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">2</div>
                      <p class="text-sm text-slate-600">4052 = 420 × 9 + 272</p>
                    </div>
                    <div class="flex items-start gap-4">
                      <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">3</div>
                      <p class="text-sm text-slate-600">420 = 272 × 1 + 148</p>
                    </div>
                    <div class="flex items-start gap-4">
                      <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">4</div>
                      <p class="text-sm text-slate-600">272 = 148 × 1 + 124</p>
                    </div>
                    <div class="flex items-start gap-4">
                      <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">5</div>
                      <p class="text-sm text-slate-600">148 = 124 × 1 + 24</p>
                    </div>
                    <div class="flex items-start gap-4">
                      <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">6</div>
                      <p class="text-sm text-slate-600">124 = 24 × 5 + 4</p>
                    </div>
                    <div class="flex items-start gap-4">
                      <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold shrink-0">7</div>
                      <p class="text-sm text-slate-600">24 = 4 × 6 + 0</p>
                    </div>
                    <div class="mt-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                      <p class="text-emerald-900 font-black">HCF = 4</p>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">📝 Board Exam Tips</h3>
                <ul class="space-y-3 text-sm text-slate-400">
                  <li class="flex gap-2"><span class="text-blue-500">✔</span> Always write the formula (a = bq + r) before starting the steps.</li>
                  <li class="flex gap-2"><span class="text-blue-500">✔</span> Mention the condition 0 ≤ r < b to score full marks.</li>
                  <li class="flex gap-2"><span class="text-blue-500">✔</span> For irrationality proofs (e.g., √2 is irrational), use the method of contradiction.</li>
                </ul>
              </section>
            </div>
          `
        },
        { 
          id: 'c10-m1-l2', 
          courseId: 'c10-m1', 
          title: 'Polynomials', 
          duration: '50m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Relationship between Zeroes and Coefficients</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  For a quadratic polynomial <strong>ax² + bx + c</strong>, if α and β are its zeroes:
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3">
                  <p class="text-sm text-blue-800 font-bold">Sum of zeroes (α + β) = -b/a</p>
                  <p class="text-sm text-blue-800 font-bold">Product of zeroes (αβ) = c/a</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Numerical: Finding Zeroes</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: Find the zeroes of x² - 2x - 8 and verify the relationship.</p>
                  <div class="space-y-4">
                    <p class="text-sm text-slate-600">x² - 4x + 2x - 8 = 0</p>
                    <p class="text-sm text-slate-600">x(x - 4) + 2(x - 4) = 0 ⇒ (x - 4)(x + 2) = 0</p>
                    <p class="text-sm text-slate-600">Zeroes: α = 4, β = -2</p>
                    <p class="text-sm text-slate-600">Sum: 4 + (-2) = 2; -b/a = -(-2)/1 = 2 (Verified)</p>
                    <p class="text-emerald-600 font-black">Answer: α = 4, β = -2</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'c10-m1-l3', 
          courseId: 'c10-m1', 
          title: 'Quadratic Equations', 
          duration: '55m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The Quadratic Formula</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  For a quadratic equation <strong>ax² + bx + c = 0</strong>, the roots are given by:
                </p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">x = [-b ± √(b² - 4ac)] / 2a</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Nature of Roots</h3>
                <p class="text-slate-600 mb-4">The value <strong>D = b² - 4ac</strong> is called the Discriminant.</p>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                    <h4 class="font-bold text-emerald-900">D > 0</h4>
                    <p class="text-[10px] text-emerald-800">Two distinct real roots</p>
                  </div>
                  <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                    <h4 class="font-bold text-blue-900">D = 0</h4>
                    <p class="text-[10px] text-blue-800">Two equal real roots</p>
                  </div>
                  <div class="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-center">
                    <h4 class="font-bold text-rose-900">D < 0</h4>
                    <p class="text-[10px] text-rose-800">No real roots</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'c10-s1',
      categoryId: 'class10',
      title: 'Class 10 Science: Chemical Reactions',
      description: 'Understand the core concepts of chemical reactions and equations.',
      thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&w=800&q=80',
      instructor: 'Rakshita Mam (PW)',
      level: 'Beginner',
      duration: '28 Hours',
      lectures: [
        { 
          id: 'c10-s1-l1', 
          courseId: 'c10-s1', 
          title: 'Types of Chemical Reactions', 
          duration: '40m', 
          order: 1,
          content: `
            <h3 class="text-xl font-bold mb-4">Theory: Chemical Reactions</h3>
            <p class="mb-4">A chemical reaction is a process that leads to the chemical transformation of one set of chemical substances to another.</p>
            <h4 class="font-bold mb-2">Types of Reactions:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li><strong>Combination Reaction:</strong> Two or more reactants combine to form a single product. (A + B -> AB)</li>
              <li><strong>Decomposition Reaction:</strong> A single reactant breaks down into two or more products. (AB -> A + B)</li>
              <li><strong>Displacement Reaction:</strong> A more reactive element displaces a less reactive element from its compound. (A + BC -> AC + B)</li>
              <li><strong>Double Displacement Reaction:</strong> Exchange of ions between two compounds. (AB + CD -> AD + CB)</li>
            </ul>
            <h4 class="font-bold mb-2">Numerical/Problem:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: Identify the type of reaction: Fe + CuSO4 -> FeSO4 + Cu</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: Displacement Reaction</p>
              <p class="text-sm text-slate-500 mt-1">Reason: Iron (Fe) is more reactive than Copper (Cu) and displaces it from Copper Sulphate solution.</p>
            </div>
          `
        },
        { 
          id: 'c10-s1-l2', 
          courseId: 'c10-s1', 
          title: 'Balancing Chemical Equations', 
          duration: '45m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Why Balance?</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  According to the <strong>Law of Conservation of Mass</strong>, mass can neither be created nor destroyed in a chemical reaction. Thus, the number of atoms of each element must remain the same.
                </p>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Step-by-Step Balancing</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: Balance Fe + H2O → Fe3O4 + H2</p>
                  <div class="space-y-4">
                    <p class="text-sm text-slate-600">Step 1: Balance Fe (3 on RHS) ⇒ 3Fe + H2O → Fe3O4 + H2</p>
                    <p class="text-sm text-slate-600">Step 2: Balance O (4 on RHS) ⇒ 3Fe + 4H2O → Fe3O4 + H2</p>
                    <p class="text-sm text-slate-600">Step 3: Balance H (8 on LHS) ⇒ 3Fe + 4H2O → Fe3O4 + 4H2</p>
                    <p class="text-emerald-600 font-black">Final: 3Fe + 4H2O → Fe3O4 + 4H2</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'c10-s1-l3', 
          courseId: 'c10-s1', 
          title: 'Acids, Bases and Salts', 
          duration: '50m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Indicators and pH Scale</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Acids turn blue litmus red, while bases turn red litmus blue. The <strong>pH scale</strong> (0-14) measures the acidity or alkalinity.
                </p>
                <div class="bg-gradient-to-r from-rose-500 via-slate-200 to-blue-500 h-4 rounded-full mb-2" />
                <div class="flex justify-between text-[10px] font-black text-slate-400">
                  <span>ACIDIC (0)</span>
                  <span>NEUTRAL (7)</span>
                  <span>BASIC (14)</span>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Neutralization Reaction</h3>
                <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center">
                  <p class="text-lg font-bold text-slate-900">Acid + Base → Salt + Water</p>
                  <p class="text-xs text-slate-500 mt-2 italic">Example: HCl + NaOH → NaCl + H2O</p>
                </div>
              </section>
            </div>
          `
        },
        { id: 'c10-s1-l4', courseId: 'c10-s1', title: 'Metals and Non-Metals', duration: '55m', order: 4, content: '<h3 class="text-xl font-bold mb-4">Theory: Metals and Non-Metals</h3><p>Physical and chemical properties of metals and non-metals, and their reactivity series.</p>' }
      ]
    },
    {
      id: 'c10-m2',
      categoryId: 'class10',
      title: 'Class 10 Maths: Trigonometry',
      description: 'Master the basics and applications of Trigonometry for Boards.',
      thumbnail: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sunil Sir (PW)',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { 
          id: 'c10-m2-l1', 
          courseId: 'c10-m2', 
          title: 'Introduction to Trigonometry', 
          duration: '60m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Trigonometric Ratios</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  In a right-angled triangle, we define ratios based on the sides:
                </p>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">sin θ</h4>
                    <p class="text-[10px] text-slate-500">Opposite / Hypotenuse</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">cos θ</h4>
                    <p class="text-[10px] text-slate-500">Adjacent / Hypotenuse</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">tan θ</h4>
                    <p class="text-[10px] text-slate-500">Opposite / Adjacent</p>
                  </div>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">📝 Table of Values</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-xs text-slate-400">
                    <thead>
                      <tr class="border-b border-slate-800">
                        <th class="py-2 text-left">Angle</th>
                        <th class="py-2">0°</th>
                        <th class="py-2">30°</th>
                        <th class="py-2">45°</th>
                        <th class="py-2">60°</th>
                        <th class="py-2">90°</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr class="border-b border-slate-800">
                        <td class="py-2 font-bold text-blue-400">sin θ</td>
                        <td class="py-2 text-center">0</td>
                        <td class="py-2 text-center">1/2</td>
                        <td class="py-2 text-center">1/√2</td>
                        <td class="py-2 text-center">√3/2</td>
                        <td class="py-2 text-center">1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'c10-m2-l2', 
          courseId: 'c10-m2', 
          title: 'Trigonometric Identities', 
          duration: '65m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The Three Fundamental Identities</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  These identities are true for all values of θ where the functions are defined:
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3 font-mono text-sm">
                  <p class="text-blue-800">1. sin²θ + cos²θ = 1</p>
                  <p class="text-blue-800">2. 1 + tan²θ = sec²θ</p>
                  <p class="text-blue-800">3. 1 + cot²θ = cosec²θ</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Proving Identities (Board Strategy)</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: Prove that (sinθ + cosecθ)² + (cosθ + secθ)² = 7 + tan²θ + cot²θ</p>
                  <div class="space-y-4 text-sm text-slate-600">
                    <p>LHS = sin²θ + cosec²θ + 2sinθcosecθ + cos²θ + sec²θ + 2cosθsecθ</p>
                    <p>= (sin²θ + cos²θ) + cosec²θ + sec²θ + 2 + 2</p>
                    <p>= 1 + (1 + cot²θ) + (1 + tan²θ) + 4</p>
                    <p>= 7 + tan²θ + cot²θ = RHS</p>
                    <p class="text-emerald-600 font-black">Hence Proved.</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'c10-ss1',
      categoryId: 'class10',
      title: 'Class 10 Social Science: History',
      description: 'Comprehensive guide to Nationalism in India and Europe.',
      thumbnail: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80',
      instructor: 'Digraj Sir',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { 
          id: 'c10-ss1-l1', 
          courseId: 'c10-ss1', 
          title: 'Nationalism in India', 
          duration: '55m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The First World War and Khilafat</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  The war created a new economic and political situation in India. It led to a huge increase in defense expenditure which was financed by war loans and increasing taxes.
                </p>
                <div class="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                  <h4 class="font-bold text-amber-900 mb-2">Satyagraha:</h4>
                  <p class="text-sm text-amber-800">The idea of satyagraha emphasized the power of truth and the need to search for truth. Gandhiji believed that if the cause was true, physical force was not necessary to fight the oppressor.</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Major Movements</h3>
                <div class="space-y-4">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Non-Cooperation Movement (1921)</h4>
                    <p class="text-xs text-slate-500">Gandhiji proposed that the movement should unfold in stages. It should begin with the surrender of titles that the government awarded.</p>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Civil Disobedience Movement (1930)</h4>
                    <p class="text-xs text-slate-500">Began with the famous <strong>Dandi March</strong>. Gandhiji reached Dandi and ceremonially violated the law, manufacturing salt by boiling sea water.</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { id: 'c10-ss1-l2', courseId: 'c10-ss1', title: 'The Rise of Nationalism in Europe', duration: '60m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: The Rise of Nationalism in Europe</h3><p>The development of nationalism as a force which brought about sweeping changes in the political and mental world of Europe.</p>' }
      ]
    },

    // Class 12 Boards
    {
      id: 'c12-p1',
      categoryId: 'class12',
      title: 'Class 12 Physics: Electrostatics',
      description: 'In-depth study of electric charges and fields for Board exams.',
      thumbnail: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
      instructor: 'Abhishek Sir',
      level: 'Intermediate',
      duration: '32 Hours',
      lectures: [
        { 
          id: 'c12-p1-l1', 
          courseId: 'c12-p1', 
          title: 'Electric Charges & Fields', 
          duration: '55m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Coulomb's Law</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  The force of attraction or repulsion between two stationary point charges is directly proportional to the product of the charges and inversely proportional to the square of the distance between them.
                </p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">F = k q1q2 / r²</p>
                  <p class="text-xs text-slate-400 mt-2">k = 1 / (4πε₀) ≈ 9 × 10⁹ Nm²/C²</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Electric Field Intensity</h3>
                <p class="text-slate-600 mb-4">Electric field at a point is the force experienced by a unit positive test charge placed at that point.</p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <p class="text-sm text-blue-800 font-bold">E = F / q₀ = k Q / r²</p>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">📝 Board Formula Sheet</h3>
                <ul class="grid md:grid-cols-2 gap-4 text-sm text-slate-400">
                  <li>● Electric Flux: Φ = E · A = EA cosθ</li>
                  <li>● Gauss's Law: Φ = q_enclosed / ε₀</li>
                  <li>● Field due to Dipole (Axial): 2kp / r³</li>
                  <li>● Field due to Dipole (Equatorial): kp / r³</li>
                </ul>
              </section>
            </div>
          `
        },
        { 
          id: 'c12-p1-l2', 
          courseId: 'c12-p1', 
          title: 'Electrostatic Potential', 
          duration: '60m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Electric Potential</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Electric potential at a point is the work done in bringing a unit positive charge from infinity to that point.
                </p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">V = W / q = k Q / r</p>
                  <p class="text-xs text-slate-400 mt-2">Unit: Volt (V) = Joule/Coulomb</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Potential Energy of a System</h3>
                <p class="text-slate-600 mb-4">For two point charges q1 and q2 separated by distance r:</p>
                <div class="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 text-center">
                  <p class="text-lg font-bold text-emerald-900">U = k q1q2 / r</p>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'c12-p1-l3', 
          courseId: 'c12-p1', 
          title: 'Capacitance', 
          duration: '50m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Capacitors and Capacitance</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  A capacitor is a system of two conductors separated by an insulator. Capacitance C is the ratio of charge Q to potential V.
                </p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">C = Q / V</p>
                  <p class="text-xs text-slate-400 mt-2">Unit: Farad (F)</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Parallel Plate Capacitor</h3>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100 text-center">
                  <p class="text-lg font-bold text-blue-900">C = ε₀A / d</p>
                  <p class="text-xs text-blue-700 mt-2">With dielectric: C' = K ε₀A / d</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Energy Stored in Capacitor</h3>
                <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100 text-center">
                  <p class="text-lg font-bold text-emerald-900">U = ½CV² = Q² / 2C</p>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'c12-c1',
      categoryId: 'class12',
      title: 'Class 12 Chemistry: Solid State',
      description: 'Master the structure and properties of solid matter.',
      thumbnail: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=800&q=80',
      instructor: 'Bharat Sir (PW)',
      level: 'Intermediate',
      duration: '22 Hours',
      lectures: [
        { 
          id: 'c12-c1-l1', 
          courseId: 'c12-c1', 
          title: 'Crystal Lattices & Unit Cells', 
          duration: '50m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Crystal Systems</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  There are 7 primitive crystal systems. The most common is the <strong>Cubic System</strong>.
                </p>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Simple Cubic</h4>
                    <p class="text-[10px] text-slate-500">Z = 1 (Atoms at corners)</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">BCC</h4>
                    <p class="text-[10px] text-slate-500">Z = 2 (Corners + Body center)</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">FCC</h4>
                    <p class="text-[10px] text-slate-500">Z = 4 (Corners + Face centers)</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Density of Unit Cell</h3>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">d = (Z × M) / (a³ × N_A)</p>
                  <p class="text-xs text-slate-400 mt-2">Z = No. of atoms, M = Molar mass, a = Edge length</p>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'c12-c1-l2', 
          courseId: 'c12-c1', 
          title: 'Imperfections in Solids', 
          duration: '45m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Point Defects</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Point defects are the irregularities or deviations from ideal arrangement around a point or an atom in a crystalline substance.
                </p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                    <h4 class="font-bold text-rose-900 mb-2">Stoichiometric Defects</h4>
                    <p class="text-xs text-rose-800">Do not disturb the stoichiometry. Examples: <strong>Schottky</strong> and <strong>Frenkel</strong> defects.</p>
                  </div>
                  <div class="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <h4 class="font-bold text-blue-900 mb-2">Non-Stoichiometric</h4>
                    <p class="text-xs text-blue-800">Disturb the stoichiometry. Examples: Metal excess and metal deficiency defects.</p>
                  </div>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">📝 Schottky vs Frenkel</h3>
                <ul class="space-y-3 text-sm text-slate-400">
                  <li>● <strong>Schottky:</strong> Equal number of cations and anions missing. Density decreases.</li>
                  <li>● <strong>Frenkel:</strong> Smaller ion (usually cation) is dislocated to interstitial site. Density remains same.</li>
                </ul>
              </section>
            </div>
          `
        },
        { 
          id: 'c12-c1-l3', 
          courseId: 'c12-c1', 
          title: 'Solutions & Colligative Properties', 
          duration: '60m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Raoult's Law</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  For a solution of volatile liquids, the partial vapor pressure of each component is directly proportional to its mole fraction.
                </p>
                <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center">
                  <p class="text-lg font-bold text-slate-900">P_total = P₁°x₁ + P₂°x₂</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Colligative Properties</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <h4 class="font-bold text-indigo-900">Elevation in B.P.</h4>
                    <p class="text-xs text-indigo-800">ΔT_b = K_b × m</p>
                  </div>
                  <div class="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h4 class="font-bold text-emerald-900">Depression in F.P.</h4>
                    <p class="text-xs text-emerald-800">ΔT_f = K_f × m</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'c12-m1',
      categoryId: 'class12',
      title: 'Class 12 Maths: Relations & Functions',
      description: 'The foundation of Class 12 Mathematics for Boards.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sachin Sir (PW)',
      level: 'Intermediate',
      duration: '25 Hours',
      lectures: [
        { 
          id: 'c12-m1-l1', 
          courseId: 'c12-m1', 
          title: 'Types of Relations', 
          duration: '55m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Equivalence Relations</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  A relation R in a set A is called an <strong>Equivalence Relation</strong> if it is:
                </p>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Reflexive</h4>
                    <p class="text-[10px] text-slate-500">(a, a) ∈ R for all a ∈ A</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Symmetric</h4>
                    <p class="text-[10px] text-slate-500">(a, b) ∈ R ⇒ (b, a) ∈ R</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Transitive</h4>
                    <p class="text-[10px] text-slate-500">(a, b), (b, c) ∈ R ⇒ (a, c) ∈ R</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Functions: One-to-One & Onto</h3>
                <div class="space-y-4">
                  <div class="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <h4 class="font-bold text-indigo-900">Injective (One-to-One)</h4>
                    <p class="text-sm text-indigo-800">f(x1) = f(x2) ⇒ x1 = x2</p>
                  </div>
                  <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <h4 class="font-bold text-emerald-900">Surjective (Onto)</h4>
                    <p class="text-sm text-emerald-800">Range of f = Codomain of f</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { id: 'c12-m1-l2', courseId: 'c12-m1', title: 'Inverse Trigonometric Functions', duration: '60m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Inverse Trigonometric Functions</h3><p>Inverse functions of the basic trigonometric functions.</p>' }
      ]
    },
    {
      id: 'c12-e1',
      categoryId: 'class12',
      title: 'Class 12 English: Flamingo & Vistas',
      description: 'Complete literature guide for Class 12 English Core.',
      thumbnail: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
      instructor: 'Shipra Mam',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { 
          id: 'c12-e1-l1', 
          courseId: 'c12-e1', 
          title: 'The Last Lesson', 
          duration: '40m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Theme: Linguistic Chauvinism</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  The story is set in the days of the Franco-Prussian War. France was defeated by Prussia led by Bismarck. The districts of Alsace and Lorraine passed into Prussian hands.
                </p>
                <div class="bg-rose-50 p-6 rounded-3xl border border-rose-100">
                  <h4 class="font-bold text-rose-900 mb-2">M. Hamel's Message:</h4>
                  <p class="text-sm text-rose-800 italic">"When a people are enslaved, as long as they hold fast to their language it is as if they had the key to their prison."</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Character Analysis: Franz</h3>
                <p class="text-slate-600 mb-4">Franz is a young student who is initially indifferent to his studies but undergoes a transformation when he realizes it's his last French lesson.</p>
                <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <ul class="space-y-2 text-sm text-slate-600">
                    <li>● <strong>Initial State:</strong> Fearful of M. Hamel, distracted by nature.</li>
                    <li>● <strong>Final State:</strong> Regretful, appreciative of his mother tongue.</li>
                  </ul>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'c12-e1-l2', 
          courseId: 'c12-e1', 
          title: 'Lost Spring', 
          duration: '45m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Saheb-e-Alam: The Ragpicker</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Saheb is a refugee from Bangladesh living in Seemapuri, Delhi. His name means "Lord of the Universe," which is ironic given his poverty.
                </p>
                <div class="bg-amber-50 p-6 rounded-3xl border border-amber-100">
                  <p class="text-sm text-amber-800">"Garbage to them is gold." For children, it is wrapped in wonder; for elders, it is a means of survival.</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Mukesh: The Bangle Maker</h3>
                <p class="text-slate-600 mb-4">Mukesh lives in Firozabad, the center of India's glass-blowing industry. He wants to be a <strong>Motor Mechanic</strong>, breaking the family tradition.</p>
                <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <h4 class="font-bold text-slate-900 mb-2">The Vicious Circle:</h4>
                  <p class="text-xs text-slate-500">The sahukars, the middlemen, the policemen, the keepers of law, the bureaucrats, and the politicians.</p>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'c12-e1-l3', 
          courseId: 'c12-e1', 
          title: 'Deep Water', 
          duration: '50m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The Misadventure at YMCA</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  William Douglas had a childhood fear of water. At the age of ten or eleven, he decided to learn to swim at the YMCA pool.
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <p class="text-sm text-blue-800">A "big bruiser" of a boy tossed him into the deep end. Douglas almost drowned, and this intensified his phobia.</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Overcoming the Fear</h3>
                <p class="text-slate-600 mb-4">Douglas hired an instructor who taught him piece by piece. Finally, he swam across Lake Wentworth to conquer his fear.</p>
                <div class="bg-slate-900 text-white p-10 rounded-[3rem]">
                  <h3 class="text-xl font-black mb-4">📝 Key Takeaway</h3>
                  <p class="text-sm text-slate-400 italic">"All we have to fear is fear itself." — Roosevelt</p>
                </div>
              </section>
            </div>
          `
        }
      ]
    },

    // Skill Development
    {
      id: 'skill-w1',
      categoryId: 'skills',
      title: 'Full Stack Web Development (MERN)',
      description: 'Learn to build modern web applications using React, Node, and MongoDB.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80',
      instructor: 'Traversy Media',
      level: 'Beginner',
      duration: '60 Hours',
      lectures: [
        { 
          id: 'skill-w1-l1', 
          courseId: 'skill-w1', 
          title: 'HTML & CSS Crash Course', 
          duration: '90m', 
          order: 1,
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The Skeleton: Semantic HTML</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  HTML is not just about making text appear on a screen; it's about providing <strong>meaning</strong> to your content. Semantic tags help search engines and screen readers understand your page structure.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-8 overflow-hidden relative">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-orange-500/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <pre class="text-orange-400 text-xs leading-relaxed">
&lt;header&gt;
  &lt;nav&gt;...&lt;/nav&gt;
&lt;/header&gt;
&lt;main&gt;
  &lt;article&gt;
    &lt;h1&gt;The Future of Web&lt;/h1&gt;
    &lt;p&gt;Content goes here...&lt;/p&gt;
  &lt;/article&gt;
&lt;/main&gt;
&lt;footer&gt;...&lt;/footer&gt;</pre>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. The Skin: CSS Box Model</h3>
                <p class="text-slate-600 mb-6">Every element in CSS is essentially a box. Understanding how these boxes interact is the key to layout mastery.</p>
                <div class="flex flex-col items-center justify-center p-10 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                  <div class="w-64 h-48 border-4 border-blue-600 bg-blue-50 flex items-center justify-center relative">
                    <span class="text-blue-600 font-black uppercase text-[10px]">Content</span>
                    <div class="absolute -top-6 left-0 right-0 text-center text-[8px] font-bold text-slate-400">PADDING</div>
                    <div class="absolute inset-0 border-8 border-blue-200/50 pointer-events-none" />
                  </div>
                  <div class="mt-4 text-center">
                    <p class="text-xs font-bold text-slate-500">Box Model = Content + Padding + Border + Margin</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practical Lab: Flexbox Navbar</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4">Task: Create a responsive navigation bar using Flexbox.</p>
                  <div class="space-y-4">
                    <div class="p-4 bg-slate-800 rounded-2xl">
                      <code class="text-emerald-400 text-xs leading-relaxed">
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}</code>
                    </div>
                    <p class="text-sm text-slate-500 italic">Pro Tip: Use 'gap' instead of margins for spacing between flex items.</p>
                  </div>
                </div>
              </section>

              <section class="bg-blue-600 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">🚀 Interview Question</h3>
                <p class="font-bold mb-2">"What is the difference between 'display: none' and 'visibility: hidden'?"</p>
                <p class="text-blue-100 text-sm">
                  Answer: 'display: none' removes the element from the DOM entirely (it takes up no space), while 'visibility: hidden' hides the element but it still occupies its original space in the layout.
                </p>
              </section>
            </div>
          `
        },
        { 
          id: 'skill-w1-l2', 
          courseId: 'skill-w1', 
          title: 'JavaScript Fundamentals', 
          duration: '120m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Modern JavaScript (ES6+)</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  JavaScript has evolved significantly. Key features like Arrow Functions, Destructuring, and Template Literals are now standard.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-8">
                  <pre class="text-emerald-400 text-xs leading-relaxed">
// Arrow Function & Template Literals
const greet = (name) => \`Hello, \${name}!\`;

// Destructuring
const user = { id: 1, name: 'Adhyaan' };
const { name } = user;</pre>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Asynchronous JavaScript</h3>
                <p class="text-slate-600 mb-4">Handling operations that take time (like API calls) using <strong>Promises</strong> and <strong>Async/Await</strong>.</p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <p class="text-sm text-blue-800 font-bold">async function fetchData() {<br/>&nbsp;&nbsp;const res = await fetch(url);<br/>&nbsp;&nbsp;const data = await res.json();<br/>}</p>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'skill-w1-l3', 
          courseId: 'skill-w1', 
          title: 'React JS Tutorial', 
          duration: '105m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Component-Based Architecture</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  React allows you to build complex UIs from small, isolated pieces of code called "components".
                </p>
                <div class="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                  <h4 class="font-bold text-indigo-900 mb-2">State vs Props:</h4>
                  <ul class="space-y-2 text-sm text-indigo-800">
                    <li>● <strong>Props:</strong> Read-only data passed from parent to child.</li>
                    <li>● <strong>State:</strong> Data managed within the component that can change over time.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. The Power of Hooks</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">useState</h4>
                    <p class="text-xs text-slate-500">For managing local state in functional components.</p>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">useEffect</h4>
                    <p class="text-xs text-slate-500">For handling side effects like data fetching or subscriptions.</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'skill-w1-l4', 
          courseId: 'skill-w1', 
          title: 'Node.js & Express', 
          duration: '110m', 
          order: 4, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Node.js Runtime</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Node.js is a JavaScript runtime built on Chrome's V8 engine. It uses an <strong>event-driven, non-blocking I/O model</strong>.
                </p>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Building APIs with Express</h3>
                <div class="bg-slate-900 rounded-[2rem] p-8">
                  <pre class="text-blue-400 text-xs leading-relaxed">
const express = require('express');
const app = express();

app.get('/api/users', (req, res) => {
  res.json({ success: true, data: [] });
});

app.listen(5000);</pre>
                </div>
              </section>

              <section class="bg-emerald-600 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">📝 Middleware Concept</h3>
                <p class="text-emerald-100 text-sm">
                  Middleware functions have access to the request (req) and response (res) objects. They can execute code, make changes, or end the request-response cycle.
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'skill-a1',
      categoryId: 'skills',
      title: 'AI & Machine Learning Basics (Intro)',
      description: 'Introduction to Artificial Intelligence and building your first ML models.',
      thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80',
      instructor: 'Andrew Ng',
      level: 'Intermediate',
      duration: '45 Hours',
      lectures: [
        { 
          id: 'skill-a1-l1', 
          courseId: 'skill-a1', 
          title: 'What is Machine Learning?', 
          duration: '45m', 
          order: 1,
          content: `
            <h3 class="text-xl font-bold mb-4">Theory: Introduction to ML</h3>
            <p class="mb-4">Machine Learning is a field of AI that gives computers the ability to learn without being explicitly programmed.</p>
            <h4 class="font-bold mb-2">Types of ML:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li><strong>Supervised Learning:</strong> Learning from labeled data (e.g., Spam detection).</li>
              <li><strong>Unsupervised Learning:</strong> Finding patterns in unlabeled data (e.g., Customer segmentation).</li>
              <li><strong>Reinforcement Learning:</strong> Learning through trial and error (e.g., Game AI).</li>
            </ul>
          `
        },
        { 
          id: 'skill-a1-l2', 
          courseId: 'skill-a1', 
          title: 'Supervised vs Unsupervised', 
          duration: '50m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Supervised Learning</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  The model is trained on a labeled dataset. It learns to map inputs to a known output.
                </p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <h4 class="font-bold text-blue-900">Regression</h4>
                    <p class="text-xs text-blue-800">Predicting continuous values (e.g., House prices).</p>
                  </div>
                  <div class="p-6 bg-indigo-50 rounded-3xl border border-indigo-100">
                    <h4 class="font-bold text-indigo-900">Classification</h4>
                    <p class="text-xs text-indigo-800">Predicting discrete labels (e.g., Dog vs Cat).</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Unsupervised Learning</h3>
                <p class="text-slate-600 mb-4">The model works on unlabeled data and discovers hidden patterns or structures.</p>
                <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <h4 class="font-bold text-slate-900">Clustering</h4>
                  <p class="text-xs text-slate-500">Grouping similar data points together (e.g., K-Means).</p>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'skill-a1-l3', 
          courseId: 'skill-a1', 
          title: 'Neural Networks Explained', 
          duration: '60m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The Biological Inspiration</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Neural Networks are inspired by the human brain's network of neurons. They consist of an <strong>Input Layer</strong>, one or more <strong>Hidden Layers</strong>, and an <strong>Output Layer</strong>.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-10 flex justify-center">
                  <div class="flex gap-8 items-center">
                    <div class="flex flex-col gap-2">
                      <div class="w-4 h-4 rounded-full bg-blue-400" />
                      <div class="w-4 h-4 rounded-full bg-blue-400" />
                      <div class="w-4 h-4 rounded-full bg-blue-400" />
                    </div>
                    <div class="w-8 h-[2px] bg-slate-700" />
                    <div class="flex flex-col gap-2">
                      <div class="w-4 h-4 rounded-full bg-indigo-400" />
                      <div class="w-4 h-4 rounded-full bg-indigo-400" />
                      <div class="w-4 h-4 rounded-full bg-indigo-400" />
                      <div class="w-4 h-4 rounded-full bg-indigo-400" />
                    </div>
                    <div class="w-8 h-[2px] bg-slate-700" />
                    <div class="flex flex-col gap-2">
                      <div class="w-4 h-4 rounded-full bg-emerald-400" />
                      <div class="w-4 h-4 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Activation Functions</h3>
                <p class="text-slate-600 mb-4">These functions decide whether a neuron should be activated or not.</p>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">ReLU</h4>
                    <p class="text-[10px] text-slate-500">max(0, x)</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Sigmoid</h4>
                    <p class="text-[10px] text-slate-500">1 / (1 + e^-x)</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Softmax</h4>
                    <p class="text-[10px] text-slate-500">For multi-class output</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'skill-u1',
      categoryId: 'skills',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of design, user research, and prototyping in Figma.',
      thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80',
      instructor: 'Gary Simon',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { 
          id: 'skill-u1-l1', 
          courseId: 'skill-u1', 
          title: 'UI Design for Beginners', 
          duration: '60m', 
          order: 1,
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. What is UI Design?</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  User Interface (UI) design is the process designers use to build interfaces in software or computerized devices, focusing on looks or style.
                </p>
                <div class="bg-purple-50 p-6 rounded-3xl border border-purple-100">
                  <h4 class="font-bold text-purple-900 mb-2">The 4 Pillars of UI:</h4>
                  <ul class="list-disc pl-5 space-y-2 text-purple-800 text-sm">
                    <li><strong>Typography:</strong> Choosing the right fonts for readability and mood.</li>
                    <li><strong>Color Theory:</strong> Using color to guide attention and evoke emotion.</li>
                    <li><strong>Layout:</strong> Arranging elements in a balanced and logical way.</li>
                    <li><strong>Interaction:</strong> How the interface responds to user input.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Visual Hierarchy</h3>
                <p class="text-slate-600 mb-6">Visual hierarchy is the arrangement or presentation of elements in a way that implies importance.</p>
                <div class="flex flex-col gap-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-200">
                  <div class="h-12 w-full bg-slate-900 rounded-xl flex items-center px-4 text-white font-black">MOST IMPORTANT</div>
                  <div class="h-10 w-3/4 bg-slate-400 rounded-xl flex items-center px-4 text-white font-bold">Secondary Info</div>
                  <div class="h-8 w-1/2 bg-slate-200 rounded-xl flex items-center px-4 text-slate-500 text-xs italic">Tertiary details...</div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practical: The 60-30-10 Rule</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="text-sm text-slate-600 leading-relaxed">
                    A classic decor rule that helps you create a balanced color palette:
                    <br/><br/>
                    ● <strong>60% Primary Color:</strong> Usually a neutral (white/gray).
                    <br/>
                    ● <strong>30% Secondary Color:</strong> Your brand color.
                    <br/>
                    ● <strong>10% Accent Color:</strong> For CTAs and highlights.
                  </p>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">🎨 Design Tip</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  "Good design is obvious. Great design is transparent." — Joe Sparano. Focus on making the user's journey as frictionless as possible.
                </p>
              </section>
            </div>
          `
        },
        { 
          id: 'skill-u1-l2', 
          courseId: 'skill-u1', 
          title: 'UX Research Methods', 
          duration: '55m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Quantitative vs Qualitative</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  UX research is the systematic study of target users and their requirements.
                </p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <h4 class="font-bold text-amber-900 mb-2">Qualitative</h4>
                    <p class="text-xs text-amber-800">Focuses on "Why" and "How". Methods: Interviews, Usability Testing.</p>
                  </div>
                  <div class="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <h4 class="font-bold text-blue-900 mb-2">Quantitative</h4>
                    <p class="text-xs text-blue-800">Focuses on "How many". Methods: Surveys, A/B Testing, Analytics.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Creating Personas</h3>
                <p class="text-slate-600 mb-4">A persona is a fictional character created to represent a user type that might use a site, brand, or product in a similar way.</p>
                <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <h4 class="font-bold text-slate-900 mb-2">Persona Checklist:</h4>
                  <ul class="space-y-2 text-sm text-slate-600">
                    <li>● Name and Photo</li>
                    <li>● Demographics (Age, Job, Location)</li>
                    <li>● Goals and Frustrations</li>
                    <li>● Tech Proficiency</li>
                  </ul>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'skill-p1',
      categoryId: 'skills',
      title: 'Python for Beginners',
      description: 'The complete guide to starting your programming journey with Python.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      instructor: 'Mosh Hamedani',
      level: 'Beginner',
      duration: '30 Hours',
      lectures: [
        { 
          id: 'skill-p1-l1', 
          courseId: 'skill-p1', 
          title: 'Python Tutorial for Beginners', 
          duration: '360m', 
          order: 1,
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Why Python?</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  Python is a high-level, interpreted, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation.
                </p>
                <div class="bg-yellow-50 p-6 rounded-3xl border border-yellow-100">
                  <h4 class="font-bold text-yellow-900 mb-2">Key Features:</h4>
                  <ul class="list-disc pl-5 space-y-2 text-yellow-800 text-sm">
                    <li><strong>Simple Syntax:</strong> Easy to learn for beginners.</li>
                    <li><strong>Versatile:</strong> Used in Web Dev, AI, Data Science, and Automation.</li>
                    <li><strong>Large Community:</strong> Massive library support (PyPI).</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Basic Syntax & Variables</h3>
                <div class="bg-slate-900 rounded-[2rem] p-8 overflow-hidden relative">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <pre class="text-yellow-400 text-xs leading-relaxed">
# This is a comment
name = "Adhyaan"
age = 20
is_student = True

print(f"Hello, {name}! You are {age} years old.")</pre>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practical Exercise: Calculator</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4">Task: Create a simple addition program.</p>
                  <div class="p-4 bg-slate-800 rounded-2xl">
                    <code class="text-emerald-400 text-xs leading-relaxed">
num1 = float(input("Enter first number: "))
num2 = float(input("Enter second number: "))
sum = num1 + num2
print(f"The sum is: {sum}")</code>
                  </div>
                </div>
              </section>

              <section class="bg-blue-600 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">🚀 Python Tip</h3>
                <p class="text-blue-100 text-sm leading-relaxed">
                  Always use <strong>snake_case</strong> for variable names in Python. It's the PEP 8 standard and makes your code look professional.
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'skill-d1',
      categoryId: 'skills',
      title: 'Data Science with Python',
      description: 'Learn NumPy, Pandas, and Matplotlib for data analysis.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&w=800&q=80',
      instructor: 'Krish Naik',
      level: 'Intermediate',
      duration: '40 Hours',
      lectures: [
        { 
          id: 'skill-d1-l1', 
          courseId: 'skill-d1', 
          title: 'Introduction to Data Science', 
          duration: '15m', 
          order: 1,
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The Data Science Lifecycle</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Data Science is the process of extracting insights from data. It follows a structured path:
                </p>
                <div class="flex flex-col gap-2">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold">1</div>
                    <p class="text-sm font-bold text-slate-900">Data Collection</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold">2</div>
                    <p class="text-sm font-bold text-slate-900">Data Cleaning (EDA)</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold">3</div>
                    <p class="text-sm font-bold text-slate-900">Model Building</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center gap-4">
                    <div class="w-8 h-8 bg-slate-900 text-white rounded-lg flex items-center justify-center text-xs font-bold">4</div>
                    <p class="text-sm font-bold text-slate-900">Deployment & Monitoring</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'skill-d1-l2', 
          courseId: 'skill-d1', 
          title: 'NumPy for Data Science', 
          duration: '45m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Why NumPy?</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  NumPy (Numerical Python) is the fundamental package for scientific computing in Python. It provides a high-performance multidimensional array object.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-8">
                  <pre class="text-blue-400 text-xs leading-relaxed">
import numpy as np

# Create a 2D array
arr = np.array([[1, 2, 3], [4, 5, 6]])

# Array operations
print(arr.shape)  # (2, 3)
print(arr.mean()) # 3.5</pre>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Vectorization</h3>
                <p class="text-slate-600 mb-4">NumPy operations are "vectorized," meaning they run much faster than standard Python loops.</p>
                <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                  <p class="text-sm text-emerald-800 font-bold">a = np.array([1, 2, 3])<br/>b = np.array([4, 5, 6])<br/>c = a + b  # [5, 7, 9]</p>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'skill-d1-l3', 
          courseId: 'skill-d1', 
          title: 'Pandas Masterclass', 
          duration: '60m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. DataFrames and Series</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Pandas is built on top of NumPy. Its primary data structure is the <strong>DataFrame</strong>, a 2D labeled data structure.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-8">
                  <pre class="text-emerald-400 text-xs leading-relaxed">
import pandas as pd

df = pd.read_csv('data.csv')

# Basic exploration
print(df.head())
print(df.describe())
print(df['column_name'].value_counts())</pre>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Data Cleaning</h3>
                <div class="space-y-4">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Handling Missing Values</h4>
                    <p class="text-xs text-slate-500">df.dropna() or df.fillna(0)</p>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Filtering Data</h4>
                    <p class="text-xs text-slate-500">df[df['age'] > 25]</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'skill-d1-l4', 
          courseId: 'skill-d1', 
          title: 'Matplotlib Visualization', 
          duration: '30m', 
          order: 4, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Data Visualization with Matplotlib</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Matplotlib is the most popular plotting library for Python. It allows you to create static, animated, and interactive visualizations.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-8">
                  <pre class="text-blue-400 text-xs leading-relaxed">
import matplotlib.pyplot as plt

x = [1, 2, 3, 4]
y = [10, 20, 25, 30]

plt.plot(x, y, color='green', marker='o')
plt.title('Simple Line Plot')
plt.xlabel('X Axis')
plt.ylabel('Y Axis')
plt.show()</pre>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Types of Plots</h3>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Bar Chart</h4>
                    <p class="text-[10px] text-slate-500">plt.bar()</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Histogram</h4>
                    <p class="text-[10px] text-slate-500">plt.hist()</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Scatter Plot</h4>
                    <p class="text-[10px] text-slate-500">plt.scatter()</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'skill-d2',
      categoryId: 'skills',
      title: 'Advanced Full Stack Web Development',
      description: 'Master HTML, CSS, JS, React, and Node.js with advanced projects.',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
      instructor: 'Hitesh Choudhary',
      level: 'Beginner',
      duration: '100 Hours',
      lectures: [
        { id: 'skill-d2-l1', courseId: 'skill-d2', title: 'HTML & CSS Basics', duration: '2h', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Advanced CSS</h3><p>Grid, Animations, and Responsive Design.</p>' },
        { id: 'skill-d2-l2', courseId: 'skill-d2', title: 'JavaScript Essentials', duration: '3h', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: ES6+ Features</h3><p>Arrow functions, Destructuring, and Promises.</p>' },
        { id: 'skill-d2-l3', courseId: 'skill-d2', title: 'React.js Crash Course', duration: '4h', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: State Management</h3><p>Context API and Redux.</p>' }
      ]
    },
    {
      id: 'jee-p3',
      categoryId: 'jee',
      title: 'JEE Physics: Electrostatics & Capacitance',
      description: 'Deep dive into Electric Fields, Potential, and Capacitance.',
      thumbnail: 'https://images.unsplash.com/photo-1517420704952-d9f39e95b43e?auto=format&fit=crop&w=800&q=80',
      instructor: 'Alakh Pandey',
      level: 'Advanced',
      duration: '45 Hours',
      lectures: [
        { 
          id: 'jee-p3-l1', 
          courseId: 'jee-p3', 
          title: 'Coulomb\'s Law', 
          duration: '50m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Vector Form of Coulomb's Law</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  For JEE, understanding the vector representation is crucial for solving 3D problems.
                </p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">F₁₂ = k (q₁q₂ / r₁₂²) r̂₁₂</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Principle of Superposition</h3>
                <p class="text-slate-600 mb-4">The net force on a charge is the vector sum of all forces acting on it due to other charges.</p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <p class="text-sm text-blue-800 font-bold">F_net = F₁ + F₂ + F₃ + ...</p>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'jee-p3-l2', 
          courseId: 'jee-p3', 
          title: 'Electric Field Lines', 
          duration: '45m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Properties of Field Lines</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Electric field lines are imaginary lines used to visualize the electric field around charges.
                </p>
                <div class="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                  <ul class="space-y-2 text-sm text-indigo-800">
                    <li>● They start from positive charges and end at negative charges.</li>
                    <li>● They never intersect each other.</li>
                    <li>● The tangent to a field line at any point gives the direction of E at that point.</li>
                    <li>● They are perpendicular to the surface of a conductor.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Field Lines for Different Systems</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Isolated +ve Charge</h4>
                    <p class="text-xs text-slate-500">Radially outwards.</p>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Electric Dipole</h4>
                    <p class="text-xs text-slate-500">Curved lines from + to -.</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'neet-b3',
      categoryId: 'neet',
      title: 'NEET Biology: Genetics (Inheritance)',
      description: 'Principles of Inheritance and Variation.',
      thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=800&q=80',
      instructor: 'Dr. Samapti Mam',
      level: 'Intermediate',
      duration: '35 Hours',
      lectures: [
        { 
          id: 'neet-b3-l1', 
          courseId: 'neet-b3', 
          title: 'Mendelian Genetics', 
          duration: '60m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Mendel's Laws</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Gregor Mendel, the father of genetics, conducted experiments on pea plants (Pisum sativum).
                </p>
                <div class="space-y-4">
                  <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <h4 class="font-bold text-emerald-900">Law of Dominance</h4>
                    <p class="text-sm text-emerald-800">In a heterozygote, one trait will conceal the presence of another trait for the same characteristic.</p>
                  </div>
                  <div class="p-6 bg-blue-50 rounded-3xl border border-blue-100">
                    <h4 class="font-bold text-blue-900">Law of Segregation</h4>
                    <p class="text-sm text-blue-800">During gamete formation, the alleles for each gene segregate from each other so that each gamete carries only one allele for each gene.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Punnett Square (Monohybrid Cross)</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Example: Crossing Tt x Tt</p>
                  <div class="grid grid-cols-2 gap-2 w-32 mx-auto">
                    <div class="p-2 bg-slate-100 text-center font-bold">TT</div>
                    <div class="p-2 bg-slate-100 text-center font-bold">Tt</div>
                    <div class="p-2 bg-slate-100 text-center font-bold">Tt</div>
                    <div class="p-2 bg-slate-100 text-center font-bold">tt</div>
                  </div>
                  <p class="text-center mt-4 text-xs text-slate-500">Phenotypic Ratio: 3:1 | Genotypic Ratio: 1:2:1</p>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'neet-b3-l2', 
          courseId: 'neet-b3', 
          title: 'DNA Structure', 
          duration: '55m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Watson-Crick Model</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  DNA is a double-stranded helical structure. Each strand is a polymer of nucleotides.
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 class="font-bold text-blue-900 mb-2">Key Features:</h4>
                  <ul class="space-y-2 text-sm text-blue-800">
                    <li>● <strong>Anti-parallel polarity:</strong> One strand is 5'→3', the other is 3'→5'.</li>
                    <li>● <strong>Base Pairing:</strong> A pairs with T (2 H-bonds), G pairs with C (3 H-bonds).</li>
                    <li>● <strong>Pitch:</strong> 3.4 nm per turn (10 base pairs).</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Chargaff's Rule</h3>
                <p class="text-slate-600 mb-4">In double-stranded DNA, the ratio between Adenine and Thymine, and Guanine and Cytosine are constant and equals one.</p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-emerald-400">[A] + [G] = [T] + [C]</p>
                  <p class="text-xs text-slate-400 mt-2">Purines = Pyrimidines</p>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'class10-s2',
      categoryId: 'class10',
      title: 'Class 10 Science: Life Processes',
      description: 'Detailed study of Nutrition, Respiration, Transportation, and Excretion.',
      thumbnail: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sunil Sir',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { 
          id: 'class10-s2-l1', 
          courseId: 'class10-s2', 
          title: 'Nutrition in Plants', 
          duration: '40m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Autotrophic Nutrition</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Plants are autotrophs, meaning they synthesize their own food using simple inorganic materials.
                </p>
                <div class="bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100">
                  <h4 class="font-bold text-emerald-900 mb-4">Photosynthesis Equation:</h4>
                  <p class="text-lg font-black text-emerald-700 text-center">6CO₂ + 12H₂O → C₆H₁₂O₆ + 6O₂ + 6H₂O</p>
                  <p class="text-xs text-emerald-600 text-center mt-2">(In the presence of Chlorophyll and Sunlight)</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Site of Photosynthesis</h3>
                <p class="text-slate-600 mb-4">Photosynthesis occurs in the <strong>Chloroplasts</strong>, which contain the green pigment <strong>Chlorophyll</strong>.</p>
                <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                  <h4 class="font-bold text-slate-900 mb-2">Stomata:</h4>
                  <p class="text-sm text-slate-600 leading-relaxed">Tiny pores on the surface of leaves that facilitate gas exchange (CO₂ in, O₂ out) and transpiration. Guard cells control their opening and closing.</p>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'class12-c2',
      categoryId: 'class12',
      title: 'Class 12 Chemistry: Organic Chemistry',
      description: 'Haloalkanes and Haloarenes, Alcohols, Phenols and Ethers.',
      thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&w=800&q=80',
      instructor: 'Bharat Panchal',
      level: 'Intermediate',
      duration: '50 Hours',
      lectures: [
        { 
          id: 'class12-c2-l1', 
          courseId: 'class12-c2', 
          title: 'Introduction to Organic', 
          duration: '45m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Tetravalence of Carbon</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Carbon has four valence electrons and can form four covalent bonds. This property, along with <strong>catenation</strong>, leads to the vast diversity of organic compounds.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-8">
                  <pre class="text-blue-400 text-xs leading-relaxed">
# Hybridization in Carbon
sp³: Methane (CH₄) - Tetrahedral
sp²: Ethene (C₂H₄) - Trigonal Planar
sp: Ethyne (C₂H₂) - Linear</pre>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Classification of Organic Compounds</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Acyclic (Open Chain)</h4>
                    <p class="text-xs text-slate-500">Alkanes, Alkenes, Alkynes.</p>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Cyclic (Closed Chain)</h4>
                    <p class="text-xs text-slate-500">Alicyclic and Aromatic (e.g., Benzene).</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'skill-ai1',
      categoryId: 'skills',
      title: 'Generative AI for Everyone',
      description: 'Learn how to use AI tools like ChatGPT, Midjourney, and more.',
      thumbnail: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?auto=format&fit=crop&w=800&q=80',
      instructor: 'Andrew Ng',
      level: 'Beginner',
      duration: '10 Hours',
      lectures: [
        { 
          id: 'skill-ai1-l1', 
          courseId: 'skill-ai1', 
          title: 'What is GenAI?', 
          duration: '15m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The Dawn of Generative AI</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  Generative AI (GenAI) is a subset of Artificial Intelligence that focuses on creating <strong>new content</strong>—be it text, images, code, or music—rather than just analyzing existing data.
                </p>
                <div class="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                  <h4 class="font-bold text-indigo-900 mb-2">How it differs from Traditional AI:</h4>
                  <ul class="list-disc pl-5 space-y-2 text-indigo-800 text-sm">
                    <li><strong>Discriminative AI:</strong> Classifies data (e.g., "Is this a cat or a dog?").</li>
                    <li><strong>Generative AI:</strong> Creates data (e.g., "Generate an image of a cat wearing a space suit.").</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Large Language Models (LLMs)</h3>
                <p class="text-slate-600 mb-6">LLMs like GPT-4, Gemini, and Claude are the engines behind text-based GenAI. They work by predicting the <strong>next token</strong> in a sequence based on massive amounts of training data.</p>
                <div class="bg-slate-900 text-white p-8 rounded-[2rem] relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <h4 class="font-bold mb-4 text-purple-400">The Transformer Architecture:</h4>
                  <p class="text-sm text-slate-400 leading-relaxed">
                    Introduced in 2017 by Google researchers, the "Attention is All You Need" paper revolutionized AI. The <strong>Self-Attention</strong> mechanism allows models to weigh the importance of different words in a sentence regardless of their distance.
                  </p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practical Use Cases</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl">
                    <p class="font-bold text-slate-800">Content Creation</p>
                    <p class="text-xs text-slate-500">Writing blogs, emails, and social media posts in seconds.</p>
                  </div>
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl">
                    <p class="font-bold text-slate-800">Coding Assistant</p>
                    <p class="text-xs text-slate-500">Generating boilerplates, debugging, and explaining complex logic.</p>
                  </div>
                </div>
              </section>

              <section class="bg-emerald-600 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">🛡️ Ethics & Safety</h3>
                <p class="text-emerald-100 text-sm leading-relaxed">
                  With great power comes great responsibility. Issues like <strong>Hallucinations</strong> (AI making things up), <strong>Bias</strong>, and <strong>Copyright</strong> are critical challenges that the industry is actively working to solve.
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'jee-m2',
      categoryId: 'jee',
      title: 'JEE Maths: Calculus (Limits & Continuity)',
      description: 'Limits, Continuity, and Differentiability for JEE.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
      instructor: 'NV Sir',
      level: 'Advanced',
      duration: '60 Hours',
      lectures: [
        { 
          id: 'jee-m2-l1', 
          courseId: 'jee-m2', 
          title: 'Introduction to Limits', 
          duration: '50m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Concept of a Limit</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  A limit is the value that a function "approaches" as the input approaches some value. It is the foundation of Calculus, leading to derivatives and integrals.
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 class="font-bold text-blue-900 mb-2">Formal Definition (ε-δ):</h4>
                  <p class="text-sm text-blue-800 italic">"For every ε > 0, there exists a δ > 0 such that if 0 < |x - a| < δ, then |f(x) - L| < ε."</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Standard Limits to Memorize</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p class="text-xs font-black text-slate-400 uppercase mb-1">Trigonometric</p>
                    <p class="font-bold text-slate-800">lim (x→0) sin(x)/x = 1</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <p class="text-xs font-black text-slate-400 uppercase mb-1">Exponential</p>
                    <p class="font-bold text-slate-800">lim (x→0) (eˣ - 1)/x = 1</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Numerical: L'Hôpital's Rule</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: Evaluate lim (x→0) (tan x - x) / x³</p>
                  <div class="space-y-4">
                    <p class="text-sm text-slate-600">This is a 0/0 form. Applying L'Hôpital's Rule:</p>
                    <div class="p-4 bg-slate-800 rounded-2xl">
                      <code class="text-emerald-400 text-xs">
= lim (sec²x - 1) / 3x² <br/>
= lim (tan²x) / 3x² <br/>
= 1/3 * (lim tanx/x)² <br/>
= 1/3 * (1)² = 1/3</code>
                    </div>
                    <p class="text-emerald-600 font-black">Final Answer: 1/3</p>
                  </div>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">🧠 JEE Advanced Tip</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  When dealing with limits involving <strong>Greatest Integer Function [x]</strong> or <strong>Fractional Part {x}</strong>, always check Left Hand Limit (LHL) and Right Hand Limit (RHL) separately.
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'neet-c2',
      categoryId: 'neet',
      title: 'NEET Chemistry: Organic (GOC)',
      description: 'General Organic Chemistry (GOC) for NEET.',
      thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&w=800&q=80',
      instructor: 'Pankaj Sir',
      level: 'Intermediate',
      duration: '40 Hours',
      lectures: [
        { 
          id: 'neet-c2-l1', 
          courseId: 'neet-c2', 
          title: 'Inductive Effect', 
          duration: '45m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. What is Inductive Effect?</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  The permanent displacement of sigma (σ) electrons along a saturated carbon chain due to the presence of a polar bond.
                </p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                    <h4 class="font-bold text-rose-900 mb-2">-I Effect</h4>
                    <p class="text-xs text-rose-800">Electron-withdrawing groups (e.g., -NO₂, -CN, -F, -Cl).</p>
                  </div>
                  <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <h4 class="font-bold text-emerald-900 mb-2">+I Effect</h4>
                    <p class="text-xs text-emerald-800">Electron-releasing groups (e.g., Alkyl groups like -CH₃, -C₂H₅).</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Applications of I-Effect</h3>
                <div class="space-y-4">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Stability of Carbocations</h4>
                    <p class="text-sm text-slate-600">+I groups increase stability by dispersing positive charge. Order: 3° > 2° > 1° > Methyl.</p>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Acidic Strength</h4>
                    <p class="text-sm text-slate-600">-I groups increase acidic strength by stabilizing the conjugate base.</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'class10-m1',
      categoryId: 'class10',
      title: 'Class 10 Maths: Trigonometry Basics',
      description: 'Introduction to Trigonometric Ratios and Identities.',
      thumbnail: 'https://images.unsplash.com/photo-1509228627152-72ae9ae6848d?auto=format&fit=crop&w=800&q=80',
      instructor: 'Dear Sir',
      level: 'Beginner',
      duration: '15 Hours',
      lectures: [
        { 
          id: 'class10-m1-l1', 
          courseId: 'class10-m1', 
          title: 'Trigonometry Basics', 
          duration: '30m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Trigonometric Ratios</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  Trigonometry is the study of relationships between the sides and angles of a right-angled triangle.
                </p>
                <div class="bg-orange-50 p-8 rounded-[2rem] border border-orange-100">
                  <h4 class="font-bold text-orange-900 mb-4">The "SOH CAH TOA" Rule:</h4>
                  <ul class="space-y-3 text-sm text-orange-800">
                    <li><strong>sin θ</strong> = Opposite / Hypotenuse</li>
                    <li><strong>cos θ</strong> = Adjacent / Hypotenuse</li>
                    <li><strong>tan θ</strong> = Opposite / Adjacent</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Trigonometric Table (0° to 90°)</h3>
                <div class="overflow-x-auto">
                  <table class="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr class="bg-slate-100">
                        <th class="p-3 border">Ratio</th>
                        <th class="p-3 border">0°</th>
                        <th class="p-3 border">30°</th>
                        <th class="p-3 border">45°</th>
                        <th class="p-3 border">60°</th>
                        <th class="p-3 border">90°</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="p-3 border font-bold">sin</td>
                        <td class="p-3 border">0</td>
                        <td class="p-3 border">1/2</td>
                        <td class="p-3 border">1/√2</td>
                        <td class="p-3 border">√3/2</td>
                        <td class="p-3 border">1</td>
                      </tr>
                      <tr>
                        <td class="p-3 border font-bold">cos</td>
                        <td class="p-3 border">1</td>
                        <td class="p-3 border">√3/2</td>
                        <td class="p-3 border">1/√2</td>
                        <td class="p-3 border">1/2</td>
                        <td class="p-3 border">0</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practice Numerical</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4 italic">Q: In a right triangle ABC, right-angled at B, if AB = 24 cm and BC = 7 cm, find sin A.</p>
                  <div class="space-y-4">
                    <p class="text-sm text-slate-600">Step 1: Find Hypotenuse (AC) using Pythagoras Theorem.</p>
                    <p class="text-sm text-slate-600">AC² = AB² + BC² = 24² + 7² = 576 + 49 = 625</p>
                    <p class="text-sm text-slate-600">AC = 25 cm</p>
                    <p class="text-sm text-slate-600">Step 2: sin A = Opposite / Hypotenuse = BC / AC = 7 / 25</p>
                    <p class="text-emerald-600 font-black">Answer: 7/25</p>
                  </div>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">📝 Board Exam Note</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  Always remember the identity: <strong>sin²θ + cos²θ = 1</strong>. This is the most frequently tested identity in Class 10 Boards.
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'jee-c2',
      categoryId: 'jee',
      title: 'JEE Chemistry: Chemical Bonding (Advanced)',
      description: 'Master VSEPR Theory, Hybridization, and Molecular Orbital Theory.',
      thumbnail: 'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=800&q=80',
      instructor: 'Sachin Sir',
      level: 'Advanced',
      duration: '40 Hours',
      lectures: [
        { 
          id: 'jee-c2-l1', 
          courseId: 'jee-c2', 
          title: 'VSEPR Theory', 
          duration: '50m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. VSEPR Theory Fundamentals</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  Valence Shell Electron Pair Repulsion (VSEPR) theory is a model used to predict the geometry of individual molecules from the number of electron pairs surrounding their central atoms.
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 class="font-bold text-blue-900 mb-2">The Core Postulate:</h4>
                  <p class="text-sm text-blue-800">Electron pairs (both bonding and non-bonding) repel each other and stay as far apart as possible to minimize repulsion and maximize stability.</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Repulsion Order</h3>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">Lone Pair - Lone Pair > Lone Pair - Bond Pair > Bond Pair - Bond Pair</p>
                  <p class="text-xs text-slate-400 mt-2 italic">This explains why bond angles decrease when lone pairs are present.</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Molecular Geometries</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl">
                    <p class="font-bold text-slate-800">AB2 Type</p>
                    <p class="text-xs text-slate-500">Linear (180°). Example: BeCl2, CO2.</p>
                  </div>
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl">
                    <p class="font-bold text-slate-800">AB3 Type</p>
                    <p class="text-xs text-slate-500">Trigonal Planar (120°). Example: BF3.</p>
                  </div>
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl">
                    <p class="font-bold text-slate-800">AB4 Type</p>
                    <p class="text-xs text-slate-500">Tetrahedral (109.5°). Example: CH4.</p>
                  </div>
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl">
                    <p class="font-bold text-slate-800">AB3L Type</p>
                    <p class="text-xs text-slate-500">Pyramidal (<109.5°). Example: NH3.</p>
                  </div>
                </div>
              </section>

              <section class="bg-emerald-600 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">🚀 JEE Numerical Hint</h3>
                <p class="text-emerald-100 text-sm leading-relaxed">
                  To find the shape, first calculate the <strong>Steric Number (Z)</strong>:
                  <br/><br/>
                  Z = ½ [V + M - C + A]
                  <br/><br/>
                  Where V = Valence electrons, M = Monovalent atoms, C = Cationic charge, A = Anionic charge.
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'class12-p1',
      categoryId: 'class12',
      title: 'Class 12 Physics: Optics & Waves',
      description: 'Ray Optics and Wave Optics for Board Exams.',
      thumbnail: 'https://images.unsplash.com/photo-1514373941175-0a141072bbc8?auto=format&fit=crop&w=800&q=80',
      instructor: 'Abhishek Sahu',
      level: 'Intermediate',
      duration: '30 Hours',
      lectures: [
        { 
          id: 'class12-p1-l1', 
          courseId: 'class12-p1', 
          title: 'Reflection of Light', 
          duration: '40m', 
          order: 1,
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Laws of Reflection</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Reflection is the phenomenon of bouncing back of light into the same medium after striking a surface.
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <ul class="space-y-2 text-sm text-blue-800">
                    <li>● The incident ray, the reflected ray, and the normal at the point of incidence all lie in the same plane.</li>
                    <li>● The angle of incidence (i) is always equal to the angle of reflection (r).</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Mirror Formula & Magnification</h3>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-blue-400">1/f = 1/v + 1/u</p>
                  <p class="text-xs text-slate-400 mt-2">m = -v/u = h'/h</p>
                </div>
                <p class="text-xs text-slate-500 mt-4 italic">Note: Follow Cartesian Sign Convention strictly for Board Exams.</p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'upsc-p1',
      categoryId: 'upsc',
      title: 'UPSC: Indian Polity & Governance',
      description: 'Master the Indian Constitution, Preamble, and Fundamental Rights for UPSC Prelims & Mains.',
      thumbnail: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80',
      instructor: 'M. Laxmikanth (Reference)',
      level: 'Advanced',
      duration: '55 Hours',
      lectures: [
        { 
          id: 'upsc-p1-l1', 
          courseId: 'upsc-p1', 
          title: 'Historical Background', 
          duration: '60m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The Company Rule (1773–1858)</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  The British came to India in 1600 as traders, in the form of East India Company, which had the exclusive right of trading in India under a charter granted by Queen Elizabeth I.
                </p>
                <div class="space-y-4">
                  <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 class="font-bold text-blue-600 mb-2">Regulating Act of 1773</h4>
                    <p class="text-sm text-slate-600">It was the first step taken by the British Government to control and regulate the affairs of the East India Company in India. It designated the Governor of Bengal as the 'Governor-General of Bengal'.</p>
                  </div>
                  <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <h4 class="font-bold text-blue-600 mb-2">Pitt’s India Act of 1784</h4>
                    <p class="text-sm text-slate-600">It distinguished between the commercial and political functions of the Company. It allowed the Court of Directors to manage the commercial affairs but created a new body called Board of Control to manage the political affairs.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. The Crown Rule (1858–1947)</h3>
                <div class="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-r-2xl mb-6">
                  <h4 class="font-bold text-amber-900 mb-2">Government of India Act of 1858</h4>
                  <p class="text-sm text-amber-800">This significant Act was enacted in the wake of the Revolt of 1857—also known as the First War of Independence or the ‘sepoy mutiny’. The Act known as the Act for the Good Government of India, abolished the East India Company, and transferred the powers of government, territories and revenues to the British Crown.</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practice Questions (Mains Perspective)</h3>
                <div class="bg-slate-50 p-8 rounded-[2rem] border border-slate-200">
                  <p class="font-bold text-slate-800 mb-4">Q: "The Regulating Act of 1773 was the first step towards centralization in British India." Discuss. (150 Words)</p>
                  <div class="space-y-4">
                    <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Key Points for Answer:</p>
                    <ul class="list-disc pl-5 text-sm text-slate-600 space-y-2">
                      <li>Designation of Governor-General of Bengal.</li>
                      <li>Subordination of Governors of Bombay and Madras.</li>
                      <li>Establishment of Supreme Court at Calcutta (1774).</li>
                      <li>Prohibition of private trade for Company servants.</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section class="bg-blue-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">💡 UPSC Prelims Fact-Check</h3>
                <div class="grid md:grid-cols-2 gap-6 text-sm">
                  <div class="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p class="font-bold text-blue-300">First Governor-General</p>
                    <p>Lord Warren Hastings (1773)</p>
                  </div>
                  <div class="p-4 bg-white/10 rounded-2xl border border-white/10">
                    <p class="font-bold text-blue-300">First Viceroy</p>
                    <p>Lord Canning (1858)</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'upsc-p1-l2', 
          courseId: 'upsc-p1', 
          title: 'Making of the Constitution', 
          duration: '55m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Demand for a Constituent Assembly</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  The idea of a Constituent Assembly for India was put forward for the first time by <strong>M.N. Roy</strong> in 1934.
                </p>
                <div class="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                  <h4 class="font-bold text-slate-900 mb-2">Key Milestones:</h4>
                  <ul class="space-y-2 text-sm text-slate-600">
                    <li>● <strong>1940:</strong> 'August Offer' accepted the demand in principle.</li>
                    <li>● <strong>1942:</strong> Cripps Mission proposed a draft on the framing of an independent Constitution.</li>
                    <li>● <strong>1946:</strong> Cabinet Mission Plan finally constituted the Assembly.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Composition of the Assembly</h3>
                <p class="text-slate-600 mb-4">The total strength was 389. After partition, it was reduced to 299.</p>
                <div class="grid md:grid-cols-2 gap-4 text-sm">
                  <div class="p-4 bg-blue-50 rounded-2xl border border-blue-100">
                    <p class="font-bold text-blue-900">President</p>
                    <p>Dr. Rajendra Prasad</p>
                  </div>
                  <div class="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                    <p class="font-bold text-indigo-900">Drafting Committee Chairman</p>
                    <p>Dr. B.R. Ambedkar</p>
                  </div>
                </div>
              </section>
            </div>
          `
        },
        { 
          id: 'upsc-p1-l3', 
          courseId: 'upsc-p1', 
          title: 'Fundamental Rights', 
          duration: '90m', 
          order: 3, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Magna Carta of India</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Part III of the Constitution (Articles 12 to 35) is described as the Magna Carta of India.
                </p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <h4 class="font-bold text-slate-900">Right to Equality</h4>
                    <p class="text-xs text-slate-500">Articles 14–18</p>
                  </div>
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <h4 class="font-bold text-slate-900">Right to Freedom</h4>
                    <p class="text-xs text-slate-500">Articles 19–22</p>
                  </div>
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <h4 class="font-bold text-slate-900">Right against Exploitation</h4>
                    <p class="text-xs text-slate-500">Articles 23–24</p>
                  </div>
                  <div class="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
                    <h4 class="font-bold text-slate-900">Right to Constitutional Remedies</h4>
                    <p class="text-xs text-slate-500">Article 32 (Heart and Soul of the Constitution)</p>
                  </div>
                </div>
              </section>

              <section class="bg-rose-600 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">⚠️ Critical Note</h3>
                <p class="text-rose-100 text-sm leading-relaxed">
                  Fundamental Rights are <strong>Justiciable</strong>, allowing persons to move the courts for their enforcement, but they are <strong>not absolute</strong> and are subject to reasonable restrictions.
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'upsc-g1',
      categoryId: 'upsc',
      title: 'UPSC: Physical Geography',
      description: 'In-depth study of Geomorphology, Climatology, and Oceanography.',
      thumbnail: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
      instructor: 'G.C. Leong (Reference)',
      level: 'Advanced',
      duration: '48 Hours',
      lectures: [
        { 
          id: 'upsc-g1-l1', 
          courseId: 'upsc-g1', 
          title: 'The Earth\'s Crust', 
          duration: '50m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Structure of the Earth</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  The Earth is made up of several concentric layers: the <strong>Crust</strong>, the <strong>Mantle</strong>, and the <strong>Core</strong>.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-8">
                  <div class="space-y-4">
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <h4 class="font-bold text-blue-400">The Crust</h4>
                      <p class="text-xs text-slate-400">The outermost solid shell. Oceanic crust (Sima) and Continental crust (Sial).</p>
                    </div>
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <h4 class="font-bold text-blue-400">The Mantle</h4>
                      <p class="text-xs text-slate-400">Extends to a depth of 2,900 km. Consists of the Lithosphere and Asthenosphere.</p>
                    </div>
                    <div class="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <h4 class="font-bold text-blue-400">The Core</h4>
                      <p class="text-xs text-slate-400">Inner and Outer core. Composed mainly of Nickel and Iron (Nife).</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Types of Rocks</h3>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Igneous</h4>
                    <p class="text-[10px] text-slate-500">Formed from cooled magma.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Sedimentary</h4>
                    <p class="text-[10px] text-slate-500">Formed by lithification.</p>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Metamorphic</h4>
                    <p class="text-[10px] text-slate-500">Formed under heat/pressure.</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'fin-s1',
      categoryId: 'finance',
      title: 'Stock Market Investing for Beginners',
      description: 'Learn how to analyze stocks, understand market cycles, and build a portfolio.',
      thumbnail: 'https://images.unsplash.com/photo-1611974714851-eb605161882b?auto=format&fit=crop&w=800&q=80',
      instructor: 'Pranjal Kamra',
      level: 'Beginner',
      duration: '25 Hours',
      lectures: [
        { 
          id: 'fin-s1-l1', 
          courseId: 'fin-s1', 
          title: 'Basics of Stock Market', 
          duration: '45m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. What is a Stock?</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  A stock (also known as equity) is a security that represents the ownership of a fraction of a corporation. This entitles the owner of the stock to a proportion of the corporation's assets and profits equal to how much stock they own.
                </p>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                    <p class="text-xs font-black text-emerald-600 uppercase mb-1">NSE</p>
                    <p class="text-sm font-bold text-slate-800">National Stock Exchange</p>
                  </div>
                  <div class="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                    <p class="text-xs font-black text-emerald-600 uppercase mb-1">BSE</p>
                    <p class="text-sm font-bold text-slate-800">Bombay Stock Exchange</p>
                  </div>
                  <div class="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                    <p class="text-xs font-black text-emerald-600 uppercase mb-1">SEBI</p>
                    <p class="text-sm font-bold text-slate-800">The Regulator</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. How the Market Works</h3>
                <div class="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 relative overflow-hidden">
                  <div class="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 blur-3xl" />
                  <h4 class="font-bold text-slate-900 mb-4">The Lifecycle of a Trade:</h4>
                  <ol class="space-y-4 text-sm text-slate-600">
                    <li class="flex gap-4">
                      <span class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">1</span>
                      <span><strong>IPO (Primary Market):</strong> Company lists its shares for the first time.</span>
                    </li>
                    <li class="flex gap-4">
                      <span class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">2</span>
                      <span><strong>Trading (Secondary Market):</strong> Investors buy and sell shares from each other.</span>
                    </li>
                    <li class="flex gap-4">
                      <span class="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">3</span>
                      <span><strong>Price Discovery:</strong> Prices fluctuate based on Supply and Demand.</span>
                    </li>
                  </ol>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practical Exercise: Calculating Returns</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8">
                  <p class="font-bold text-slate-800 mb-4 italic">Scenario: You bought 10 shares of Reliance at ₹2,400 and sold them at ₹2,800. Calculate your absolute return percentage.</p>
                  <div class="space-y-3 text-sm text-slate-600">
                    <p>● Buy Price = 10 * 2400 = ₹24,000</p>
                    <p>● Sell Price = 10 * 2800 = ₹28,000</p>
                    <p>● Profit = ₹4,000</p>
                    <p class="font-bold text-blue-600">● Return % = (4000 / 24000) * 100 = 16.67%</p>
                  </div>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">⚠️ Investor's Note</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  "The stock market is a device for transferring money from the impatient to the patient." — Warren Buffett. Never invest money you cannot afford to lose in the short term.
                </p>
              </section>
            </div>
          `
        },
        { 
          id: 'fin-s1-l2', 
          courseId: 'fin-s1', 
          title: 'Fundamental Analysis', 
          duration: '60m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. What is Fundamental Analysis?</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Fundamental analysis is a method of determining a stock's real or "fair market" value. It involves looking at everything from the overall economy and industry conditions to the financial strength and management of individual companies.
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 class="font-bold text-blue-900 mb-2">Key Financial Statements:</h4>
                  <ul class="space-y-2 text-sm text-blue-800">
                    <li>● <strong>Balance Sheet:</strong> Assets, Liabilities, and Equity.</li>
                    <li>● <strong>Income Statement:</strong> Revenue, Expenses, and Profit.</li>
                    <li>● <strong>Cash Flow Statement:</strong> Inflow and outflow of cash.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Important Ratios</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">P/E Ratio</h4>
                    <p class="text-xs text-slate-500">Price to Earnings. Indicates if a stock is overvalued or undervalued.</p>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">ROE</h4>
                    <p class="text-xs text-slate-500">Return on Equity. Measures how effectively management is using a company’s assets to create profits.</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'fin-p1',
      categoryId: 'finance',
      title: 'Personal Finance & Wealth Management',
      description: 'Master budgeting, tax planning, and retirement strategies.',
      thumbnail: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80',
      instructor: 'Ankur Warikoo',
      level: 'Beginner',
      duration: '15 Hours',
      lectures: [
        { 
          id: 'fin-p1-l1', 
          courseId: 'fin-p1', 
          title: 'The Psychology of Money', 
          duration: '40m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Wealth vs. Riches</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Being "rich" is having a high current income. Being "wealthy" is having assets that haven't been converted into the things you see (cars, houses, etc.).
                </p>
                <div class="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                  <p class="text-sm text-indigo-800 italic">"Wealth is what you don't see. It's the cars not purchased. The diamonds not bought. The watches not worn."</p>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. The Power of Compounding</h3>
                <p class="text-slate-600 mb-4">Compounding works best when you give it time. It's not about being a genius investor; it's about being an <strong>un-interruptible</strong> one.</p>
                <div class="p-6 bg-slate-900 text-white rounded-[2rem] text-center">
                  <p class="text-xl font-black text-emerald-400">Consistency > Intensity</p>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'mkt-s1',
      categoryId: 'marketing',
      title: 'SEO Masterclass: Rank #1 on Google',
      description: 'Learn On-page, Off-page, and Technical SEO to drive organic traffic.',
      thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      instructor: 'Neil Patel',
      level: 'Intermediate',
      duration: '30 Hours',
      lectures: [
        { 
          id: 'mkt-s1-l1', 
          courseId: 'mkt-s1', 
          title: 'Keyword Research', 
          duration: '50m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The Foundation of SEO: Keywords</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  Keyword research is the process of finding and analyzing search terms that people enter into search engines with the goal of using that data for a specific purpose, often for search engine optimization (SEO) or general marketing.
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 class="font-bold text-blue-900 mb-2">Types of Keywords:</h4>
                  <ul class="list-disc pl-5 space-y-2 text-blue-800 text-sm">
                    <li><strong>Short-tail:</strong> Broad, high volume (e.g., "Shoes").</li>
                    <li><strong>Long-tail:</strong> Specific, lower volume, higher conversion (e.g., "Red running shoes for marathons").</li>
                    <li><strong>LSI Keywords:</strong> Latent Semantic Indexing (related terms like "footwear", "sneakers").</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Search Intent</h3>
                <p class="text-slate-600 mb-6">Google prioritizes content that matches the user's intent. There are four main types:</p>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p class="font-bold text-slate-800">Informational</p>
                    <p class="text-xs text-slate-500">User wants to learn (e.g., "How to bake a cake").</p>
                  </div>
                  <div class="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <p class="font-bold text-slate-800">Transactional</p>
                    <p class="text-xs text-slate-500">User wants to buy (e.g., "Buy iPhone 15 Pro").</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practical Lab: Using Google Keyword Planner</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <p class="font-bold text-slate-800 mb-4">Step-by-Step Guide:</p>
                  <ol class="space-y-3 text-sm text-slate-600">
                    <li>1. Go to Google Ads and open Keyword Planner.</li>
                    <li>2. Enter your seed keyword (e.g., "Organic Coffee").</li>
                    <li>3. Filter by Location and Language.</li>
                    <li>4. Look for "Low Competition" with "High Search Volume".</li>
                  </ol>
                </div>
              </section>

              <section class="bg-slate-900 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">📈 Pro Tip</h3>
                <p class="text-slate-400 text-sm leading-relaxed">
                  Don't just chase high-volume keywords. Focus on <strong>Long-tail keywords</strong> as they are easier to rank for and often bring in more qualified leads who are ready to take action.
                </p>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'cyb-h1',
      categoryId: 'cyber',
      title: 'Ethical Hacking: The Complete Guide',
      description: 'Learn penetration testing, network security, and vulnerability assessment.',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
      instructor: 'The Cyber Mentor',
      level: 'Advanced',
      duration: '65 Hours',
      lectures: [
        { 
          id: 'cyb-h1-l1', 
          courseId: 'cyb-h1', 
          title: 'Networking Basics', 
          duration: '70m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. The OSI Model</h3>
                <p class="text-slate-600 leading-relaxed mb-6">
                  The Open Systems Interconnection (OSI) model is a conceptual framework used to understand how data is transmitted over a network. It consists of 7 layers.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-8">
                  <div class="space-y-3">
                    <div class="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <span class="text-blue-400 font-bold">L7</span>
                      <p class="text-sm text-slate-300"><strong>Application:</strong> HTTP, FTP, SMTP (User Interface)</p>
                    </div>
                    <div class="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <span class="text-blue-400 font-bold">L4</span>
                      <p class="text-sm text-slate-300"><strong>Transport:</strong> TCP, UDP (End-to-End Connection)</p>
                    </div>
                    <div class="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/10">
                      <span class="text-blue-400 font-bold">L3</span>
                      <p class="text-sm text-slate-300"><strong>Network:</strong> IP, ICMP (Routing & Addressing)</p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. TCP vs UDP</h3>
                <div class="grid md:grid-cols-2 gap-6">
                  <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
                    <h4 class="font-bold text-emerald-900 mb-2">TCP (Transmission Control Protocol)</h4>
                    <p class="text-xs text-emerald-800">Connection-oriented, reliable, slower. Used for Web, Email.</p>
                  </div>
                  <div class="p-6 bg-rose-50 rounded-3xl border border-rose-100">
                    <h4 class="font-bold text-rose-900 mb-2">UDP (User Datagram Protocol)</h4>
                    <p class="text-xs text-rose-800">Connectionless, unreliable, faster. Used for Streaming, Gaming.</p>
                  </div>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">3. Practical: Common Ports to Know</h3>
                <div class="bg-white border-2 border-slate-100 rounded-[2rem] p-8 shadow-sm">
                  <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div class="text-center p-4 bg-slate-50 rounded-2xl">
                      <p class="text-xs font-black text-slate-400">HTTP</p>
                      <p class="font-bold text-slate-800">80</p>
                    </div>
                    <div class="text-center p-4 bg-slate-50 rounded-2xl">
                      <p class="text-xs font-black text-slate-400">HTTPS</p>
                      <p class="font-bold text-slate-800">443</p>
                    </div>
                    <div class="text-center p-4 bg-slate-50 rounded-2xl">
                      <p class="text-xs font-black text-slate-400">SSH</p>
                      <p class="font-bold text-slate-800">22</p>
                    </div>
                    <div class="text-center p-4 bg-slate-50 rounded-2xl">
                      <p class="text-xs font-black text-slate-400">FTP</p>
                      <p class="font-bold text-slate-800">21</p>
                    </div>
                  </div>
                </div>
              </section>

              <section class="bg-blue-600 text-white p-10 rounded-[3rem]">
                <h3 class="text-xl font-black mb-4">🛡️ Security Insight</h3>
                <p class="text-blue-100 text-sm leading-relaxed">
                  Most attacks happen at the <strong>Application Layer (L7)</strong>. Understanding how protocols like HTTP work is essential for web penetration testing and defending against SQLi or XSS.
                </p>
              </section>
            </div>
          `
        },
        { 
          id: 'cyb-h1-l2', 
          courseId: 'cyb-h1', 
          title: 'Linux for Hackers', 
          duration: '80m', 
          order: 2, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Why Linux?</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Linux is the backbone of the internet and the preferred OS for security professionals due to its transparency, power, and vast array of security tools.
                </p>
                <div class="bg-slate-900 rounded-[2rem] p-8">
                  <pre class="text-emerald-400 text-xs leading-relaxed">
# Essential Commands
ls -la       # List all files with details
cd /etc      # Change directory
pwd          # Print working directory
sudo su      # Switch to root user
grep "pass"  # Search for pattern</pre>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. File Permissions</h3>
                <p class="text-slate-600 mb-4">Understanding <strong>chmod</strong> and <strong>chown</strong> is critical for privilege escalation and system hardening.</p>
                <div class="grid md:grid-cols-3 gap-4">
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Read (4)</h4>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Write (2)</h4>
                  </div>
                  <div class="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-center">
                    <h4 class="font-bold text-slate-900">Execute (1)</h4>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    },
    {
      id: 'skill-soft1',
      categoryId: 'skills',
      title: 'Soft Skills & Communication',
      description: 'Improve your public speaking, body language, and professional writing.',
      thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80',
      instructor: 'Vikas Khanna',
      level: 'Beginner',
      duration: '12 Hours',
      lectures: [
        { 
          id: 'skill-soft1-l1', 
          courseId: 'skill-soft1', 
          title: 'Effective Public Speaking', 
          duration: '45m', 
          order: 1, 
          content: `
            <div class="space-y-8">
              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">1. Overcoming Glossophobia</h3>
                <p class="text-slate-600 leading-relaxed mb-4">
                  Fear of public speaking is common. The key is to shift focus from <strong>yourself</strong> to your <strong>audience</strong>.
                </p>
                <div class="bg-blue-50 p-6 rounded-3xl border border-blue-100">
                  <h4 class="font-bold text-blue-900 mb-2">The 3-P Formula:</h4>
                  <ul class="space-y-2 text-sm text-blue-800">
                    <li>● <strong>Prepare:</strong> Know your content inside out.</li>
                    <li>● <strong>Practice:</strong> Rehearse in front of a mirror or record yourself.</li>
                    <li>● <strong>Perform:</strong> Focus on delivering value, not perfection.</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 class="text-2xl font-black text-slate-900 mb-4 tracking-tight">2. Body Language</h3>
                <div class="grid md:grid-cols-2 gap-4">
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Eye Contact</h4>
                    <p class="text-xs text-slate-500">Connect with individuals, not just the room.</p>
                  </div>
                  <div class="p-6 bg-slate-50 rounded-3xl border border-slate-200">
                    <h4 class="font-bold text-slate-900">Hand Gestures</h4>
                    <p class="text-xs text-slate-500">Use them to emphasize key points naturally.</p>
                  </div>
                </div>
              </section>
            </div>
          `
        }
      ]
    }
  ];

  let userProgress: any[] = [];

  app.get("/api/user", (req, res) => {
    try {
      res.json({
        name: "Adhyaan Sirohi",
        email: "sirohiadhyaan@gmail.com",
        role: "Verified Citizen",
        joinDate: "Jan 2024",
        avatar: "https://api.dicebear.com/7.x/personas/svg?seed=Adhyaan",
        bio: "Urban planning enthusiast and active contributor to Delhi's smart city initiatives. Focused on improving local waste management and road infrastructure."
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user profile" });
    }
  });

  app.get("/api/learning/categories", (req, res) => {
    try {
      res.json(categories);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  app.get("/api/learning/courses", (req, res) => {
    try {
      const { categoryId } = req.query;
      if (categoryId) {
        return res.json(courses.filter(c => c.categoryId === categoryId));
      }
      res.json(courses);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch courses" });
    }
  });

  app.get("/api/learning/progress", (req, res) => {
    try {
      res.json(userProgress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  app.post("/api/learning/progress", (req, res) => {
    try {
      const { courseId, lectureId, completed } = req.body;
      let progress = userProgress.find(p => p.courseId === courseId);
      if (!progress) {
        progress = { courseId, completedLectures: [], progressPercent: 0 };
        userProgress.push(progress);
      }

      if (completed) {
        if (!progress.completedLectures.includes(lectureId)) {
          progress.completedLectures.push(lectureId);
        }
      } else {
        progress.completedLectures = progress.completedLectures.filter((id: string) => id !== lectureId);
      }

      const course = courses.find(c => c.id === courseId);
      if (course) {
        progress.progressPercent = Math.round((progress.completedLectures.length / course.lectures.length) * 100);
      }

      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to update progress" });
    }
  });

  app.get("/api/agri-data", (req, res) => {
    try {
      // Simulate live agriculture data for Delhi/NCR region
      const marketPrices = [
        { crop: 'Wheat', price: '₹2,125', unit: 'Quintal', trend: 'up', change: '+2.5%' },
        { crop: 'Paddy (Basmati)', price: '₹3,850', unit: 'Quintal', trend: 'down', change: '-1.2%' },
        { crop: 'Mustard', price: '₹5,450', unit: 'Quintal', trend: 'stable', change: '0%' },
        { crop: 'Potato', price: '₹1,200', unit: 'Quintal', trend: 'up', change: '+5.8%' },
        { crop: 'Onion', price: '₹1,850', unit: 'Quintal', trend: 'up', change: '+12.4%' },
        { crop: 'Tomato', price: '₹2,400', unit: 'Quintal', trend: 'down', change: '-8.5%' },
      ];

      const weatherAlerts = [
        { type: 'Heatwave', severity: 'high', message: 'Intense heat expected. Irrigate crops during early morning or late evening.', time: 'Active' },
        { type: 'Dust Storm', severity: 'medium', message: 'Strong winds likely. Secure polyhouses and young saplings.', time: 'Expected in 4h' },
      ];

      // Randomize values slightly to simulate live feed
      const baseTemp = 38;
      const tempVar = (Math.random() * 4 - 2).toFixed(1);
      const baseAqi = 240;
      const aqiVar = Math.floor(Math.random() * 40 - 20);
      const currentAqi = baseAqi + aqiVar;

      const liveWeather = {
        temp: `${(baseTemp + parseFloat(tempVar)).toFixed(1)}°C`,
        condition: currentAqi > 250 ? 'Hazy' : 'Sunny',
        humidity: `${Math.floor(Math.random() * 10 + 20)}%`,
        windSpeed: `${Math.floor(Math.random() * 5 + 10)} km/h`,
        aqi: currentAqi,
        aqiStatus: currentAqi > 300 ? 'Hazardous' : currentAqi > 200 ? 'Poor' : 'Moderate',
        aqiColor: currentAqi > 300 ? 'text-red-500' : currentAqi > 200 ? 'text-orange-500' : 'text-yellow-500',
        visibility: `${(Math.random() * 2 + 2).toFixed(1)} km`,
        uvIndex: 'High (9)'
      };

      res.json({
        marketPrices,
        weatherAlerts,
        liveWeather,
        lastUpdated: new Date().toLocaleTimeString(),
        location: 'Najafgarh Mandi, Delhi'
      });
    } catch (error) {
      console.error("Agri data error:", error);
      res.status(500).json({ error: "Failed to fetch agri data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
