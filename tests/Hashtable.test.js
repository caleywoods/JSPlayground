const ht = require('../data-structures/Hashtable');
let Hashtable = ht.CrashTable;
let Node = ht.Node;

test('we can create new hashtable', () => {
    const ht = new Hashtable();
    expect(ht).toBeDefined();
    expect(ht).toHaveProperty('hashFn');
    expect(ht).toHaveProperty('data');
    expect(ht).toHaveProperty('keys');
});

test('we can add a key', () => {
    const ht = new Hashtable();
    ht.put('Felicia', {age: 24, hometown: "Friday, USA", hobbies: "Asking to borrow your car"});
    expect(ht.data.length).toEqual(ht.hashFn('Felicia')+1);
    expect(ht.keys.length).toEqual(1);
    expect(ht.keys).toContain('Felicia');
});

test('we can retrieve a key', () => {
    const ht = new Hashtable();
    ht.put('Felicia', {age: 24, hometown: "Friday, USA", hobbies: "Asking to borrow your car"});
    const returnedValue = ht.get('Felicia');
    expect(returnedValue).toBeInstanceOf(Node);
    expect(Object.keys(returnedValue.data)).toEqual(['age', 'hometown', 'hobbies', 'key']);
    expect(returnedValue.data.key).toBe('Felicia');
})