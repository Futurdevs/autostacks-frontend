"use client"

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Github, ArrowRight, Code, Sparkles, Layers, FileCode } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function Home() {
  const [email, setEmail] = useState("");

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <motion.div
            initial={{ rotate: -10, scale: 0.9 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="animate-pulse-glow rounded-full p-4"
          >
            <Image src="/logo.svg" alt="AutoStacks" width={25} height={25} />
          </motion.div>
          <h1 className="text-2xl font-bold tracking-tight glow">AutoStacks</h1>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            <Link href="#features" className="hover:text-primary transition-colors">Features</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it Works</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <ThemeToggle />
          <Button asChild className="shadow-neon-purple">
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32 flex flex-col md:flex-row items-center gap-12">
        <motion.div 
          className="flex-1 space-y-6"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight glow">
            AI-Powered Stacks Blockchain Development
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            Bootstrap your Stacks blockchain projects with AI assistance. 
            Build smart contracts in Clarity language faster and with fewer errors.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="group shadow-neon-pink" asChild>
              <Link href="/login">
                Get Started <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-primary/40 hover:border-primary/80">
              <Link href="https://github.com/apps/auto-stacks" target="_blank">
                <Github className="mr-2" size={18} />
                View on GitHub
              </Link>
            </Button>
          </div>
        </motion.div>
        <motion.div 
          className="flex-1 relative"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="w-full h-[400px] relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-lg blur-3xl opacity-30"></div>
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ 
                duration: 6, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <div className="w-[80%] h-[80%] bg-card rounded-lg border border-primary/20 shadow-lg glow-box overflow-hidden bg-grid-small">
                <div className="h-8 bg-muted flex items-center px-4 border-b border-primary/20">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="ml-4 text-xs text-muted-foreground">clarity-smart-contract.clar</div>
                </div>
                <div className="p-4 font-mono text-sm overflow-hidden">
                  <div className="text-primary">;; Define a new non-fungible token</div>
                  <div className="mt-2">(define-non-fungible-token nft-name uint)</div>
                  <div className="mt-1"></div>
                  <div className="mt-1">;; Define the contract owner</div>
                  <div className="mt-1">(define-data-var contract-owner principal tx-sender)</div>
                  <div className="mt-1"></div>
                  <div className="mt-1">;; Mint a new NFT</div>
                  <div className="mt-1">(define-public (mint (recipient principal) (token-id uint))</div>
                  <div className="mt-1 ml-4">(let ((sender tx-sender))</div>
                  <div className="mt-1 ml-8">(asserts! (is-eq sender (var-get contract-owner)) (err u100))</div>
                  <div className="mt-1 ml-8">(nft-mint? nft-name token-id recipient)</div>
                  <div className="mt-1 ml-4">)</div>
                  <div className="mt-1">)</div>
                  <div className="mt-4 text-accent">✓ Smart contract generated successfully!</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold mb-4 glow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            Powerful Features
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-[600px] mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Everything you need to build on the Stacks blockchain with Clarity
          </motion.p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div variants={fadeIn}>
            <Card className="h-full border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-neon-pink transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <FileCode size={24} className="text-primary" />
                </div>
                <CardTitle>Smart Contract Generation</CardTitle>
                <CardDescription>
                  Generate Clarity smart contracts with AI assistance for common use cases.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span>NFT and fungible token contracts</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span>DAO and governance structures</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span>DeFi primitives and protocols</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="h-full border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-neon-purple transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Layers size={24} className="text-primary" />
                </div>
                <CardTitle>Stacks Integration</CardTitle>
                <CardDescription>
                  Seamlessly integrate with the Stacks blockchain ecosystem.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span>Stacks.js library integration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span>Hiro Wallet connection</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span>Testnet and mainnet deployment</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card className="h-full border-primary/20 bg-card/50 backdrop-blur-sm hover:shadow-neon-blue transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Code size={24} className="text-primary" />
                </div>
                <CardTitle>Clarity Language Support</CardTitle>
                <CardDescription>
                  Get expert assistance with Clarity language development.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span>Syntax checking and validation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span>Security best practices</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" />
                    <span>Optimization suggestions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <motion.div 
          className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-xl p-8 md:p-12 relative overflow-hidden bg-dots"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-3xl font-bold glow">Ready to build on Stacks?</h2>
              <p className="text-lg text-muted-foreground max-w-[500px]">
                Join the waitlist to be among the first to experience AutoStacks.
              </p>
            </div>
            <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="md:min-w-[300px] border-primary/30 focus:border-primary"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button className="shadow-neon-pink">Join Waitlist</Button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <Image src="/logo.svg" alt="AutoStacks" width={25} height={25} />
              <span className="text-xl font-bold glow">AutoStacks</span>
            </div>
            <div className="flex flex-wrap gap-8 justify-center">
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                GitHub
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} AutoStacks. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
