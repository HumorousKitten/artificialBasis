export function searchSameElements(arr1: string[], arr2: string[]): boolean {
	const set1 = new Set(arr1);  

	for (const elem of arr2) {
			if (set1.has(elem)) {
					return true;  
			}
	}

	return false; 
}