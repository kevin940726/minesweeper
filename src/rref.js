import { fromJS, List, Range, is } from 'immutable';

const rref = (matrix) => {
	const m = List.isList(matrix) ? matrix : fromJS(matrix);

	let A = m;
	const rows = A.size;
	const columns = A.get(0).size;

	let lead = 0;
	for (let k = 0; k < rows; k++) {
		if (columns <= lead) {
			return A;
		}

		let i = k;
		while (A.get(i).get(lead) === 0) {
			i++;
			if (rows === i) {
				i = k;
				lead++;
				if (columns === lead) {
					return A;
				}
			}
		}

		const irow = A.get(i);
		const krow = A.get(k);
		A = A.update(i, r => krow);
		A = A.update(k, r => irow);

		let val = A.get(k).get(lead);
		for (let j = 0; j < columns; j++) {
			A = A.update(k, r => r.update(j, c => c / val));
		}

		for (let i = 0; i < rows; i++) {
			if (i === k) continue;
			val = A.get(i).get(lead);
			for (let j = 0; j < columns; j++) {
				A = A.update(i, r => r.update(j, c => c - val * A.get(k).get(j)));
			}
		}
		lead++;
	}

	return A;
};

export default rref;
