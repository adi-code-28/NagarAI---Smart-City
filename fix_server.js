const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

// Remove videoUrl property from all lines
content = content.replace(/videoUrl: '[^']*', /g, '');
content = content.replace(/videoUrl: "[^"]*", /g, '');
content = content.replace(/videoUrl: '[^']*'/g, '');
content = content.replace(/videoUrl: "[^"]*"/g, '');

// Fix lectures missing content
const missingContent = [
  { id: 'jee-m1-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Application of Derivatives</h3><p>Using derivatives to find rates of change, tangents, normals, and maxima/minima.</p>' },
  { id: 'jee-m1-l3', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Definite Integration</h3><p>Calculating the area under a curve between two points.</p>' },
  { id: 'jee-m1-l4', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Differential Equations</h3><p>Equations involving derivatives of an unknown function.</p>' },
  { id: 'neet-c1-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: VSEPR Theory</h3><p>Valence Shell Electron Pair Repulsion theory used to predict the geometry of individual molecules.</p>' },
  { id: 'neet-c1-l3', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Molecular Orbital Theory</h3><p>A method for describing the electronic structure of molecules using quantum mechanics.</p>' },
  { id: 'neet-b2-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Molecular Basis of Inheritance</h3><p>Study of genes at the molecular level, including DNA replication, transcription, and translation.</p>' },
  { id: 'c10-s1-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Balancing Chemical Equations</h3><p>Ensuring the number of atoms of each element is the same on both sides of the equation.</p>' },
  { id: 'c10-s1-l3', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Acids, Bases and Salts</h3><p>Understanding pH, neutralization reactions, and properties of various salts.</p>' },
  { id: 'c10-s1-l4', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Metals and Non-Metals</h3><p>Physical and chemical properties of metals and non-metals, and their reactivity series.</p>' },
  { id: 'c10-m2-l1', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Introduction to Trigonometry</h3><p>Study of relationships between side lengths and angles of triangles.</p>' },
  { id: 'c10-m2-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Trigonometric Identities</h3><p>Equations involving trigonometric functions that are true for every value of the occurring variables.</p>' },
  { id: 'c10-ss1-l1', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Nationalism in India</h3><p>The growth of modern nationalism in India and the struggle for independence.</p>' },
  { id: 'c10-ss1-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: The Rise of Nationalism in Europe</h3><p>The development of nationalism as a force which brought about sweeping changes in the political and mental world of Europe.</p>' },
  { id: 'c12-p1-l1', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Electric Charges & Fields</h3><p>Study of electric charges at rest and the fields they create.</p>' },
  { id: 'c12-p1-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Electrostatic Potential</h3><p>Work done per unit charge in bringing a charge from infinity to a point.</p>' },
  { id: 'c12-p1-l3', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Capacitance</h3><p>The ability of a system to store an electric charge.</p>' },
  { id: 'c12-c1-l1', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Crystal Lattices & Unit Cells</h3><p>The symmetrical three-dimensional arrangement of atoms inside a crystal.</p>' },
  { id: 'c12-c1-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Imperfections in Solids</h3><p>Deviations from the perfectly ordered arrangement of atoms in a crystal.</p>' },
  { id: 'c12-c1-l3', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Solutions & Colligative Properties</h3><p>Properties of solutions that depend on the ratio of the number of solute particles to the number of solvent molecules.</p>' },
  { id: 'c12-m1-l1', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Types of Relations</h3><p>Reflexive, symmetric, transitive, and equivalence relations.</p>' },
  { id: 'c12-m1-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Inverse Trigonometric Functions</h3><p>Inverse functions of the basic trigonometric functions.</p>' },
  { id: 'c12-e1-l1', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: The Last Lesson</h3><p>A story about the importance of one\'s language and the impact of war on education.</p>' },
  { id: 'c12-e1-l2', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Lost Spring</h3><p>Stories of stolen childhood and the plight of street children.</p>' },
  { id: 'c12-e1-l3', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Deep Water</h3><p>An autobiographical account of overcoming fear of water.</p>' },
  { id: 'class10-s2-l1', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Nutrition in Plants</h3><p>How plants prepare their own food through photosynthesis.</p>' },
  { id: 'class12-c2-l1', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: Introduction to Organic</h3><p>Basic principles and techniques of organic chemistry.</p>' },
  { id: 'skill-ai1-l1', content: '<h3 class=\"text-xl font-bold mb-4\">Theory: What is GenAI?</h3><p>Generative AI refers to artificial intelligence that can generate new content, such as text, images, or other media.</p>' }
];

missingContent.forEach(item => {
  const regex = new RegExp(`id: '${item.id}', courseId: '[^']*', title: '[^']*', duration: '[^']*', order: \\d+ }`, 'g');
  content = content.replace(regex, (match) => {
    return match.replace(' }', `, content: '${item.content}' }`);
  });
});

fs.writeFileSync('server.ts', content);
