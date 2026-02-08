import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Admin user
  const adminPasswordHash = await bcrypt.hash('guzo2026', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@guzo.org' },
    update: {},
    create: {
      name: 'Admin',
      email: 'admin@guzo.org',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      emailVerified: true,
      authProvider: 'EMAIL',
    },
  });
  console.log('Admin user created:', admin.email);

  // Courses
  const courses = await Promise.all([
    prisma.course.upsert({
      where: { id: 'course-1' },
      update: {},
      create: {
        id: 'course-1',
        title: 'Meditation for Beginners',
        description: 'A gentle introduction to meditation practices. Learn foundational techniques to calm the mind, reduce stress, and cultivate inner peace. Perfect for those new to spiritual practice.',
        instructor: 'Acharya Navneetji',
        duration: '4 weeks',
        level: 'Beginner',
        thumbnail: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80',
        startDate: new Date('2026-03-01'),
        endDate: new Date('2026-03-28'),
        isActive: true,
        maxParticipants: 50,
        registeredCount: 32,
        recurrence: 'WEEKLY',
        sessionTime: '18:00',
        sessionDuration: 60,
        joinLink: 'https://zoom.us/j/example1',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-2' },
      update: {},
      create: {
        id: 'course-2',
        title: 'The Discipline Series',
        description: 'Transform your daily routine into a spiritual practice. This course explores how discipline creates freedom and how to establish sustainable spiritual habits in modern life.',
        instructor: 'Acharya Navneetji',
        duration: '6 weeks',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
        startDate: new Date('2026-03-15'),
        endDate: new Date('2026-04-26'),
        isActive: true,
        maxParticipants: 40,
        registeredCount: 28,
        recurrence: 'WEEKLY',
        sessionTime: '19:00',
        sessionDuration: 75,
        joinLink: 'https://zoom.us/j/example2',
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-3' },
      update: {},
      create: {
        id: 'course-3',
        title: 'Relationships as Practice',
        description: 'Discover how relationships become your greatest teacher. Learn to transform conflicts into growth opportunities and cultivate compassion in all your connections.',
        instructor: 'Acharya Navneetji',
        duration: '5 weeks',
        level: 'Intermediate',
        thumbnail: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
        startDate: new Date('2026-04-01'),
        endDate: new Date('2026-05-06'),
        isActive: true,
        maxParticipants: 35,
        registeredCount: 22,
        recurrence: 'WEEKLY',
        sessionTime: '18:30',
        sessionDuration: 60,
      },
    }),
    prisma.course.upsert({
      where: { id: 'course-4' },
      update: {},
      create: {
        id: 'course-4',
        title: 'Advanced Contemplation',
        description: 'Deep dive into advanced meditation and self-inquiry practices. For experienced practitioners ready to explore the depths of consciousness.',
        instructor: 'Acharya Navneetji',
        duration: '8 weeks',
        level: 'Advanced',
        thumbnail: 'https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&q=80',
        startDate: new Date('2026-04-15'),
        endDate: new Date('2026-06-10'),
        isActive: true,
        maxParticipants: 25,
        registeredCount: 18,
        recurrence: 'BIWEEKLY',
        sessionTime: '20:00',
        sessionDuration: 90,
        visibility: 'PRIVATE',
      },
    }),
  ]);
  console.log(`${courses.length} courses created`);

  // Course materials
  await prisma.courseMaterial.createMany({
    skipDuplicates: true,
    data: [
      { id: 'm1', title: 'Introduction to Meditation', type: 'video', url: '#', description: 'Getting started with basic meditation techniques', courseId: 'course-1', sortOrder: 0 },
      { id: 'm2', title: 'Breathing Techniques Guide', type: 'pdf', url: '#', description: 'Complete guide to pranayama breathing exercises', courseId: 'course-1', sortOrder: 1 },
      { id: 'm3', title: 'Morning Meditation Audio', type: 'audio', url: '#', description: 'Guided 10-minute morning meditation', courseId: 'course-1', sortOrder: 2 },
      { id: 'm4', title: 'Building Daily Rituals', type: 'video', url: '#', description: 'Creating sustainable spiritual practices', courseId: 'course-2', sortOrder: 0 },
      { id: 'm5', title: 'Discipline Workbook', type: 'pdf', url: '#', description: '30-day discipline challenge workbook', courseId: 'course-2', sortOrder: 1 },
      { id: 'm6', title: 'The Mirror of Relationships', type: 'video', url: '#', description: 'Understanding relationships as spiritual mirrors', courseId: 'course-3', sortOrder: 0 },
      { id: 'm7', title: 'Communication Practices', type: 'audio', url: '#', description: 'Mindful communication exercises', courseId: 'course-3', sortOrder: 1 },
      { id: 'm8', title: 'Self-Inquiry Techniques', type: 'video', url: '#', description: 'Who am I? inquiry methods', courseId: 'course-4', sortOrder: 0 },
      { id: 'm9', title: 'Advanced Meditation Guide', type: 'pdf', url: '#', description: 'Deep meditation practices', courseId: 'course-4', sortOrder: 1 },
    ],
  });
  console.log('Course materials created');

  // Talks
  const talks = await Promise.all([
    prisma.talk.upsert({
      where: { id: 'talk-1' },
      update: {},
      create: {
        id: 'talk-1',
        title: 'The Art of Letting Go',
        description: 'A profound exploration of surrender and release. Learn how letting go creates space for transformation.',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=800&q=80',
        duration: '45:30',
        category: 'Wisdom Talks',
        tags: ['surrender', 'transformation', 'meditation'],
        date: new Date('2026-01-15'),
        featured: true,
      },
    }),
    prisma.talk.upsert({
      where: { id: 'talk-2' },
      update: {},
      create: {
        id: 'talk-2',
        title: 'Finding Peace in Chaos',
        description: "Practical guidance for maintaining inner calm amidst life's challenges and uncertainties.",
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&q=80',
        duration: '52:15',
        category: 'Wisdom Talks',
        tags: ['peace', 'mindfulness', 'daily life'],
        date: new Date('2026-01-08'),
        featured: true,
      },
    }),
    prisma.talk.upsert({
      where: { id: 'talk-3' },
      update: {},
      create: {
        id: 'talk-3',
        title: 'The Path of Devotion',
        description: 'Understanding bhakti as a complete spiritual path. How love becomes the doorway to the divine.',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?w=800&q=80',
        duration: '38:45',
        category: 'Spiritual Discourses',
        tags: ['devotion', 'bhakti', 'love'],
        date: new Date('2025-12-20'),
        featured: false,
      },
    }),
    prisma.talk.upsert({
      where: { id: 'talk-4' },
      update: {},
      create: {
        id: 'talk-4',
        title: 'Meditation Q&A Session',
        description: 'Live Q&A addressing common meditation challenges and questions from practitioners.',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1593811167562-9cef47bfc4d7?w=800&q=80',
        duration: '1:05:20',
        category: 'Q&A Sessions',
        tags: ['meditation', 'Q&A', 'practice'],
        date: new Date('2025-12-15'),
        featured: false,
      },
    }),
    prisma.talk.upsert({
      where: { id: 'talk-5' },
      update: {},
      create: {
        id: 'talk-5',
        title: 'Living with Awareness',
        description: 'How to bring mindfulness into every moment of your daily life.',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1508672019048-805c876b67e2?w=800&q=80',
        duration: '41:00',
        category: 'Wisdom Talks',
        tags: ['awareness', 'mindfulness', 'presence'],
        date: new Date('2025-12-01'),
        featured: true,
      },
    }),
    prisma.talk.upsert({
      where: { id: 'talk-6' },
      update: {},
      create: {
        id: 'talk-6',
        title: 'Understanding Suffering',
        description: 'A deep dive into the nature of suffering and the path to liberation from it.',
        youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        thumbnail: 'https://images.unsplash.com/photo-1474418397713-7ede21d49118?w=800&q=80',
        duration: '55:30',
        category: 'Spiritual Discourses',
        tags: ['suffering', 'liberation', 'wisdom'],
        date: new Date('2025-11-20'),
        featured: false,
      },
    }),
  ]);
  console.log(`${talks.length} talks created`);

  // Books
  const books = await Promise.all([
    prisma.book.upsert({
      where: { id: 'book-1' },
      update: {},
      create: {
        id: 'book-1',
        title: 'The Silent Path',
        author: 'Acharya Navneetji',
        description: 'A comprehensive guide to meditation and inner silence. This book offers practical techniques for quieting the mind and discovering the peace that lies within.',
        coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600&q=80',
        publishYear: 2024,
        category: 'Meditation',
        purchaseLink: '#',
        featured: true,
      },
    }),
    prisma.book.upsert({
      where: { id: 'book-2' },
      update: {},
      create: {
        id: 'book-2',
        title: 'Wisdom for Daily Living',
        author: 'Acharya Navneetji',
        description: 'Transform ordinary life into spiritual practice. This collection of teachings shows how to bring awareness, compassion, and wisdom into every aspect of daily life.',
        coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600&q=80',
        publishYear: 2023,
        category: 'Spiritual Living',
        purchaseLink: '#',
        featured: true,
      },
    }),
    prisma.book.upsert({
      where: { id: 'book-3' },
      update: {},
      create: {
        id: 'book-3',
        title: 'The Heart of Devotion',
        author: 'Acharya Navneetji',
        description: 'Explore the path of bhakti and discover how love and devotion can become powerful vehicles for spiritual transformation and self-realization.',
        coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&q=80',
        publishYear: 2023,
        category: 'Devotion',
        purchaseLink: '#',
        featured: false,
      },
    }),
    prisma.book.upsert({
      where: { id: 'book-4' },
      update: {},
      create: {
        id: 'book-4',
        title: 'Beyond the Mind',
        author: 'Acharya Navneetji',
        description: 'A profound exploration of consciousness beyond thought. This advanced text guides experienced practitioners into deeper states of awareness.',
        coverImage: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&q=80',
        publishYear: 2022,
        category: 'Advanced Practice',
        purchaseLink: '#',
        featured: false,
      },
    }),
    prisma.book.upsert({
      where: { id: 'book-5' },
      update: {},
      create: {
        id: 'book-5',
        title: 'Compassion in Action',
        author: 'Acharya Navneetji',
        description: 'Learn how to embody compassion in your relationships, work, and service to others. A practical guide to living a life of loving-kindness.',
        coverImage: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=600&q=80',
        publishYear: 2022,
        category: 'Compassion',
        purchaseLink: '#',
        featured: true,
      },
    }),
  ]);
  console.log(`${books.length} books created`);

  // Sample downloads
  await prisma.download.createMany({
    skipDuplicates: true,
    data: [
      {
        id: 'dl-1',
        title: 'Morning Meditation Guide',
        description: 'A printable guide for establishing a daily morning meditation practice.',
        category: 'Meditation',
        fileUrl: '#',
        fileType: 'pdf',
        fileSize: 2500000,
        featured: true,
      },
      {
        id: 'dl-2',
        title: 'Mantra Collection',
        description: 'Sacred mantras for daily recitation with meanings and pronunciation guide.',
        category: 'Devotion',
        fileUrl: '#',
        fileType: 'pdf',
        fileSize: 1800000,
        featured: true,
      },
      {
        id: 'dl-3',
        title: 'Evening Reflection Journal Template',
        description: 'A structured journal template for daily evening self-reflection.',
        category: 'Practice',
        fileUrl: '#',
        fileType: 'pdf',
        fileSize: 950000,
        featured: false,
      },
    ],
  });
  console.log('Downloads created');

  // Site settings
  await prisma.siteSettings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      siteName: 'Guidance Zone',
      contactEmail: 'contact@guidancezone.org',
      socialLinks: {
        youtube: 'https://youtube.com/@guidancezone',
        instagram: 'https://instagram.com/guidancezone',
        spotify: 'https://open.spotify.com/show/guidancezone',
      },
      satsangSchedule: {
        day: 'Sunday',
        time: '8:00 PM',
        timezone: 'IST',
        link: 'https://zoom.us/j/satsang',
      },
      aboutContent: {
        biography: 'Acharya Navneetji is a modern spiritual teacher who bridges ancient wisdom with contemporary life. With over two decades of study and practice, he offers practical guidance for seekers navigating the complexities of modern existence.',
        philosophy: 'True spirituality is not about escaping life but about engaging with it more fully, more consciously, and with greater compassion.',
        stats: {
          yearsTeaching: 20,
          studentsGuided: 10000,
          coursesOffered: 50,
          countriesReached: 15,
        },
      },
    },
  });
  console.log('Site settings created');

  console.log('Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
