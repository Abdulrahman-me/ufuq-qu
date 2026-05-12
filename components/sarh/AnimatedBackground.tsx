import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

export const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-[#EFE9E3] dark:bg-[#030303]">
            {/* Radial Gradient Glows */}
            <div
                className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]"
                aria-hidden="true"
            />
            <div
                className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent/10 blur-[120px]"
                aria-hidden="true"
            />

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.25] hidden dark:block"
                style={{
                    backgroundImage: `linear-gradient(to right, #333 1px, transparent 1px), linear-gradient(to bottom, #333 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />
            <div
                className="absolute inset-0 block dark:hidden"
                style={{
                    backgroundImage: `linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)`,
                    backgroundSize: '40px 40px'
                }}
            />

            {/* Moving Particles/Symbols */}
            <div className="absolute inset-0 overflow-hidden">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute text-primary/20 pointer-events-none select-none"
                        initial={{
                            x: Math.random() * 100 + '%',
                            y: Math.random() * 100 + '%',
                            opacity: 0,
                            scale: Math.random() * 0.5 + 0.5
                        }}
                        animate={{
                            x: [null, (Math.random() * 100) + '%'],
                            y: [null, (Math.random() * 100) + '%'],
                            opacity: [0.1, 0.3, 0.1],
                        }}
                        transition={{
                            duration: Math.random() * 20 + 20,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        style={{ fontSize: Math.random() * 20 + 10 + 'px' }}
                    >
                        {['{ }', '</>', '[]', '()', ';', '#', '=>'][Math.floor(Math.random() * 7)]}
                    </motion.div>
                ))}
            </div>

            {/* Central Radial Gradient to avoid pure black deafness */}
            <div className="absolute inset-0 dark:bg-[radial-gradient(circle_at_center,rgba(15,15,15,0)_0%,rgba(3,3,3,1)_100%)] bg-[radial-gradient(circle_at_center,rgba(255,255,255,0)_0%,rgba(239,233,227,1)_100%)]" />
        </div>
    );
};
