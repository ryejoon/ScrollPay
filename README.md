### SplitPay Protocol
 Bitcom prefix `1MUm6vjuA7BF3VLmgUpRPywiKD69w4TUjA`. A general protocol to indicate the publish/purchase of a chunk of an item. 

#### Sell
 Put a `tag` for an existing protocol to indicate the amount of sale, price unit and price. The txid of this OP_RETURN will be used as a reference from the buyers.
 
### Type
```
number | utc | date
```
 
### Protocol
```
OP_RETURN [Any Protocol] | 
1MUm6vjuA7BF3VLmgUpRPywiKD69w4TUjA [pay-to-address] range [from] [until] [price unit] [price]
```

#### Buy
 Indicates a payment to an item, with the actual payment output in the same transaction. The both outputs must be in the same transaction.
```
output1 
OP_RETURN 1MUm6vjuA7BF3VLmgUpRPywiKD69w4TUjA [item txid] [from] [until]

output2
Amount : (price * ((until - from) / price unit))
Address : [pay-to-address] of the sell tx.
```



#### Samples
- [Scrollpay OP_RETURNs ](https://babel.bitdb.network/query/1DHDifPvtPgKFPZMRSxmVHhiPvFmxZwbfh/ewogICJ2IjogMywKICAicSI6IHsKICAgICJmaW5kIjogewogICAgICAib3V0LnMxIiA6ICIxRkdiREZ6ejNLZTZ4OGRNM1RmYVNvR1JmeDF6M0JFVWtCIgogICAgfSwKICAgICJsaW1pdCI6IDEwCiAgfQp9)
