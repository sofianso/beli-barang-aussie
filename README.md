## Refreshers

1.

```
// the ! inside guarantees that it has to return an array
// the ! outside guarantees it cannot be null
orders: [Order!]!
```

2. schema is the same as typeDefs in Apollo-server
3. To return mongoose `id` in Graphql Playground, there are two methods to do it.
   The first requires you to extract and return the `_id` and convert it to string
   ` return {...result._doc, _id: order._doc._id.toString() };`
   OR
   `return {...result._doc, _id: order.id };`

## REFERENCES

REF[1]: https://youtu.be/sOUNgOx0GcU

## NEXT TUTORIAL

https://www.youtube.com/watch?v=MRrcUQhZwBc&list=PL55RiY5tL51rG1x02Yyj93iypUuHYXcB_&index=6
