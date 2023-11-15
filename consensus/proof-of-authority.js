


class ProofOfAuthority {
    constructor(block) { 
        this.block = block;
    }

    calculateHash() {
        return SHA256(this.block.previousHash + this.block.timestamp + JSON.stringify(this.block.transactions) + this.block.validator).toString();
    }

    //PoA DOESN'T require miners to perform complex computations like PoW does, the concept of the NONCE VALUE ISN'T NECESSARY in the same way.

    generateBlock() {
        this.block.hash = this.calculateHash();
        console.log("Block generated:"+this.block.hash);
        return this.block;
    }
}

module.exports = ProofOfAuthority;