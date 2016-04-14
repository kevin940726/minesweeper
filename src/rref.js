import { fromJS, List, Range, Seq, Map, Record } from 'immutable';

const BlockRecord = Record({ row: 0, col: 0 });
const Block = Record({
	type: 'normal',
	mines: 0,
	hidden: true,
	flag: false
});

let edges = Map();
edges = edges.set(
	new BlockRecord({ row: 0, col: 1 }),
	new Block({ mines: 1, hidden: false })
);
edges = edges.set(
	new BlockRecord({ row: 1, col: 1 }),
	new Block({ mines: 2, hidden: false })
);
edges = edges.set(
	new BlockRecord({ row: 2, col: 1 }),
	new Block({ mines: 1, hidden: false })
);
edges = edges.set(
	new BlockRecord({ row: 3, col: 1 }),
	new Block({ mines: 1, hidden: false })
);

let edgeBlocks = Map();
edgeBlocks = edgeBlocks.set(
	new BlockRecord({ row: 0, col: 0 }),
	new Block({ type: 'mine' })
);
edgeBlocks = edgeBlocks.set(
	new BlockRecord({ row: 1, col: 0 }),
	new Block({ mines: 2 })
);
edgeBlocks = edgeBlocks.set(
	new BlockRecord({ row: 2, col: 0 }),
	new Block({ type: 'mine' })
);
edgeBlocks = edgeBlocks.set(
	new BlockRecord({ row: 3, col: 0 }),
	new Block({ mines: 1 })
);

const rref = (matrix) => {
	const m = List.isList(matrix) ? matrix : fromJS(matrix);

	let M = m.sort( (prev, next) => (
		prev.findIndex(col => col !== 0) < next.findIndex(col => col !== 0) ? -1 : 1
	));

	Range(0, m.get(0).size - 1)
		.forEach(col => {
			const reduced = M.toKeyedSeq().filter(row => row.get(col) !== 0);
			reduced.butLast().forEach( (seq, i) => {
				const reducer = seq.get(reduced.last().findIndex(c => c === 1));
				M = M.update(i, row => row.map( (c, j) => c - reduced.last().get(j) * reducer ));
			});
		});

	return M;
};

const matrix = [
	[1, 1, 0, 0, 1],
	[1, 1, 1, 0, 1],
	[0, 1, 1, 1, 2],
	[0, 0, 1, 1, 1]
];

console.log(rref(matrix));
