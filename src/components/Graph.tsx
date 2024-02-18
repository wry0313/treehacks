import React, { useEffect, useMemo, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';

type AdjacencyList = {
  [key: string]: string[];
};

interface GraphProps {
  adjacencyList: AdjacencyList;
}

interface Link {
  source: string;
  target: string;
}

const Graph: React.FC<GraphProps> = ({ adjacencyList }) => {
  const [minMaxY, setMinMaxY] = useState({ minY: 0, maxY: 0 });

  const graphData = useMemo(() => {
    const nodes = new Set<string>();
    const links: Link[] = [];

    for (const [source, targets] of Object.entries(adjacencyList)) {
      nodes.add(source);
      targets.forEach(target => {
        nodes.add(target);
        links.push({ source, target });
      });
    }

    return {
      nodes: Array.from(nodes).map(id => ({ id })),
      links,
    };
  }, [adjacencyList]);

  useEffect(() => {
    // Dynamically adjust minY and maxY based on rendered positions
    // This is a placeholder for actual logic which may involve observing node positions after rendering
    setMinMaxY({ minY: 0, maxY: 600 }); // Assuming 600 as graph height for demo
  }, [graphData]);

  // Dynamic color based on node position
  const getNodeColor = (y: number) => {
    const minY = -40;
    const maxY = 40;
    const ratio = (y - minY) / (maxY - minY);
    const r = Math.round(255 - ratio * (255 - 135)); // Pink to Blue gradient
    const g = Math.round(192 - ratio * (192 - 206));
    const b = Math.round(203 - ratio * (203 - 235));
    return `rgba(${r},${g},${b}, 0.8)`;
  };

  return (
    <ForceGraph2D
      graphData={graphData}
      nodeLabel="id"
        nodeAutoColorBy="id"
        linkDirectionalParticles="value"
        linkDirectionalParticleSpeed={d => d.value * 0.001}
        width={2000} // Set the width
        height={1000} // Set the height
        nodeCanvasObject={(node, ctx, globalScale) => {
            // Ensure node.x and node.y are defined
            if (typeof node.x === 'number' && typeof node.y === 'number') {
              const label = node.id;
              const fontSize = 12 / globalScale; // Adjust font size based on zoom level
              ctx.font = `${fontSize}px Sans-Serif`;

            //   ctx.fillStyle = node.color|| 'rgba(257,192,202, 0.8)'; // Fallback node color if undefined rgba(257,192,202, 0.8)
                ctx.fillStyle = getNodeColor(node.y);
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
