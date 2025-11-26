import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  ThumbsUp, 
  BarChart4, 
  Bell, 
  CheckCircle, 
  MessageSquare, 
  Users, 
  Shield,
  Smartphone,
  Landmark,
  Sparkles,
  HeartHandshake,
  TrendingUp,
  AlertCircle,
  Rotate3D
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { useAuthStore } from '../store/authStore';
import { useIssueStore } from '../store/issueStore';
import IssueCard from '../components/issues/IssueCard';
import CategoryStats from '../components/issues/CategoryStats';
import WhatsAppButton from '../components/common/WhatsAppButton';

const HomePage: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const { issues } = useIssueStore();
  
  // Get top issues by votes
  const topIssues = [...issues]
    .sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes))
    .slice(0, 3);
  
  // Get resolved issues count
  const resolvedCount = issues.filter(issue => issue.status === 'resolved' || issue.status === 'closed').length;
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring",
        damping: 10,
        stiffness: 100,
        duration: 0.5
      } 
    }
  };
  
  const hoverEffect = {
    scale: 1.03,
    transition: { duration: 0.3 }
  };
  
  const tapEffect = {
    scale: 0.98
  };



  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-black via-gray-900 to-gray-800 text-white py-16 md:py-24 overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full opacity-20"
          animate={{
            background: [
              'radial-gradient(circle at 10% 20%, rgba(201, 197, 205, 0.2) 0%, transparent 20%)',
              'radial-gradient(circle at 90% 30%, rgba(156, 125, 105, 0.2) 0%, transparent 20%)',
              'radial-gradient(circle at 50% 80%, rgba(34, 197, 94, 0.2) 0%, transparent 20%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.2
              }}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-2 mb-4 bg-gray-800 backdrop-blur-sm rounded-full py-1 px-3 w-max border border-lavender-500/30"
              >
                <Sparkles size={16} className="text-lavender-300" />
                <span className="text-sm font-medium text-lavender-100">Community Powered</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                <motion.span 
                  className="inline-block text-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Empowering Citizens
                </motion.span>{' '}
                <motion.span 
                  className="inline-block bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  for Better Communities
                </motion.span>
              </h1>
              
              <motion.p 
                className="text-xl mb-8 text-gray-300 max-w-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Report civic issues, collaborate with authorities, and track progress together in real-time.
              </motion.p>
              
              <motion.div 
                className="flex flex-wrap gap-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <Link to="/report">
                  <motion.div
                    whileHover={hoverEffect}
                    whileTap={tapEffect}
                  >
                    <Button 
                      variant="accent" 
                      size="lg"
                      leftIcon={<MapPin size={18} />}
                      className="shadow-lg shadow-orange-500/20 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                    >
                      Report an Issue
                    </Button>
                  </motion.div>
                </Link>
                
                <motion.div
                  whileHover={hoverEffect}
                  whileTap={tapEffect}
                >
                  <WhatsAppButton className="bg-green-600 hover:bg-green-700 border-green-700" />
                </motion.div>
                
                <Link to="/issues">
                  <motion.div
                    whileHover={hoverEffect}
                    whileTap={tapEffect}
                  >
                    <Button 
                      variant="outline" 
                      size="lg"
                      leftIcon={<BarChart4 size={18} />}
                      className="bg-gray-800/50 text-gray-100 border-gray-600 hover:bg-gray-700/50 backdrop-blur-sm"
                    >
                      Browse Issues
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
              
              <motion.div 
                className="mt-8 flex flex-wrap gap-6 text-gray-300"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-green-500/20">
                  <CheckCircle size={20} className="text-green-400" />
                  <span>{resolvedCount}+ Issues Resolved</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-lavender-500/20">
                  <Users size={20} className="text-lavender-400" />
                  <span>Community Driven</span>
                </div>
                <div className="flex items-center gap-2 bg-gray-800/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-pink-500/20">
                  <Shield size={20} className="text-pink-400" />
                  <span>Secure & Anonymous</span>
                </div>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="md:w-1/2 md:pl-10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.4
              }}
            >
              <div className="relative">
                {/* Civic Sense Image */}
                <motion.div
                  className="relative h-96 w-full rounded-2xl overflow-hidden shadow-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <img 
                    src="/civic sense.webp"
                    alt="Civic Sense"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                <motion.div 
                  className="absolute -bottom-4 -left-4 bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-lg shadow-lg text-white"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  whileHover={{
                    rotate: [0, -5, 5, -5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                      <CheckCircle size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Issue Resolved!</div>
                      <div className="text-sm text-white/80">Street light fixed</div>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-600 to-orange-700 p-4 rounded-lg shadow-lg text-white"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  whileHover={{
                    rotate: [0, 5, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-white/20 p-2 rounded-full backdrop-blur-sm">
                      <TrendingUp size={24} className="text-white" />
                    </div>
                    <div>
                      <div className="font-semibold">Community Support</div>
                      <div className="text-sm text-white/80">45 votes</div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-20 left-10 w-40 h-40 rounded-full bg-lavender-100 blur-3xl opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-orange-100 blur-3xl opacity-20"></div>
        </div>
        
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-3"
            >
              <div className="bg-gradient-to-r from-lavender-500 to-pink-600 text-white px-4 py-1 rounded-full inline-flex items-center gap-2">
                <Rotate3D size={16} />
                <span className="text-sm font-medium">How It Works</span>
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Transform Your Community in 3 Steps</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              Our platform connects citizens, NGOs, and authorities through a simple and effective process.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                icon: <MapPin size={30} className="text-blue" />,
                title: "Report Issues",
                description: "Easily submit civic issues with photos, location data, and detailed descriptions.",
                gradient: 'from-lavender-500 to-lavender-600',
                border: 'border-lavender-400'
              },
              {
                icon: <ThumbsUp size={30} className="text-white" />,
                title: "Prioritize Together",
                description: "Vote on issues that matter most to your community to highlight their importance.",
                gradient: 'from-orange-500 to-orange-600',
                border: 'border-orange-400'
              },
              {
                icon: <CheckCircle size={30} className="text-white" />,
                title: "Track Progress",
                description: "Follow real-time updates as issues move from reported to resolved status.",
                gradient: 'from-green-500 to-green-600',
                border: 'border-green-400'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="flex flex-col items-center text-center"
                variants={childVariants}
              >
                <motion.div 
                  className={`bg-gradient-to-r ${feature.gradient} p-5 rounded-2xl mb-5 shadow-lg border-t ${feature.border} border-opacity-50`}
                  whileHover={{
                    rotate: [0, -5, 5, 0],
                    transition: { duration: 0.5 }
                  }}
                >
                  {feature.icon}
                </motion.div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
          
          <motion.div 
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Link to={isAuthenticated ? "/report" : "/register"}>
              <motion.div
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Button 
                  variant="default" 
                  size="lg"
                  className="px-8 bg-gradient-to-r from-brown-600 to-brown-800 text-white shadow-lg hover:shadow-brown-500/30"
                >
                  {isAuthenticated ? "Report an Issue" : "Join the Community"}
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>
      
      {/* Top Issues Section */}
      <section className="py-16 bg-gradient-to-br from-gray-100 to-white relative overflow-hidden">
        {/* Animated background dots */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.05 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-lavender-500"
              style={{
                width: Math.random() * 10 + 5,
                height: Math.random() * 10 + 5,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, (Math.random() * 20) - 10],
                opacity: [0.3, 0.7, 0.3]
              }}
              transition={{
                duration: Math.random() * 5 + 5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          ))}
        </motion.div>
        
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-6 md:mb-0"
            >
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mb-3 text-pink-600"
              >
                <AlertCircle size={18} />
                <span className="text-sm font-medium">Community Pulse</span>
              </motion.div>
              
              <h2 className="text-3xl font-bold mb-2 text-gray-900">Top Reported Issues</h2>
              <p className="text-gray-600 max-w-lg">
                The most upvoted issues in your community that need attention right now.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Link to="/issues">
                <motion.div
                  whileHover={hoverEffect}
                  whileTap={tapEffect}
                >
                  <Button 
                    variant="outline"
                    rightIcon={<BarChart4 size={16} />}
                    className="border-pink-300 text-pink-600 hover:bg-pink-50"
                  >
                    View All Issues
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topIssues.length > 0 ? (
              <AnimatePresence>
                {topIssues.map((issue, index) => (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.5, 
                      delay: index * 0.1,
                      type: "spring",
                      stiffness: 100
                    }}
                    whileHover={{ y: -5 }}
                  >
                    <IssueCard issue={issue} />
                  </motion.div>
                ))}
              </AnimatePresence>
            ) : (
              <div className="col-span-3 text-center py-10">
                <motion.div 
                  className="bg-white rounded-lg shadow-sm p-8 border border-gray-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                >
                  <div className="text-gray-400 flex justify-center mb-4">
                    <Landmark size={48} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">No Issues Yet</h3>
                  <p className="text-gray-600 mb-6">
                    Be the first to report an issue in your community!
                  </p>
                  <Link to="/report">
                    <motion.div
                      whileHover={hoverEffect}
                      whileTap={tapEffect}
                    >
                      <Button 
                        variant="default"
                        className="bg-gradient-to-r from-lavender-500 to-pink-600 text-white"
                      >
                        Report an Issue
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </section>
      
      {/* Statistics Section */}
      <section className="py-16 bg-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <motion.div 
            className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-lavender-100 blur-3xl opacity-20"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1]
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/4 w-80 h-80 rounded-full bg-pink-100 blur-3xl opacity-20"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.15, 0.1]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 2
            }}
          />
        </div>
        
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-3"
            >
              <div className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-4 py-1 rounded-full inline-flex items-center gap-2">
                <TrendingUp size={16} />
                <span className="text-sm font-medium">Making an Impact</span>
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4 text-gray-900">Community Progress Dashboard</h2>
            <p className="max-w-2xl mx-auto text-gray-600">
              See how our community is working together to improve urban life.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <CategoryStats />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 relative overflow-hidden"
            >
              {/* Decorative gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-r from-lavender-100 to-pink-100 rounded-full filter blur-3xl opacity-30 -z-1"></div>
              
              <h3 className="text-xl font-semibold mb-6 relative z-10 text-gray-800">Why Hamara Shehar Works</h3>
              
              <div className="space-y-6 relative z-10">
                {[
                  {
                    icon: <Users size={24} className="text-lavender-600" />,
                    title: "Community-Driven Approach",
                    description: "Citizens, NGOs, and authorities collaborate on a single platform to identify and solve urban issues efficiently.",
                    bg: "bg-lavender-50",
                    border: "border-lavender-200"
                  },
                  {
                    icon: <Bell size={24} className="text-orange-600" />,
                    title: "Real-Time Updates",
                    description: "Stay informed with status updates and notifications as issues progress toward resolution.",
                    bg: "bg-orange-50",
                    border: "border-orange-200"
                  },
                  {
                    icon: <Smartphone size={24} className="text-pink-600" />,
                    title: "Multi-Channel Access",
                    description: "Report issues via web, mobile, and messaging platforms to ensure everyone can participate.",
                    bg: "bg-pink-50",
                    border: "border-pink-200"
                  },
                  {
                    icon: <MessageSquare size={24} className="text-green-600" />,
                    title: "Transparent Communication",
                    description: "Open dialogue between citizens and authorities creates accountability and builds trust.",
                    bg: "bg-green-50",
                    border: "border-green-200"
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className={`flex gap-4 p-4 rounded-lg ${item.bg} border ${item.border} transition-all duration-300 hover:shadow-sm`}
                    whileHover={{ 
                      x: 5,
                      backgroundColor: "rgba(255, 255, 255, 0.9)"
                    }}
                  >
                    <div className={`flex-shrink-0 ${item.bg} p-3 rounded-lg border ${item.border}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg mb-1 text-gray-800">{item.title}</h4>
                      <p className="text-gray-600">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 left-0 w-full h-full"
          animate={{
            background: [
              'radial-gradient(circle at 20% 30%, rgba(216, 180, 254, 0.2) 0%, transparent 25%)',
              'radial-gradient(circle at 80% 70%, rgba(249, 115, 22, 0.2) 0%, transparent 25%)',
              'radial-gradient(circle at 50% 50%, rgba(220, 38, 38, 0.2) 0%, transparent 25%)'
            ]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex justify-center mb-4"
            >
              <div className="bg-white/20 backdrop-blur-sm px-4 py-1 rounded-full inline-flex items-center gap-2 border border-lavender-500/30">
                <Sparkles size={16} className="text-lavender-300" />
                <span className="text-sm font-medium">Join the Movement</span>
              </div>
            </motion.div>
            
            <h2 className="text-3xl font-bold mb-4">Ready to Improve Your Community?</h2>
            <motion.p 
              className="max-w-2xl mx-auto text-gray-300 mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              Join thousands of citizens who are making a difference in their neighborhoods through Hamara Shehar.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Link to={isAuthenticated ? "/report" : "/register"}>
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="accent" 
                    size="lg"
                    className="px-8 bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-600 hover:to-pink-700 shadow-lg"
                  >
                    {isAuthenticated ? "Report an Issue" : "Create an Account"}
                  </Button>
                </motion.div>
              </Link>
              
              <Link to="/issues">
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="px-8 border-lavender-400/50 text-white hover:bg-lavender-500/10 backdrop-blur-sm"
                  >
                    Explore Issues
                  </Button>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;