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
    { id: 'skills', title: 'Skill Development', description: 'Learn Coding, AI, Communication, and more for the future.', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80', icon: 'Zap' }
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
            <h3 class="text-xl font-bold mb-4">Theory: Vectors in Physics</h3>
            <p class="mb-4">Vectors are quantities that have both magnitude and direction. They are essential for representing physical quantities like displacement, velocity, and force.</p>
            <h4 class="font-bold mb-2">Key Concepts:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li><strong>Vector Addition:</strong> Triangle law and Parallelogram law of vector addition.</li>
              <li><strong>Dot Product (Scalar Product):</strong> A · B = |A||B|cosθ. Result is a scalar.</li>
              <li><strong>Cross Product (Vector Product):</strong> A × B = |A||B|sinθ n̂. Result is a vector perpendicular to both A and B.</li>
            </ul>
            <h4 class="font-bold mb-2">Numerical Problem:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: If vector A = 3i + 4j and vector B = i + j, find the magnitude of A + B.</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: √41 ≈ 6.4</p>
              <p class="text-sm text-slate-500 mt-1">Solution: A + B = (3+1)i + (4+1)j = 4i + 5j. Magnitude = √(4² + 5²) = √(16 + 25) = √41.</p>
            </div>
          `
        },
        { id: 'jee-p1-l2', courseId: 'jee-p1', title: 'Laws of Motion - Part 1', duration: '58m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Newton\'s Laws of Motion</h3><p>Newton\'s laws of motion are three physical laws that, together, laid the foundation for classical mechanics.</p>' },
        { id: 'jee-p1-l3', courseId: 'jee-p1', title: 'Work, Energy and Power', duration: '64m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Work-Energy Theorem</h3><p>The work done by the net force on a particle equals the change in its kinetic energy.</p>' },
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
        { id: 'jee-c1-l2', courseId: 'jee-c1', title: 'Isomerism in Organic Compounds', duration: '65m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Isomerism</h3><p>Isomers are compounds with the same molecular formula but different structural arrangements or spatial orientations.</p>' },
        { id: 'jee-c1-l3', courseId: 'jee-c1', title: 'Reaction Mechanisms', duration: '80m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Reaction Mechanisms</h3><p>Detailed step-by-step description of how a chemical reaction occurs, including intermediates and transition states.</p>' }
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
        { id: 'jee-m1-l2', courseId: 'jee-m1', title: 'Application of Derivatives', duration: '75m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Application of Derivatives</h3><p>Using derivatives to find rates of change, tangents, normals, and maxima/minima.</p>' },
        { id: 'jee-m1-l3', courseId: 'jee-m1', title: 'Definite Integration', duration: '90m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Definite Integration</h3><p>Calculating the area under a curve between two points.</p>' },
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
            <h3 class="text-xl font-bold mb-4">Theory: Digestion and Absorption</h3>
            <p class="mb-4">Digestion is the process of breaking down complex food substances into simple absorbable forms.</p>
            <h4 class="font-bold mb-2">Key Organs:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li><strong>Mouth:</strong> Mechanical digestion and start of carbohydrate digestion by salivary amylase.</li>
              <li><strong>Stomach:</strong> Protein digestion by pepsin and HCl.</li>
              <li><strong>Small Intestine:</strong> Complete digestion and absorption of nutrients.</li>
            </ul>
            <h4 class="font-bold mb-2">Numerical/Fact:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: What is the dental formula of an adult human?</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: 2123/2123</p>
              <p class="text-sm text-slate-500 mt-1">Explanation: 2 Incisors, 1 Canine, 2 Premolars, 3 Molars in each half of upper and lower jaw.</p>
            </div>
          `
        },
        { id: 'neet-b1-l2', courseId: 'neet-b1', title: 'Breathing and Exchange of Gases', duration: '60m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Respiration</h3><p>The process of exchange of O2 from the atmosphere with CO2 produced by the cells.</p>' },
        { id: 'neet-b1-l3', courseId: 'neet-b1', title: 'Body Fluids and Circulation', duration: '65m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Circulatory System</h3><p>Blood and lymph are the main circulating fluids in the human body.</p>' }
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
            <h3 class="text-xl font-bold mb-4">Theory: Real Numbers</h3>
            <p class="mb-4">Real numbers consist of all the rational and irrational numbers.</p>
            <h4 class="font-bold mb-2">Euclid's Division Lemma:</h4>
            <p class="mb-4">For any two positive integers a and b, there exist unique integers q and r such that a = bq + r, where 0 ≤ r < b.</p>
            <h4 class="font-bold mb-2">Numerical Problem:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Q: Find the HCF of 135 and 225 using Euclid's division algorithm.</p>
              <p class="mt-2 text-blue-600 font-bold">Answer: 45</p>
              <p class="text-sm text-slate-500 mt-1">Solution: 225 = 135 * 1 + 90; 135 = 90 * 1 + 45; 90 = 45 * 2 + 0. Since remainder is 0, HCF is 45.</p>
            </div>
          `
        },
        { id: 'c10-m1-l2', courseId: 'c10-m1', title: 'Polynomials', duration: '50m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Polynomials</h3><p>An expression consisting of variables and coefficients.</p>' },
        { id: 'c10-m1-l3', courseId: 'c10-m1', title: 'Quadratic Equations', duration: '55m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Quadratic Formula</h3><p>x = [-b ± √(b² - 4ac)] / 2a</p>' }
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
        { id: 'c10-s1-l2', courseId: 'c10-s1', title: 'Balancing Chemical Equations', duration: '45m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Balancing Chemical Equations</h3><p>Ensuring the number of atoms of each element is the same on both sides of the equation.</p>' },
        { id: 'c10-s1-l3', courseId: 'c10-s1', title: 'Acids, Bases and Salts', duration: '50m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Acids, Bases and Salts</h3><p>Understanding pH, neutralization reactions, and properties of various salts.</p>' },
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
        { id: 'c10-m2-l1', courseId: 'c10-m2', title: 'Introduction to Trigonometry', duration: '60m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Introduction to Trigonometry</h3><p>Study of relationships between side lengths and angles of triangles.</p>' },
        { id: 'c10-m2-l2', courseId: 'c10-m2', title: 'Trigonometric Identities', duration: '65m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Trigonometric Identities</h3><p>Equations involving trigonometric functions that are true for every value of the occurring variables.</p>' }
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
        { id: 'c10-ss1-l1', courseId: 'c10-ss1', title: 'Nationalism in India', duration: '55m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Nationalism in India</h3><p>The growth of modern nationalism in India and the struggle for independence.</p>' },
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
        { id: 'c12-p1-l1', courseId: 'c12-p1', title: 'Electric Charges & Fields', duration: '55m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Electric Charges & Fields</h3><p>Study of electric charges at rest and the fields they create.</p>' },
        { id: 'c12-p1-l2', courseId: 'c12-p1', title: 'Electrostatic Potential', duration: '60m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Electrostatic Potential</h3><p>Work done per unit charge in bringing a charge from infinity to a point.</p>' },
        { id: 'c12-p1-l3', courseId: 'c12-p1', title: 'Capacitance', duration: '50m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Capacitance</h3><p>The ability of a system to store an electric charge.</p>' }
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
        { id: 'c12-c1-l1', courseId: 'c12-c1', title: 'Crystal Lattices & Unit Cells', duration: '50m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Crystal Lattices & Unit Cells</h3><p>The symmetrical three-dimensional arrangement of atoms inside a crystal.</p>' },
        { id: 'c12-c1-l2', courseId: 'c12-c1', title: 'Imperfections in Solids', duration: '45m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Imperfections in Solids</h3><p>Deviations from the perfectly ordered arrangement of atoms in a crystal.</p>' },
        { id: 'c12-c1-l3', courseId: 'c12-c1', title: 'Solutions & Colligative Properties', duration: '60m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Solutions & Colligative Properties</h3><p>Properties of solutions that depend on the ratio of the number of solute particles to the number of solvent molecules.</p>' }
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
        { id: 'c12-m1-l1', courseId: 'c12-m1', title: 'Types of Relations', duration: '55m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Types of Relations</h3><p>Reflexive, symmetric, transitive, and equivalence relations.</p>' },
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
        { id: 'c12-e1-l1', courseId: 'c12-e1', title: 'The Last Lesson', duration: '40m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: The Last Lesson</h3><p>A story about the importance of one\'s language and the impact of war on education.</p>' },
        { id: 'c12-e1-l2', courseId: 'c12-e1', title: 'Lost Spring', duration: '45m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Lost Spring</h3><p>Stories of stolen childhood and the plight of street children.</p>' },
        { id: 'c12-e1-l3', courseId: 'c12-e1', title: 'Deep Water', duration: '50m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Deep Water</h3><p>An autobiographical account of overcoming fear of water.</p>' }
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
            <h3 class="text-xl font-bold mb-4">Theory: HTML & CSS Basics</h3>
            <p class="mb-4">HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser. CSS (Cascading Style Sheets) is a style sheet language used for describing the presentation of a document written in HTML.</p>
            <h4 class="font-bold mb-2">Key Concepts:</h4>
            <ul class="list-disc pl-5 mb-4">
              <li><strong>Semantic HTML:</strong> Using tags like &lt;header&gt;, &lt;footer&gt;, &lt;article&gt; for better structure.</li>
              <li><strong>Box Model:</strong> Content, Padding, Border, and Margin.</li>
              <li><strong>Flexbox:</strong> A one-dimensional layout method for arranging items in rows or columns.</li>
            </ul>
            <h4 class="font-bold mb-2">Practical Task:</h4>
            <div class="bg-slate-50 p-4 rounded-lg border border-slate-200">
              <p class="font-medium italic">Task: Create a simple navbar using Flexbox.</p>
              <pre class="mt-2 text-xs bg-slate-800 text-white p-2 rounded">
nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}</pre>
            </div>
          `
        },
        { id: 'skill-w1-l2', courseId: 'skill-w1', title: 'JavaScript Fundamentals', duration: '120m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: JavaScript</h3><p>JavaScript is a high-level, often just-in-time compiled language that conforms to the ECMAScript specification.</p>' },
        { id: 'skill-w1-l3', courseId: 'skill-w1', title: 'React JS Tutorial', duration: '105m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: React Hooks</h3><p>Hooks are functions that let you "hook into" React state and lifecycle features from function components.</p>' },
        { id: 'skill-w1-l4', courseId: 'skill-w1', title: 'Node.js & Express', duration: '110m', order: 4, content: '<h3 class="text-xl font-bold mb-4">Theory: Express Middleware</h3><p>Middleware functions are functions that have access to the request object, the response object, and the next middleware function in the application’s request-response cycle.</p>' }
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
        { id: 'skill-a1-l2', courseId: 'skill-a1', title: 'Supervised vs Unsupervised', duration: '50m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Supervised Learning</h3><p>Regression and Classification are the two main types of supervised learning.</p>' },
        { id: 'skill-a1-l3', courseId: 'skill-a1', title: 'Neural Networks Explained', duration: '60m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Neural Networks</h3><p>Inspired by the human brain, neural networks consist of layers of interconnected nodes.</p>' }
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
          content: '<h3 class="text-xl font-bold mb-4">Theory: UI Design</h3><p>User Interface design is the process of making interfaces in software or computerized devices with a focus on looks or style.</p>'
        },
        { id: 'skill-u1-l2', courseId: 'skill-u1', title: 'UX Research Methods', duration: '55m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: UX Research</h3><p>User experience research is the systematic study of target users and their requirements, to add realistic contexts and insights to design processes.</p>' }
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
          content: '<h3 class="text-xl font-bold mb-4">Theory: Python Basics</h3><p>Python is an interpreted, high-level and general-purpose programming language.</p>'
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
          content: '<h3 class="text-xl font-bold mb-4">Theory: Data Science</h3><p>Data science is an interdisciplinary field that uses scientific methods, processes, algorithms and systems to extract knowledge and insights from noisy, structured and unstructured data.</p>'
        },
        { id: 'skill-d1-l2', courseId: 'skill-d1', title: 'NumPy for Data Science', duration: '45m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: NumPy</h3><p>NumPy is a library for the Python programming language, adding support for large, multi-dimensional arrays and matrices.</p>' },
        { id: 'skill-d1-l3', courseId: 'skill-d1', title: 'Pandas Masterclass', duration: '60m', order: 3, content: '<h3 class="text-xl font-bold mb-4">Theory: Pandas</h3><p>Pandas is a software library written for the Python programming language for data manipulation and analysis.</p>' },
        { id: 'skill-d1-l4', courseId: 'skill-d1', title: 'Matplotlib Visualization', duration: '30m', order: 4, content: '<h3 class="text-xl font-bold mb-4">Theory: Matplotlib</h3><p>Matplotlib is a plotting library for the Python programming language and its numerical mathematics extension NumPy.</p>' }
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
        { id: 'jee-p3-l1', courseId: 'jee-p3', title: 'Coulomb\'s Law', duration: '50m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Coulomb\'s Law</h3><p>The force between two point charges is directly proportional to the product of the charges and inversely proportional to the square of the distance between them.</p>' },
        { id: 'jee-p3-l2', courseId: 'jee-p3', title: 'Electric Field Lines', duration: '45m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: Electric Field Lines</h3><p>Imaginary lines used to visualize the direction and strength of an electric field.</p>' }
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
        { id: 'neet-b3-l1', courseId: 'neet-b3', title: 'Mendelian Genetics', duration: '60m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Mendelian Genetics</h3><p>Mendel\'s laws of inheritance include the Law of Dominance, Law of Segregation, and Law of Independent Assortment.</p>' },
        { id: 'neet-b3-l2', courseId: 'neet-b3', title: 'DNA Structure', duration: '55m', order: 2, content: '<h3 class="text-xl font-bold mb-4">Theory: DNA Structure</h3><p>DNA is a double helix structure composed of nucleotides.</p>' }
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
        { id: 'class10-s2-l1', courseId: 'class10-s2', title: 'Nutrition in Plants', duration: '40m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Nutrition in Plants</h3><p>How plants prepare their own food through photosynthesis.</p>' }
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
        { id: 'class12-c2-l1', courseId: 'class12-c2', title: 'Introduction to Organic', duration: '45m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Introduction to Organic</h3><p>Basic principles and techniques of organic chemistry.</p>' }
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
        { id: 'skill-ai1-l1', courseId: 'skill-ai1', title: 'What is GenAI?', duration: '15m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: What is GenAI?</h3><p>Generative AI refers to artificial intelligence that can generate new content, such as text, images, or other media.</p>' }
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
        { id: 'jee-m2-l1', courseId: 'jee-m2', title: 'Introduction to Limits', duration: '50m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Limits</h3><p>The value that a function approaches as the input approaches some value.</p>' }
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
        { id: 'neet-c2-l1', courseId: 'neet-c2', title: 'Inductive Effect', duration: '45m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Inductive Effect</h3><p>Permanent displacement of sigma electrons along a saturated carbon chain.</p>' }
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
        { id: 'class10-m1-l1', courseId: 'class10-m1', title: 'Trigonometry Basics', duration: '30m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: Trigonometry</h3><p>Study of relationships between side lengths and angles of triangles.</p>' }
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
        { id: 'jee-c2-l1', courseId: 'jee-c2', title: 'VSEPR Theory', duration: '50m', order: 1, content: '<h3 class="text-xl font-bold mb-4">Theory: VSEPR Theory</h3><p>Valence Shell Electron Pair Repulsion theory is used to predict the geometry of individual molecules.</p>' }
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
          content: '<h3 class="text-xl font-bold mb-4">Theory: Reflection</h3><p>Reflection of light from spherical mirrors and its applications.</p>'
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
