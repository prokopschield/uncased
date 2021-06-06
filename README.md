# uncased

### Case-insensitive Map

Use it just like any other `Map`.

Its keys can are case-insensitive strings.

Its values can be strings and/or Uncased maps.

Type coercion is automatic, however, Symbols will not work.

No dependencies.

Installation: `yarn add uncased`

## Bonus!

```javascript
const uMap = require('uncased');
const map = new uMap();
map.set('FOO', 'bar');
const obj = map.obj;
obj.foo // bar
obj.Foo // bar
obj.FiZz = 'buzz' // buzz
obj.fizz // buzz
map.get('fiZZ') // buzz
map.add({ a: { b: { c: { d: 'e' } } } })
map.obj.a.obj.b.obj.c.obj.d // e
```

#### map.obj returns a Proxy object, which you can use instead of the map!

Free to use, under GNU GPL. See [License](<https://gnu.org/licenses/gpl>).
