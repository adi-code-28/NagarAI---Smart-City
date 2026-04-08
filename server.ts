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
      id: 'e1',
      title: 'Delhi Smart City Hackathon 2026',
      category: 'hackathon',
      date: 'May 15, 2026',
      time: '09:00 AM',
      location: 'IIT Delhi, Hauz Khas',
      description: 'A 48-hour hackathon to solve urban challenges using AI and IoT. Win prizes up to ₹5 Lakhs.',
      organizer: 'Delhi Government & IIT Delhi',
      image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800',
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
      image: 'https://images.unsplash.com/photo-1514525253361-bee8718a74a2?auto=format&fit=crop&q=80&w=800',
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
      image: 'https://images.unsplash.com/photo-1591115765373-520b7a217294?auto=format&fit=crop&q=80&w=800',
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
      image: 'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&q=80&w=800',
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
      image: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?auto=format&fit=crop&q=80&w=800',
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
      image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800',
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
      image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=800',
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
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
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
      image: 'https://images.unsplash.com/photo-1475721027185-404ebc77d3f0?auto=format&fit=crop&q=80&w=800',
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
      image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=800',
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
    { id: 'jee', title: 'JEE Preparation', description: 'Master Physics, Chemistry, and Maths for JEE Main & Advanced.', thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800', icon: 'GraduationCap' },
    { id: 'neet', title: 'NEET Preparation', description: 'Comprehensive Biology, Physics, and Chemistry for Medical aspirants.', thumbnail: 'https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&q=80&w=800', icon: 'Activity' },
    { id: 'class10', title: 'Class 10 Boards', description: 'Complete syllabus coverage for Class 10 Board exams.', thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=800', icon: 'BookOpen' },
    { id: 'class12', title: 'Class 12 Boards', description: 'In-depth preparation for Class 12 Board exams and competitive basics.', thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800', icon: 'Book' },
    { id: 'skills', title: 'Skill Development', description: 'Learn Coding, AI, Communication, and more for the future.', thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800', icon: 'Zap' }
  ];

  const courses = [
    // JEE Preparation
    {
      id: 'jee-p1',
      categoryId: 'jee',
      title: 'JEE Physics: Mechanics Masterclass',
      description: 'Comprehensive coverage of Mechanics for JEE Main & Advanced. From Kinematics to Rotational Dynamics.',
      thumbnail: 'https://images.unsplash.com/photo-1636466484202-cae263f05812?auto=format&fit=crop&q=80&w=800',
      instructor: 'Alakh Pandey (PW)',
      level: 'Advanced',
      duration: '45 Hours',
      lectures: [
        { id: 'jee-p1-l1', courseId: 'jee-p1', title: 'Introduction to Vectors', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '52m', order: 1 },
        { id: 'jee-p1-l2', courseId: 'jee-p1', title: 'Laws of Motion - Part 1', videoUrl: 'https://www.youtube.com/embed/XqE6-X7uL-U', duration: '58m', order: 2 },
        { id: 'jee-p1-l3', courseId: 'jee-p1', title: 'Work, Energy and Power', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '64m', order: 3 },
        { id: 'jee-p1-l4', courseId: 'jee-p1', title: 'Circular Motion', videoUrl: 'https://www.youtube.com/embed/XqE6-X7uL-U', duration: '55m', order: 4 },
        { id: 'jee-p1-l5', courseId: 'jee-p1', title: 'Rotational Dynamics', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '70m', order: 5 }
      ]
    },
    {
      id: 'jee-c1',
      categoryId: 'jee',
      title: 'JEE Chemistry: Organic Fundamentals',
      description: 'Master the core concepts of Organic Chemistry, reaction mechanisms, and IUPAC nomenclature.',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf51ad990de?auto=format&fit=crop&q=80&w=800',
      instructor: 'Dr. Pankaj Sijairya',
      level: 'Advanced',
      duration: '38 Hours',
      lectures: [
        { id: 'jee-c1-l1', courseId: 'jee-c1', title: 'General Organic Chemistry (GOC)', videoUrl: 'https://www.youtube.com/embed/f_zG6mH1vC8', duration: '72m', order: 1 },
        { id: 'jee-c1-l2', courseId: 'jee-c1', title: 'Isomerism in Organic Compounds', videoUrl: 'https://www.youtube.com/embed/f_zG6mH1vC8', duration: '65m', order: 2 },
        { id: 'jee-c1-l3', courseId: 'jee-c1', title: 'Reaction Mechanisms', videoUrl: 'https://www.youtube.com/embed/f_zG6mH1vC8', duration: '80m', order: 3 }
      ]
    },
    {
      id: 'jee-m1',
      categoryId: 'jee',
      title: 'JEE Maths: Calculus for Advanced',
      description: 'Deep dive into Differential and Integral Calculus for JEE Advanced level problem solving.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
      instructor: 'Sachin Sir (PW)',
      level: 'Advanced',
      duration: '50 Hours',
      lectures: [
        { id: 'jee-m1-l1', courseId: 'jee-m1', title: 'Limits, Continuity & Differentiability', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '80m', order: 1 },
        { id: 'jee-m1-l2', courseId: 'jee-m1', title: 'Application of Derivatives', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '75m', order: 2 },
        { id: 'jee-m1-l3', courseId: 'jee-m1', title: 'Definite Integration', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '90m', order: 3 },
        { id: 'jee-m1-l4', courseId: 'jee-m1', title: 'Differential Equations', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '85m', order: 4 }
      ]
    },
    {
      id: 'jee-p2',
      categoryId: 'jee',
      title: 'JEE Physics: Electromagnetism',
      description: 'Master Electrostatics, Current Electricity, and Magnetism for JEE.',
      thumbnail: 'https://images.unsplash.com/photo-1516339901600-2e1a62dc0c45?auto=format&fit=crop&q=80&w=800',
      instructor: 'Alakh Pandey (PW)',
      level: 'Advanced',
      duration: '40 Hours',
      lectures: [
        { id: 'jee-p2-l1', courseId: 'jee-p2', title: 'Electric Charges & Fields', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '65m', order: 1 },
        { id: 'jee-p2-l2', courseId: 'jee-p2', title: 'Current Electricity', videoUrl: 'https://www.youtube.com/embed/XqE6-X7uL-U', duration: '70m', order: 2 }
      ]
    },

    // NEET Preparation
    {
      id: 'neet-b1',
      categoryId: 'neet',
      title: 'NEET Biology: Human Physiology',
      description: 'Detailed exploration of human body systems, vital for NEET aspirants.',
      thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
      instructor: 'Dr. Samapti Mam',
      level: 'Intermediate',
      duration: '42 Hours',
      lectures: [
        { id: 'neet-b1-l1', courseId: 'neet-b1', title: 'Digestion and Absorption', videoUrl: 'https://www.youtube.com/embed/pC_278v6v_Y', duration: '55m', order: 1 },
        { id: 'neet-b1-l2', courseId: 'neet-b1', title: 'Breathing and Exchange of Gases', videoUrl: 'https://www.youtube.com/embed/pC_278v6v_Y', duration: '60m', order: 2 },
        { id: 'neet-b1-l3', courseId: 'neet-b1', title: 'Body Fluids and Circulation', videoUrl: 'https://www.youtube.com/embed/pC_278v6v_Y', duration: '65m', order: 3 }
      ]
    },
    {
      id: 'neet-p1',
      categoryId: 'neet',
      title: 'NEET Physics: Ray Optics',
      description: 'Master the principles of light, reflection, and refraction for NEET.',
      thumbnail: 'https://images.unsplash.com/photo-1516339901600-2e1a62dc0c45?auto=format&fit=crop&q=80&w=800',
      instructor: 'MR Sir',
      level: 'Intermediate',
      duration: '30 Hours',
      lectures: [
        { id: 'neet-p1-l1', courseId: 'neet-p1', title: 'Reflection of Light', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '50m', order: 1 },
        { id: 'neet-p1-l2', courseId: 'neet-p1', title: 'Refraction & Lenses', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '55m', order: 2 },
        { id: 'neet-p1-l3', courseId: 'neet-p1', title: 'Optical Instruments', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '60m', order: 3 }
      ]
    },
    {
      id: 'neet-c1',
      categoryId: 'neet',
      title: 'NEET Chemistry: Chemical Bonding',
      description: 'Understand the forces that hold atoms together in molecules.',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf51ad990de?auto=format&fit=crop&q=80&w=800',
      instructor: 'Sudhanshu Sir (PW)',
      level: 'Intermediate',
      duration: '25 Hours',
      lectures: [
        { id: 'neet-c1-l1', courseId: 'neet-c1', title: 'Ionic & Covalent Bonding', videoUrl: 'https://www.youtube.com/embed/f_zG6mH1vC8', duration: '60m', order: 1 },
        { id: 'neet-c1-l2', courseId: 'neet-c1', title: 'VSEPR Theory', videoUrl: 'https://www.youtube.com/embed/f_zG6mH1vC8', duration: '55m', order: 2 },
        { id: 'neet-c1-l3', courseId: 'neet-c1', title: 'Molecular Orbital Theory', videoUrl: 'https://www.youtube.com/embed/f_zG6mH1vC8', duration: '65m', order: 3 }
      ]
    },
    {
      id: 'neet-b2',
      categoryId: 'neet',
      title: 'NEET Biology: Genetics & Evolution',
      description: 'Master the principles of inheritance and the history of life.',
      thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
      instructor: 'Dr. Samapti Mam (PW)',
      level: 'Advanced',
      duration: '45 Hours',
      lectures: [
        { id: 'neet-b2-l1', courseId: 'neet-b2', title: 'Mendelian Genetics', videoUrl: 'https://www.youtube.com/embed/pC_278v6v_Y', duration: '70m', order: 1 },
        { id: 'neet-b2-l2', courseId: 'neet-b2', title: 'Molecular Basis of Inheritance', videoUrl: 'https://www.youtube.com/embed/pC_278v6v_Y', duration: '80m', order: 2 }
      ]
    },

    // Class 10 Boards
    {
      id: 'c10-m1',
      categoryId: 'class10',
      title: 'Class 10 Maths: Full Board Prep',
      description: 'Complete syllabus coverage for Class 10 Mathematics Board Exams.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
      instructor: 'Sunil Sir',
      level: 'Beginner',
      duration: '35 Hours',
      lectures: [
        { id: 'c10-m1-l1', courseId: 'c10-m1', title: 'Real Numbers', videoUrl: 'https://www.youtube.com/embed/7u_X2_6_X_M', duration: '45m', order: 1 },
        { id: 'c10-m1-l2', courseId: 'c10-m1', title: 'Polynomials', videoUrl: 'https://www.youtube.com/embed/7u_X2_6_X_M', duration: '50m', order: 2 },
        { id: 'c10-m1-l3', courseId: 'c10-m1', title: 'Quadratic Equations', videoUrl: 'https://www.youtube.com/embed/7u_X2_6_X_M', duration: '55m', order: 3 }
      ]
    },
    {
      id: 'c10-s1',
      categoryId: 'class10',
      title: 'Class 10 Science: Chemical Reactions',
      description: 'Understand the core concepts of chemical reactions and equations.',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf51ad990de?auto=format&fit=crop&q=80&w=800',
      instructor: 'Rakshita Mam (PW)',
      level: 'Beginner',
      duration: '28 Hours',
      lectures: [
        { id: 'c10-s1-l1', courseId: 'c10-s1', title: 'Types of Chemical Reactions', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '40m', order: 1 },
        { id: 'c10-s1-l2', courseId: 'c10-s1', title: 'Balancing Chemical Equations', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '45m', order: 2 },
        { id: 'c10-s1-l3', courseId: 'c10-s1', title: 'Acids, Bases and Salts', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '50m', order: 3 },
        { id: 'c10-s1-l4', courseId: 'c10-s1', title: 'Metals and Non-Metals', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '55m', order: 4 }
      ]
    },
    {
      id: 'c10-m2',
      categoryId: 'class10',
      title: 'Class 10 Maths: Trigonometry',
      description: 'Master the basics and applications of Trigonometry for Boards.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800',
      instructor: 'Sunil Sir (PW)',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { id: 'c10-m2-l1', courseId: 'c10-m2', title: 'Introduction to Trigonometry', videoUrl: 'https://www.youtube.com/embed/7u_X2_6_X_M', duration: '60m', order: 1 },
        { id: 'c10-m2-l2', courseId: 'c10-m2', title: 'Trigonometric Identities', videoUrl: 'https://www.youtube.com/embed/7u_X2_6_X_M', duration: '65m', order: 2 }
      ]
    },
    {
      id: 'c10-ss1',
      categoryId: 'class10',
      title: 'Class 10 Social Science: History',
      description: 'Comprehensive guide to Nationalism in India and Europe.',
      thumbnail: 'https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=800',
      instructor: 'Digraj Sir',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { id: 'c10-ss1-l1', courseId: 'c10-ss1', title: 'Nationalism in India', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '55m', order: 1 },
        { id: 'c10-ss1-l2', courseId: 'c10-ss1', title: 'The Rise of Nationalism in Europe', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '60m', order: 2 }
      ]
    },

    // Class 12 Boards
    {
      id: 'c12-p1',
      categoryId: 'class12',
      title: 'Class 12 Physics: Electrostatics',
      description: 'In-depth study of electric charges and fields for Board exams.',
      thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800',
      instructor: 'Abhishek Sir',
      level: 'Intermediate',
      duration: '32 Hours',
      lectures: [
        { id: 'c12-p1-l1', courseId: 'c12-p1', title: 'Electric Charges & Fields', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '55m', order: 1 },
        { id: 'c12-p1-l2', courseId: 'c12-p1', title: 'Electrostatic Potential', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '60m', order: 2 },
        { id: 'c12-p1-l3', courseId: 'c12-p1', title: 'Capacitance', videoUrl: 'https://www.youtube.com/embed/8vO02r0220M', duration: '50m', order: 3 }
      ]
    },
    {
      id: 'c12-c1',
      categoryId: 'class12',
      title: 'Class 12 Chemistry: Solid State',
      description: 'Master the structure and properties of solid matter.',
      thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf51ad990de?auto=format&fit=crop&q=80&w=800',
      instructor: 'Bharat Sir (PW)',
      level: 'Intermediate',
      duration: '22 Hours',
      lectures: [
        { id: 'c12-c1-l1', courseId: 'c12-c1', title: 'Crystal Lattices & Unit Cells', videoUrl: 'https://www.youtube.com/embed/f_zG6mH1vC8', duration: '50m', order: 1 },
        { id: 'c12-c1-l2', courseId: 'c12-c1', title: 'Imperfections in Solids', videoUrl: 'https://www.youtube.com/embed/f_zG6mH1vC8', duration: '45m', order: 2 },
        { id: 'c12-c1-l3', courseId: 'c12-c1', title: 'Solutions & Colligative Properties', videoUrl: 'https://www.youtube.com/embed/f_zG6mH1vC8', duration: '60m', order: 3 }
      ]
    },
    {
      id: 'c12-m1',
      categoryId: 'class12',
      title: 'Class 12 Maths: Relations & Functions',
      description: 'The foundation of Class 12 Mathematics for Boards.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
      instructor: 'Sachin Sir (PW)',
      level: 'Intermediate',
      duration: '25 Hours',
      lectures: [
        { id: 'c12-m1-l1', courseId: 'c12-m1', title: 'Types of Relations', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '55m', order: 1 },
        { id: 'c12-m1-l2', courseId: 'c12-m1', title: 'Inverse Trigonometric Functions', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '60m', order: 2 }
      ]
    },
    {
      id: 'c12-e1',
      categoryId: 'class12',
      title: 'Class 12 English: Flamingo & Vistas',
      description: 'Complete literature guide for Class 12 English Core.',
      thumbnail: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=800',
      instructor: 'Shipra Mam',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { id: 'c12-e1-l1', courseId: 'c12-e1', title: 'The Last Lesson', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '40m', order: 1 },
        { id: 'c12-e1-l2', courseId: 'c12-e1', title: 'Lost Spring', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '45m', order: 2 },
        { id: 'c12-e1-l3', courseId: 'c12-e1', title: 'Deep Water', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '50m', order: 3 }
      ]
    },

    // Skill Development
    {
      id: 'skill-w1',
      categoryId: 'skills',
      title: 'Full Stack Web Development',
      description: 'Learn to build modern web applications using React, Node, and MongoDB.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
      instructor: 'Traversy Media',
      level: 'Beginner',
      duration: '60 Hours',
      lectures: [
        { id: 'skill-w1-l1', courseId: 'skill-w1', title: 'HTML & CSS Crash Course', videoUrl: 'https://www.youtube.com/embed/mU6an7qykQE', duration: '90m', order: 1 },
        { id: 'skill-w1-l2', courseId: 'skill-w1', title: 'JavaScript Fundamentals', videoUrl: 'https://www.youtube.com/embed/hdI2bqOjy3c', duration: '120m', order: 2 },
        { id: 'skill-w1-l3', courseId: 'skill-w1', title: 'React JS Tutorial', videoUrl: 'https://www.youtube.com/embed/SqcY0GlETPk', duration: '105m', order: 3 },
        { id: 'skill-w1-l4', courseId: 'skill-w1', title: 'Node.js & Express', videoUrl: 'https://www.youtube.com/embed/fBNz5xF-Kx4', duration: '110m', order: 4 }
      ]
    },
    {
      id: 'skill-a1',
      categoryId: 'skills',
      title: 'AI & Machine Learning Basics',
      description: 'Introduction to Artificial Intelligence and building your first ML models.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      instructor: 'Andrew Ng',
      level: 'Intermediate',
      duration: '45 Hours',
      lectures: [
        { id: 'skill-a1-l1', courseId: 'skill-a1', title: 'What is Machine Learning?', videoUrl: 'https://www.youtube.com/embed/PPLop4L2eGk', duration: '45m', order: 1 },
        { id: 'skill-a1-l2', courseId: 'skill-a1', title: 'Supervised vs Unsupervised', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '50m', order: 2 },
        { id: 'skill-a1-l3', courseId: 'skill-a1', title: 'Neural Networks Explained', videoUrl: 'https://www.youtube.com/embed/aircAruvnKk', duration: '60m', order: 3 }
      ]
    },
    {
      id: 'skill-u1',
      categoryId: 'skills',
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the principles of design, user research, and prototyping in Figma.',
      thumbnail: 'https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800',
      instructor: 'Gary Simon',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { id: 'skill-u1-l1', courseId: 'skill-u1', title: 'UI Design for Beginners', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', duration: '60m', order: 1 },
        { id: 'skill-u1-l2', courseId: 'skill-u1', title: 'UX Research Methods', videoUrl: 'https://www.youtube.com/embed/c9Wg6Cb_YlU', duration: '55m', order: 2 }
      ]
    },
    {
      id: 'skill-p1',
      categoryId: 'skills',
      title: 'Python for Beginners',
      description: 'The complete guide to starting your programming journey with Python.',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800',
      instructor: 'Mosh Hamedani',
      level: 'Beginner',
      duration: '30 Hours',
      lectures: [
        { id: 'skill-p1-l1', courseId: 'skill-p1', title: 'Python Tutorial for Beginners', videoUrl: 'https://www.youtube.com/embed/_uQrJ0TkZlc', duration: '360m', order: 1 }
      ]
    },
    {
      id: 'skill-d1',
      categoryId: 'skills',
      title: 'Data Science with Python',
      description: 'Learn NumPy, Pandas, and Matplotlib for data analysis.',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bbda38a5f9ce?auto=format&fit=crop&q=80&w=800',
      instructor: 'Krish Naik',
      level: 'Intermediate',
      duration: '40 Hours',
      lectures: [
        { id: 'skill-d1-l1', courseId: 'skill-d1', title: 'Introduction to Data Science', videoUrl: 'https://www.youtube.com/embed/X3paOmcrTjQ', duration: '15m', order: 1 },
        { id: 'skill-d1-l2', courseId: 'skill-d1', title: 'NumPy for Data Science', videoUrl: 'https://www.youtube.com/embed/QUT1VGiL8iU', duration: '45m', order: 2 },
        { id: 'skill-d1-l3', courseId: 'skill-d1', title: 'Pandas Masterclass', videoUrl: 'https://www.youtube.com/embed/vmEHCJofslg', duration: '60m', order: 3 },
        { id: 'skill-d1-l4', courseId: 'skill-d1', title: 'Matplotlib Visualization', videoUrl: 'https://www.youtube.com/embed/OZOOLe2ol6w', duration: '30m', order: 4 }
      ]
    },
    {
      id: 'skill-d2',
      categoryId: 'skills',
      title: 'Full Stack Web Development',
      description: 'Master HTML, CSS, JS, React, and Node.js.',
      thumbnail: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800',
      instructor: 'Hitesh Choudhary',
      level: 'Beginner',
      duration: '100 Hours',
      lectures: [
        { id: 'skill-d2-l1', courseId: 'skill-d2', title: 'HTML & CSS Basics', videoUrl: 'https://www.youtube.com/embed/HcOc7P5BMi4', duration: '2h', order: 1 },
        { id: 'skill-d2-l2', courseId: 'skill-d2', title: 'JavaScript Essentials', videoUrl: 'https://www.youtube.com/embed/W6NZfCO5SIk', duration: '3h', order: 2 },
        { id: 'skill-d2-l3', courseId: 'skill-d2', title: 'React.js Crash Course', videoUrl: 'https://www.youtube.com/embed/bMknfKXIFA8', duration: '4h', order: 3 }
      ]
    },
    {
      id: 'jee-p3',
      categoryId: 'jee',
      title: 'JEE Physics: Electromagnetism',
      description: 'Deep dive into Electric Fields, Potential, and Capacitance.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
      instructor: 'Alakh Pandey',
      level: 'Advanced',
      duration: '45 Hours',
      lectures: [
        { id: 'jee-p3-l1', courseId: 'jee-p3', title: 'Coulomb\'s Law', videoUrl: 'https://www.youtube.com/embed/3_V_2_8X4_o', duration: '50m', order: 1 },
        { id: 'jee-p3-l2', courseId: 'jee-p3', title: 'Electric Field Lines', videoUrl: 'https://www.youtube.com/embed/vN_v_v_v_v_v', duration: '45m', order: 2 }
      ]
    },
    {
      id: 'neet-b2',
      categoryId: 'neet',
      title: 'NEET Biology: Genetics',
      description: 'Principles of Inheritance and Variation.',
      thumbnail: 'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&q=80&w=800',
      instructor: 'Dr. Samapti Mam',
      level: 'Intermediate',
      duration: '35 Hours',
      lectures: [
        { id: 'neet-b2-l1', courseId: 'neet-b2', title: 'Mendelian Genetics', videoUrl: 'https://www.youtube.com/embed/9O59rkM_6p8', duration: '60m', order: 1 },
        { id: 'neet-b2-l2', courseId: 'neet-b2', title: 'DNA Structure', videoUrl: 'https://www.youtube.com/embed/8kK2zwjRV0M', duration: '55m', order: 2 }
      ]
    },
    {
      id: 'class10-s2',
      categoryId: 'class10',
      title: 'Class 10 Science: Life Processes',
      description: 'Detailed study of Nutrition, Respiration, Transportation, and Excretion.',
      thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&q=80&w=800',
      instructor: 'Sunil Sir',
      level: 'Beginner',
      duration: '20 Hours',
      lectures: [
        { id: 'class10-s2-l1', courseId: 'class10-s2', title: 'Nutrition in Plants', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '40m', order: 1 }
      ]
    },
    {
      id: 'class12-c2',
      categoryId: 'class12',
      title: 'Class 12 Chemistry: Organic Chemistry',
      description: 'Haloalkanes and Haloarenes, Alcohols, Phenols and Ethers.',
      thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&q=80&w=800',
      instructor: 'Bharat Panchal',
      level: 'Intermediate',
      duration: '50 Hours',
      lectures: [
        { id: 'class12-c2-l1', courseId: 'class12-c2', title: 'Introduction to Organic', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '45m', order: 1 }
      ]
    },
    {
      id: 'skill-ai1',
      categoryId: 'skills',
      title: 'Generative AI for Everyone',
      description: 'Learn how to use AI tools like ChatGPT, Midjourney, and more.',
      thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
      instructor: 'Andrew Ng',
      level: 'Beginner',
      duration: '10 Hours',
      lectures: [
        { id: 'skill-ai1-l1', courseId: 'skill-ai1', title: 'What is GenAI?', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15m', order: 1 }
      ]
    },
    {
      id: 'jee-m1',
      categoryId: 'jee',
      title: 'JEE Maths: Calculus',
      description: 'Limits, Continuity, and Differentiability for JEE.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd48a579a?auto=format&fit=crop&q=80&w=800',
      instructor: 'NV Sir',
      level: 'Advanced',
      duration: '60 Hours',
      lectures: [
        { id: 'jee-m1-l1', courseId: 'jee-m1', title: 'Introduction to Limits', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '50m', order: 1 }
      ]
    },
    {
      id: 'neet-c1',
      categoryId: 'neet',
      title: 'NEET Chemistry: Organic',
      description: 'General Organic Chemistry (GOC) for NEET.',
      thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&q=80&w=800',
      instructor: 'Pankaj Sir',
      level: 'Intermediate',
      duration: '40 Hours',
      lectures: [
        { id: 'neet-c1-l1', courseId: 'neet-c1', title: 'Inductive Effect', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '45m', order: 1 }
      ]
    },
    {
      id: 'class10-m1',
      categoryId: 'class10',
      title: 'Class 10 Maths: Trigonometry',
      description: 'Introduction to Trigonometric Ratios and Identities.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd48a579a?auto=format&fit=crop&q=80&w=800',
      instructor: 'Dear Sir',
      level: 'Beginner',
      duration: '15 Hours',
      lectures: [
        { id: 'class10-m1-l1', courseId: 'class10-m1', title: 'Trigonometry Basics', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30m', order: 1 }
      ]
    },
    {
      id: 'jee-c1',
      categoryId: 'jee',
      title: 'JEE Chemistry: Chemical Bonding',
      description: 'Master VSEPR Theory, Hybridization, and Molecular Orbital Theory.',
      thumbnail: 'https://images.unsplash.com/photo-1532187875605-1ef6c237ddc4?auto=format&fit=crop&q=80&w=800',
      instructor: 'Sachin Sir',
      level: 'Advanced',
      duration: '40 Hours',
      lectures: [
        { id: 'jee-c1-l1', courseId: 'jee-c1', title: 'VSEPR Theory', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '50m', order: 1 }
      ]
    },
    {
      id: 'class12-p1',
      categoryId: 'class12',
      title: 'Class 12 Physics: Optics',
      description: 'Ray Optics and Wave Optics for Board Exams.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
      instructor: 'Abhishek Sahu',
      level: 'Intermediate',
      duration: '30 Hours',
      lectures: [
        { id: 'class12-p1-l1', courseId: 'class12-p1', title: 'Reflection of Light', videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '40m', order: 1 }
      ]
    }
  ];

  let userProgress: any[] = [];

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

      const liveWeather = {
        temp: '38°C',
        condition: 'Sunny',
        humidity: '24%',
        windSpeed: '12 km/h',
        aqi: 245,
        aqiStatus: 'Poor',
        aqiColor: 'text-orange-500',
        visibility: '3.5 km',
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
