import React, { useEffect, useState, useCallback } from 'react';
import { ForceGraph2D } from 'react-force-graph';

type AdjacencyList = {
  [key: string]: string[];
};

interface GraphProps {
  adjacencyList: AdjacencyList;
}

interface Node {
  id: string;
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
}

const Graph: React.FC<GraphProps> = ({ adjacencyList }) => {
    const [isZoomed, setIsZoomed] = useState(false);
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] });

  useEffect(() => {
    const nodes = new Set<string>();
    const links: Link[] = [];

    for (const [source, targets] of Object.entries(adjacencyList)) {
      nodes.add(source);
      targets.forEach(target => {
        nodes.add(target);
        links.push({ source, target });
      });
    }

    setGraphData({
      nodes: Array.from(nodes).map(id => ({ id })),
      links,
    });
  }, [adjacencyList]);

  const getNodeColor = (y: number) => {
    const minY = -40;
    const maxY = 40;
    const ratio = (y - minY) / (maxY - minY);
    const r = Math.round(255 - ratio * (255 - 135)); // Pink to Blue gradient
    const g = Math.round(192 - ratio * (192 - 206));
    const b = Math.round(203 - ratio * (203 - 235));
    return `rgba(${r},${g},${b}, 0.8)`;
  };

  const handleNodeClick = useCallback((node: Node) => {

    if (isZoomed){
        console.log("zoomed click");
    }else{
        setIsZoomed(true);
        // Calculate nodes within two degrees of separation
        const nodesWithinTwoDegrees = new Set<string>([node.id]);
        const linksWithinTwoDegrees: Link[] = [];

        // Direct connections (one degree)
        adjacencyList[node.id]?.forEach((neighbor) => {
        nodesWithinTwoDegrees.add(neighbor);
        linksWithinTwoDegrees.push({ source: node.id, target: neighbor });

        // Two degrees connections
        adjacencyList[neighbor]?.forEach((secondDegree) => {
            if (!nodesWithinTwoDegrees.has(secondDegree)) {
            nodesWithinTwoDegrees.add(secondDegree);
            linksWithinTwoDegrees.push({ source: neighbor, target: secondDegree });
            }
        });
        });

        setGraphData({
        nodes: Array.from(nodesWithinTwoDegrees).map(id => ({ id })),
        links: linksWithinTwoDegrees,
        });
    }
  }, [adjacencyList]);

  return (
    <ForceGraph2D
      graphData={graphData}
      width={2000} // Set the width
      height={1000} // Set the height
      nodeAutoColorBy="id"
      linkDirectionalParticles="value"
      linkDirectionalParticleSpeed={0.001}
      nodeCanvasObject={(node, ctx, globalScale) => {
        if (typeof node.x === 'number' && typeof node.y === 'number') {
          const label = node.id;
          const fontSize = 12 / globalScale; // Adjust font size based on zoom level
          ctx.font = `${fontSize}px Sans-Serif`;
          ctx.fillStyle = getNodeColor(node.y);
          ctx.beginPath();
          ctx.arc(node.x, node.y, 5, 0, 2 * Math.PI, false);
          ctx.fill();
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          ctx.fillStyle = 'black'; // Text color
          ctx.fillText(label, node.x, node.y - 7); // Adjust the y value to display the text above the node
        }
      }}
      onNodeClick={handleNodeClick}
    />
  );
};

export default Graph;
