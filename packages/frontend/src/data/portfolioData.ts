// packages/frontend/src/data/portfolioData.ts

// --- ABOUT ME SECTION DATA ---
export const aboutData = {
  headline: "Turning Ideas into Seamless Web Experiences.",
  bioParagraphs: [
    "I'm Emmanuel Agina, a passionate Full Stack Web Developer based in Lagos, Nigeria. With a strong foundation in both frontend and backend technologies, I thrive on building robust, scalable, and user-centric applications from concept to deployment.",
    "My journey in web development began with a fascination for how digital products solve real-world problems. This curiosity quickly evolved into a commitment to mastering the craft, focusing on clean code, optimal performance, and exceptional user experience.",
    "I specialize in creating dynamic web solutions, integrating intuitive UIs with powerful server-side logic and efficient database management. Whether it's developing a complex API, designing a responsive user interface, or optimizing database queries, I'm dedicated to delivering high-quality results that exceed expectations."
  ],
  highlights: [
    { label: "Years Experience", value: 2 }, // Changed from "3+" to 3 (number)
    { label: "Projects Completed", value: 20 }, // Changed from "20+" to 20 (number)
    { label: "Clients Served", value: 3 } // Changed from "8+" to 8 (number)
  ]
};

// --- SKILLS SECTION DATA ---
// You will need to import the actual react-icons components in the components themselves
// For the data file, we'll use placeholder strings for the icon names
// and then map them to actual components where they are used.
// OR, more conveniently for this use case, we can directly import and store the icon components here
// as React.createElement is used later.

// Import necessary icons
import {
  FaReact, FaNodeJs, FaDocker, FaGitAlt,
  FaHtml5, FaCss3Alt, FaJsSquare, FaServer, FaCode,
  FaVuejs, FaFigma, FaNpm, FaYarn,
  FaGithub, FaBootstrap
} from 'react-icons/fa';
import {
  SiTailwindcss, SiTypescript, SiMongodb, SiExpress, SiPostgresql, SiFirebase, SiGraphql, SiWebpack, SiVite,
  SiNextdotjs, SiSocketdotio, SiTestinglibrary,
} from 'react-icons/si';

// Define a type for skill to ensure consistency
export type Skill = {
  name: string;
  icon: React.ElementType; // This allows storing React component types like FaReact
  color: string;
};

export type SkillCategory = {
  name: string;
  skills: Skill[];
};

export const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend',
    skills: [
      { name: 'React', icon: FaReact, color: '#61DAFB' },
      { name: 'Next.js', icon: SiNextdotjs, color: '#000000' },
      { name: 'TypeScript', icon: SiTypescript, color: '#3178C6' },
      { name: 'JavaScript', icon: FaJsSquare, color: '#F7DF1E' },
      { name: 'Tailwind CSS', icon: SiTailwindcss, color: '#06B6D4' },
      { name: 'HTML5', icon: FaHtml5, color: '#E34F26' },
      { name: 'CSS3', icon: FaCss3Alt, color: '#1572B6' },
      // For Framer Motion, since it's a library not an icon, you might represent it differently
      // or just list it as text if no icon representation is needed.
      // For now, I'll use a generic code icon.
      { name: 'Framer Motion', icon: FaCode, color: '#0055FF' },
      { name: 'Vue.js', icon: FaVuejs, color: '#4FC08D' },
      { name: 'Bootstrap', icon: FaBootstrap, color: '#7952B3' },
    ],
  },
  {
    name: 'Backend',
    skills: [
      { name: 'Node.js', icon: FaNodeJs, color: '#339933' },
      { name: 'Express.js', icon: SiExpress, color: '#000000' },
      { name: 'REST APIs', icon: FaServer, color: '#F7DF1E' },
      { name: 'GraphQL', icon: SiGraphql, color: '#E10098' },
      { name: 'Socket.IO', icon: SiSocketdotio, color: '#010101' },
    ],
  },
  {
    name: 'Databases',
    skills: [
      { name: 'MongoDB', icon: SiMongodb, color: '#47A248' },
      { name: 'PostgreSQL', icon: SiPostgresql, color: '#336791' },
      { name: 'Firebase', icon: SiFirebase, color: '#FFCA28' },
    ],
  },
  {
    name: 'Tools & DevOps',
    skills: [
      { name: 'Git', icon: FaGitAlt, color: '#F05032' },
      { name: 'GitHub', icon: FaGithub, color: '#181717' },
      { name: 'Docker', icon: FaDocker, color: '#2496ED' },
      { name: 'Vite', icon: SiVite, color: '#646CFF' },
      { name: 'Webpack', icon: SiWebpack, color: '#8DD6F9' },
      { name: 'npm', icon: FaNpm, color: '#CB3837' },
      { name: 'pnpm', icon: FaYarn, color: '#F69220' }, // Using yarn icon as a placeholder for pnpm
      { name: 'Figma', icon: FaFigma, color: '#F24E1E' },
      { name: 'React Testing Library', icon: SiTestinglibrary, color: '#E33332' },
    ],
  },
];


// --- PROJECTS SECTION DATA ---
export type Project = {
  id: string;
  title: string;
  category: string;
  thumbnail: string; // Path to image in public folder
  description: string;
  technologies: string[];
  liveLink: string | null;
  githubLink: string | null;
  details: string; // More extensive description for modal
};

export const projectsData: Project[] = [
  {
    id: '1',
    title: 'E-commerce Platform',
    category: 'Full Stack',
    thumbnail: '/images/project-ecommerce.webp', // Ensure this image exists in public/images
    description: 'A robust e-commerce solution built with MERN stack, featuring product management, user authentication, shopping cart, and payment gateway integration.',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'Stripe', 'Tailwind CSS'],
    liveLink: 'https://example-ecommerce.com',
    githubLink: 'https://github.com/emmanuel-agina/ecommerce-platform',
    details: 'This project involved building a scalable backend with RESTful APIs, a responsive frontend with a clean UI, and integrating third-party services for payments. Focused on performance and security, ensuring a seamless shopping experience from product Browse to secure checkout.'
  },
  {
    id: '2',
    title: 'Real-time Chat Application',
    category: 'Backend',
    thumbnail: '/images/project-chat.webp',
    description: 'A real-time chat application leveraging WebSockets for instant messaging, group chats, and online user status.',
    technologies: ['Node.js', 'Express', 'Socket.IO', 'MongoDB', 'React (basic UI)'],
    liveLink: 'https://example-chat.com',
    githubLink: 'https://github.com/emmanuel-agina/chat-app',
    details: 'Implemented robust WebSocket communication, efficient user and message storage, and secure authentication. Scalability was a key consideration to handle concurrent users and high message volumes without performance degradation.'
  },
  {
    id: '3',
    title: 'AI Content Generator',
    category: 'Full Stack',
    thumbnail: '/images/project-ai.webp',
    description: 'A web application that generates creative content using AI models, offering various templates and customization options.',
    technologies: ['Next.js', 'Python (Flask)', 'OpenAI API', 'PostgreSQL', 'Tailwind CSS'],
    liveLink: 'https://example-ai-generator.com',
    githubLink: 'https://github.com/emmanuel-agina/ai-content-generator',
    details: 'Integrated with external AI APIs, managed user subscriptions, and developed a user-friendly interface for content creation and management. Designed for intuitive use, allowing users to quickly generate and refine text content.'
  },
  {
    id: '4',
    title: 'Personal Portfolio v1 (Legacy)',
    category: 'Frontend',
    thumbnail: '/images/project-portfolio.webp',
    description: 'My previous portfolio website, showcasing earlier frontend skills and design aesthetics.',
    technologies: ['React', 'SCSS', 'GSAP'],
    liveLink: 'https://old-portfolio.com',
    githubLink: 'https://github.com/emmanuel-agina/old-portfolio',
    details: 'A static site demonstrating early proficiency in React and animation libraries. Served as a stepping stone for more complex and robust web development endeavors.'
  },
  {
    id: '5',
    title: 'Task Management API',
    category: 'Backend',
    thumbnail: '/images/project-api.webp',
    description: 'A secure and scalable RESTful API for task management, including user authentication, CRUD operations, and task filtering.',
    technologies: ['Node.js', 'Express', 'MongoDB', 'JWT', 'Jest'],
    liveLink: null, // No live link for API
    githubLink: 'https://github.com/emmanuel-agina/task-api',
    details: 'Focused on API design best practices, comprehensive testing, and robust error handling. Built with TDD principles to ensure high reliability and maintainability.'
  },
  {
    id: '6',
    title: 'Blog Platform',
    category: 'Full Stack',
    thumbnail: '/images/project-blog.webp',
    description: 'A complete blog platform with user authentication, content creation (WYSIWYG editor), comment system, and admin panel.',
    technologies: ['React', 'Node.js', 'Express', 'PostgreSQL', 'Redux Toolkit'],
    liveLink: 'https://example-blog.com',
    githubLink: 'https://github.com/emmanuel-agina/blog-platform',
    details: 'Developed a robust content management system, secure user authentication, and an intuitive frontend for both content creators and readers. Emphasized SEO-friendly practices and performance.'
  },
];

export const projectCategories = ['All', 'Full Stack', 'Frontend', 'Backend'];

// --- SOCIAL LINKS DATA (for Navbar, Contact, Footer) ---
import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';

export type SocialLink = {
  icon: React.ElementType;
  href: string;
  label: string;
};

export const socialLinks: SocialLink[] = [
  { icon: FaLinkedin, href: 'https://linkedin.com/in/agina-emmanuel-526273370', label: 'LinkedIn' },
  { icon: FaGithub, href: 'https://github.com/Emmilex20', label: 'GitHub' },
  { icon: FaTwitter, href: 'https://twitter.com/emmanuel-agina', label: 'Twitter' },
  { icon: FaEnvelope, href: 'mailto:aginaemmanuel6@gmail.com', label: 'Email' },
];