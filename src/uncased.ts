const adder_global_set = new WeakSet;

/**
 * Uncased map
 */
export class Uncased implements Map<string, Uncased | string> {
	#_values = new Map<string, Uncased | string>();
	#_valobj: {
		[index: string]: Uncased | string;
	} = {}
	#_strobj: {
		[index: string]: string;
	} = {}
	private __reflect (key: string) {
		const self = this;
		Object.defineProperty(self.#_valobj, key, {
			enumerable: true,
			configurable: true,
			get () {
				return self.get(key);
			},
			set (val) {
				return self.set(key, val);
			},
		});
		Object.defineProperty(self.#_strobj, key, {
			enumerable: true,
			configurable: true,
			get () {
				const val = self.get(key);
				if (typeof val === 'string') return val;
				else return val?.first;
			},
			set (val) {
				return self.set(key, val);
			},
		});
	}
	private __set (key: string, val: string | Uncased) {
		key = `${key}`.toLocaleLowerCase();
		this.#_values.set(key, val);
		this.__reflect(key);
	}
	constructor (...initial: any[]) {
		this.add(initial);
	}
	/**
	 * Add entires into the map
	 * @param entries The entries
	 */
	add (...entries: any[]) {
		for (const entry of entries) {
			if (typeof entry !== 'object') {
				try {
					this.__set(`${entry}`.toLocaleLowerCase(), `${entry}`);
				} catch (error) {}
			} else {
				adder_global_set.add(entry);
				if (Symbol.iterator in entry) {
					try {
						const ar = [ ...(entry as any as Map<string, unknown>) ];
						// If ar is defined, v was iterable.
						// Otherwise, proceed below.
						if ((ar.length === 2) && ((typeof ar[0] === 'string') || (typeof ar[0] === 'number'))) {
							this.add({
								[ar[0]]: ar[1],
							});
						} else this.add(...ar);
						adder_global_set.delete(entry);
						continue;
					} catch (error) {}
				}
				// We have a non-iterable object.
				for (const key in entry) {
					const val = entry[key];
					if (typeof val === 'object') {
						if (adder_global_set.has(val)) {
							this.__set(`${key}`.toLocaleLowerCase(), '<<< SELF-REFERENCE >>>');
						} else {
							this.__set(`${key}`.toLocaleLowerCase(), new Uncased(val));
						}
					} else {
						this.__set(`${key}`.toLocaleLowerCase(), `${val}`);
					}
				}
				adder_global_set.delete(entry);
			}
		}
		return this;
	}
	/**
	 * Get the number of entries stored
	 */
	get size (): number {
		return this.#_values.size;
	}
	/**
	 * Iterate through map
	 */
	*[Symbol.iterator] () {
		for (const val of this.#_values) {
			yield val;
		}
	}
	/**
	 * Erase map
	 */
	clear () {
		return this.#_values.clear();
	}
	/**
	 * Delete an entry
	 * @param key
	 * @returns true if entry existed
	 */
	delete (key: string | Symbol) {
		return this.#_values.delete(`${key}`.toLocaleLowerCase());
	}
	/**
	 * Get iterator of entries
	 * @returns Iterator
	 */
	entries () {
		return this.#_values.entries();
	}
	/**
	 * Apply map values to callback function
	 * @param cb Your callback function
	 * @param thisArg What should be used as `this`
	 */
	forEach (cb: (item: Uncased | string, key: string, map: Map<string, Uncased | string>) => void, thisArg: any) {
		for (const [ key, item ] of (this.entries())) {
			try {
				cb.call(thisArg || this, item, key, this.#_values);
			} catch (error) {
				console.error(error);
			}
		}
		return this;
	}
	/**
	 * Get a value
	 * @param key
	 */
	get (key: string) {
		return this.#_values.get(`${key}`.toLocaleLowerCase());
	}
	/**
	 * Check if a value exists
	 * @param key
	 */
	has (key: string) {
		return this.#_values.has(`${key}`.toLocaleLowerCase());
	}
	/**
	 * Set a key-value pair
	 * @param key
	 * @param val
	 */
	set (key: string, val: string | object | IterableIterator<string | [string, string]>) {
		return this.add({
			[key]: val,
		});
	}
	/**
	 * Get all keys in the map
	 * @returns Iterator of keys
	 */
	keys () {
		return this.#_values.keys();
	}
	/**
	 * Get all values of the map
	 * @returns Iterator of values
	 */
	values () {
		return this.#_values.values();
	}
	[Symbol.toStringTag] = 'Uncased Map';
	/**
	 * Get an object-like accessor
	 */
	get obj (): {
		[index: string]: string | Uncased;
	} {
		const self = this;
		return new Proxy(self.#_valobj, {
			get (target, key) {
				return self.get(key.toString());
			},
			set (target, key, val) {
				return !!self.set(key.toString(), val);
			},
		});
	}
	/**
	 * Get an object-like accessor that only returns strings
	 */
	get str (): {
		[index: string]: string;
	} {
		const self = this;
		return new Proxy(self.#_strobj, {
			get (target, key) {
				const entry = self.get(key.toString())
				if (typeof entry === 'string') {
					return entry;
				} else if (entry) {
					for (let [ key, val ] of entry) {
						if (typeof val === 'string') val;
						else return val.first;
					}
				}
			},
			set (target, key, val) {
				return !!self.set(key.toString(), val);
			},
		});
	}
	get first (): string | undefined {
		for (const [ key, value ] of this) {
			if (typeof value === 'string') return value;
			else return value.first;
		}
	}
	toJSON () {
		return { ...this.obj }
	}
}

declare const module: {
	exports?: typeof Uncased;
}

export default Uncased;
module.exports = Uncased;

Object.assign({
	default: Uncased,
	Uncased,
});
