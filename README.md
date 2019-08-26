# ScrollPay
- Put small amouts of BSV, and read payable content just by scrolling the content.
- This is a BSV Hackathon project to demonstrate BSV's micropayment capability.
- The application is published on [Github Pages](https://ryejoon.github.io/ScrollPay/login)
- [Youtube](https://www.youtube.com/watch?v=qs8h4q50P8s&t=13s)

## Protocol
 ScrollPay application runs on two protocols-of its own, and SplitPay. 
 
### ScrollPay Protocol
 Bitcom prefix `1FGbDFzz3Ke6x8dM3TfaSoGRfx1z3BEUkB`. A simple application-specific protocol that indicates the title, description, preview, and most importantly, the [C://](https://c.bitdb.network) hashes of the chunks of the text. The collection and the ordering of the hashes is very important, and should be kept secure(via encryption, server side storage, etc). The current implimentation had this limitation as to focus on the payment.
```
OP_RETURN 1FGbDFzz3Ke6x8dM3TfaSoGRfx1z3BEUkB [title] [description] [preview] [sha256 hashes of the chunks]
```

 [This](https://whatsonchain.com/tx/ea31c42152a6a6fd1a97d4f22e7242f4efa942a439be2564b6bd7c533a3d9f64) is an example for `애국가` item. [This](https://whatsonchain.com/tx/0a67ddce2c7381719c56ee9549059712dccfc1da537653b6198422a6f9523b4b) is an example OP_RETURN of `Alice’s Adventures in Wonderland`. 
 

### SplitPay Protocol
 Bitcom prefix `1MUm6vjuA7BF3VLmgUpRPywiKD69w4TUjA`. A general protocol to indicate the publish/purchase of a chunk of an item. 

#### Sell
 Put a `tag` for an existing protocol to indicate the amount of sale, price unit and price. The txid of this OP_RETURN will be used as a reference from the buyers.
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
