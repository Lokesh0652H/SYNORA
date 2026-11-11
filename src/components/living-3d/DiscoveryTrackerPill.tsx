'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Check, Lock, Award, ArrowUpRight } from 'lucide-react';
import { useLivingWorld } from './LivingWorldContext';
import { LIVING_OBJECTS } from './data';
import { LivingObjectId } from './types';

export default function DiscoveryTrackerPill() {
  const {
    discoveredObjects,
    isDiscoveryModalOpen,
    openDiscoveryModal,
    closeDiscoveryModal,
    selectObject,
    navigateToSection,
  } = useLivingWorld();

  const allObjectKeys = Object.keys(LIVING_OBJECTS) as LivingObjectId[];
  const discoveredCount = discoveredObjects.length;
  const isAllDiscovered = discoveredCount >= allObjectKeys.length;

  return (
    <>
      {/* Floating Discovery Pill (Bottom-Right) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 right-6 z-30"
      >
        <button
          onClick={openDiscoveryModal}
          className="group flex items-center gap-2.5 px-3.5 py-2 rounded-full bg-[#FBFAF6]/90 backdrop-blur-xl border border-[#DEDAD0] shadow-[0_8px_30px_rgba(0,0,0,0.08)] hover:border-[#20201D] text-[#20201D] transition-all cursor-pointer"
          title="View 3D Object Discoveries"
          aria-label="View 3D discoveries"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isAllDiscovered ? 'bg-emerald-400' : 'bg-[#D4AF37]'
              }`}
            />
            <span
              className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                isAllDiscovered ? 'bg-emerald-600' : 'bg-[#D4AF37]'
              }`}
            />
          </span>

          <span className="text-xs font-mono font-medium tracking-tight">
            {discoveredCount}/{allObjectKeys.length} 3D Artifacts
          </span>

          {isAllDiscovered ? (
            <Award className="w-3.5 h-3.5 text-emerald-700" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-[#A87932] group-hover:rotate-12 transition-transform" />
          )}
        </button>
      </motion.div>

      {/* Discovery Constellation Modal */}
      <AnimatePresence>
        {isDiscoveryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="relative w-full max-w-xl bg-[#FBFAF6] border border-[#DEDAD0] shadow-2xl rounded-2xl p-6 sm:p-8 text-[#20201D]"
            >
              {/* Close Button */}
              <button
                onClick={closeDiscoveryModal}
                className="absolute top-5 right-5 p-2 rounded-lg text-[#8A877D] hover:text-[#20201D] hover:bg-[#EFEBE2] transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-xs font-mono tracking-wider uppercase text-[#8A877D]">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>The Living 3D Ecosystem</span>
              </div>

              <h2 className="mt-1 font-serif text-2xl font-normal text-[#20201D]">
                The Sovereign Constellation
              </h2>

              <p className="mt-2 text-sm text-[#66635B] leading-relaxed">
                Six independent 3D artifacts roam through the SYNORA landscape. Click any discovered artifact to trigger its interactive reasoning experience, or scroll to locate undiscovered objects.
              </p>

              {/* Progress Bar */}
              <div className="mt-5 space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-[#5A554A]">
                  <span>Discovery Progress</span>
                  <span className="font-bold">
                    {discoveredCount} of {allObjectKeys.length} unlocked
                  </span>
                </div>
                <div className="w-full h-1.5 bg-[#EAE6DC] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#20201D] transition-all duration-500"
                    style={{ width: `${(discoveredCount / allObjectKeys.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Artifacts Grid */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[42vh] overflow-y-auto pr-1">
                {allObjectKeys.map((key) => {
                  const item = LIVING_OBJECTS[key];
                  const isFound = discoveredObjects.includes(key);

                  return (
                    <div
                      key={key}
                      className={`p-3 rounded-xl border text-left flex items-start justify-between gap-3 transition-all ${
                        isFound
                          ? 'bg-white border-[#DEDAD0] shadow-xs'
                          : 'bg-[#F5F2EA]/60 border-[#EAE6DC] opacity-75'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              isFound ? 'bg-[#2D5A43]' : 'bg-[#C5C0B5]'
                            }`}
                          />
                          <span className="text-xs font-mono uppercase tracking-wider text-[#8A877D]">
                            {item.sectionLabel}
                          </span>
                        </div>
                        <div className="text-sm font-serif font-medium text-[#20201D] mt-0.5">
                          {item.name}
                        </div>
                        <p className="text-[11px] text-[#66635B] line-clamp-1 mt-0.5">
                          {item.category}
                        </p>
                      </div>

                      {isFound ? (
                        <button
                          onClick={() => {
                            closeDiscoveryModal();
                            selectObject(key);
                          }}
                          className="px-2 py-1 rounded bg-[#EFEBE2] hover:bg-[#20201D] hover:text-white text-[11px] font-mono transition-colors cursor-pointer shrink-0 mt-1 flex items-center gap-0.5"
                        >
                          <span>Engage</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            closeDiscoveryModal();
                            navigateToSection(item.homeSectionId);
                          }}
                          className="px-2 py-1 rounded bg-[#E5E0D5]/50 hover:bg-[#E5E0D5] text-[11px] font-mono text-[#5A554A] transition-colors cursor-pointer shrink-0 mt-1 flex items-center gap-1"
                          title="Scroll to section"
                        >
                          <Lock className="w-3 h-3" />
                          <span>Locate</span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Reward Banner when 6/6 discovered */}
              {isAllDiscovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 rounded-xl bg-[#20201D] text-[#FBFAF6] space-y-2"
                >
                  <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37]">
                    <Award className="w-4 h-4" />
                    <span>SOVEREIGN SYNTHESIS UNLOCKED</span>
                  </div>
                  <p className="text-xs text-[#DEDAD0] leading-relaxed">
                    You have unlocked all 6 3D intellectual artifacts. The entire knowledge perimeter is fully coherent and ready for rigorous inquiry.
                  </p>
                </motion.div>
              )}

              {/* Modal Footer */}
              <div className="mt-6 pt-4 border-t border-[#EAE6DC] flex items-center justify-between text-xs">
                <span className="font-mono text-[#8A877D]">
                  {isAllDiscovered
                    ? 'All artifacts synchronized'
                    : `${allObjectKeys.length - discoveredCount} artifact(s) remaining`}
                </span>
                <button
                  onClick={closeDiscoveryModal}
                  className="px-4 py-2 rounded-xl bg-[#EFEBE2] hover:bg-[#DEDAD0] font-medium text-[#20201D] transition-colors cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
