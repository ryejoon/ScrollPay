# ScrollPay
- Put small amouts of BSV, and read payable content just by scrolling the content.
- This is a BSV Hackathon project to demonstrate BSV's micropayment capability.
- The application is published on [Github Pages](https://ryejoon.github.io/ScrollPay/login)

## Protocol
 ScrollPay application runs on two protocols-of its own, and SplitPay. 
 
### ScrollPay Protocol
 Bitcom prefix `1FGbDFzz3Ke6x8dM3TfaSoGRfx1z3BEUkB`. A simple application-specific protocol that indicates the title, description, preview, and most importantly, the C hashes of the chunks of the text. The collection and the ordering of the hashes is very important, and should be kept secure(via encryption, server side storage, etc). The current implimentation had this limitation as to focus on the payment.
```
OP_RETURN 1FGbDFzz3Ke6x8dM3TfaSoGRfx1z3BEUkB [title] [description] [preview] [C hashs of the chunks]
```

### SplitPay Protocol
 Bitcom prefix `1MUm6vjuA7BF3VLmgUpRPywiKD69w4TUjA`. A general protocol to indicate the publish/purchase of a chunk of an item. 

#### Sell
 Put a `tag` for an existing protocol to indicate the amount of sale, price unit and price. The txid of this OP_RETURN will be used as a reference from the buyers.
```
OP_RETURN [Any Protocol] | 
1MUm6vjuA7BF3VLmgUpRPywiKD69w4TUjA [pay-to-address] range [from] [until] [price unit] [price]
```

#### Buy
 Indicates a payment to an item, with the actual payment output in the same transaction. The both outputs have to be in the same transaction.

##### OP_RETURN Output
```
OP_RETURN 1MUm6vjuA7BF3VLmgUpRPywiKD69w4TUjA [item txid] [from] [until]
```
##### Payment Output
```
Amount : (price * ((until - from) / price unit))
Address : [pay-to-address] of the sell tx.
```
