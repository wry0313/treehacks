import Graph from "../../components/Graph";

const adjacencyList = {
  "The Stable Matching ...": [
    "Stability is defined...",
    "The algorithm operat...",
    "The concept of optim...",
  ],
  "Stability is defined...": [
    "The Stable Matching ...",
    "The algorithm operat...",
    "The concept of optim...",
  ],
  "The algorithm operat...": [
    "The Stable Matching ...",
    "Stability is defined...",
    "The concept of optim...",
  ],
  "The concept of optim...": [
    "The Stable Matching ...",
    "The algorithm operat...",
    "Stability is defined...",
  ],
  "Historical context i...": [
    "The note discusses t...",
    "The concept of optim...",
    "The Stable Matching ...",
  ],
  "The note discusses t...": [
    "Historical context i...",
    "The concept of optim...",
    "The algorithm operat...",
  ],
  "Further reading sugg...": [
    "The Stable Matching ...",
    "RSA's implementation...",
    "Hall's Marriage Theo...",
  ],
  "RSA's implementation...": [
    "The document outline...",
    "RSA cryptography all...",
    "Further reading sugg...",
  ],
  "Hall's Marriage Theo...": [],
  "Eulerian Tours: Cond...": ["Planar Graphs and Eu..."],
  "Planar Graphs and Eu...": [
    "Connectivity and Pat...",
    "Eulerian Tours: Cond...",
  ],
  "Connectivity and Pat...": ["Planar Graphs and Eu..."],
  "RSA cryptography all...": [
    "The security of RSA ...",
    "Security: The securi...",
    "The document outline...",
  ],
  "The security of RSA ...": [
    "Security: The securi...",
    "RSA cryptography all...",
    "The document outline...",
  ],
  "Security: The securi...": [],
  "The document outline...": [
    "RSA cryptography all...",
    "RSA's implementation...",
    "Security: The securi...",
  ],
};

export default function GraphPage() {
  return <Graph adjacencyList={adjacencyList} />;
}
