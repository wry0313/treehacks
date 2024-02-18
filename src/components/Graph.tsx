import React, { useMemo } from 'react';
import { ForceGraph2D } from 'react-force-graph';

// Define the type for the adjacency list
type AdjacencyList = {
  [key: string]: string[];
};

// Define the props type for the Graph component
interface GraphProps {
  adjacencyList: AdjacencyList;
}

// Define the type for links
interface Link {
  source: string;
  target: string;
}

const Graph: React.FC<GraphProps> = ({ adjacencyList }) => {
  const graphData = useMemo(() => {
    const nodes = new Set<string>();
    const links: Link[] = []; // Explicitly define links as an array of Link

    for (const [source, targets] of Object.entries(adjacencyList)) {
      nodes.add(source);
      targets.forEach(target => {
        links.push({ source, target });
      });
    }

    return {
      nodes: Array.from(nodes).map(id => ({ id })),
      links,
    };
  }, [adjacencyList]);

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="id"
      nodeAutoColorBy="id"
      linkDirectionalParticles="value"
      linkDirectionalParticleSpeed={d => d.value * 0.001}
    />
  );
};

export default Graph;
