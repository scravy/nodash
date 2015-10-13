`(b → b → c) → (a → b) → a → a → c`

Example:

```JavaScript
var xs = [
    { firstName: 'Jonathan', secondName: 'Müller' },
    { firstName: 'Benjamin', secondName: 'Bamboo' }
];
var sortByFirstName = sortBy(on(compare, select('firstName')), xs);
```
