function murmurhash3_32_gc(key, seed) {
	var remainder, bytes, h1, h1b, c1, c1b, c2, c2b, k1, i;
	
	remainder = key.length & 3; // key.length % 4
	bytes = key.length - remainder;
	h1 = seed;
	c1 = 0xcc9e2d51;
	c2 = 0x1b873593;
	i = 0;
	
	while (i < bytes) {
	  	k1 = 
	  	  ((key.charCodeAt(i) & 0xff)) |
	  	  ((key.charCodeAt(++i) & 0xff) << 8) |
	  	  ((key.charCodeAt(++i) & 0xff) << 16) |
	  	  ((key.charCodeAt(++i) & 0xff) << 24);
		++i;
		
		k1 = ((((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16))) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = ((((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16))) & 0xffffffff;

		h1 ^= k1;
        h1 = (h1 << 13) | (h1 >>> 19);
		h1b = ((((h1 & 0xffff) * 5) + ((((h1 >>> 16) * 5) & 0xffff) << 16))) & 0xffffffff;
		h1 = (((h1b & 0xffff) + 0x6b64) + ((((h1b >>> 16) + 0xe654) & 0xffff) << 16));
	}
	
	k1 = 0;
	
	switch (remainder) {
		case 3: k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;
		case 2: k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;
		case 1: k1 ^= (key.charCodeAt(i) & 0xff);
		
		k1 = (((k1 & 0xffff) * c1) + ((((k1 >>> 16) * c1) & 0xffff) << 16)) & 0xffffffff;
		k1 = (k1 << 15) | (k1 >>> 17);
		k1 = (((k1 & 0xffff) * c2) + ((((k1 >>> 16) * c2) & 0xffff) << 16)) & 0xffffffff;
		h1 ^= k1;
	}
	
	h1 ^= key.length;

	h1 ^= h1 >>> 16;
	h1 = (((h1 & 0xffff) * 0x85ebca6b) + ((((h1 >>> 16) * 0x85ebca6b) & 0xffff) << 16)) & 0xffffffff;
	h1 ^= h1 >>> 13;
	h1 = ((((h1 & 0xffff) * 0xc2b2ae35) + ((((h1 >>> 16) * 0xc2b2ae35) & 0xffff) << 16))) & 0xffffffff;
	h1 ^= h1 >>> 16;

	return h1 >>> 0;
}

class Node {
    constructor(data) {
        this.data = data;
        this.next = null;
    }
}

class ShrinkedList {
    constructor() {
        this.head = null;
    }

    append(data) {
        if (this.head === null) {
            this.head = new Node(data);
            return;
        }

        let currentNode = this.head;

        while (currentNode.next !== null) {
            currentNode = currentNode.next;
        }

        currentNode.next = new Node(data);
    }

    prepend(data) {
        const newHead = new Node(data);
        newHead.next = this.head;
        this.head = newHead;
    }

    deleteWithMatchingValue(value) {
        if (this.head === null) return;

        if (this.head.data === value) {
            this.head = this.head.next;
            return;
        }

        let currentNode = this.head;

        while (currentNode.next !== null) {
            if (currentNode.next.data === value) {
                currentNode.next = currentNode.next.next;
                return;
            }
            currentNode = currentNode.next;
        }
    }

    getNodeWithValue(value) {
        if (this.head === null) return null;

        let currentNode = this.head;

        while (currentNode.next !== null) {
            if (currentNode.data === value) {
                return currentNode;
            }

            currentNode = currentNode.next;
        }

        return null;
    }
}

class CrashTable {

    constructor(hashFn) {
        if (!hashFn) {
            this.hashFn = murmurhash3_32_gc;
        } else {
            this.hashFn = hashFn;
        }
        this.data = new Map();
    }

    // Handles collisions by using a simple linked list at the indexes
    put(k,v) {
        // Run our hash function against k to get an index
        // Insert v into a singly linked list at the kth index
        const idx = this.hashFn(k);
        let ll;
        if (this.data.has(idx)) {
            ll = this.data.get(idx);
        } else {
            ll = new ShrinkedList();
            this.data.set(idx, ll);
        }

        const nodeWithValue = ll.getNodeWithValue(v);

        if (nodeWithValue) {
            nodeWithValue.data = v;
            return;
        }

        ll.append(v);
    }

    get(k) {
        const idx = this.hashFn(k);

        return this.data.get(idx);
    }
}

const hashtable = new CrashTable();
hashtable.put('Karen', {age: 31, hometown: "Anytown, USA", hobbies: "Speaking to managers"});
hashtable.put('Caley', {age: 999, hometown: "NoTown, USA", hobbies: "pogonotrophy, code"});
console.log(hashtable.get('Karen'));
