const Block = require('./Block.js');
const Transaction = require('./Transaction.js');

// const ProofOfWork = require('../consensus/proof-of-work.js');
// const ProofOfStake = require('../consensus/proof-of-stake.js');
const ProofOfAuthority = require('../consensus/proof-of-authority.js');

class Blockchain {
    constructor (consensus) {
        this.consensus = consensus;
        this.chain = [this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.participants = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block("21/08/2023","GenesisBlock","0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    generateBlock(minerAddress, difficulty = 2) { 
        let block = new Block(Date.now(), this.pendingTransactions, this.getLatestBlock().hash);
        
         if (this.consensus == 'poa'){ 
            let algorithm = new ProofOfAuthority(block);        //passing the block (uper wala) object
            block.validator = minerAddress;             //boook-author (analogy)
            block = algorithm.generateBlock();  //GENERATEBLOCK() of ProofOfAuthority class
            block.blockNo = this.chain.length;   //adding the new mined block(Actual!)
            this.chain.push(block);
            this.pendingTransactions = [];
        }
    }

    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address) {
        let balance = 0;

        for(const block of this.chain) {
            for(const trans of block.transactions) {
                if(trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if(trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }

        return balance;
    }

    validationCheck() {
        let consensusAlgorithm = null;
        let validChain = true;
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            const copiedBlock = Object.assign({}, currentBlock);            //used like temp
            
            switch (this.consensus) {
                default:
                case 'poa':
                    consensusAlgorithm = new ProofOfAuthority(copiedBlock);
                    break;
            } 
                //CHECK FOR HASH VAUES OF CURRENT AND PREV BLOCK~~
            if(currentBlock.hash !== consensusAlgorithm.calculateHash()) {
                console.log("Block "+ currentBlock.block + " is invalid!");
                validChain = false;
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log("Block "+ currentBlock.block + " is invalid!");
                validChain = false;
            }
        }
        if(validChain){
            console.log("Blockchain is valid.");
        }
    }

}

module.exports = Blockchain;