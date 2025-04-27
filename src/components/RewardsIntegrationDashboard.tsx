'use client';

import React, { useEffect, useState, Suspense, lazy } from 'react';
const Avatar3D = lazy(() => import("@/components/Avatar3D"));

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import '../styles/cyberpunk.css';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10
    }
  }
};

const cardHoverVariants = {
  hover: {
    scale: 1.02,
    boxShadow: "0px 5px 15px rgba(58,255,221,0.3)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  }
};

const pulseVariants = {
  pulse: {
    scale: [1, 1.02, 1],
    opacity: [0.8, 1, 0.8],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// Update button variants with more cyberpunk effects
const buttonVariants = {
  hover: {
    scale: 1.05,
    boxShadow: "0 0 25px rgba(0, 255, 255, 0.7)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 10
    }
  },
  tap: {
    scale: 0.95,
    boxShadow: "0 0 15px rgba(0, 255, 255, 0.5)"
  }
};

// Mock data
const fetchTokenBalances = async () => ({
  GreenPoints: 1200,
  CIVIQ: 350,
  USDC: 45.75,
});

const fetchNFTs = async () => [
  {
    id: '1',
    name: 'CitizenNFT #457',
    image: '/images/citizen457.png',
    type: 'Citizen',
  },
  {
    id: '2',
    name: 'StructureNFT #102',
    image: '/images/structure102.png',
    type: 'Structure',
  },
];

const fetchTransactionHistory = async () => [
  {
    id: 'tx1',
    date: '2025-04-15',
    type: 'Mint',
    token: 'GreenPoints',
    amount: 500,
    status: 'Confirmed',
  },
  {
    id: 'tx2',
    date: '2025-04-16',
    type: 'Bridge',
    token: 'USDC',
    amount: -10,
    status: 'Completed',
  },
];

export default function RewardsIntegrationDashboard() {
  const [balances, setBalances] = useState<Record<string, number>>({});
  const [nfts, setNfts] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [bridgeAsset, setBridgeAsset] = useState('GreenPoints');
  const [fromChain, setFromChain] = useState('Monad');
  const [toChain, setToChain] = useState('Base');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    async function loadData() {
      setBalances(await fetchTokenBalances());
      setNfts(await fetchNFTs());
      setTransactions(await fetchTransactionHistory());
      setIsLoaded(true);
    }
    loadData();
  }, []);

  const handleBridge = () => {
    alert(`Bridging ${bridgeAsset} from ${fromChain} to ${toChain}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0c29] via-[#302b63] to-[#24243e] text-white cyberpunk-cursor font-orbitron">
      <AnimatePresence>
        {isLoaded && (
          <motion.div
            className="container mx-auto p-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 20 }}
          >
            {/* Leaderboard */}
            <motion.div
              className="tile glassmorph"
              variants={itemVariants}
              whileHover="hover"
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={cardHoverVariants}>
                <Card className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 border-l-4 border-cyan-400 shadow-cyan hover:shadow-lg transition-shadow duration-300 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-cyan-300 text-xl flex items-center gap-2">
                      <motion.span
                        animate={{
                          rotate: [0, 10, 0],
                          transition: { duration: 2, repeat: Infinity }
                        }}
                      >
                        🏆
                      </motion.span>
                      Leaderboard
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.ul 
                      className="space-y-2 text-sm"
                      variants={containerVariants}
                    >
                      {['Aaryan (1500 pts)', 'Neha (1320 pts)', 'Zaid (1255 pts)', 'Mira (1210 pts)'].map((item, index) => (
                        <motion.li
                          key={index}
                          variants={itemVariants}
                          custom={index}
                          whileHover={{ x: 5, color: '#00ffff' }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          {item}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Token Wallet */}
            <motion.div
              className="tile glassmorph"
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.div variants={cardHoverVariants}>
                <Card className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 border-l-4 border-cyan-400 shadow-cyan backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">Token Wallet Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div variants={containerVariants}>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-cyan-200">Token</TableHead>
                            <TableHead className="text-cyan-200">Balance</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Object.entries(balances).map(([token, amount], index) => (
                            <motion.tr
                              key={token}
                              variants={itemVariants}
                              custom={index}
                              whileHover={{ backgroundColor: 'rgba(0, 255, 255, 0.1)' }}
                            >
                              <TableCell className="text-cyan-100">{token}</TableCell>
                              <TableCell>
                                <motion.span
                                  initial={{ opacity: 0, scale: 0.5 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: index * 0.2 }}
                                  className="text-cyan-300 font-bold"
                                >
                                  {amount}
                                </motion.span>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className="mt-4"
                      >
                        <Button className="w-full bg-gradient-to-r from-cyan-600 to-cyan-800 text-cyan-100 font-orbitron text-lg py-3 px-6 rounded-lg border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.4)] hover:shadow-[0_0_30px_rgba(0,255,255,0.6)] transition-all duration-300 uppercase tracking-wider">
                          View Full Activity
                        </Button>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* NFT Gallery */}
            <motion.div
              className="tile glassmorph"
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.div variants={cardHoverVariants}>
                <Card className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 border-l-4 border-cyan-400 shadow-cyan backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">NFT Gallery</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div 
                      className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      variants={containerVariants}
                    >
                      {nfts.map((nft, index) => (
                        <motion.div
                          key={nft.id}
                          className="border border-cyan-500 p-2 rounded-xl bg-cyan-900/20"
                          variants={itemVariants}
                          whileHover={{
                            scale: 1.05,
                            boxShadow: "0px 5px 15px rgba(0, 255, 255, 0.2)"
                          }}
                          custom={index}
                        >
                          <motion.img
                            src={nft.image}
                            alt={nft.name}
                            className="w-full h-32 object-cover rounded-lg"
                            whileHover={{ scale: 1.1 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          />
                          <motion.h3 
                            className="mt-2 font-orbitron text-cyan-200 text-lg tracking-wide"
                            variants={pulseVariants}
                            animate="pulse"
                          >
                            {nft.name}
                          </motion.h3>
                          <p className="text-sm font-orbitron text-cyan-300 tracking-wide">Type: {nft.type}</p>
                          <motion.div
                            variants={buttonVariants}
                            whileHover="hover"
                            whileTap="tap"
                            className="mt-2"
                          >
                            <Button 
                              size="lg"
                              className="w-full bg-gradient-to-r from-cyan-600 to-cyan-800 text-cyan-100 font-orbitron text-base py-2 px-4 rounded-lg border-2 border-cyan-400 shadow-[0_0_15px_rgba(0,255,255,0.4)] hover:shadow-[0_0_25px_rgba(0,255,255,0.6)] transition-all duration-300 uppercase tracking-wider"
                            >
                              Transfer
                            </Button>
                          </motion.div>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>

            {/* Cyber Avatar */}
            <motion.div
              className="tile glassmorph"
              variants={itemVariants}
              whileHover="hover"
            >
              <motion.div variants={cardHoverVariants}>
                <Card className="bg-gradient-to-br from-cyan-900/40 to-cyan-800/40 border-l-4 border-cyan-400 shadow-cyan h-80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-cyan-300">Your Cyber Avatar</CardTitle>
                  </CardHeader>
                  <CardContent className="h-full">
                    <Suspense 
                      fallback={
                        <motion.div 
                          className="h-full w-full flex items-center justify-center bg-cyan-900/20 rounded-lg"
                          animate={{
                            opacity: [0.5, 1, 0.5],
                            scale: [0.98, 1, 0.98],
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <div className="animate-pulse text-cyan-400">Loading Avatar...</div>
                        </motion.div>
                      }
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Avatar3D />
                      </motion.div>
                    </Suspense>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
