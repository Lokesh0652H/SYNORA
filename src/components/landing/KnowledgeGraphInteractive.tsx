'use client';

import React, { useState } from 'react';
import { Network, Sparkles, ArrowUpRight, Share2, Layers } from 'lucide-react';

type GraphNode = {
  id: string;
  label: string;
  type: 'concept' | 'model' | 'metric' | 'citation';
  x: number;
  y: number;
  connections: string[];
  description: string;
  sourceRef: string;
};

const NODES: GraphNode[] = [
  {
    id: 'n1',
    label: 'Scaled Dot-Product Attention',
    type: 'concept',
    x: 48,
    y: 28,
    connections: ['n2', 'n3', 'n4'],
    description: 'Core linear attention formulation scaling queries and keys by the inverse square root of head dimension.',
    sourceRef: 'Vaswani et al., 2017 · §3.2.1',
  },
  {
    id: 'n2',
    label: 'FlashAttention-2',
    type: 'model',
    x: 24,
    y: 65,
    connections: ['n1', 'n3', 'n5'],
    description: 'Tiled SRAM softmax implementation achieving 2× speedup and 73% theoretical peak FLOPs/s.',
    sourceRef: 'Dao, 2023 · §3',
  },
  {
    id: 'n3',
    label: 'Memory IO Bottleneck',
    type: 'metric',
    x: 74,
    y: 60,
    connections: ['n1', 'n2'],
    description: 'Hardware constraint where memory bandwidth between HBM and SRAM dominates runtime over computation.',
    sourceRef: 'Hardware Roofline Model Analysis',
  },
  {
    id: 'n4',
    label: 'Multi-Subspace Projection',
    type: 'concept',
    x: 78,
    y: 22,
    connections: ['n1'],
    description: 'Projects tokens into 8 parallel representational subspaces simultaneously.',
    sourceRef: 'Vaswani et al., 2017 · p. 5',
  },
  {
    id: 'n5',
    label: 'SRAM Cache Tiling',
    type: 'citation',
    x: 22,
    y: 30,
    connections: ['n2'],
    description: 'Keeps intermediate softmax statistical vectors strictly in fast L1/L2 cache.',
    sourceRef: 'GPU Architecture Whitepaper',
  },
];

export default function KnowledgeGraphInteractive() {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(NODES[0]);

  return (
    <div className="w-full bg-white border border-[#DEDAD0] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-[#E8E4DA]">
          <span className="text-[11px] font-mono tracking-widest text-[#858875] uppercase flex items-center gap-1.5">
            <Network size={13} /> DYNAMIC KNOWLEDGE GRAPH · 5 CLUSTER NODES
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#EFEBE2] text-[#20201D] border border-[#DEDAD0]">
            Interactive Topology
          </span>
        </div>

        {/* Visual Graph Canvas Area */}
        <div className="relative w-full h-[240px] sm:h-[270px] bg-[#F5F3ED] rounded-2xl border border-[#DEDAD0] overflow-hidden mb-4 p-4 select-none">
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {NODES.map((node) =>
              node.connections.map((targetId) => {
                const target = NODES.find((n) => n.id === targetId);
                if (!target) return null;
                const isHighlighted = selectedNode.id === node.id || selectedNode.id === target.id;
                return (
                  <line
                    key={`${node.id}-${targetId}`}
                    x1={`${node.x}%`}
                    y1={`${node.y}%`}
                    x2={`${target.x}%`}
                    y2={`${target.y}%`}
                    stroke={isHighlighted ? '#20201D' : '#D6C9B5'}
                    strokeWidth={isHighlighted ? 1.75 : 1}
                    strokeDasharray={isHighlighted ? 'none' : '3,3'}
                    className="transition-all duration-300"
                  />
                );
              })
            )}
          </svg>

          {/* Interactive Graph Nodes */}
          {NODES.map((node) => {
            const isSelected = selectedNode.id === node.id;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{ top: `${node.y}%`, left: `${node.x}%` }}
                className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 cursor-pointer shadow-xs flex items-center gap-1.5 z-10 ${
                  isSelected
                    ? 'bg-[#20201D] text-white scale-108 shadow-md border border-black font-semibold'
                    : 'bg-[#FBFAF6] text-[#20201D] border border-[#DEDAD0] hover:border-[#858875] hover:scale-104'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    node.type === 'concept'
                      ? 'bg-[#858875]'
                      : node.type === 'model'
                      ? 'bg-[#B98F7B]'
                      : 'bg-[#D6C9B5]'
                  }`}
                />
                <span className="truncate max-w-[130px] sm:max-w-[170px]">{node.label}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Node Details Box */}
        <div className="p-4 rounded-xl bg-[#F5F3ED] border border-[#DEDAD0] text-left">
          <div className="flex items-center justify-between mb-1.5 text-[10px] font-mono text-[#858875]">
            <span>NODE TYPE: {selectedNode.type.toUpperCase()}</span>
            <span>PROVENANCE: {selectedNode.sourceRef}</span>
          </div>
          <h5 className="text-sm font-semibold text-[#20201D] mb-1">
            {selectedNode.label}
          </h5>
          <p className="text-xs text-[#77756E] leading-relaxed">
            {selectedNode.description}
          </p>
        </div>
      </div>

      <div className="pt-4 border-t border-[#E8E4DA] mt-4 flex items-center justify-between text-xs">
        <span className="text-[#77756E]">Graph auto-constructs as you upload papers</span>
        <span className="font-mono text-[11px] text-[#858875]">Click any node to explore ↗</span>
      </div>
    </div>
  );
}
