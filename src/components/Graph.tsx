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
        width={1000} // Set the width
        height={1000} // Set the height
        nodeCanvasObject={(node, ctx, globalScale) => {
            // Ensure node.x and node.y are defined
            if (typeof node.x === 'number' && typeof node.y === 'number') {
              const label = node.id;
              const fontSize = 12 / globalScale; // Adjust font size based on zoom level
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = node.color || 'rgba(255, 255, 255, 0.8)'; // Fallback node color if undefined
              // Draw the node circle
              ctx.beginPath();
              ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
              ctx.fill();
              // Draw the text above the node
              ctx.textAlign = 'center';
              ctx.textBaseline = 'bottom';
              ctx.fillStyle = 'black'; // Text color
              ctx.fillText(label, node.x, node.y - 7); // Adjust the y value to display the text above the node
            }
          }}
          
    />
  );
};

export default Graph;
